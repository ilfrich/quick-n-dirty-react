import React from "react"

class WindowResolution extends React.Component {

    constructor(props) {
        super(props)
        
        this.state = {
            dimension: {
                width: window.innerWidth,
                height: window.innerHeight,
            },
        }

        this.updateDimension = this.updateDimension.bind(this)
    }

    updateDimension(newDimension) {
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
