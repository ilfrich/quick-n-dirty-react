import React from "react"
import mixins from "./mixins"

const style = {
    text: {
        margin: "15px 0px",
        ...mixins.clickable,
        ...mixins.textLink,
        display: "inline-block",
        paddingLeft: "6px",
    },
    arrow: {
        display: "inline-block",
        width: "20px",
    },
}

class ToggleSection extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            show: props.show || false,
        }
        this.toggle = this.toggle.bind(this)
    }

    toggle() {
        this.setState(
            oldState => ({
                ...oldState,
                show: !oldState.show,
            }),
            () => {
                if (this.props.update != null) {
                    // notify parent if required
                    this.props.update(this.state.show)
                }
            }
        )
    }

    render() {
        const fontStyle = this.props.fontStyle || {}
        return (
            <div>
                <div>
                    <span onClick={this.toggle}>
                        {this.state.show ? (
                            <span style={{ ...style.arrow, ...fontStyle }}>&#x25BC;</span>
                        ) : (
                            <span style={{ ...style.arrow, ...fontStyle }}>&#x25B6;</span>
                        )}
                        {this.props.prefix !== false ? (
                            <span style={{ ...style.text, ...fontStyle }}>{`${this.state.show ? "Hide" : "Show"} ${
                                this.props.label
                            }`}</span>
                        ) : (
                            <span style={{ ...style.text, ...fontStyle }}>{this.props.label}</span>
                        )}
                    </span>
                </div>
                {this.state.show ? <div>{this.props.children}</div> : null}
            </div>
        )
    }
}

export default ToggleSection
