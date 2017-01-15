import { ElementInfo } from "../core/FocusGroup";
export { ElementInfo } from "../core/FocusGroup";
export declare const INSPECT_TOKEN: string;
export declare class DomProcessor {
    removeGroup(element: HTMLElement): void;
    removeElement(element: HTMLElement): void;
    getElementInfo(element: HTMLElement): ElementInfo;
    isGroup(element: HTMLElement): boolean;
    isElement(element: HTMLElement): boolean;
    processRemovedElement(element: HTMLElement): void;
    locateParentGroupElement(element: HTMLElement): HTMLElement;
    getElementOrder(element: HTMLElement): number;
    getGroupProperties(element: HTMLElement): {
        head: string;
        tail: string;
    };
    addGroup(element: HTMLElement): void;
    canElementGetFocus(element: HTMLElement): boolean;
    addElement(element: HTMLElement): void;
    processAddedElement(element: HTMLElement): void;
    processFromElement(rootElement: HTMLElement): void;
}
export declare const domProcessor: DomProcessor;
