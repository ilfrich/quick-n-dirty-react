import React from "react"
import { DateTime } from "luxon"
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

export interface DateRangeSelectProps {
    defaultFrom?: DateTime,
    defaultTo?: DateTime,
    changeTo?: (dt: DateTime) => void,
    changeFrom?: (dt: DateTime) => void,
}

class DateRangeSelect extends React.Component<DateRangeSelectProps> {

    private from = React.createRef<HTMLInputElement>()
    private to = React.createRef<HTMLInputElement>()

    constructor(props: DateRangeSelectProps) {
        super(props)
        this.changeFrom = this.changeFrom.bind(this)
        this.changeTo = this.changeTo.bind(this)
        this.getValues = this.getValues.bind(this)
    }

    componentDidUpdate(prevProps: DateRangeSelectProps) {
        // allows manipulation from the outside
        if (prevProps.defaultFrom !== this.props.defaultFrom) {
            this.from.current!.value = util.formatDate(this.props.defaultFrom)
        }
        if (prevProps.defaultTo !== this.props.defaultTo) {
            this.to.current!.value = util.formatDate(this.props.defaultTo)
        }
    }

    getValues() {
        let from = null
        let to = null
        if (this.from.current!.value !== "") {
            from = DateTime.fromSQL(this.from.current!.value)
        }
        if (this.to.current!.value !== "") {
            to = DateTime.fromSQL(this.to.current!.value)
        }
        return {
            from,
            to,
        }
    }

    changeFrom() {
        if (this.props.changeFrom != null) {
            this.props.changeFrom(DateTime.fromSQL(this.from.current!.value))
        }
    }

    changeTo() {
        if (this.props.changeTo != null) {
            this.props.changeTo(DateTime.fromSQL(this.to.current!.value))
        }
    }

    render() {
        return (
            <div style={style.dateSelectContainer}>
                <div style={mixins.label}>From</div>
                <div style={mixins.label}>To</div>
                <input
                    type="date"
                    ref={this.from}
                    style={mixins.textInput}
                    defaultValue={this.props.defaultFrom ? util.formatDate(this.props.defaultFrom) : ""}
                    onChange={this.changeFrom}
                />
                <input
                    type="date"
                    ref={this.to}
                    style={mixins.textInput}
                    defaultValue={this.props.defaultTo ? util.formatDate(this.props.defaultTo) : ""}
                    onChange={this.changeTo}
                />
            </div>
        )
    }
}

export default DateRangeSelect
