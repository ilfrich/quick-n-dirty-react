import React from "react"

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

const positions = {
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
        position: "fixed",
        zIndex: "1500",
    },
    message: {
        padding: "15px",
        fontWeight: "600",
        borderBottom: "1px solid #ccc",
    },
}

const getRandomId = () => `${new Date().getTime()}${Math.random()}`

class NotificationBar extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            messages: {},
        }
        this.error = this.error.bind(this)
        this.info = this.info.bind(this)
        this.success = this.success.bind(this)
        this.getPosition = this.getPosition.bind(this)
        this.popMessage = this.popMessage.bind(this)
        this.addMessage = this.addMessage.bind(this)
    }

    getPosition() {
        const position = this.props.position || "bottom"
        if (Object.keys(positions).indexOf(position) !== -1) {
            return position
        }
        return "bottom"
    }

    error(message) {
        this.addMessage(message, messageTypes.error)
    }

    info(message) {
        this.addMessage(message, messageTypes.info)
    }

    success(message) {
        this.addMessage(message, messageTypes.success)
    }

    addMessage(message, style) {
        const timeout = this.props.timeout || 3000 // 3 seconds default
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
        setTimeout(() => {
            this.popMessage(randomId)
        }, timeout)
    }

    popMessage(randomId) {
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
