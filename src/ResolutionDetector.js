import React from "react"

class ResolutionDetector extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            resolution: {
                width: window.innerWidth,
                height: window.innerHeight,
            },
        }

        this.getDimension = this.getDimension.bind(this)
        this.setNewResolution = this.setNewResolution.bind(this)

        this.event = () => {
            const newResolution = {
                width: window.innerWidth,
                height: window.innerHeight,
            }
            this.setNewResolution(newResolution)
        }
    }

    componentDidMount() {
        window.addEventListener("resize", this.event)
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.event)
    }

    getDimension() {
        return this.state.resolution
    }

    setNewResolution(newResolution) {
        this.setState({ resolution: newResolution })
        if (this.props.updateDimension != null) {
            this.props.updateDimension(newResolution)
        }
    }

    render() {
        return null
    }
}

export default ResolutionDetector
