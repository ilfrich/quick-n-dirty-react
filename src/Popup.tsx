import React from "react"
import mixins from "./mixins"

const style = {
    backdrop: (zIndex: number | undefined): React.CSSProperties => ({
        zIndex: `${zIndex || 600}`,
        position: "fixed",
        top: "0px",
        left: "0px",
        width: "100%",
        height: "100%",
        display: "block",
        background: "rgba(33, 33, 33, 0.7)",
    }),
    popup: (zIndex: number | undefined): React.CSSProperties => ({
        zIndex: `${zIndex ? zIndex + 1 : 601}`,
        position: "fixed",
        top: "200px",
        left: "25%",
        width: "50%",
        margin: "auto",
        background: "#eee",
    }),
    title: {
        background: "#004",
        color: "#fff",
        borderBottom: "1px solid #ccc",
        padding: "30px",
        fontSize: "20px",
    },
    body: {
        padding: "30px",
    },
    buttons: {
        padding: "30px",
        textAlign: "right" as const,
    },
}

export interface PopupProps {
    buttonStyle?: React.CSSProperties,
    cancelButtonStyle?: React.CSSProperties,
    titleStyle?: React.CSSProperties,
    backdropStyle?: React.CSSProperties,
    popupStyle?: React.CSSProperties,
    bodyStyle?: React.CSSProperties,
    buttonLineStyle?: React.CSSProperties,
    no?: (e: React.MouseEvent<HTMLElement>) => void,
    yes?: (e: React.MouseEvent<HTMLElement>) => void,
    ok?: (e: React.MouseEvent<HTMLElement>) => void,
    cancel?: (e: React.MouseEvent<HTMLElement>) => void,
    zIndex?: number,
    title: string,
    children: React.ReactNode,
}

/**
 * Renders a popup on a backdrop with a custom tile and injectable body and a set of buttons.
 * @param {{yes: function, no: function, ok: function, cancel: function, title: string, children: array, zIndex: number}} props:
 * the properties passed into this component. Either provide ('yes' and 'no') keys or ('ok' and 'cancel') keys. The
 * 'zIndex' is optional and defaults to 600.
 * @returns {object} a React component's rendering
 */
const Popup = (props: PopupProps) => {
    const customButtonStyle = props.buttonStyle || {}
    const customCancelButtonStyle = props.cancelButtonStyle || {}
    const customTitleStyle = props.titleStyle || {}
    const customBackdropStyle = props.backdropStyle || {}
    const customPopupStyle = props.popupStyle || {}
    const customBodyStyle = props.bodyStyle || {}
    const customButtonLineStyle = props.buttonLineStyle || {}
    return (
        <div>
            <div
                style={{ ...style.backdrop(props.zIndex), ...customBackdropStyle }}
                onClick={props.no || props.cancel || props.ok}
            />
            <div style={{ ...style.popup(props.zIndex), ...customPopupStyle }}>
                <div style={{ ...style.title, ...customTitleStyle }}>{props.title}</div>
                <div style={{ ...style.body, ...customBodyStyle }}>{props.children}</div>
                <div style={{ ...style.buttons, ...customButtonLineStyle }}>
                    {/* delete dialog */}
                    {props.yes != null && props.no != null
                        ? [
                              <button
                                  key="yes"
                                  type="button"
                                  style={{ ...mixins.button, ...customButtonStyle }}
                                  onClick={props.yes}
                              >
                                  Yes
                              </button>,
                              <button
                                  key="no"
                                  type="button"
                                  style={{ ...mixins.inverseButton, ...customCancelButtonStyle }}
                                  onClick={props.no}
                              >
                                  No
                              </button>,
                          ]
                        : null}
                    {/* ok dialog */}
                    {props.ok != null && props.cancel != null
                        ? [
                              <button
                                  key="ok"
                                  type="button"
                                  style={{ ...mixins.button, ...customButtonStyle }}
                                  onClick={props.ok}
                              >
                                  Ok
                              </button>,
                              <button
                                  key="cancel"
                                  type="button"
                                  style={{ ...mixins.inverseButton, ...customCancelButtonStyle }}
                                  onClick={props.cancel}
                              >
                                  Cancel
                              </button>,
                          ]
                        : null}
                    {props.ok != null && props.yes == null && props.cancel == null ? (
                        <button
                            key="ok"
                            type="button"
                            style={{ ...mixins.button, ...customButtonStyle }}
                            onClick={props.ok}
                        >
                            Ok
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default Popup
