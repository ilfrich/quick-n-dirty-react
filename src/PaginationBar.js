import util from "quick-n-dirty-utils"
import React from "react"
import mixins from "./mixins"

const style = {
    layout: {
        display: "grid",
        gridTemplateColumns: "1fr 150px",
    },
    bar: width => ({
        width: `calc(${width} - 10px)`,
        padding: "10px 5px",
    }),
    pageNumber: selected => ({
        fontFamily: "monospace",
        padding: "0px 5px",
        cursor: selected ? "normal" : "pointer",
        textDecoration: selected ? "none" : "underline",
        fontWeight: selected ? "600" : "400",
    }),
    pageSizeContainer: {
        ...mixins.flexRow,
        paddingLeft: "20px",
    },
    label: {
        fontSize: "12px",
        paddingRight: "10px",
    },
    rightFlex: {
        ...mixins.flexRow,
        flexDirection: "row-reverse",
    },
}

const PaginationBar = props => {
    const { pageSize, total } = props
    const pageSizes = props.pageSizes || [25, 50, 100]
    const page = props.page + 1
    if (total < pageSize) {
        return null
    }

    const pageNumbers = util.range(1, Math.ceil(total / pageSize))

    const setPaging = (pageNumber, newPageSize) => {
        return () => {
            if (pageNumber === page && newPageSize === pageSize) {
                return
            }

            if (newPageSize !== pageSize) {
                const maxPages = Math.ceil(total / newPageSize)
                if (maxPages < pageNumber) {
                    // page size has increased, go to last page
                    props.setPaging(maxPages - 1, newPageSize)
                    return
                }
            }

            props.setPaging(pageNumber - 1, newPageSize)
        }
    }

    return (
        <div style={{ width: props.width != null ? `${props.width}px` : "100%" }}>
            <div style={style.layout}>
                <div style={mixins.flexRow}>
                    <div style={style.label}>Page:</div>
                    {pageNumbers.map(pageNumber => (
                        <div
                            style={style.pageNumber(pageNumber === page)}
                            onClick={setPaging(pageNumber, pageSize)}
                            key={pageNumber}
                        >
                            {pageNumber}
                        </div>
                    ))}
                </div>

                <div style={style.rightFlex}>
                    {pageSizes.reverse().map(currentPageSize => (
                        <div
                            key={currentPageSize}
                            style={style.pageNumber(pageSize === currentPageSize)}
                            onClick={setPaging(page, currentPageSize)}
                        >
                            {currentPageSize}
                        </div>
                    ))}
                    <div style={style.label}>Show:</div>
                </div>
            </div>
        </div>
    )
}

export default PaginationBar
