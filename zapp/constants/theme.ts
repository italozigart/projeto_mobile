//tokens de design compartilhados por todas as telas
//alterar aqui reflete em todo o sistema

export const COLORS = {
    primary: "#B8860B",
    danger: "#cc0000",
    success: "#2e7d32",
    cancel: "#888",
    inputBg: "#f5f5f5",
    white: "#fff",
    textMuted: "#666",
    border: "#eee",
};

export const FONT = {
    family: "Jomhuria" as const,
    sizeButton: 18,
    sizeDetail: 13,
    sizeLabel: 14,
};

//estilos reutilizáveis entre telas — importar e usar diretamente no StyleSheet
export const SHARED = {
    input: {
        width: "100%" as const,
        backgroundColor: "#f5f5f5",
        fontFamily: "Jomhuria" as const,
        height: 45,
        borderWidth: 2,
        borderColor: "#B8860B",
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 4,
    },
    button: {
        backgroundColor: "#B8860B",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        width: "100%" as const,
        alignItems: "center" as const,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold" as const,
        textAlign: "center" as const,
        fontFamily: "Jomhuria" as const,
    },
    footer: {
        width: "100%" as const,
        flexDirection: "row" as const,
        justifyContent: "space-around" as const,
        alignItems: "center" as const,
        paddingVertical: 15,
        backgroundColor: "rgba(0, 0, 0, 0.35)",
    },
    logoutButton: {
        position: "absolute" as const,
        top: 40,
        left: 20,
        zIndex: 10,
        backgroundColor: "rgba(0,0,0,0.4)",
        padding: 10,
        borderRadius: 20,
    },
    toast: {
        position: "absolute" as const,
        top: 60,
        alignSelf: "center" as const,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        gap: 8,
        zIndex: 99,
        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    toastText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold" as const,
    },
    errorText: {
        color: "#cc0000",
        fontSize: 12,
        marginBottom: 8,
        marginLeft: 4,
    },
    inputError: {
        borderColor: "#cc0000",
    },
};