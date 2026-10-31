package controller

import (
	"bufio"
	"fmt"
	"strings"
	"time"

	"go.bug.st/serial"
)

type GRBLController struct {
	port serial.Port
}

func (c *GRBLController) Connect(
	portName string,
	baudRate int,
) error {
	mode := &serial.Mode{
		BaudRate: baudRate,
	}

	port, err := serial.Open(portName, mode)
	if err != nil {
		return err
	}

	c.port = port

	time.Sleep(2 * time.Second)

	return nil
}

func (c *GRBLController) IsConnected() bool {
	return c.port != nil
}

func (c *GRBLController) Close() error {
	if c.port == nil {
		return nil
	}

	err := c.port.Close()
	if err != nil {
		return err
	}

	c.port = nil

	return nil
}

func (c *GRBLController) SendCommand(command string) ([]string, error) {
	if c.port == nil {
		return nil, fmt.Errorf("GRBL controller is not connected")
	}

	_, err := c.port.Write([]byte(command + "\n"))
	if err != nil {
		return nil, err
	}

	var response []string

	scanner := bufio.NewScanner(c.port)

	for scanner.Scan() {
		line := scanner.Text()

		response = append(response, line)

		if line == "ok" {
			return response, nil
		}

		if strings.HasPrefix(line, "error:") {
			return response, fmt.Errorf("GRBL returned %s", line)
		}
	}

	if err := scanner.Err(); err != nil {
		return response, err
	}

	return response, fmt.Errorf("GRBL response ended without ok or error")
}
