import React from "react"
import moment from "moment"
import { util } from "quick-n-dirty-utils"
import mixins from "./mixins"

const style = {
    dateSelectContainer: {
        display: "grid",
        width: "400px",
        gridTemplateColumns: "1fr 1fr",
        gridColumnGap: "30px",
        gridRowGap: "5px",
        padding: "5px",
    },
    label: {
        fontSize: "11px",
        textDecoration: "underline",
        fontWeight: "600",
    },
}

class DateRangeSelect extends React.Component {
    constructor(props) {
        super(props)
        this.changeFrom = this.changeFrom.bind(this)
        this.changeTo = this.changeTo.bind(this)
        this.getValues = this.getValues.bind(this)
    }

    componentDidUpdate(prevProps) {
        // allows manipulation from the outside
        if (prevProps.defaultFrom !== this.props.defaultFrom) {
            this.from.value = util.formatDate(this.props.defaultFrom)
        }
        if (prevProps.defaultTo !== this.props.defaultTo) {
            this.to.value = util.formatDate(this.props.defaultTo)
        }
    }

    getValues() {
        let from = null
        let to = null
        if (this.from.value !== "") {
            from = moment(this.from.value)
        }
        if (this.to.value !== "") {
            to = moment(this.to.value)
        }
        return {
            from,
            to,
        }
    }

    changeFrom() {
        if (this.props.changeFrom != null) {
            this.props.changeFrom(moment(this.from.value))
        }
    }

    changeTo() {
        if (this.props.changeTo != null) {
            this.props.changeTo(moment(this.to.value))
        }
    }

    render() {
        return (
            <div style={style.dateSelectContainer}>
                <div style={mixins.label}>From</div>
                <div style={mixins.label}>To</div>
                <input
                    type="date"
                    ref={e => {
                        this.from = e
                    }}
                    style={mixins.textInput}
                    defaultValue={this.props.defaultFrom ? util.formatDate(this.props.defaultFrom) : ""}
                    onChange={this.changeFrom}
                />
                <input
                    type="date"
                    ref={e => {
                        this.to = e
                    }}
                    style={mixins.textInput}
                    defaultValue={this.props.defaultTo ? util.formatDate(this.props.defaultTo) : ""}
                    onChange={this.changeTo}
                />
            </div>
        )
    }
}

export default DateRangeSelect
