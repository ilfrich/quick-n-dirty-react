import React from "react"
import Popup from "./Popup"

class DeleteObject extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            deleteObject: null,
        }

        this.setDeleteObject = this.setDeleteObject.bind(this)
        this.confirmDelete = this.confirmDelete.bind(this)
    }

    setDeleteObject(object) {
        return () => {
            this.setState({ deleteObject: object })
        }
    }

    confirmDelete() {
        if (this.state.deleteObject == null) {
            console.error("Please do not call this method manually.")
            return
        }
        if (this.props.delete == null) {
            console.error("Please pass a `delete(item)` handler to the component inherting from DeleteObject as property")
            return
        }
        this.props.delete(this.state.deleteObject)
        this.setState({ deleteObject: null })
    }

    renderDeletePopup(title = "Delete Item", content = "Are you sure you want to delete this item?", styles = {}) {
        return (
            <Popup 
                title={title} 
                yes={this.confirmDelete} 
                no={this.setDeleteObject(null)} 
                buttonStyle={styles.buttonStyle}
                cancelButtonStyle={styles.cancelButtonStyle}
                titleStyle={styles.titleStyle}
                backdropStyle={styles.backdropStyle}
                popupStyle={styles.popupStyle}
                bodyStyle={styles.bodyStyle}
                buttonLineStyle={styles.buttonLineStyle}
            >
                {content}
            </Popup>
        )
    }
}

export default DeleteObject
