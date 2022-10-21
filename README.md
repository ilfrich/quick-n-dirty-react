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
- `minLength` - default `2` - defines the minimum lenght a search term has to have, before
 suggestions will be shown.
- `maxSuggestions` - default `8` - the maximum number of items shown as suggestions.
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