# Manipulator Control System

Engineering project of a universal three-axis positioning platform with microcontroller-based motion control, a web-based operator interface, remote access and real-time video monitoring.

The system is designed as a modular test platform that can later be adapted for different tools and applications, such as engraving, laser processing or other CNC-like tasks.

## Project Goals

The main goals of the project are:

- control of three independent motion axes,
- microcontroller-based motion execution using G-code,
- local and remote operator control,
- real-time machine status monitoring,
- camera preview integrated with the web interface,
- secure remote access over the network,
- experimental evaluation of positioning performance and communication parameters.

## System Architecture

```text
Web Browser
React + TypeScript
      │
      │ WebSocket / HTTP
      ▼
NVIDIA Jetson Nano
Go Backend
      │
      │ USB Serial
      ▼
Arduino Uno R3
GRBL 1.1
      │
      │ STEP / DIR / ENABLE
      ▼
MKS SERVO42C
      │
      ▼
NEMA17 Stepper Motors
      │
      ▼
X / Y / Z Linear Axes
```

Planned video path:

```text
USB Camera
    │
    ▼
Jetson Nano
GStreamer / WebRTC
    │
    ▼
Web Browser
```

Remote access will be provided through an overlay network, currently planned with Tailscale.

## Hardware

Current hardware platform:

- NVIDIA Jetson Nano
- Arduino Uno R3 with ATmega328P and ATmega16U2
- GRBL 1.1 firmware
- 3 × NEMA17 stepper motors
- 3 × MKS SERVO42C V1.1 closed-loop stepper drivers
- 24 V motor power supply
- three linear screw-driven axes
- aluminium profile mechanical frame

Planned hardware:

- Omron mechanical limit switches
- emergency stop circuit
- USB camera
- final power distribution system

## Software Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Heroicons

The frontend provides the operator dashboard, machine connection controls, manual motion controls, system status indicators, logs, settings and language support.

### Backend

- Go
- Gorilla WebSocket
- serial communication with GRBL

The backend runs on the Jetson Nano and is responsible for:

- WebSocket communication with the frontend,
- communication with the GRBL controller,
- controller connection state reporting,
- command processing,
- serving the production frontend.

### Motion Controller

The Arduino Uno runs GRBL 1.1 and generates real-time:

- STEP,
- DIR,
- ENABLE

signals for the three SERVO42C motor drivers.

## Repository Structure

```text
manipulator-control-system/
├── backend/
│   ├── cmd/
│   │   └── serial-test/
│   ├── internal/
│   │   └── controller/
│   ├── go.mod
│   └── main.go
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── i18n/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   └── package.json
│
└── README.md
```

Mechanical CAD models and printable components will also be added to the repository as the mechanical design is finalized.

## Current Project Status

### Completed

- three-axis mechanical concept and CAD model
- React operator dashboard
- WebSocket connection between frontend and Go backend
- typed command and event messages
- connection and controller status handling
- Go backend running on NVIDIA Jetson Nano
- USB serial communication between Jetson Nano and Arduino Uno
- GRBL 1.1 integration
- reusable `GRBLController` backend component
- physical STEP / DIR / ENABLE control of SERVO42C
- successful closed-loop calibration of all three motor/driver sets
- validation of all three NEMA17 + SERVO42C drive sets
- physical axis movement using GRBL commands
- production frontend serving from the backend

### In Progress

- connecting frontend `MoveCommand` messages to physical GRBL motion
- integration of all three axes into the final mechanical assembly
- GRBL motion parameter calibration

### Planned

- automatic GRBL controller reconnect
- limit switch integration
- homing
- soft and hard travel limits
- emergency stop
- final power distribution
- USB camera integration
- WebRTC video streaming
- remote operation through Tailscale
- system service and automatic startup on Jetson Nano
- positioning accuracy and repeatability measurements
- speed and acceleration optimization
- communication latency, jitter and reliability measurements

## Communication

The frontend communicates with the backend primarily through WebSocket.

Example motion command:

```json
{
  "type": "move",
  "requestId": "example-id",
  "axis": "X",
  "distanceMm": 10,
  "speedMmPerSecond": 5
}
```

The backend translates operator commands into commands understood by GRBL and communicates with the controller over USB serial.

GRBL then generates the physical motor control signals.

## Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Code quality checks:

```bash
npm run lint
npm run format:check
```

### Backend

```bash
cd backend
go run .
```

Build:

```bash
go build ./...
```

Tests:

```bash
go test ./...
```

The backend expects the GRBL controller to be available through the configured serial port on the Jetson Nano.

## Research Scope

The engineering thesis includes experimental work focused on:

- positioning accuracy,
- positioning repeatability,
- influence of motion speed and acceleration,
- selection of optimal motion parameters,
- communication latency and jitter,
- reliability of remote communication,
- comparison of communication approaches for control and video transmission.

## Project Stage

The project is currently under active development.

The basic communication chain has already been validated:

```text
Frontend
   ↓
WebSocket
   ↓
Go Backend
   ↓
USB Serial
   ↓
Arduino + GRBL
   ↓
SERVO42C
   ↓
NEMA17
   ↓
Physical Axis
```

The next development stage focuses on integrating frontend motion commands with physical GRBL movement and completing the three-axis machine.