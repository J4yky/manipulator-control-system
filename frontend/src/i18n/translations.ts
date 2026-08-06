export type Language = "en" | "pl";

export const translations ={
    en: {
        appName: "Manipulator Control Center",
        settings: "Settings",
        logs: "Logs",
        connect: "Connect",
        language: "Language",
        theme: "Theme",
        cameraAutoplay: "Camera autoplay",
        manualControl: "Manual control",
        cameraPreview: "Camera preview",
        systemStatus: "System status",
        disconnect: "Disconnect",
        axis: "Axis",
        distance: "Distance",
        speed: "Speed",
        move: "Move",
    },

    pl: {
        appName: "Centrum Sterowania Manipulatorem",
        settings: "Ustawienia",
        logs: "Logi",
        connect: "Połącz",
        language: "Język",
        theme: "Motyw",
        cameraAutoplay: "Automatyczne uruchamianie kamery",
        manualControl: "Sterowanie ręczne",
        cameraPreview: "Podgląd kamery",
        systemStatus: "Stan systemu",
        disconnect: "Rozłącz",
        axis: "Oś",
        distance: "Dystans",
        speed: "Prędkość",
        move: "Rusz",
    },
} as const;

export type TranslationKey = keyof typeof translations.en;