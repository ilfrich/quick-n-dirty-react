import React from "react"
import { util } from "quick-n-dirty-utils"
import mixins from "./mixins"

const style = {
    progressContainer: {
        position: "fixed" as const,
        bottom: "0px",
        left: "0px",
        width: "100vw",
    },
    progressBar: {
        display: "grid",
        gridTemplateColumns: "200px 1fr",
        margin: "auto",
        maxWidth: "1280px",
    },
    label: {
        background: "#fff",
        padding: "10px",
    },
    bar: (percent: number, isProgress: boolean) => ({
        height: "35px",
        width: `${percent}%`,
        background: isProgress ? mixins.green.color : "#ccc",
    }),
}

export interface BatchProgressBarProps {
    total: number,
    current: number,
    label: string,
}  

const BatchProgressBar = (props: BatchProgressBarProps) => {
    if (props.total === 0 || isNaN(props.total) || isNaN(props.current)) {
        return null
    }
    const percent = util.normalise(props.current / props.total, 0.0, 1.0) * 100.0

    return (
        <div style={style.progressContainer}>
            <div style={style.progressBar}>
                <div style={style.label}>
                    {props.label} {props.current} / {props.total}
                </div>
                <div style={mixins.flexRow}>
                    <div style={style.bar(percent, true)} />
                    <div style={style.bar(100.0 - percent, false)} />
                </div>
            </div>
        </div>
    )
}

export default BatchProgressBar
