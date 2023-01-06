import { Application } from "../../core";
export interface NotificationEvent<T extends HTMLElement> extends Event {
    detail: {
        notification: T;
    };
}
export declare class NotificationPanel extends Application {
    private batteryLevelIndicatorIcon;
    private batteryLevelIndicatorText;
    private fullscreenNotificationPanel;
    private brightnessSlider;
    private notificationClock;
    private notifications;
    private static FULLSCREEN_DRAG_THRESHOLD;
    private static NOTIFICATION_DRAG_THRESHOLD;
    private static BATTERY_CHARGING_IMG_SRC;
    private static BATTERY_FULL_IMG_SRC;
    private networkConnectionIndicatorIcon;
    private networkConnectionIndicatorText;
    private static NETWORK_4G;
    private static NETWORK_3G;
    private static NETWORK_2G;
    private static NETWORK_SLOWER;
    private isFullscreenNotificationPanelInForeground;
    private boundedBackButtonPressEvent;
    private currentBrightness;
    constructor();
    createNotification(notification: HTMLElement): void;
    onCreated(): void | Promise<void>;
    onBackButtonPressed(e: Event): void;
    onBeforeMount(): void;
    onBeforeUnmount(): void;
    updateBatteryIndicator(): void;
    updateNetworkIndicator(): void;
    updateBrightness(): void;
    private pad;
    updateClock(): void;
    onUpdated(): void;
}
//# sourceMappingURL=notification-panel.d.ts.map