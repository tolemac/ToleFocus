import { domProcessor } from "./DomProcessor";

export class FocusObserver {
    private _enabled = false;
    private _rootElement: HTMLElement;
    private observer = new MutationObserver((mutations) => this.observerCallback(mutations));

    get enabled() {
        return this._enabled;
    }

    get rootElement() {
        return this._rootElement;
    }

    disable() {
        if (!this._enabled) {
            return;
        }
        this.observer.disconnect();
        this._enabled = false;
    }

    enable(rootElement?: HTMLElement) {
        if (this._enabled) {
            this.disable();
        }

        if (!rootElement) {
            rootElement = document.body;
        }

        const config = {
            childList: true,
            subtree: true
        };
        this.observer.observe(rootElement as Node, config);
    }

    observerCallback(mutations: MutationRecord[]) {
        mutations.forEach((mutation) => this.processMutation(mutation));
    }

    processMutation(mutation: MutationRecord) {
        if (mutation.type === "childList") {
            for (let i = 0, j = mutation.addedNodes.length; i < j; i++) {
                domProcessor.processAddedElement(mutation.addedNodes.item(i) as HTMLElement);
                domProcessor.processFromElement(mutation.addedNodes.item(i) as HTMLElement);
            }
            for (let i = 0, j = mutation.removedNodes.length; i < j; i++) {
                domProcessor.processRemovedElement(mutation.removedNodes.item(i) as HTMLElement);
                domProcessor.removeChildrenFromElement(mutation.removedNodes.item(i) as HTMLElement);
            }
        }
    }
}

export const focusObserver = new FocusObserver();
