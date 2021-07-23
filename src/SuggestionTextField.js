import React from "react"
import mixins from "./mixins"

const style = {
    dropdown: zIndex => ({
        position: "absolute",
        zIndex,
        borderLeft: "1px solid #aaa",
        borderRight: "1px solid #aaa",
        width: "100%",
    }),
    choice: hover => ({
        ...mixins.clickable,
        borderBottom: "1px solid #aaa",
        background: hover ? "#ccc" : "#eee",
        padding: "4px",
    }),
}

/**
 * Component to render a text field that will provide a drop down to select from a list of matching selections.
 * Matched items will be determined as the user types.
 *
 * Properties:
 * - defaultValue (null) - initial value of the text field
 * - inputStyle (null) - a custom style for the text input
 * - items ([]) - a list of strings against which the search term will be matched
 * - maxSuggestions (8) - maximum number of suggestions to display
 * - minLength (2) - minimum length of the string before searching begins
 * - matchCaseSensitive (false) - whether to match case-sensitive
 * - onSelect (null) - event handler when the user selects a choice from the drop down
 * - onKeyPress (null) - event handler when the user presses a key
 * - onChange (null) - event handler when the user changes the text field value - not triggered onSelect
 * - zIndex (5) - the zIndex of the drop down
 */
class SuggestionTextField extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            choices: null,
            hover: null,
        }

        this.onKeyPress = this.onKeyPress.bind(this)
        this.onChange = this.onChange.bind(this)
        this.select = this.select.bind(this)
    }

    /**
     * Event handler whenever a key is pressed (keyUp event). Will evaluate, if suggestions should be shown and,
     * if provided, call an event handler passed in as property
     * @param {Event} ev - the keyUp event
     * @returns always true
     */
    onKeyPress(ev) {
        const searchTerm = ev.target.value
        if (searchTerm.length < (this.props.minLength || 2)) {
            this.setState({
                choices: null,
                hover: null,
            })
            return true
        }

        this.setState({ choices: this.getMatchingItems(searchTerm).slice(0, this.props.maxSuggestions || 8) })

        if (this.props.onKeyPress != null) {
            this.props.onKeyPress(ev)
        }
        return true
    }

    /**
     * Will call the onChange event handler, if one is passed in as property.
     * @param {Event} ev - the change event on the input
     */
    onChange(ev) {
        if (this.props.onChange != null) {
            this.props.onChange(ev)
        }
    }

    /**
     * Filters the list of items provided according to the current search term and search properties.
     * @param {String} searchTerm - the current value of the text field
     * @returns a list of items matching the search criteria
     */
    getMatchingItems(searchTerm) {
        // transformation function
        const transform = this.props.matchCaseSensitive === true ? val => val : val => val.toLowerCase()
        // filter items
        return (this.props.items || []).filter(item => transform(item).includes(transform(searchTerm)))
    }

    /**
     * Getter function called from the outside to retrieve the value of the input field.
     * @returns the current value of the input field
     */
    getValue() {
        return this.field.value
    }

    /**
     * Manually updates the value in the input field and resets the suggestions.
     * @param {String} newVal - the new value for the input
     */
    setValue(newVal) {
        this.field.value = newVal
        this.setState({
            choices: null,
            hover: null,
        })
    }

    /**
     * When the user moves the mouse over suggestions, this will handle the currently highlighted selection.
     * @param {String} hover - the new hover state, the value from the list of selections or null
     * @returns an event handler
     */
    setHover(hover) {
        return () => {
            this.setState({ hover })
        }
    }

    /**
     * Event handler to be executed whenever the user selects an item from the drop-down list of suggestions.
     * @param {String} val - the selected value
     * @returns an event handler
     */
    select(val) {
        return () => {
            this.field.value = val
            this.setState({
                choices: null,
                hover: null,
            })
            if (this.props.onSelect != null) {
                this.props.onSelect(val)
            }
        }
    }

    render() {
        return (
            <div style={mixins.relative}>
                <input
                    type="text"
                    style={this.props.inputStyle || mixins.textInput}
                    onKeyUp={this.onKeyPress}
                    defaultValue={this.props.defaultValue || ""}
                    onChange={this.onChange}
                    ref={el => {
                        this.field = el
                    }}
                    disabled={this.props.disabled === true}
                />
                {this.state.choices != null && this.state.choices.length > 0 ? (
                    <div style={style.dropdown(this.props.zIndex || 5)}>
                        {this.state.choices.map(choice => (
                            <div
                                style={style.choice(this.state.hover === choice)}
                                onClick={this.select(choice)}
                                key={choice}
                                onMouseEnter={this.setHover(choice)}
                                onMouseOut={this.setHover(null)}
                                onBlur={this.setHover(null)}
                            >
                                {choice}
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        )
    }
}

export default SuggestionTextField
