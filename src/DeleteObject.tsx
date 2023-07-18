import React from "react"
import Popup from "./Popup"

export interface DeleteObjectProps {
    delete: (obj: any) => void
}
export interface DeleteObjectState {
    deleteObject: any,
}
export interface DeleteObjectStyles {
    buttonStyle?: React.CSSProperties,
    cancelButtonStyle?: React.CSSProperties,
    titleStyle?: React.CSSProperties,
    backdropStyle?: React.CSSProperties,
    popupStyle?: React.CSSProperties,
    bodyStyle?: React.CSSProperties,
    buttonLineStyle?: React.CSSProperties,
}

class DeleteObject extends React.Component<DeleteObjectProps, DeleteObjectState> {
    constructor(props: DeleteObjectProps) {
        super(props)

        this.state = {
            deleteObject: null,
        }

        this.setDeleteObject = this.setDeleteObject.bind(this)
        this.confirmDelete = this.confirmDelete.bind(this)
    }

    setDeleteObject(object: any) {
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

    renderDeletePopup(title = "Delete Item", content = "Are you sure you want to delete this item?", styles: DeleteObjectStyles = {}) {
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
