import React from "react"
import mixins from "./mixins"

const SORT_ASCENDING = "asc"

const style = {
    enabledUp: {
        ...mixins.clickable,
        paddingLeft: "5px",
        color: "#000",
    },
    enabledDown: {
        ...mixins.clickable,
        paddingLeft: "5px",
        color: "#000",
    },
    disabled: {
        ...mixins.clickable,
        paddingLeft: "5px",
        color: "#999",
    },
}

const ListSorting = props => {
    const { current, sortKey } = props
    if (current != null && current.key === sortKey) {
        // currently sorting this column
        if (current.direction != null && current.direction.toLowerCase() === SORT_ASCENDING) {
            return (
                <span onClick={props.change(sortKey)} style={style.enabledUp}>
                    &#9650;
                </span>
            )
        }
        return (
            <span onClick={props.change(sortKey)} style={style.enabledDown}>
                &#9660;
            </span>
        )
    }

    return (
        <span onClick={props.change(sortKey)} style={style.disabled}>
            &#8645;
        </span>
    )
}

export default ListSorting
