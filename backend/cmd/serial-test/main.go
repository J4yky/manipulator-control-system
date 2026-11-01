package main

import (
	"fmt"
	"log"
	"manipulator-control-center/internal/controller"
	"time"
)

func main() {
	var grbl controller.GRBLController

	err := grbl.Connect("/dev/ttyACM0", 115200)
	if err != nil {
		log.Fatal("GRBL conn err:", err)
	}
	defer grbl.Close()

	time.Sleep(2 * time.Second)

	response, err := grbl.SendCommand("$I")
	if err != nil {
		log.Fatal("GRBL command error:", err)
	}

	for _, line := range response {
		fmt.Println("GrBL:", line)
	}
}
