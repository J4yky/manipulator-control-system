package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type BackendStatus struct {
	Status string `json:"status"`
}

type MessageHeader struct {
	Type      string `json:"type"`
	RequestID string `json:"requestID"`
}

type MoveCommand struct {
	Type             string  `json:"type"`
	RequestID        string  `json:"requestID"`
	Axis             string  `json:"axis"`
	DistanceMm       float64 `json:"distanceMm"`
	SpeedMMPerSecond float64 `json:"speedMMPerSecond"`
}

type AckEvent struct {
	Type      string `json:"type"`
	RequestID string `json:"requestID"`
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

func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}
	defer conn.Close()

	log.Println("WebSocket client conected")

	err = conn.WriteJSON(ControllerStateEvent{
		Type:  "controllerState",
		State: "disconnected",
	})

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
				command.SpeedMMPerSecond,
			)

			ack := AckEvent{
				Type:      "ack",
				RequestID: command.RequestID,
			}

			if err := conn.WriteJSON(ack); err != nil {
				log.Println("WebSocket write error:", err)
				break
			}

		default:
			log.Println("Unknown message type:", header.Type)
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
	mux := http.NewServeMux()
	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/ws", wsHandler)

	log.Println("Backend listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
