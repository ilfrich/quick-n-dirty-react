# Quick & Dirty React Components and CSS Mixins

Little library of React components and utilities for frontend development

```bash
npm install --save quick-n-dirty-react
```

1. [Components](#components)
    1. [DateRangeSelect](#daterangeselect)
    2. [PercentageBar](#percentagebar)
    3. [Popup](#popup)
    4. [NotificationBar](#notificationbar)
    5. [ToggleSection](#togglesection)
    6. [SuggestionTextField](#suggestiontextfield)
    7. [BatchProgressBar](#batchprogressbar)
    8. [PaginationBar](#paginationbar)
    9. [ListSorting](#listsorting)
    10. [WindowEdgeToggle](#windowedgetoggle)
    11. [DeleteObject](#deleteobject)
    12. [Automatic Resolution Detection](#automatic-resolution-detection)
    13. [BackdropContent](#backdropcontent)
    14. [Adjustable List](#adjustablelist)
2. [CSS Mixins](#css-mixins)

## Components

### `DateRangeSelect`

A combined component to provide a "From" and "To" date for a date range.

**Example**

```jsx harmony
import React from "react"
import { DateTime } from "luxon"
import { DateRangeSelect } from "quick-n-dirty-react"

class MyComponent extends React.Component {
    constructor(props) {
        super(props)
        // init your own components proxy for the current values
        this.state = {
            fromDate: DateTime.now(),
            toDate: DateTime.now(),
        }
        // register event handlers
        this.setFrom = this.setFrom.bind(this)
        this.setTo = this.setTo.bind(this)                 
    }
    
    // register event handlers for changing from / to date
    
    setFrom(newDate) {
        this.setState({ fromDate: newDate })
    }
    
    setTo(newDate) {
        this.setState({ toDate: newDate })
    }
    
    render() {
        // provide initial values and change handlers for both dates
        return (
            <div>
                <DateRangeSelect 
                    changeFrom={this.setFrom} 
                    changeTo={this.setTo}
                    defaultFrom={this.state.fromDate}
                    defaultTo={this.state.toDate}
                />
            </div>
        )
    }
}
```

Alternatively, you can also simply let the component run independently and fetch the values on demand:

```jsx harmony
import React from "react"
import { DateRangeSelect } from "quick-n-dirty-react"

class MyComponent extends React.Component {
    constructor(props) {
        super(props)

        this.trigger = this.trigger.bind(this)
    }

    trigger() {
        // returns 2 date objects (can be null, if no date has been selected)
        const { from, to } = this.dateRange.getValues()
    }

    render() {
        return (
            <div>
                <DateRangeSelect ref={el => { this.dateRange = el }} />
                <button onClick={this.trigger} type="button">Fetch</button>
            </div>
        )
    }
}
```

### `PercentageBar`

A basic coloured percentage bar 

**Example**

```jsx harmony
import React from "react"
import { PercentageBar } from "quick-n-dirty-react"

// show 3 percentage bars (200px wide), 
// - the first one showing the label 85%
// - the second one just displaying the bar
// - the third one displaying additional message on hover: ${title} / ${percentage}
const MyComponent = props => (
    <div>
        <PercentageBar percentage={85} width={200} />
        <PercentageBar percentage={15} width={200} hideNumber />
        <PercentageBar percentage={15} width={200} hideNumber title="Some extra text displayed on hover" />
    </div>
)
```

### `Popup`

A basic popup with a semi-transparent backdrop and action buttons (yes/no or ok/cancel).

**Example**

```jsx harmony
import React from "react"
import { Popup } from "quick-n-dirty-react"

class MyComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showPopup: false,
        }
        this.togglePopup = this.togglePopup.bind(this)
        this.confirmAction = this.confirmAction.bind(this)
    }
    
    togglePopup() {
        this.setState(oldState => ({
            ...oldState,
            showPopup: !oldState.showPopup,
        }))
    }
    
    confirmAction() {
        // <input> in the popup
        const value = this.inputField.value
        // do something with it, once the user presses ok/yes
        
        // at the end, close the popup
        this.togglePopup()
    }
    
    render() {
        return (
            <div>
                <button type="button" onClick={this.togglePopup}>Show Popup</button>
                {/* only show popup, if the user has clicked on the button */}
                {this.state.showPopup ? (
                    <Popup title="Provide title here" cancel={this.togglePopup} ok={this.confirmAction}>
                        <p>Provide some text in the input below:</p>
                        <input type="text" ref={el => { this.inputField = el }} />
                    </Popup> 
                ) : null}
            </div>
        )
    }
}
```

There are 2 ways to provide event handlers, which will change the button texts:

- Provide `yes`, `no` and `cancel`: will render "Yes" / "No" button, `cancel` is used when the user clicks outside of 
the popup
- Provide `ok` and `cancel`: will render "Yes" / "Cancel" button, where the "Cancel" button uses the same event handler 
as clicking outside of the popup

The default colour for the title of the popup and the "OK" / "Yes" button is `#004` (dark blue)

To override this, you can simply provide `buttonStyle` and/or `titleStyle` parameters to the component:

```jsx harmony
import React from "react"
import { Popup } from "quick-n-dirty-react"

const render = <Popup 
                    ok={...} 
                    cancel={...} 
                    title="My Title" 
                    buttonStyle={{ background: "#F00" }} 
                    titleStyle={{ color: "#F00", background: "#FFF" }}
                >
                    <p>Popup body text</p>
                </Popup>
```

**A full list of styles to overwrite:**

- `buttonStyle` - for the "OK" or "Yes" button
- `cancelButtonStyle` - for the "Cancel" or "No" button
- `titleStyle` - for the header of the popup
- `backdropStyle` - custom grey/transparent backdrop  
- `popupStyle` - for the container wrapping the visible area of the whole popup
- `bodyStyle` - for the area containing the popup content (`props.children`)
- `buttonLineStyle` - for the footer containing the buttons

**Other properties**

- `zIndex` - default 600 - the `z-index` of the backdrop and popup

### `NotificationBar`

Embeds a container into any component that has a fixed position and will be invisible as long as no message is emitted 
to the component. It needs to be bound to another React component that will emit the message.

Usage:

```javascript
import React from "react"
import { NotificationBar } from "quick-n-dirty-react"

class MyComponent extends React.Component {
    someHandler() {
        this.alert.error("Something bad happened!")
    }

    render() {
        return (
            <div>
                 <NotificationBar ref={el => { this.alert = el }} timeout={2500} position="right" />
            </div>
        )
    }
}
```

> In the `render` method you create a reference `this.alert` for the notification bar component. Then in a handler of 
> the same component you can simply add a message.

**Methods** of `NotificationBar`:

- `error(message, customTimeout = null)` - display a message on red background (something went wrong)
- `info(message, customTimeout = null)` - display a message on yellow background (e.g. a warning or info message)
- `success(message, customTimeout = null)` - display a message on green background (e.g. confirmation)

The `customTimeout` can override the default `timeout` property for a given message. By default it's null and will
 fall back to the default.

**Properties** of `NotificationBar`:

- `timeout` - default `3000` - number of milliseconds, before a message disappears
- `position` - default `bottom` - where to display the message (`top`, `bottom`, `left` (top-left), and `right` 
 (top right))

If you want to pass alert functions to children of the component that contains the `<NotificationBar />` so they don't 
need to include a `<NotificationBar />` themselves, you can use the `AlertContainer`:

```javascript
import React from "react"
import { AlertContainer, NotificationBar } from "quick-n-dirty-react"

const SomeInclude = ({ info, error, success }) => (
    <div>
        <div onClick={() => info("Show a notification")}>Info</div>
        <div onClick={() => error("Show an error")}>Error</div>
        <div onClick={() => success("Show a success message")}>Success</div>
    </div>
)

class MyComponent extends AlertContainer {
    // important for the AlertContainer is that you bind the NotificationBar to this.alert
    render() {
        return (
            <div>
                <NotificationBar ref={el => { this.alert = el }} />
                <SomeInclude error={this.error} info={this.info} success={this.success} />
            </div>
        )
    }
}
```


### `ToggleSection`

Creates a toggle for the children element of this element. It will render an arrow right or down and maintain its own
 state for the visibility of the children.  

Usage:

```javascript
import React from "react"
import { ToggleSection } from "quick-n-dirty-react"

class MyComponent extends React.Component {
    render() {
        return (
            <div>
                <ToggleSection label="Options">
                    <div>Option 1: abc</div>
                    <div>Option 2: def</div>
                </ToggleSection>
            </div>
        )
    }
}
```

This will display:

```
> Show Options
```

When clicked on, this will expand to:

```
v Hide options
Option 1: abc
Option 2: def
```

**Properties** of `ToggleSection`:

- `show` - default `false` - the initial state of the component (show/hide the children)
- `label` - default `""` - the label to display
- `prefix` - default `true` - whether to show the "Show" / "Hide" text in front of the label
- `fontStyle` - default `{}` - provide additional styling override for all text elements (arrows and text)
- `update` - default `null` - an event handler for the state update on toggle. Will pass the updated state (`true` or 
 `false`) as parameter.

### `SuggestionTextField`

Create an `<input type="text" />` with the ability to run a suggestion search on a pre-defined 
 list of strings, render them as suggestions and allow the user to select an option from the
 suggestions.

The component will be rendered at full-width within the encapsulating component/div. If the 
 input's style is not `width: 100%`, then the suggestion list will most likely exceed the
 input's length and look weird. Always wrap this component within a `<div>` with the width
 you've specified for the input (if you decide to override the default style).

The value of the input can be retrieved at any time using the `.getValue()` on a reference to 
 the component.

Usage:

```javascript
import React from "react"
import { SuggestionTextField } from "quick-n-dirty-react"

class MyComponent extends React.Component {
    save() {
        // retrieve the current input field value
        const currentValue = this.field.getValue()
    }
    
    render() {
        return (
            <div style={{ width: "400px" }}>
                <SuggestionTextField 
                    ref={el => { this.field = el }}
                    items={["Germany", "France", "Spain", "Italy"]}
                    onSelect={(val) => { console.log("Selected:", val) }}
                />
                <button onClick={this.save}>Save</button>
            </div>
        )
    }
}
```

**Properties** of `SuggestionTextField`

- `defaultValue` - the input's initial value.
- `items` - a list of suggestions (have to be strings) that will be matched against the user's
 input.
- `matchCaseSensitive` - default `false` - whether the user input is matched using case-sensitive
 matching. By default all strings will be converted to lower-case to match them against the items.
- `disabled` - default `false` - whether to disable the input field
- `zIndex` - default `5` - the z-index of the suggestion list. Should be higher than the parent
 container rendering the `SuggestionTextField`
- `inputStyle` - default `mixins.textInput` - the style used for the text field. By default the 
 quick-n-dirty-react mixin for text inputs will be used.
- `onChange(ev)` - default `null` - event handler that will be called with the change event 
 whenever the user changes the input of the text field. Will not be called, when the user selects
 a suggestion.
- `onSelect(value)` - default `null` - callback that will be called with the selected option when 
 the user selects a suggestion.
- `onKeyPress(ev)` - default `null` - event handler that will be called, when the user presses a 
 key while the text field is focused.

**Methods** of `SuggestionTextField`

- `getValue()` - retrieves the currently active input value (similar to regular input ref's
 `.value`).
- `setValue(newValue)` - provides a new value for the input field and resets any visible
 suggestions.

### `BatchProgressBar`

Renders a progress bar full screen width at the bottom of the screen. There's a 200px wide section
 on the left side of the bar for a label and the rest is a progress bar.

If `total` or `current` are not valid numbers or `total` is 0, the bar will not be rendered.

Usage:

```javascript
import React from "react"
import { BatchProgressBar } from "quick-n-dirty-react"

class MyComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            current: 0,
        }
    }

    componentDidMount() {
        const inv = setInterval(() => {
            // update every 0.5s and increment the current counter
            this.setState(oldState => ({ current: oldState.current + 1 }), () => {
                if (this.state.current === 100) {
                    // once we reach total, clear the interval
                    clearInterval(inv)
                }
            })
        }, 500)
    }

    render() {
        return (
            <BatchProgressBar current={this.state.current} total={100} label="Loading Items" />
        )
    }
}
```

**Properties** of `BatchProgressBar`

- `label` - the label to display on the left side of the bar
- `total` - the limit (number) of the progress bar
- `current` - the current (number) of the progress


### `PaginationBar`

Renders a pagination bar underneath a paginated table. The component relies on the concept of a `page` (starting 
 from 0) and `pageSize`, which indicates the number of items per page. Additionally the `total` number of items
 in the list needs to be known.

Usage:

```javascript
import React from "react"
import { PaginationBar } from "quick-n-dirty-react"

class MyComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // initial paging parameters
            paging: {
                page: 0,
                pageSize: 15,
            },
        }
        // event handler to change paging
        this.setPaging = this.setPaging.bind(this)
    }

    setPaging(newPage, newPageSize) {
        this.setState({
            paging: {
                page: newPage,
                pageSize: newPageSize,
            },
        })
    }

    render() {
        return (
            <div>
                <table>
                    ...
                </table>
                <PaginationBar 
                    width={580} 
                    total={100}
                    setPaging={this.setPaging} 
                    page={this.state.paging.page} 
                    pageSize={this.state.paging.pageSize}
                    pageSizes={[15, 30, 50]}
                />
            </div>
        )
    }
}
```

**Properties** of `PaginationBar`

- `total` - the total number of items in the list
- `page` - the current page to show (starts with 0)
- `pageSize` - the currently configured page size
- `width` - default: `100%` - the width of the pagination bar in pixels
- `pageSizes` - default: `[25, 50, 100]` - a list of available page sizes
- `setPaging` - the event handler to call when the user changes the page or page size, has 
 2 parameters, `page` and `pageSize`

### `ListSorting`

Renders a sorting symbol next to a list header. When the sorting is active, it will 
 render and up-arrow or down-arrow depending on the current sorting direction. 

This component relies on a sorting object, containing a `key` property (which defines
 the attribute to sort by) and a `direction` property, which defines the sort direction
 (either `"asc"` or `"desc"`).

Usage:

```javascript
import React from "react"
import { ListSorting } from "quick-n-dirty-react"
import util from "quick-n-dirty-utils"

class MyComponent extends React.Component { 
    constructor(props) {
        super(props)
        this.state = {
            // provide initial sorting
            sorting: {
                key: "date",
                direction: "desc",
            }
        }
    }

    setSorting(sortKey) {
        // utilising quick-n-dirty-utils sort feature
        this.setState(oldState => util.updateSorting(oldState, sortKey)
    }

    render() {
        return (
            <table>
                <thead>
                    <th>
                        Name
                        <ListSorting current={this.state.sorting} sortKey="name" change={this.setSorting} />
                    </th>
                    <th>
                        Date
                        <ListSorting current={this.state.sorting} sortKey="date" change={this.setSorting} />
                    </th>
                </thead>
                ...
            </table>
        )
    }
}
```

### `WindowEdgeToggle`

This component will render an arrow on a side of the browser window (or container, if 
 specified) and allow to expand / hide the children components.

Usage:

```javascript
import React from "react"
import { WindowEdgeToggle } from "quick-n-dirty-react"

const MyComponent = props => (
    <div>
        <WindowEdgeToggle 
            side="right" 
            distance={50} 
            margin={10} 
            background="#cccccc" 
            backgroundToggle="#000000" 
            color="#ffffff"
            initialShow
        >
            <div>Some content to render, when the Toggle is expanded</div>
        </WindowEdgeToggle>
    </div>
)
```

This will render the toggle icon (an arrow / caret) on the right side of the browser window, 
 50 pixels from the top, 10 pixels from the right side of the browser window edge. The toggle 
 will have a black background and the arrow will be white. Initially the toggle is expanded
 and the content will be shown on grey (#cccccc) background.

**Properties**

- `side` - default `right` - one of `top`, `left`, `right`, `bottom` (an error is thrown if 
 some invalid value is provided)
- `distance` - default `0` - the number of pixels from the corner the toggle will be rendered.
 For `top` and `left`, this determines the distance to the top-left corner, for `right` from 
 the top-right corner and for `bottom` the distance to the bottom-left corner.
- `margin` - default `0` - the number of pixels from the window boundaries the toggle will be 
 rendered. If the default is provided, it will stick to the edge of the browser.
- `absolute` - default `false` - a boolean flag that changes the position of the entire 
 component from `fixed` to `absolute`, which allows positioning within another container. 
 Ensure to add `position: "relative"` to the container in this case.
- `padding` - default `15` - the number of pixels of padding (all directions) of the expanded
 section to render the children.
- `background` - default `#f3f3f3` - the background used for the expanded content, if not 
 otherwise specified (`backgroundToggle`), this background will also be used for the toggle itself.
- `backgroundToggle` - default `#f3f3f3` or value of `background` - an override for the background
 color of the toggle.
- `color` - default `#000000` - the font color of the arrow that expands/collapses the toggle.
- `zIndex` - default `20` - the z-index CSS property for the entire component
- `initialShow` - default `false` - whether to initially show the children components or not.
- `onChangeShow` - default `null` - allows to provide an event handler, which informs the 
 parent component embedding the `WindowEdgeToggle` to be notified, when the toggle is changed.
 The function will be called with the new state of the toggle (`true` or `false`) depending on
 whether the content is visible or not.

**Methods**

- `toggle(value)` - changes the current visibility of the collapsable content, where a value of
 `true` will make the content visible, and `false` will hide the children. If no `value` is
 provided, this will simply change the state to the opposite state (`true` -> `false` and vice-
 versa).

### `DeleteObject`

This abstract component is meant to be inherited for a listing component (or any component that 
 wants to call a delete operation of a database object) and provides handling for asking for 
 confirmation of the delete operation before calling it.

The component inheriting `DeleteObject` will receive a new managed state (`deleteObject`) and a
 method `setDeleteObject`, which can be called from the inheriting component. The inheriting 
 component only requires a `delete` property being passed, which needs to be a function that 
 executes the deletion.

Usage:

```javascript
import React from "react"
import { DeleteObject } from "quick-n-dirty-react"

class LetterList extends DeleteObject {
    constructor(props) {
        super(props)

        this.state = {
            ...this.state,  // this is important! don't forget this, or the component might not work
            someOther: "state",
        }
    }
    render() {
        return (
            <div>
                {props.items.map(item => (
                    <div key={item} onClick={this.setDeleteObject(item)}>Delete {item}</div>
                ))}
                {this.state.deleteObject != null ? (
                    this.renderDeletePopup("DeleteLetter", "Are you sure you want to delete this letter?", {   
                        buttonStyle: { background: "#f00" },
                    })
                ) : null}
            </div>
        )
    }
}

// this is the container that handles the data
class Container extends React.Component {
    deleteItem(item) {
        // will be executed with the item as soon as the user selects "Yes" from the popup
    }

    render() {
        return (
            <div>
                <LetterList delete={this.deleteItem} items={["a", "b"]} />
            </div>
        )
    }
}
```

**Properties**

- `delete` - a function needs to be passed to the inheriting component that executes the deletion.

**Methods**

- `setDeleteObject` - this method is provided by the `DeleteObject` component.
- `confirmDelete` - this is an internal method provided by the `DeleteObject` component. Do not call or 
 override this.
- `renderDeletePopup(title, content, styles = {})` - this will render the popup with a title, body content 
 and style overrides. The styles provided are the same as for [`Popup`](#popup) except here they are
 provided as keys of the a JSON object.

### Automatic Resolution Detection

This package provides 2 components that handle changing the window resolution:
1. An abstract component that you can inherit from, which provides a state variable `dimension` holding
 width and height
2. A component that is responsible for registering the `resize` event and calling the abstract component's
 methods to update the dimension.

Usage:

```javascript
import React from "React"
import { ResolutionDetector, WindowResolution } from "quick-n-dirty-react"

class MyComponent extends WindowResolution {
    constructor(props) {
        super(props)

        this.state = {
            ...this.state, // this is important, if this is missing the component might not work
            someOther: "state",
        }
    }

    render() {
        return (
            <div>
                <ResolutionDetector updateDimension={this.updateDimension} />
                <div style={{ 
                    width: this.state.dimension.width, 
                    height: this.state.dimension.height,
                }}>
                    Some Content
                </div>
            </div>
        )
    }
}
```

**Properties for ResolutionDetector**

- `updateDimension` - provides the event handler for when the resolution changes, a default method is 
 provided by the abstract component `WindowResolution` and can be used here.

**Methods for WindowResolution**

- `updateDimension({ width, height })` - this is the default method managing the abstract component's state.

### `BackdropContent`

This is a component similar to the popup, but only contains the backdrop. You can provide any children elements that 
will be displayed on top of the backdrop.

**Properties for `BackdropContent`**

- `contentWidth` - the width of the content in pixel (e.g. 800)
- `contentHeight` - the height of the content in pixel (e.g. 300)
- `dimension` - a JSON document with `width` and `height` keys providing the dimension of the content
- `title` - a title displayed at the top of the content
- `titleStyle` - the style overwriting the default style for the title section
- `cancel` - a click handler when the user clicks on the backdrop


### `AdjustableList`

This is a complex component to render a list of items with the capabilities to add and remove items to the list.

Note that when a new row is added, all item values will be read from the form fields. Only after all values have been
read, will the parsers be applied. `boolean` fields (see `form` parameter) will automatically be parsed to boolean 
values. Strings is the default form parameter type and string fields do not have to be specified in the `form` 
parameter. 

Please be aware that you are responsible for providing appropriate column widths to render all the form elements and 
values correctly.

**Usage:**

This example shows all the elements in action. Real-world examples will be smaller. Style overwrites are not used in 
this example.

```javascript
import React from "React"
import { AdjustableList } from "quick-n-dirty-react"
// we use Luxon to parse and format dates, you can use whatever library you want
import { DateTime } from "luxon"  

// declare all your formatters
const booleanFormatter = (value, item) => value === true ? "Yes" : "No"
// we can use the whole row item to enrich our formatter
const datetimeFormatter = (value, item) => DateTime.fromSeconds(value, { zone: item.timezone }).toFormat("dd/MM/yy T")
const dateFormatter = (value, item) => DateTime.fromFormat(value, "yyyy-MM-dd").toFormat("dd/MM/yy")

// declare all your parsers
const datetimeParser = (value, item) => 
    DateTime.fromFormat(value.replace("T", " "), "yyyy-MM-dd HH:mm", { zone: item.timezone }).toSeconds()

// declare all your validators for attributes
const datetimeValidator = (value, item) => !Number.isNaN(value)  // the parser converts this to a timestamp
const dateValidator = (value, item) => value !== ""  // we keep this as a string

// declare the validator for any new item to be added
const validateItem = item =>   // ensure that start datetime is before end date
    item.startTs < DateTime.fromFormat(item.endDate, "yyyy-MM-dd", { zone: item.timezone }).toSeconds()

// declare validator for removal of items
const validateRemove = item => DateTime.now().toSeconds() > item.startTs  // start timestamp has already passed


// my react component
class MyComponent extends React.Component {
    
    constructor(props) {
        super(props)

        this.state = {
            // we just populate the list with an initial item (can be [] as well or be read from the `props`)
            items: [{
                label: "Hello",
                total: 15,
                check: false,
                startTs: 1689643000,
                endDate: "2023-07-26",
                timezone: "Australia/Melbourne",
                country: "AUS",
            }]
        }

        this.updateList = this.updateList.bind(this)
    }

    updateList(values) {
        this.setState({ items: values })
    }

    render() {
        <>
            <AdjustableList
                columns={["80px", "50px", "50px", "195px", "120px", "140px", "80px"]}
                attributes={{
                    label: "Label",
                    total: "Total",
                    check: "True",
                    startTs: "Start Date / Time",
                    endDate: "End Date",
                    timezone: "Timezone",
                    country: "Country",
                }}
                update={this.updateList}
                formatters={{
                    check: booleanFormatter,
                    startTs: datetimeFormatter,
                    endDate: dateFormatter,
                }}
                parsers={{
                    startTs: datetimeParser,
                }}
                validators={{
                    startTs: datetimeValidator,
                    endDate: dateValidator,
                }}
                validateItem={validateItem}
                validateRemove={validateRemove}
                form={{
                    total: "number",
                    check: "boolean",
                    startTs: "datetime",
                    endDate: "date",
                    timezone: ["Australia/Melbourne", "Germany/Berlin", "UTC"]
                    country: {
                        AUS: "Australia",
                        GER: "Germany",
                    }
                }}
            />
        </>
    }
}
```

**Functional Properties**

- `columns` - REQUIRED - will define the column widths. The values (provided as array of strings) will be fed directly 
 into a `display: grid` grid column definition. Please note that the component will add 2px gap between columns. In the
 form section, the component will also add 5px on each side of form components.
- `attributes` - REQUIRED - a JSON object with the attributes of the list items as key and the label of each attribute
 as string value.
- `update` - optional - a function that will be called, when the list has been changed (items added or removed), it will
 receive the complete list of items as parameter.
- `formatters` - optional - a JSON object with attributes as keys and functions with parameters (value, item) as value, 
 which handles the display of values in the list
- `parsers` - optional - a JSON object with attributes as keys and functions with parameters (value, item) as value, 
 which handles parsing string values from the form elements to the internal data structure.
- `validators` - optional - a JSON object with attributes as keys and functions with parameters (value, item) as value,
 which validates individual field values when the user wants to add a new row. The validators will be executed after 
 the `parsers``.
- `validateItem` - optional - a function with parameter (item) that will be executed after all fields of the form are
 parsed and validated to allow validating the entire form row to be validated.
- `validateRemove` - optional - a function with parameter (item) that will be executed when the user tries to remove 
 a row. If this function returns false, the row will not be removed.
- `form` - optional - a JSON object providing the data types of the form elements for each row. If this is not supported
 all `attributes` are considered as text inputs. Supported types are: `number`, `boolean`, `date`, `datetime`, which map
 to their respective `<input type="...">` tag. Additionally, the user can provide an `Array` of values (which will be 
 rendered as a drop-down) or a JSON object, where the key of the objects map to the `<option value="...">` and the value
 behind that key as the display value inside the `<option>...</option>`.

**Display Properties**

- `showHeader` - default `false` - a boolean flag to indicate whether to show column labels of the list
- `listHeaderStyle` - default `mixins.listHeader` - an overwrite of the list header styles (if `showHeader` is `true`) 
 that will be used to style the individual header columns above the list of items.
- `buttonStyle` - default `mixins.button` - an overwrite for the "Add" button underneath the new row form.
- `lineColors` - default `["#fff", "#fafafa"]` - the colours used for a striped table for the items

**Methods**

- `getItems()` - returns the current list of items - alternatively, you can be notified by the component using the 
 `update` parameter.
- `addItem(item)` - adds a new item to the list, this will only execute the validation for the whole element (not 
 individual attributes)
- `removeItem(idx)` - removes an item from the list with the given index (0...n-1)


## CSS Mixins

**Form related:**

- `label` - used for `<label>` tags to provide some form label above the input
- `textInput` - used for `<input type="text|number|date" /> to display an elegant text input
- `dropdown` - equivalent to `textInput`, but for `<select>`
- `formLine` - basic padding and text align short cut
- `buttonLine` - line with some spacing for button below a form
- `button` - better than default HTML button (padding, border, background)
- `inverseButton` - similar to `button`, less aggressive style
- `buttonDisabled` - some additional styles for disabled buttons
- `buttonPending` - while some request is in progress, this will indicate background activity

**Layout related**:

- `vSpacer(height)` - vertical spacer (block div)
- `indent(px)` - left padding for `px` pixels
- `flexRow` - shortcut for `flex` with `row` `wrap`
- `noList` - removes any dots and indentation from lists
- `trimOverflow` - any  text overflow will be cut short with "..." (remember to add `title=".."` to your component where 
 you provide the full text if required)
- `gridColumns(cols, colGap, maxWidth)` - creates a display grid style width a given number of columns of the same width
 and gaps in between columns. `maxWidth` is optional.
- `width(px)` - an element of a given width

**Text related:**

- `white`, `red` and `green` - for text color
- `bold` - for bold text
- `smallFont` - 13px font size
- `percentage(percent)` -  provides a red (0) to green (100) spectrum of colours in 20% intervals for the provided 
number

**Popup related:**

- `backdrop` - shortcut for a fixed full screen transparent background div
- `popup.container` - box in the middle of the screen
- `popup.header` - some formatting for header of popup
- `popup.body` - some formatting for body of popup
- `popup.footer` - some formatting for the area in a popup where you'd find the buttons
- `close` - close icon for the popup (top right)

**Other Components:**

- `infoBox` - a little box with smaller font, background and border to display hints
- `panel` - some basic formatting for a panel with border radius 
- `clickable` - shortcut for `cursor: pointer`
- `listIcon` - a clickable (pointer) element with a margin of 5px on each side
