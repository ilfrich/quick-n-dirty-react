import React from "react"
import { util } from "quick-n-dirty-utils"

const getTricolor = (
    percent,
    colors = [
        [248, 105, 107],
        [255, 255, 255],
        [90, 138, 198],
    ]
) => {
    const w1 = percent < 0.5 ? util.normalise(percent, 0, 0.5) : util.normalise(percent, 0.5, 1)
    const w2 = 1 - w1

    const color1 = percent > 0.5 ? colors[2] : colors[1]
    const color2 = percent > 0.5 ? colors[1] : colors[0]

    const rgb = [
        Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2),
    ]
    return `rgb(${rgb.join(",")})`
}

const style = {
    container: width => ({
        display: "grid",
        width: width ? `${width + 40}px` : "250px",
        gridTemplateColumns: width ? `${width}px 40px` : "200px 40px",
        gridColumnGap: "10px",
        height: "18px",
        textAlign: "left",
    }),
    barContainer: width => ({
        border: "1px solid #d3d3d3",
        width: width ? `${width}px` : "200px",
        height: "20px",
    }),
    bar: (percentage, width) => {
        const finalWidth = width || 200
        const colors = [
            [180, 30, 30], // red
            [160, 160, 70], // yellow
            [30, 180, 30], // green
        ]
        return {
            display: "inline-block",
            width: `${Math.round((percentage * finalWidth) / 100)}px`,
            background: getTricolor(percentage / 100, colors),
            height: "20px",
        }
    },
    number: {
        width: "40px",
        paddingTop: "4px",
    },
    tricolorContainer: (percentage, width) => {
        const finalWidth = width || 200
        return {
            display: "inline-block",
            width: `${finalWidth}px`,
            background: getTricolor(percentage),
            height: "20px",
        }
    },
}

const getTitle = props => {
    if (props.title == null) {
        return props.percentage.toFixed(0)
    }
    return `${props.title} / ${props.percentage.toFixed()}%`
}

const PercentageBar = props => {
    if (props.tricolor) {
        // simple tile from red (0%) -> white (50%) -> blue (100%)
        return (
            <div style={style.tricolorContainer(props.percentage / 100, props.width)}>
                {props.title ? props.title : `${props.percentage.toFixed(0)}%`}
            </div>
        )
    }

    // regular red to green bar with dynamic width representing the percentage
    return (
        <div style={style.container(props.width)}>
            <div style={style.barContainer(props.width)} title={getTitle(props)}>
                <div style={style.bar(props.percentage, props.width)} />
            </div>
            {props.hideNumber ? null : <div style={style.number}>{props.percentage.toFixed(0)}%</div>}
        </div>
    )
}

export default PercentageBar
