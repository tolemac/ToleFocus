import { OrderedList } from "../Utils/OrderedList";
import { ElementEventsHandler } from "./ElementEventsHandler";
export declare type GroupItem = FocusGroup | HTMLElement;
export declare const ELEMENT_INFO_TOKEN: string;
export declare type LoopBehavior = "" | "stop" | "loop";
export declare type ElementInfo = {
    parentGroup: FocusGroup;
    group: FocusGroup;
    eventsHandler: ElementEventsHandler;
};
export declare class FocusGroup {
    parentGroup: FocusGroup;
    groupElement: HTMLElement;
    private headBehavior;
    private tailBehavior;
    items: OrderedList<GroupItem>;
    readonly count: number;
    constructor(parentGroup: FocusGroup, groupElement: HTMLElement, headBehavior?: LoopBehavior, tailBehavior?: LoopBehavior);
    add(item: GroupItem, focusOrder?: number): void;
    remove(item: GroupItem): void;
    fistElementRecursively(): HTMLElement;
    lastElementRecursively(): HTMLElement;
    locateElementRecursively(element: HTMLElement): {
        group: FocusGroup;
        elementIndex: number;
    };
    getItemIndexByElement(element: HTMLElement): number;
    getNextElement(currentElement: HTMLElement): HTMLElement;
    getPriorElement(currentElement: HTMLElement): HTMLElement;
}
