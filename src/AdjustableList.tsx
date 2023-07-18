import React from "react"
import mixins from "./mixins"
import NotificationBar from "./NotificationBar"

const style = {
    container: {
        display: "inline-block",
    },
    columns: (columns: string[], idx = 0, lineColors = ["#fff", "#fafafa"]) => ({
        display: "grid",
        gridTemplateColumns: `${columns.join(" ")} 30px`, // 30px for delete icon
        gridColumnGap: "2px",
        padding: "5px 0px",
        background: idx % 2 === 0 ? lineColors[0] : lineColors[1],
        fontSize: "13px",
    }),
    formSection: {
        padding: "0px 5px", // for each input
    },
}

export type ItemType = {
    [s: string]: any,
}
export type KeyValueMapping = {
    [s: string]: string | number | boolean
}
export type StringMapping = {
    [s: string]: string
}
export type FormConfigurationValueType = string | number | boolean | StringMapping | string[]
export type FormConfigurationType = {
    [s: string]: FormConfigurationValueType
}
export type KeyValueFunctionMapping = {
    [s: string]: (value: string | number | boolean, item: ItemType) => boolean | string | number,
}
export type NewAttributesType = {
    [s: string]: HTMLInputElement | HTMLSelectElement | null
}
export interface AdjustableListProps {
    attributes: KeyValueMapping,
    columns: string[],
    items?: ItemType[],
    form?: FormConfigurationType,
    parsers?: KeyValueFunctionMapping,
    validators?: KeyValueFunctionMapping,
    formatter?: KeyValueFunctionMapping,
    validateItem?: (item: KeyValueMapping) => boolean,
    validateRemove?: (item: KeyValueMapping) => boolean,
    update?: (items: KeyValueMapping[]) => void,
    listHeaderStyle?: React.CSSProperties,
    buttonStyle?: React.CSSProperties,
    lineColors?: string[],
    showHeader?: boolean,
}
export interface AdjustableListState {
    items: KeyValueMapping[],
    keepValues: boolean,
}

class AdjustableList extends React.Component<AdjustableListProps, AdjustableListState> {

    private uuid: string = URL.createObjectURL(new Blob([])).slice(-36)
    private alert = React.createRef<NotificationBar>()
    private newAttributes: NewAttributesType = {}

    constructor(props: AdjustableListProps) {
        super(props)
        
        this.state = {
            items: props.items != null ? [...props.items] : [],
            keepValues: false,
        }

        this.getItems = this.getItems.bind(this)
        this.addItem = this.addItem.bind(this)
        this.addItemFromForm = this.addItemFromForm.bind(this)
        this.removeItem = this.removeItem.bind(this)
        this.toggleKeepValues = this.toggleKeepValues.bind(this)
        this.renderFormField = this.renderFormField.bind(this)
    }

    getItems() {
        return [...this.state.items]
    }

    addItemFromForm() {
        // collect attribute values
        const item: KeyValueMapping = {}
        Object.keys(this.props.attributes).map((attr) => {
            item[attr] =
                this.props.form != null && this.props.form[attr] === "boolean" ? (this.newAttributes[attr] as HTMLInputElement).checked : this.newAttributes[attr]!.value
        })

        // apply parsers to elements
        Object.keys(this.props.parsers || {}).map((attr) => {
            item[attr] = this.props.parsers![attr](item[attr], item)
        })

        // validate
        let invalidAttribute = null
        
        Object.keys(this.props.validators || {}).map((attr) => {
            if (this.props.validators![attr](item[attr], item) === false) {
                this.alert.current!.info(`Invalid value for ${this.props.attributes[attr]}`)
                invalidAttribute = attr
            }
        })
        
        if (invalidAttribute != null) {
            return
        }

        // finally add item to list
        this.addItem(item).then(() => {
            if (this.state.keepValues === false) {
                // reset form fields
                Object.keys(this.newAttributes).forEach((attr) => {
                    const field = this.newAttributes[attr]
                    if (this.props.form == null) {
                        return
                    }
                    if (this.props.form[attr] === "boolean") {
                        // reset checkboxes
                        (field as HTMLInputElement).checked = false
                        return
                    }
                    if (this.props.form[attr] == null || ["datetime", "date", "number"].includes(this.props.form[attr] as string)) {
                        // reset inputs
                        field!.value = ""
                    }
                })
            }
        }).catch(() => {
            // validation failed, nothing to do
        })        
    }


    addItem(item: KeyValueMapping) {
        // validate item
        if (this.props.validateItem != null) {
            const valid = this.props.validateItem(item)
            if (valid === false) {
                this.alert.current!.info("Validation failed")
                return new Promise((resolve, reject) => {
                    reject("Validation failed")
                })
            }
        }
        return new Promise(resolve => {
            // add item
            this.setState(
                (oldState) => ({
                    ...oldState,
                    items: oldState.items.concat(item),
                }),
                () => {
                    if (this.props.update != null) {
                        this.props.update(this.state.items)
                    }                    
                    resolve(item)
                }
            )
        })        
    }

    removeItem(idx: number) {
        return () => {
            if (this.props.validateRemove != null) {
                const outcome = this.props.validateRemove(this.state.items[idx])
                if (outcome === false) {
                    this.alert.current!.info("Cannot remove this item")
                    return
                }
            }
            this.setState(
                (oldState) => {
                    const { items } = oldState
                    items.splice(idx, 1)
                    return {
                        ...oldState,
                        items,
                    }
                },
                () => {
                    if (this.props.update != null) {
                        this.props.update(this.state.items)
                    }                    
                }
            )
        }
    }

