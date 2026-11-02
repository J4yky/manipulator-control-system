package controller

import (
	"fmt"
	"log"
	"strings"
	"sync"
	"time"

	"go.bug.st/serial"
)

type GRBLController struct {
	mu   sync.Mutex
	port serial.Port
}

func (c *GRBLController) Connect(
	portName string,
	baudRate int,
) error {
	c.mu.Lock()
	defer c.mu.Unlock()

	mode := &serial.Mode{
		BaudRate: baudRate,
	}

	port, err := serial.Open(portName, mode)
	if err != nil {
		return err
	}

	c.port = port
	if err := c.port.SetReadTimeout(500 * time.Millisecond); err != nil {
		_ = c.port.Close()
		c.port = nil
		return err
	}

	if _, err := c.port.Write([]byte("\r\n\r\n")); err != nil {
		_ = c.port.Close()
		c.port = nil
		return err
	}

	time.Sleep(2 * time.Second)

	if err := c.port.ResetInputBuffer(); err != nil {
		_ = c.port.Close()
		c.port = nil
		return err
	}

	return nil
}

func (c *GRBLController) IsConnected() bool {
	c.mu.Lock()
	defer c.mu.Unlock()

	return c.port != nil
}

func (c *GRBLController) markDisconnected() {
	if c.port != nil {
		_ = c.port.Close()
	}

	c.port = nil
}

func (c *GRBLController) Close() error {
	c.mu.Lock()
	defer c.mu.Unlock()

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
	log.Println("[GRBL SendCommand] Waiting for mutex")

	c.mu.Lock()
	defer c.mu.Unlock()

	log.Println("[GRBL SendCommand] Mutex acquired")

	if c.port == nil {
		return nil, fmt.Errorf("GRBL controller is not connected")
	}

	log.Println("[GRBL SendCommand] Writing command:", command)

	n, err := c.port.Write([]byte(command + "\n"))

	log.Printf(
		"[GRBL SendCommand] Write returned: n=%d err=%v",
		n,
		err,
	)

	if err != nil {
		c.markDisconnected()
		return nil, err
	}

	deadline := time.Now().Add(3 * time.Second)

	var response []string
	var pending string
	buffer := make([]byte, 256)

	for time.Now().Before(deadline) {
		log.Println("[GRBL SendCommand] Waiting for read")

		n, err := c.port.Read(buffer)

		log.Printf(
			"[GRBL SendCommand] Read returned: n=%d err=%v",
			n,
			err,
		)

		if err != nil {
			c.markDisconnected()
			return response, err
		}

		if n == 0 {
			continue
		}

		pending += string(buffer[:n])

		for {
			newlineIndex := strings.IndexByte(pending, '\n')
			if newlineIndex == -1 {
				break
			}

			line := strings.TrimSpace(pending[:newlineIndex])
			pending = pending[newlineIndex+1:]

			if line == "" {
				continue
			}

			response = append(response, line)

			if line == "ok" {
				return response, nil
			}

			if strings.HasPrefix(line, "error:") {
				return response, fmt.Errorf("GRBL returned %s", line)
			}
		}
	}

	c.markDisconnected()
	return response, fmt.Errorf("GRBL response timeout")
}
