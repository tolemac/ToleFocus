import { OrderedList } from "../Utils/OrderedList";
import { ElementEventsHandler } from "./ElementEventsHandler";

type GroupItem = FocusGroup | HTMLElement;
export const ELEMENT_INFO_TOKEN = "TOLEFOCUS_INFO";

export type LoopBehavior = "" | "stop" | "loop";

export type ElementInfo = {
    parentGroup: FocusGroup;
    group: FocusGroup;
    eventsHandler: ElementEventsHandler;
};

export class FocusGroup {
    items = new OrderedList<GroupItem>();

    get count() {
        return this.items.orderedItems.length;
    }

    constructor(public parentGroup: FocusGroup, public groupElement: HTMLElement,
        private headBehavior: LoopBehavior = "",
        private tailBehavior: LoopBehavior = "") {
    }

    add(item: GroupItem, focusOrder?: number) {
        this.items.add(item, focusOrder);
        if (!(item instanceof FocusGroup)) {
            item.setAttribute("tabindex", "-1");

            if (!item[ELEMENT_INFO_TOKEN]) {
                item[ELEMENT_INFO_TOKEN] = {
                    parentGroup: this,
                    eventsHandler: new ElementEventsHandler(item)
                };
            }
        } else {
            if (!item.groupElement[ELEMENT_INFO_TOKEN]) {
                item.groupElement[ELEMENT_INFO_TOKEN] = {
                    parentGroup: this,
                    group: item
                };
            }
        }
    }

    remove(item: GroupItem) {
        if (!(item instanceof FocusGroup) && item[ELEMENT_INFO_TOKEN]) {
            (item[ELEMENT_INFO_TOKEN] as ElementInfo).eventsHandler.unhandle();
        }
        this.items.remove(item);
    }

    fistElementRecursively(): HTMLElement {
        for (let {object} of this.items.orderedItems) {
            if (!(object instanceof FocusGroup)) {
                return object;
            } else {
                const innerGroupFirst = object.fistElementRecursively();
                if (innerGroupFirst) {
                    return innerGroupFirst;
                }
            }
        }
        return undefined;
    }

    lastElementRecursively(): HTMLElement {
        for (let i = this.items.orderedItems.length - 1; i >= 0; i--) {
            const object = this.items.orderedItems[i].object;
            if (!(object instanceof FocusGroup)) {
                return object;
            } else {
                const innerGroupLast = object.lastElementRecursively();
                if (innerGroupLast) {
                    return innerGroupLast;
                }
            }
        }
        return undefined;
    }

    locateElementRecursively(element: HTMLElement): {
        group: FocusGroup,
        elementIndex: number
    } {
        let index = 0;
        for (let {object} of this.items.orderedItems) {
            if (!(object instanceof FocusGroup)) {
                if (object === element) {
                    return { group: this, elementIndex: index };
                }
            } else {
                const innerResult = object.locateElementRecursively(element);
                if (innerResult.group) {
                    return innerResult;
                }
            }
            index++;
        }
        return { group: undefined, elementIndex: undefined };
    }

    getItemIndexByElement(element: HTMLElement) {
        return this.items.orderedItems.findIndex((item) =>
            (item.object instanceof FocusGroup && item.object.groupElement === element)
            || (!(item.object instanceof FocusGroup) && item.object === element)
        );
    }

    getNextElement(currentElement: HTMLElement): HTMLElement {
        let nextItemIndex: number;
        const index = this.getItemIndexByElement(currentElement);
        if (index >= 0) {
            if (index < this.items.orderedItems.length - 1) {
                nextItemIndex = index + 1;
            } else {
                if (this.tailBehavior === "loop") {
                    nextItemIndex = 0;
                } else if (this.tailBehavior === "stop") {
                    nextItemIndex = index;
                } else {
                    if (this.parentGroup) {
                        const parentNext = this.parentGroup.getNextElement(this.groupElement);
                        if (parentNext) {
                            return parentNext;
                        }
                    }
                }
            }
        }

        if (nextItemIndex === undefined) {
            return undefined;
        }

        const nextItem = this.items.orderedItems[nextItemIndex];
        if (nextItem.object instanceof FocusGroup) {
            return nextItem.object.fistElementRecursively();
        } else {
            return nextItem.object;
        }
    }

    getPriorElement(currentElement: HTMLElement): HTMLElement {
        let priorItemIndex: number;
        const index = this.getItemIndexByElement(currentElement);
        if (index >= 0) {
            if (index > 0) {
                priorItemIndex = index - 1;
            } else {
                if (this.headBehavior === "loop") {
                    priorItemIndex = this.items.orderedItems.length - 1;
                } else if (this.headBehavior === "stop") {
                    priorItemIndex = index;
                } else {
                    if (this.parentGroup) {
                        const parentPrior = this.parentGroup.getPriorElement(this.groupElement);
                        if (parentPrior) {
                            return parentPrior;
                        }
                    }
                }
            }
        }

        if (priorItemIndex === undefined) {
            return undefined;
        }

        const priorItem = this.items.orderedItems[priorItemIndex];
        if (priorItem.object instanceof FocusGroup) {
            return priorItem.object.lastElementRecursively();
        } else {
            return priorItem.object;
        }
    }
}
