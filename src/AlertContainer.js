import React from "react"

class AlertContainer extends React.Component {

    constructor(props) {
        super(props)

        this.info = this.info.bind(this)
        this.success = this.success.bind(this)
        this.error = this.error.bind(this)
    }

    info(message) {
        if (this.alert == null) {
            return
        }
        this.alert.info(message)
    }

    error(message) {
        if (this.alert == null) {
            return
        }
        this.alert.error(message)
    }

    success(message) {
        if (this.alert == null) {
            return
        }
        this.alert.success(message)
    }

    render() {
        return null
    }
}

export default AlertContainer
