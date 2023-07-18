import React from "react"

export interface ResolutionType {
    width: number,
    height: number,
}
export interface ResolutionDetectorState {
    resolution: ResolutionType,
}
export interface ResolutionDetectorProps {
    updateDimension?: (dim: ResolutionType) => void,
}

class ResolutionDetector extends React.Component<ResolutionDetectorProps, ResolutionDetectorState> {

    private event: () => void

    constructor(props: ResolutionDetectorProps) {
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

    setNewResolution(newResolution: ResolutionType) {
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
