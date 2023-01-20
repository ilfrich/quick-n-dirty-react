import React from "react"
import mixins from "./mixins"

const style = {
    content: (dimension, contentWidth, contentHeight) => ({
        position: "fixed",
        left: `${(dimension.width - contentWidth) / 2}px`,
        top: `${(dimension.height - contentHeight) / 2}px`,
        width: contentWidth,
        maxHeight: contentHeight,
        minHeight: "150px",
        overflowY: "scroll",
        background: "#fff",
        padding: "30px",
        zIndex: "601",
    }),
    title: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#444",
    }
}

const BackdropContent = ({ contentWidth, contentHeight, dimension, children, title, cancel, titleStyle }) => (
    <div>
        <div style={mixins.backdrop} onClick={cancel} />
        <div style={style.content(dimension, contentWidth, contentHeight)}>
            <div style={titleStyle || style.title}>{title}</div>
            <div style={mixins.vSpacer(20)} />
            {children}
        </div>
    </div>
)

export default BackdropContent
