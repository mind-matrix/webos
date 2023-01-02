import { XApplication } from "../../x-application";
import { ConversionCalculator } from "./conversion-calculator";
import { ScientificCalculator } from "./scientific-calculator";
import { SimpleCalculator } from "./simple-calculator";

export class Calculator extends XApplication {
    constructor() {
        super([
            { path: "", page: SimpleCalculator },
            { path: "/scientific", page: ScientificCalculator },
            { path: "/conversion", page: ConversionCalculator }
        ])
    }
    static get APP_ICON() {
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAADXUlEQVR4nO1b3W8SQRC/P8hUjX+OH+/tLaiJitF4tA9SgV1JxLTWlF2gfrS1SX2q74iRxD70wT5aSGvUlgeTGmOoSdfMcQfHAQ1fu3vg/pIJOZhkdmZnZ367txiGhoaGhoZGT0jNsAsY0dfYZD8IYly22HZN9ioxnZ0yZIOg7DWM2IkKx9vEpLXkDLsqzXkczl4iJvuLEeXztxf4rIV5dPYRt+bkCdibe4D5/K2FejYgdgIZKSUAxGRvwCgYl+l0N2kGga7JCQBiVTAIM+/OxsNImievL3McErzuQ8y2A/bcrINMcGrCkZQAYERPwaA7A7E7T5WsfbDrjsHJgFMpASDOAFzjMCPwvJIr8I13O8JlJV+oOxzOtAQApGWcJvvgCdh7YQEgzrMM513pNgbvOLFJi56WWfjvAiAMRAeA6QwgY7AEdBE0JRVBHM7U22C+wDe2BM/+1g7P53prg8JAfAEAVqaCCIHdQAQgqoIK321SYeUBsAIgSougFQBRygQtexnE7c1JfV9APTu2eNtgRegqrgFxnrjxvOOahe+9gxWlqzQAMWc7vHh/nW+XKnzv6y++XSrzxXtrbdV6EN2lSIbvbqZ5tZjiu2+f8GeRTLC6QNLZDoND+4d/GvLpY9n+Hn4fRhec/1l63JDPm+k2XcVMkNrPewfHLU59OThutK5hdKvFpvMgR8VUB12FRTDZmNVyHxnQuy6k/SAZIAykCxOEdQ2OwOzCp7uuvUdXg+hCDQCnIRPg060B/iOxQHaB+M0lbvVY2YfRVc4Eo7PxBh12+7U9Q116+6h1NRNEipmgFUAqLAxEU2GmqTAZAyosjQkmA0qFJb4YoYGkwsJANBVmmgqTMaDCUs8EowGkwpoJigLRVJh1XALu6W0/L0da7/xM4Kkw6UNGfSosrQjGfPS28v13C8k5S0BXFBVWcCZY6dlxv4igwsJAeqTC/chEUuH9UWXAuJ0KV/qsAaJOhYUVQey7KTqqLjAsFfbfFBVZBKveu8J+yjoIDxiGCrt3hQmihyNz8iwQxNaDeFucmGzVkAEcyl10/ywBxmEGVPxfADKw6TytEZQ5b8gCQZkrdaPDrfuRiElrOMQuG7KRmM5OYcReYpN+U+G4bdekL5Lh5XPSndfQ0NAwJhD/ANMfl8lTw3y7AAAAAElFTkSuQmCC"
    }
}