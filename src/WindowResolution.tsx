import React from "react"

export interface WindowResolutionProps {}

class WindowResolution extends React.Component {

    constructor(props: WindowResolutionProps) {
        super(props)
        
        this.state = {
            dimension: {
                width: window.innerWidth,
                height: window.innerHeight,
            },
        }

        this.updateDimension = this.updateDimension.bind(this)
    }

    updateDimension(newDimension: { width: number, height: number }) {
        this.setState({
            dimension: {
                width: newDimension.width,
                height: newDimension.height,
            },
        })
    }

    render() {
        return null
    }
}

export default WindowResolution
