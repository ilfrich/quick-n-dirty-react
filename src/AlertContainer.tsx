import React from "react"
import NotificationBar from "./NotificationBar"


export interface AlertContainerProps {

}

class AlertContainer extends React.Component<AlertContainerProps> {

    private alert = React.createRef<NotificationBar>()
    
    constructor(props: AlertContainerProps) {
        super(props)

        this.info = this.info.bind(this)
        this.success = this.success.bind(this)
        this.error = this.error.bind(this)
    }

    info(message: string) {
        if (this.alert == null) {
            return
        }
        this.alert.current!.info(message)
    }

    error(message: string) {
        if (this.alert == null) {
            return
        }
        this.alert.current!.error(message)
    }

    success(message: string) {
        if (this.alert == null) {
            return
        }
        this.alert.current!.success(message)
    }

    render() {
        return null
    }
}

export default AlertContainer
