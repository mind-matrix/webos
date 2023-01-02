export abstract class RouteGuard {
    abstract canActivate(): Promise<boolean> | boolean
}