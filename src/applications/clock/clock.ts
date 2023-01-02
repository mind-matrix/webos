import { XApplication } from "../../x-application";
import { AlarmClock } from "./alarm-clock";
import { StopwatchClock } from "./stopwatch-clock";
import { TimerClock } from "./timer-clock";

export class Clock extends XApplication {
    constructor() {
        super([
            { path: "", page: AlarmClock },
            { path: "/timer", page: TimerClock },
            { path: "/stopwatch", page: StopwatchClock }
        ])
    }
    static get APP_ICON() {
        const date = new Date()
        const [h, m, s] = [date.getHours(), date.getMinutes(), date.getSeconds()]
        const hr = (h * 360) / 12 + (m * (360 / 60)) / 12
        const min = (m * 360) / 60 + (s * (360 / 60)) / 60
        const sec = (s * 360) / 60
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 600 600">
        <g>
          <circle cx="300" cy="300" r="253.9"
            style="fill: #fff;stroke: #000;stroke-width: 9;stroke-miterlimit: 10;"></circle>
          <path
            d="M300.5 94V61M506 300.5h32M300.5 506v33M94 300.5H60M411.3 107.8l7.9-13.8M493 190.2l13-7.4M492.1 411.4l16.5 9.5M411 492.3l8.9 15.3M189 492.3l-9.2 15.9M107.7 411L93 419.5M107.5 189.3l-17.1-9.9M188.1 108.2l-9-15.6"
            style="
          fill: none;
          stroke: #000;
          stroke-width: 9;
          stroke-miterlimit: 10;
      "></path>
          <circle cx="300" cy="300" r="16.2" style="
          fill: #000;
      "></circle>
        </g>
        <g style="transform-origin: 300px 300px; transform: rotate(${hr}deg);">
          <path class="hour-arm" d="M300.5 298V142"
            style="
          fill: none;
          stroke: #000;
          stroke-width: 17;
          stroke-miterlimit: 10;
      "></path>
          <circle cx="300" cy="300" r="253.9" style="
          fill: none;
      "></circle>
        </g>
        <g style="transform-origin: 300px 300px; transform: rotate(${min}deg);">
          <path d="M300.5 298V67"
            style="
          fill: none;
          stroke: #000;
          stroke-width: 11;
          stroke-miterlimit: 10;
      "></path>
          <circle cx="300" cy="300" r="253.9" style="
          fill: none;
      "></circle>
        </g>
        <g style="transform-origin: 300px 300px; transform: rotate(${sec}deg);">
          <path d="M300.5 350V55"
            style="
          fill: none;
          stroke: #000;
          stroke-width: 4;
          stroke-miterlimit: 10;
      "></path>
          <circle cx="300" cy="300" r="253.9" style="
          fill: none;
      "></circle>
        </g>
      </svg>`
        const cleaned = svg.replace(/[\t\n\r]/gim, '').replace(/\s\s+/g, ' ').replace(/'/gim, '\\i')
        const encoded = encodeURIComponent(cleaned).replace(/\(/g, '%28').replace(/\)/g, '%29')
        return `data:image/svg+xml;charset=UTF-8,${encoded}`
    }
}