    toggleKeepValues() {
        this.setState((oldState) => ({
            ...oldState,
            keepValues: !oldState.keepValues,
        }))
    }

    formatValue(attr: string, value: any, item: ItemType): any {
        // handles formatter
        if (this.props.formatter != null && this.props.formatter[attr] != null) {
            return this.props.formatter[attr](value, item)
        }

        // handles form parameters passed in for dropdowns with key, value pairs
        if (this.props.form != null && this.props.form[attr] != null) {
            const formConfig = this.props.form[attr]
            if ((formConfig as StringMapping)[value as string] != null) {
                return (formConfig as StringMapping)[value as string]
            }
        }

        return value
    }

    renderFormField(attr: string, fieldConfig: FormConfigurationValueType) {
        if (fieldConfig === "datetime") {
            return (
                <input
                    type="datetime-local"
                    style={mixins.textInput}
                    ref={(el) => {
                        this.newAttributes[attr] = el
                    }}
                />
            )
        }
        if (fieldConfig === "date") {
            return (
                <input
                    type="date"
                    style={mixins.textInput}
                    ref={(el) => {
                        this.newAttributes[attr] = el
                    }}
                />
            )
        }
        if (fieldConfig === "number") {
            return (
                <input
                    type="number"
                    style={mixins.textInput}
                    ref={(el) => {
                        this.newAttributes[attr] = el
                    }}
                />
            )
        }
        if (fieldConfig === "boolean") {
            return (
                <input
                    type="checkbox"
                    style={mixins.checkbox}
                    ref={(el) => {
                        this.newAttributes[attr] = el
                    }}
                />
            )
        }
        if (Array.isArray(fieldConfig)) {
            return (
                <select
                    style={mixins.dropdown}
                    ref={(el) => {
                        this.newAttributes[attr] = el
                    }}
                >
                    {fieldConfig.map((formItem) => (
                        <option key={formItem} value={formItem}>
                            {formItem}
                        </option>
                    ))}
                </select>
            )
        }
        if (typeof fieldConfig === "object") {
            // dict with key > value
            return (
                <select
                    style={mixins.dropdown}
                    ref={(el) => {
                        this.newAttributes[attr] = el
                    }}
                >
                    {Object.keys(fieldConfig).map((formKey) => (
                        <option key={formKey} value={formKey}>
                            {fieldConfig[formKey]}
                        </option>
                    ))}
                </select>
            )
        }
        // string
        return (
            <input
                type="text"
                style={mixins.textInput}
                ref={(el) => {
                    this.newAttributes[attr] = el
                }}
            />
        )
    }

    render() {
        const listHeaderStyle =
            this.props.listHeaderStyle != null
                ? { ...mixins.listHeader, ...this.props.listHeaderStyle }
                : mixins.listHeader
        const buttonStyle = this.props.buttonStyle != null ? { ...mixins.button, ...this.props.buttonStyle } : mixins.button
        const lineColors = this.props.lineColors || ["#fff", "#fafafa"]

        const { columns, attributes } = this.props

        if (columns == null || attributes == null) {
            console.error("Please provide parameters 'columns' and 'attributes'")
            return null
        }

        return (
            <div style={style.container}>
                <NotificationBar ref={this.alert} />
                {this.props.showHeader === true ? (
                    <div style={style.columns(this.props.columns, 0, lineColors)}>
                        {Object.keys(this.props.attributes).map((attr) => (
                            <div key={attr} style={listHeaderStyle}>
                                {this.props.attributes[attr]}
                            </div>
                        ))}
                        <div style={listHeaderStyle} />
                    </div>
                ) : null}

                {this.state.items.map((item, idx) => (
                    <div key={`${idx}`} style={style.columns(this.props.columns, idx, lineColors)}>
                        {Object.keys(this.props.attributes).map((attr) => (
                            <div key={attr}>{this.formatValue(attr, item[attr], item)}</div>
                        ))}
                        <div style={mixins.center}>
                            <span style={mixins.clickable} onClick={this.removeItem(idx)}>
                                &times;
                            </span>
                        </div>
                    </div>
                ))}

                <div style={style.columns(this.props.columns, 0, lineColors)}>
                    {Object.keys(this.props.attributes).map((attr) => (
                        <div key={attr} style={style.formSection}>
                            <label style={mixins.label}>{this.props.attributes[attr]}</label>
                            {this.props.form != null && this.props.form[attr] != null ? (
                                this.renderFormField(attr, this.props.form[attr])
                            ) : (
                                <input
                                    type="text"
                                    style={mixins.textInput}
                                    ref={(el) => {
                                        this.newAttributes[attr] = el
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <div style={mixins.buttonLine}>
                    <div style={mixins.flexRow}>
                        <div>
                            <button style={buttonStyle} type="button" onClick={this.addItemFromForm}>
                                Add
                            </button>
                        </div>
                        <div style={mixins.indent(20)}>
                            <div style={mixins.vSpacer(10)} />
                            <input
                                type="checkbox"
                                style={mixins.checkbox}
                                id={this.uuid}
                                checked={this.state.keepValues}
                                onChange={this.toggleKeepValues}
                            />
                            <label htmlFor={this.uuid}>Keep Values</label>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AdjustableList
