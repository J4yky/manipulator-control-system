package motion

import "testing"

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

func TestBuildJogCommandInvalidAxis(t *testing.T) {
	_, err := BuildJogCommand("A", 10, 5)

	if err == nil {
		t.Fatal("expected error for invalid axis")
	}
}
