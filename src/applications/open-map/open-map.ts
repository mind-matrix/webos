import { XApplication } from "../../x-application";
import { Map } from "./map";

export class OpenMap extends XApplication {
    constructor() {
        super([
            { path: "", page: Map }
        ])
    }

    static get APP_ICON() {
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADHklEQVR4nO2WTUgUYRjH/xholEVQdKikTwIPmZe2XOfdcV7LhA6Bhy7RIchbFh1UbCe2gspuftChogg6FIZKMxZe+jj3cagwCuwinSoSzUwrfeKd3UzRd3dmZ3xnoX3ggUF3nuf3e+aZfRfIRz7yEViQjk0Uw0nS0E8M70jDmJPJ637ScIIqsBG5FsRQQgxXScNvYqAMOUUMXaRhC3IhKIZDxPDdBfjc1PCDNBwJF17DaWKY9gz/L6eJoSXMyfuBny1xWC18FFudFfAPT6kcJ4bN6gTESyjf7QliaCcNu2kfljsprhk6Uv+TSdxRA69he5rV+UiV2Cm9N4py5zOyVdKxTYVAs3TyaeDnSMifRKMKgceS5u0eanRKhvBIxf5/kAhEXNeoxB5JjUEVAuMLNtdR7LpGFCtk30ZY7CANw74FIlgpEfiqQuDlIq7QCxUCbZLmHQG8xG0q3oGo9Gs0ivKM9yfPgknJEKKLLpCSGJAeZGkkMhxkA0rgHRANp9L8JJh0VkTsuY5iJ2OoSK2NbPIkaqoTqMZqYhhNI+E1R0VNZQKOBMO5AAXOKoWfdRh98g2v4Ys4F5QLOBIamgKYfmMo8I5ALYqI4b0P+EHSsTQ0AUeCocaHwAHkQhDDvSzgu5ArQTo2EMOIB/gRcQ9URct9XmbanNJl96VS19MXn81Uz3ywd0dgAqZlXM7Y0Ob0pn5tRvi3R9dkhrc5xS2jNRD4RCJRYNrGkJumF7sYfastlMKP7S+k1ruaKwHTNoZEb98Ccbu6yl3DZN7qKKfp2MICt9vKXNcxbU5nrCo9AAHjupemIp83rJsH/+z4ek81TJEWv+YLvuFhbVHc5sNeG5/v0enzwWUz8OJa/M1rnbjNhwVD1gJmn1HneWqp7LwZoZ98Cf0yCujKjV1Z1TBF9hl1WQvELd6ddWObU8+FUif91IhbvDsr+ESvvsq0jAk/zQNJy5gQLN6nbxv1ocPbfyX4sSwE+NPQwe2Zp/DEG3xvTUncNqZCB7eTKVgEk2sBs483hw1tzpPgTe6fgGW8DhvYnJfGK09rlI98/CfxBw+xCgfxyGQPAAAAAElFTkSuQmCC"
    }
}