import React, { ChangeEvent, KeyboardEvent } from "react"
import mixins from "./mixins"

const style = {
    dropdown: (zIndex: string) => ({
        position: "absolute" as const,
        zIndex,
        borderLeft: "1px solid #aaa",
        borderRight: "1px solid #aaa",
        width: "100%",
        maxHeight: "200px",
    }),
    choice: (hover: boolean) => ({
        ...mixins.clickable,
        borderBottom: "1px solid #aaa",
        background: hover ? "#ccc" : "#eee",
        padding: "4px",
    }),
    dropdownArrow: {
        position: "absolute" as const,
        right: "0px",
        top: "0px",
        padding: "5px",
    },
}

export interface SuggestionTextFieldProps {
    onKeyPress?: (ev: KeyboardEvent) => void,
    onChange?: (ev: ChangeEvent) => void,
    onSelect?: (val: string) => void,
    matchCaseSensitive?: boolean,
    items?: string[],
    zIndex?: string,
    disabled?: boolean,
    defaultValue?: string,
    inputStyle?: React.CSSProperties,
}
export interface SuggestionTextFieldState {
    choices?: string[] | null,
    hover?: string | null,
}

/**
 * Component to render a text field that will provide a drop down to select from a list of matching selections.
 * Matched items will be determined as the user types.
 *
 * Properties:
 * - defaultValue (null) - initial value of the text field
 * - inputStyle (null) - a custom style for the text input
 * - items ([]) - a list of strings against which the search term will be matched
 * - matchCaseSensitive (false) - whether to match case-sensitive
 * - onSelect (null) - event handler when the user selects a choice from the drop down
 * - onKeyPress (null) - event handler when the user presses a key
 * - onChange (null) - event handler when the user changes the text field value - not triggered onSelect
 * - zIndex (5) - the zIndex of the drop down
 */
class SuggestionTextField extends React.Component<SuggestionTextFieldProps, SuggestionTextFieldState> {

    private field = React.createRef<HTMLInputElement>()

    constructor(props: SuggestionTextFieldProps) {
        super(props)
        this.state = {
            choices: null,
            hover: null,
        }

        this.onKeyPress = this.onKeyPress.bind(this)
        this.onChange = this.onChange.bind(this)
        this.expandAll = this.expandAll.bind(this)
        this.select = this.select.bind(this)
    }

    /**
     * Event handler whenever a key is pressed (keyUp event). Will evaluate, if suggestions should be shown and,
     * if provided, call an event handler passed in as property
     * @param {Event} ev - the keyUp event
     * @returns always true
     */
    onKeyPress(ev: KeyboardEvent<HTMLInputElement>) {
        const searchTerm = (ev.target as HTMLInputElement).value
        if (searchTerm.length === 0) {
            this.setState({
                choices: null,
                hover: null,
            })
            return true
        }

        this.setState({ choices: this.getMatchingItems(searchTerm) })

        if (this.props.onKeyPress != null) {
            this.props.onKeyPress(ev)
        }
        return true
    }

    /**
     * Will call the onChange event handler, if one is passed in as property.
     * @param {Event} ev - the change event on the input
     */
    onChange(ev: ChangeEvent) {
        if (this.props.onChange != null) {
            this.props.onChange(ev)
        }
    }

    /**
     * Filters the list of items provided according to the current search term and search properties.
     * @param {String} searchTerm - the current value of the text field
     * @returns a list of items matching the search criteria
     */
    getMatchingItems(searchTerm: string) {
        // transformation function
        const transform = this.props.matchCaseSensitive === true ? (val: string) => val : (val: string) => val.toLowerCase()
        // filter items
        return (this.props.items || []).filter(item => transform(item).includes(transform(searchTerm)))
    }

    /**
     * Getter function called from the outside to retrieve the value of the input field.
     * @returns the current value of the input field
     */
    getValue() {
        return this.field.current!.value
    }

    /**
     * Manually updates the value in the input field and resets the suggestions.
     * @param {String} newVal - the new value for the input
     */
    setValue(newVal: string) {
        this.field.current!.value = newVal
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
    setHover(hover: string | null) {
        return () => {
            this.setState({ hover })
        }
    }

    expandAll() {
        this.setState(oldState => { 
            if (oldState.choices == null) {
                return {
                    ...oldState,
                    choices: this.props.items
                }
            }
            return {
                ...oldState,
                choices: null,
            }
        })
    }

    /**
     * Event handler to be executed whenever the user selects an item from the drop-down list of suggestions.
     * @param {String} val - the selected value
     * @returns an event handler
     */
    select(val: string) {
        return () => {
            this.field.current!.value = val
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
                    ref={this.field}
                    disabled={this.props.disabled === true}
                />
                <div style={style.dropdownArrow} onClick={this.expandAll}>
                    &#9662;
                </div>
                {this.state.choices != null && this.state.choices.length > 0 ? (
                    <div style={style.dropdown(this.props.zIndex || "5")}>
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
