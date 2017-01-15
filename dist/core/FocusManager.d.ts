import { FocusGroup } from "./FocusGroup";
export declare const focusGroupAttributeName: string;
export declare const focusOrderAttributeName: string;
export declare const autofocusAttributeName: string;
export declare const focusableTagNames: string[];
export declare const autofocusInspectAttributeValue: string;
export declare class FocusManager {
    private _enabled;
    private _root;
    readonly root: FocusGroup;
    readonly enabled: boolean;
    focusNext(currentElement: HTMLElement): void;
    focusPrior(currentElement: HTMLElement): void;
    disable(): void;
    enable(rootElement?: HTMLElement): void;
}
export declare const focusManager: FocusManager;
