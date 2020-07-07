/**
 * Created by Peter Ilfrich
 *
 *
 */
const mixins = {
    // layout related
    clearFix: {
        clear: "both",
    },
    relative: {
        position: "relative",
    },
    right: {
        textAlign: "right",
    },
    left: {
        textAlign: "left",
    },
    center: {
        textAlign: "center",
    },
    vSpacer(height) {
        return {
            height: `${height}px`,
            display: "block",
        }
    },
    indent: px => ({
        paddingLeft: `${px}px`,
    }),
    flexRow: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    noList: {
        margin: "0px",
        padding: "0px",
        listStyle: "none",
    },
    trimOverflow: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },

    // text related
    white: {
        color: "#eee",
    },
    red: {
        color: "#933",
    },
    green: {
        color: "#393",
    },
    bold: {
        fontWeight: "600",
    },
    smallFont: {
        fontSize: "13px",
    },
    textLink: {
        color: "#0099ff",
        textDecoration: "underline",
        cursor: "pointer",
    },
    percentage(percent) {
        if (isNaN(percent)) {
            return {
                color: "#666",
            }
        }
        if (percent < 20) {
            return {
                color: "#660000",
            }
        }
        if (percent < 40) {
            return {
                color: "#88450a",
            }
        }
        if (percent < 60) {
            return {
                color: "#a18d4b",
            }
        }
        if (percent < 80) {
            return {
                color: "#496613",
            }
        }
        return {
            color: "#090",
        }
    },

    // components
    backdrop: {
        position: "fixed",
        top: "0",
        left: "0",
        background: "rgba(60, 60, 60, 0.3)",
        width: "100%",
        height: "100%",
        zIndex: "600",
    },
    popup: {
        container: width => ({
            margin: "auto",
            top: "100px",
            width: `${width}px`,
            left: `calc(50% - ${Math.round(width / 2)}px)`,
            background: "#eee",
            border: "1px solid #eee",
            borderRadius: "10px",
            position: "fixed",
            zIndex: "601",
        }),
        header: {
            borderBottom: "1px solid #ccc",
            fontSize: "18px",
            color: "#aaa",
            fontWeight: "bold",
            padding: "30px",
        },
        body: {
            padding: "10px 30px",
        },
        footer: {
            borderTop: "1px solid #ccc",
            textAlign: "right",
            padding: "30px",
        },
        close: {
            position: "absolute",
            right: "30px",
            top: "10px",
            cursor: "pointer",
        },
    },
    infoBox: {
        padding: "15px 25px",
        border: "1px solid #ccc",
        margin: "5px 5px 25px 5px",
        color: "#999",
        background: "#efefef",
        fontSize: "13px",
    },
    panel: {
        border: "1px solid #ccc",
        borderRadius: "5px",
        padding: "30px",
        background: "#fff",
        color: "#333",
    },

    // form related
    label: {
        display: "inline-block",
        maxWidth: "100%",
        fontWeight: "700",
        marginTop: "10px",
        marginBottom: "5px",
        marginLeft: "10px",
        fontSize: "14px",
        textDecoration: "underline",
    },
    textInput: {
        fontSize: "14px",
        lineHeight: "1.2",
        color: "#555",
        backgroundColor: "#fff",
        borderLeft: "0px",
        borderRight: "0px",
        borderTop: "0px",
        borderBottom: "1px solid #666666",
        borderRadius: "0px",
        outline: "none",
        display: "block",
        width: "calc(100% - 12px)",
        height: "31px",
        padding: "0px 6px",
    },
    button: {
        borderRadius: "0px",
        padding: "6px 10px",
        minWidth: "120px",
        borderColor: "#006",
        background: "#004",
        fontSize: "14px",
        color: "#eee",
        cursor: "pointer",
        outline: "none",
        fontWeight: "600",
    },
    inverseButton: {
        borderRadius: "0px",
        padding: "6px 20px",
        minWidth: "120px",
        borderColor: "#fff",
        color: "#004",
        fontSize: "14px",
        backgroundColor: "#eee",
        cursor: "pointer",
        outline: "none",
    },
    formLine: {
        textAlign: "left",
        padding: "0px 15px",
    },
    buttonLine: {
        padding: "10px 0px",
    },
    checkbox: {
        marginRight: "8px",
    },

    // other
    clickable: {
        cursor: "pointer",
    },
}

// additional buttons
mixins.buttonDisabled = {
    ...mixins.button,
    background: "#79818f",
    cursor: "not-allowed",
}
mixins.buttonPending = {
    ...mixins.button,
    background: "#79818f",
    cursor: "wait",
}

export default mixins
