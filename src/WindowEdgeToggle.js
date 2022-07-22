import React from "react"
import mixins from "./mixins"

/* Properties:
 * - side: top, left, right, bottom
 * - distance: (from corner of the toggle) in pixel (default: 0)
 * - initialShow: (bool)
 * - padding: inside padding (default 15)
 * - margin: margin from border of window (default: 0)
 * - onChangeShow: handler called when the toggle is used
 * - absolute: (bool) - default false
 * - background: background color (default #f3f3f3) for the toggle and container
 * - backgroundToggle: overriding color for the toggle
 * - zIndex: default (20)
 * - color: the colour of the toggle icon (default #000)
 */

const globalStyle = {
    contentWrapper: {
        position: "relative",
    },
}

class WindowEdgeToggle extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            show: props.initialShow === true,
        }

        if (props.side != null && !["right", "left", "top", "bottom"].includes(props.side)) {
            throw Error(
                `Invalid property 'side' provided: ${props.side}. Must be one of 'right', 'top', 'left', 'bottom'`
            )
        }

        this.toggle = this.toggle.bind(this)
        this.getArrowCharacter = this.getArrowCharacter.bind(this)
        this.getContainerCss = this.getContainerCss.bind(this)
        this.getContentStyle = this.getContentStyle.bind(this)
        this.getToggleArrowStyle = this.getToggleArrowStyle.bind(this)
        this.getToggleStyle = this.getToggleStyle.bind(this)
    }

    getArrowCharacter() {
        const opposite = {
            top: "bottom",
            right: "left",
            left: "right",
            bottom: "top",
        }

        const side = this.props.side || "right"
        const effectiveSide = this.state.show ? side : opposite[side]

        const lookup = {
            top: <span>&#9652;</span>,
            left: <span>&#9666;</span>,
            right: <span>&#9656;</span>,
            bottom: <span>&#9662;</span>,
        }
        return lookup[effectiveSide]
    }

    getContentStyle() {
        const style = {
            display: this.state.show ? "inline-block" : "none",
            padding: this.props.padding != null ? `${this.props.padding}px` : "15px",
            background: this.props.background || "#f3f3f3",
            position: "absolute",
        }

        const side = this.props.side || "right"
        if (side === "right") {
            style.top = "-35px"
            style.right = "37px"
        } else if (side === "left") {
            style.top = "-35px"
            style.left = "37px"
        } else if (side === "top") {
            style.top = "-2px"
            style.left = "0px"
        } else {
            style.bottom = "39px"
            style.left = "0px"
        }

        return style
    }

    getToggleStyle() {
        const background =
            this.props.backgroundToggle != null ? this.props.backgroundToggle : this.props.background || "#f3f3f3"
        return {
            ...mixins.clickable,
            ...mixins.center,
            position: "relative",
            fontSize: "30px",
            display: "inline-block",
            background,
            width: "35px",
            height: "35px",
            color: this.props.color || "#000",
        }
    }

    getToggleArrowStyle() {
        if (this.props.side === "right" || this.props.side === "left") {
            return null
        }
        return {
            position: "absolute",
            display: "inline-block",
            left: "10px",
        }
    }

    getContainerCss() {
        const style = {}
        if (this.props.absolute === true) {
            style.position = "absolute"
        } else {
            style.position = "fixed"
        }
        const margin = this.props.margin || 0
        const distance = this.props.distance || 0
        const side = this.props.side || "right"

        const sides = {
            top: ["top", "left"],
            left: ["left", "top"],
            right: ["right", "top"],
            bottom: ["bottom", "left"],
        }[side]

        style[sides[0]] = `${margin}px`
        style[sides[1]] = `${distance}px`

        style.zIndex = this.props.zIndex || 20

        return style
    }

    toggle(newValue = null) {
        this.setState(
            oldState => ({
                ...oldState,
                show: newValue !== true && newValue !== false ? !oldState.show : newValue,
            }),
            () => {
                // notify parent if required
                if (this.props.onChangeShow != null) {
                    this.props.onChangeShow(this.state.show)
                }
            }
        )
    }

    render() {
        return (
            <div style={this.getContainerCss()}>
                <div style={this.getToggleStyle()} onClick={this.toggle}>
                    <div style={this.getToggleArrowStyle()}>{this.getArrowCharacter()}</div>
                </div>
                <div style={globalStyle.contentWrapper}>
                    <div style={this.getContentStyle()}>{this.props.children}</div>
                </div>
            </div>
        )
    }
}

export default WindowEdgeToggle
