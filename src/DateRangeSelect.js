import React from "react"
import moment from "moment"
import mixins from "./mixins"
import util from "quick-n-dirty-utils"

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
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // allows manipulation from the outside
        if (prevProps.defaultFrom !== this.props.defaultFrom) {
            this.from.value = util.formatDate(this.props.defaultFrom)
        }
        if (prevProps.defaultTo !== this.props.defaultTo) {
            this.to.value = util.formatDate(this.props.defaultTo)
        }
    }

    changeFrom() {
        this.props.changeFrom(moment(this.from.value))
    }

    changeTo() {
        this.props.changeTo(moment(this.to.value))
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
                    defaultValue={util.formatDate(this.props.defaultFrom || moment())}
                    onChange={this.changeFrom}
                />
                <input
                    type="date"
                    ref={e => {
                        this.to = e
                    }}
                    style={mixins.textInput}
                    defaultValue={util.formatDate(this.props.defaultTo || moment())}
                    onChange={this.changeTo}
                />
            </div>
        )
    }
}

export default DateRangeSelect
