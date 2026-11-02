package motion

import (
	"fmt"
	"math"
	"strings"
)

func BuildJogCommand(
	axis string,
	distanceMM float64,
	speedMMPerSecond float64,
) (string, error) {
	axis = strings.ToUpper(axis)
	if axis != "X" && axis != "Y" && axis != "Z" {
		return "", fmt.Errorf("invalid axis: %s", axis)
	}

	if math.IsNaN(distanceMM) || math.IsInf(distanceMM, 0) {
		return "", fmt.Errorf("invalid distance: %f", distanceMM)
	}

	if math.IsNaN(speedMMPerSecond) || math.IsInf(speedMMPerSecond, 0) {
		return "", fmt.Errorf("invalid speed: %f", speedMMPerSecond)
	}

	if distanceMM == 0 {
		return "", fmt.Errorf("distance must not be zero")
	}

	if speedMMPerSecond <= 0 {
		return "", fmt.Errorf("speed must be greater than zero")
	}

	feedRate := speedMMPerSecond * 60 // Convert mm/s to mm/min
	command := fmt.Sprintf(
		"$J=G91 G21 %s%.3f F%.3f",
		axis,
		distanceMM,
		feedRate,
	)

	return command, nil
}
