import React, { MouseEvent } from "react"
import mixins from "./mixins"

export interface DimensionType {
    width: number,
    height: number,
}

const style = {
    content: (dimension: DimensionType, contentWidth: number, contentHeight: number): React.CSSProperties => ({
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

export interface BackdropContentProps {
    contentWidth: number,
    contentHeight: number,
    dimension: DimensionType,
    children: React.ReactNode,
    title: string,
    cancel: (ev: MouseEvent<HTMLDivElement>) => void,
    titleStyle?: React.CSSProperties,
}

const BackdropContent = ({ contentWidth, contentHeight, dimension, children, title, cancel, titleStyle }: BackdropContentProps) => (
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
