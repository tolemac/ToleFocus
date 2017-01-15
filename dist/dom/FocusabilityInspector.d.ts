export declare type FocusabilityInspectorCallback = (isFocusable: boolean) => void;
export declare class FocusabilityInspector {
    private element;
    private callback;
    focusable: boolean;
    intervalHandle: any;
    constructor(element: HTMLElement, callback: FocusabilityInspectorCallback);
    check: () => void;
    stop(): void;
}
