export declare class ElementEventsHandler {
    private element;
    constructor(element: HTMLElement);
    unhandle(): void;
    handle(): void;
    keyPressHandler: (event: KeyboardEvent) => void;
}
