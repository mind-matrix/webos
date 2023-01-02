import { Page, Router } from "../../x-application";
import template from "./map.html"
import styles from "./map.scss"
import L from "leaflet"

export class Map extends Page {
    private location: GeolocationCoordinates
    private map: HTMLDivElement

    private onNextUpdateListeners: (() => Promise<void>|void)[]

    constructor(router: Router) {
        super(router)
        this.ui.innerHTML = template
        this.map = this.ui.querySelector("#map")
        this.onNextUpdateListeners = []
    }

    async onCreated() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.location = position.coords
            this.onNextUpdateListeners.push(() => {
                const map = L.map('map').setView([this.location.latitude, this.location.longitude], 14)
                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    minZoom: 3,
                    maxZoom: 20,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(map)
                L.marker([ this.location.latitude, this.location.longitude ]).addTo(map)
            })
        })
    }

    onBeforeMount(): void | Promise<void> {
        styles.use()
    }

    onBeforeUnmount(): void | Promise<void> {
        styles.unuse()
    }

    async onUpdated() {
        for (const listener of this.onNextUpdateListeners) {
            await listener()
        }
        this.onNextUpdateListeners = []
    }
}