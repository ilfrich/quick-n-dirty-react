declare module "quick-n-dirty-utils" {
    import { DateTime } from "luxon"
    let util = {
        formatDate: (dt?: DateTime) => string,
        normalise: (value: number, min: number, max: number) => number,
        range: (start: number, end: number) => number,
    }
    export { util }
}
