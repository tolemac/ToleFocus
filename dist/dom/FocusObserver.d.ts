export declare class FocusObserver {
    private _enabled;
    private _rootElement;
    private observer;
    readonly enabled: boolean;
    readonly rootElement: HTMLElement;
    disable(): void;
    enable(rootElement?: HTMLElement): void;
    observerCallback(mutations: MutationRecord[]): void;
    processMutation(mutation: MutationRecord): void;
}
export declare const focusObserver: FocusObserver;
