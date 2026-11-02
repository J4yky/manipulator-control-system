package motion

import (
	"math"
	"testing"
)

func TestBuildJogCommand(t *testing.T) {
	command, err := BuildJogCommand("X", -10, 5)

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	expected := "$J=G91 G21 X-10.000 F300.000"

	if command != expected {
		t.Errorf("expected %q, got %q", expected, command)
	}
}

func TestBuildJogCommandLowercaseAxis(t *testing.T) {
	command, err := BuildJogCommand("y", 2.5, 1.5)

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	expected := "$J=G91 G21 Y2.500 F90.000"

	if command != expected {
		t.Errorf("expected %q, got %q", expected, command)
	}
}

func TestBuildJogCommandInvalidAxis(t *testing.T) {
	_, err := BuildJogCommand("A", 10, 5)

	if err == nil {
		t.Fatal("expected error for invalid axis")
	}
}

func TestBuildJogCommandZeroDistance(t *testing.T) {
	_, err := BuildJogCommand("X", 0, 5)

	if err == nil {
		t.Fatal("expected error for zero distance")
	}
}

func TestBuildJogCommandZeroSpeed(t *testing.T) {
	_, err := BuildJogCommand("X", 10, 0)

	if err == nil {
		t.Fatal("expected error for zero speed")
	}
}

func TestBuildJogCommandNegativeSpeed(t *testing.T) {
	_, err := BuildJogCommand("X", 10, -5)

	if err == nil {
		t.Fatal("expected error for negative speed")
	}
}

func TestBuildJogCommandNaNDistance(t *testing.T) {
	_, err := BuildJogCommand("X", math.NaN(), 5)

	if err == nil {
		t.Fatal("expected error for NaN distance")
	}
}

func TestBuildJogCommandInfiniteDistance(t *testing.T) {
	_, err := BuildJogCommand("X", math.Inf(1), 5)

	if err == nil {
		t.Fatal("expected error for infinite distance")
	}
}

func TestBuildJogCommandNaNSpeed(t *testing.T) {
	_, err := BuildJogCommand("X", 10, math.NaN())

	if err == nil {
		t.Fatal("expected error for NaN speed")
	}
}

func TestBuildJogCommandInfiniteSpeed(t *testing.T) {
	_, err := BuildJogCommand("X", 10, math.Inf(1))

	if err == nil {
		t.Fatal("expected error for infinite speed")
	}
}
