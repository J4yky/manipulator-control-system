package main

import (
	"encoding/json"
	"log"
	"net/http"
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

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func wsHandler(
	grbl *controller.GRBLController,
) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("WebSocket upgrade error:", err)
			return
		}
		defer conn.Close()

		log.Println("WebSocket client conected")

		controllerState := "disconnected"
		if grbl.IsConnected() {
			controllerState = "connected"
		}

		if err := conn.WriteJSON(ControllerStateEvent{
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

					conn.WriteJSON(ErrorEvent{
						Type:      "error",
						RequestID: command.RequestID,
						Message:   err.Error(),
						Timestamp: time.Now().Format(time.RFC3339),
					})

					continue
				}

				response, err := grbl.SendCommand(grblCommand)

				if err != nil {
					log.Println("GRBL command error:", err)

					conn.WriteJSON(ErrorEvent{
						Type:      "error",
						RequestID: command.RequestID,
						Message:   err.Error(),
						Timestamp: time.Now().Format(time.RFC3339),
					})

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

				if err := conn.WriteJSON(ack); err != nil {
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

func main() {
	var grbl controller.GRBLController

	err := grbl.Connect("/dev/ttyACM0", 115200)
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

	mux := http.NewServeMux()
	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/ws", wsHandler(&grbl))

	frontend := http.FileServer(
		http.Dir("../frontend/dist"),
	)

	mux.Handle("/", frontend)

	log.Println("Backend listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
