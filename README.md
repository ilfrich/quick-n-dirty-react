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
2. [CSS Mixins](#css-mixins)

## Components

### `DateRangeSelect`

A combined component to provide a "From" and "To" date for a date range.

**Example**

```jsx harmony
import React from "react"
import moment from "moment"
import { DateRangeSelect } from "quick-n-dirty-react"

class MyComponent extends React.Component {
    constructor(props) {
        super(props)
        // init your own components proxy for the current values
        this.state = {
            fromDate: moment(),
            toDate: moment(),
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

- `error(message)` - display a message on red background (something went wrong)
- `info(message)` - display a message on yellow background (e.g. a warning or info message)
- `success(message)` - display a message on green background (e.g. confirmation)

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