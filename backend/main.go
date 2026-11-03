package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"manipulator-control-center/internal/controller"
	"manipulator-control-center/internal/motion"

	"github.com/gorilla/websocket"
)

type BackendStatus struct {
	Status string `json:"status"`
}

type MessageHeader struct {
	Type      string `json:"type"`
	RequestID string `json:"requestId"`
}

type MoveCommand struct {
	Type             string  `json:"type"`
	RequestID        string  `json:"requestId"`
	Axis             string  `json:"axis"`
	DistanceMm       float64 `json:"distanceMm"`
	SpeedMmPerSecond float64 `json:"speedMmPerSecond"`
}

type AckEvent struct {
	Type      string `json:"type"`
	RequestID string `json:"requestId"`
}

type ErrorEvent struct {
	Type      string `json:"type"`
	RequestID string `json:"requestId,omitempty"`
	Message   string `json:"message"`
	Timestamp string `json:"timestamp"`
}

type ControllerStateEvent struct {
	Type  string `json:"type"`
	State string `json:"state"`
}

type WSClient struct {
	conn    *websocket.Conn
	writeMu sync.Mutex
}

type WSClients struct {
	mu      sync.Mutex
	clients map[*WSClient]struct{}
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

const (
	grblPort     = "/dev/serial/by-id/usb-Arduino__www.arduino.cc__0043_24238313635351910130-if00"
	grblBaudRate = 115200
)

func wsHandler(
	grbl *controller.GRBLController,
	clients *WSClients,
) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("WebSocket upgrade error:", err)
			return
		}

		client := &WSClient{
			conn: conn,
		}

		clients.Add(client)
		defer clients.Remove(client)
		defer conn.Close()

		log.Println("WebSocket client connected")

		controllerState := "disconnected"
		if grbl.IsConnected() {
			controllerState = "connected"
		}

		if err := client.WriteJSON(ControllerStateEvent{
			Type:  "controllerState",
			State: controllerState,
		}); err != nil {
			log.Println("WebSocket write error:", err)
			return
		}

		for {
			_, message, err := conn.ReadMessage()
			if err != nil {
				log.Println("WebSocket disconnected:", err)
				break
			}

			var header MessageHeader

			if err := json.Unmarshal(message, &header); err != nil {
				log.Println("Invalid JSON:", err)
				continue
			}

			switch header.Type {
			case "move":
				var command MoveCommand

				if err := json.Unmarshal(message, &command); err != nil {
					log.Println("Invalid move command:", err)
					continue
				}

				log.Printf(
					"Move command: axis=%s distance=%.2fmm speed=%.2fmm/s",
					command.Axis,
					command.DistanceMm,
					command.SpeedMmPerSecond,
				)

				grblCommand, err := motion.BuildJogCommand(
					command.Axis,
					command.DistanceMm,
					command.SpeedMmPerSecond,
				)

				if err != nil {
					log.Println("Invalid move command:", err)

					if err := client.WriteJSON(ErrorEvent{
						Type:      "error",
						RequestID: command.RequestID,
						Message:   err.Error(),
						Timestamp: time.Now().Format(time.RFC3339),
					}); err != nil {
						log.Println("WebSocket write error:", err)
					}

					continue
				}

				response, err := grbl.SendCommand(grblCommand)

				if err != nil {
					log.Println("GRBL command error:", err)

					if err := client.WriteJSON(ErrorEvent{
						Type:      "error",
						RequestID: command.RequestID,
						Message:   err.Error(),
						Timestamp: time.Now().Format(time.RFC3339),
					}); err != nil {
						log.Println("WebSocket write error:", err)
					}

					if !grbl.IsConnected() {
						if err := client.WriteJSON(ControllerStateEvent{
							Type:  "controllerState",
							State: "disconnected",
						}); err != nil {
							log.Println("WebSocket write error:", err)
						}
					}

					continue
				}

				log.Printf(
					"GRBL command accepted: %s response=%v",
					grblCommand,
					response,
				)

				ack := AckEvent{
					Type:      "ack",
					RequestID: command.RequestID,
				}

				if err := client.WriteJSON(ack); err != nil {
					log.Println("WebSocket write error:", err)
				}

			default:
				log.Println("Unknown message type:", header.Type)
			}
		}
	}
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(
		BackendStatus{Status: "ok"},
	)
}

func reconnectGRBL(
	grbl *controller.GRBLController,
	clients *WSClients,
) {
	ticker := time.NewTicker(2 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		if grbl.IsConnected() {
			if err := grbl.CheckConnection(); err != nil {
				log.Println("GRBL connection lost:", err)

				clients.Broadcast(ControllerStateEvent{
					Type:  "controllerState",
					State: "disconnected",
				})
			}
			continue
		}

		log.Println("[GRBL reconnect] Trying to reconnect...")
		log.Println("[GRBL reconnect] Opening serial port...")

		if err := grbl.Connect(grblPort, grblBaudRate); err != nil {
			log.Println("[GRBL reconnect] Open failed:", err)
			continue
		}

		log.Println("[GRBL reconnect] Serial port opened")
		log.Println("[GRBL reconnect] Starting handshake...")

		response, err := grbl.SendCommand("$I")
		if err != nil {
			log.Println("[GRBL reconnect] Handshake failed:", err)

			if err := grbl.Close(); err != nil {
				log.Println("[GRBL reconnect] Close error:", err)
			}

			continue
		}

		log.Println("[GRBL reconnect] Handshake response:", response)
		log.Println("[GRBL reconnect] GRBL controller reconnected")

		clients.Broadcast(ControllerStateEvent{
			Type:  "controllerState",
			State: "connected",
		})
	}
}

func (c *WSClient) WriteJSON(v any) error {
	c.writeMu.Lock()
	defer c.writeMu.Unlock()

	return c.conn.WriteJSON(v)
}

func NewWSClients() *WSClients {
	return &WSClients{
		clients: make(map[*WSClient]struct{}),
	}
}

func (c *WSClients) Add(client *WSClient) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.clients[client] = struct{}{}
}

func (c *WSClients) Remove(client *WSClient) {
	c.mu.Lock()
	defer c.mu.Unlock()

	delete(c.clients, client)
}

func (c *WSClients) Broadcast(v any) {
	c.mu.Lock()
	defer c.mu.Unlock()

	for client := range c.clients {
		if err := client.WriteJSON(v); err != nil {
			log.Println("WebSocket broadcast error:", err)
		}
	}
}

func main() {
	var grbl controller.GRBLController

	err := grbl.Connect(grblPort, grblBaudRate)
	if err != nil {
		log.Println("GRBL connection failed:", err)
	} else {
		if _, err := grbl.SendCommand("$I"); err != nil {
			log.Println("GRBL handshake failed:", err)

			if err := grbl.Close(); err != nil {
				log.Println("GRBL close error:", err)
			}
		} else {
			log.Println("GRBL controller connected")
		}
	}

	clients := NewWSClients()

	go reconnectGRBL(&grbl, clients)

	mux := http.NewServeMux()
	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/ws", wsHandler(&grbl, clients))

	frontend := http.FileServer(
		http.Dir("../frontend/dist"),
	)

	mux.Handle("/", frontend)

	log.Println("Backend listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
