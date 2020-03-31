import React from "react"
import mixins from "./mixins"

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
        const { color } = mixins.percentage({}, percentage)
        return {
            display: "inline-block",
            width: `${Math.round((percentage * finalWidth) / 100)}px`,
            background: color,
            height: "20px",
        }
    },
    number: {
        width: "40px",
        paddingTop: "4px",
    },
}

const getTitle = props => {
    if (props.title == null) {
        return props.percentage.toFixed(0)
    }
    return `${props.title} / ${props.percentage.toFixed()}%`
}

const PercentageBar = props => (
    <div style={style.container(props.width)}>
        <div style={style.barContainer(props.width)} title={getTitle(props)}>
            <div style={style.bar(props.percentage, props.width)} />
        </div>
        {props.hideNumber ? null : <div style={style.number}>{props.percentage.toFixed(0)}%</div>}
    </div>
)

export default PercentageBar
