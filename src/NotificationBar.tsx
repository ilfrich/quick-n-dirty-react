import React from "react"
import { SideType } from "./shared-types"

const messageTypes = {
    info: {
        background: "#ffffaa",
        color: "#333",
    },
    success: {
        background: "#88ff88",
        color: "#333",
    },
    error: {
        background: "#ff3333",
        color: "#eee",
    },
}

export type PositionStyleMappingType = {
    [side in SideType]: React.CSSProperties
}

const positions: PositionStyleMappingType = {
    bottom: {
        bottom: "0px",
        width: "100%",
        left: "0px",
        textAlign: "center",
    },
    top: {
        top: "0px",
        width: "100%",
        left: "0px",
        textAlign: "center",
    },
    left: {
        width: "200px",
        top: "20px",
        left: "20px",
    },
    right: {
        width: "200px",
        top: "20px",
        right: "20px",
    },
}

const notificationBaseStyle = {
    container: {
        position: "fixed" as const,
        zIndex: "1500",
    },
    message: {
        padding: "15px",
        fontWeight: "600",
        borderBottom: "1px solid #ccc",
    },
}

const getRandomId = () => `${new Date().getTime()}${Math.random()}`

export type MessageType = {
    content: string,
    style: React.CSSProperties,
    id: string,
}
export interface NotificationBarProps {
    position?: SideType,
    timeout?: number,
}
export interface NotificationBarState {
    messages: {
        [uuid: string]: MessageType
    }
}

class NotificationBar extends React.Component<NotificationBarProps, NotificationBarState> {

    private timers: {[uuid: string]: number} = {}

    constructor(props: NotificationBarProps) {
        super(props)

        this.state = {
            messages: {},
        }
        this.timers = {}
        this.error = this.error.bind(this)
        this.info = this.info.bind(this)
        this.success = this.success.bind(this)
        this.getPosition = this.getPosition.bind(this)
        this.popMessage = this.popMessage.bind(this)
        this.addMessage = this.addMessage.bind(this)
    }

    componentWillUnmount() {
        Object.keys(this.timers).forEach(timerKey => {
            clearTimeout(this.timers[timerKey])
        })
    }

    getPosition(): SideType {
        const position = this.props.position || "bottom"
        if (Object.keys(positions).indexOf(position) !== -1) {
            return position
        }
        return "bottom"
    }

    error(message: string, customTimeout: number | null = null) {
        this.addMessage(message, messageTypes.error, customTimeout)
    }

    info(message: string, customTimeout: number | null = null) {
        this.addMessage(message, messageTypes.info, customTimeout)
    }

    success(message: string, customTimeout: number | null = null) {
        this.addMessage(message, messageTypes.success, customTimeout)
    }

    addMessage(message: string, style: React.CSSProperties, customTimeout: number | null = null) {
        let timeout = customTimeout
        if (timeout == null) {
            timeout = this.props.timeout || 3000 // 3 seconds default
        }
        const randomId = getRandomId()
        this.setState(oldState => {
            const messages = { ...oldState.messages }
            messages[randomId] = {
                content: message,
                style,
                id: randomId,
            }
            return {
                ...oldState,
                messages,
            }
        })
        // clean up message
        this.timers[randomId] = setTimeout(() => {
            this.popMessage(randomId)
            delete this.timers[randomId]
        }, timeout)
    }

    popMessage(randomId: string) {
        this.setState(oldState => {
            const messages = { ...oldState.messages }
            delete messages[randomId]
            return {
                ...oldState,
                messages,
            }
        })
    }

    render() {
        const position = this.getPosition()

        if (Object.values(this.state.messages).length === 0) {
            return null
        }

        return (
            <div style={{ ...notificationBaseStyle.container, ...positions[position] }}>
                {Object.values(this.state.messages).map(message => (
                    <div key={message.id} style={{ ...notificationBaseStyle.message, ...message.style }}>
                        {message.content}
                    </div>
                ))}
            </div>
        )
    }
}

export default NotificationBar
