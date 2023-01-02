declare module '*.html' {
    const content: string;
    export default content;
}
declare module '*.scss' {
    const content: Record<string, string>;
    const use: () => void;
    const unuse: () => void;
    export {content,use,unuse};
}
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
}