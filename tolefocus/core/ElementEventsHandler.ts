import { focusManager } from "./FocusManager";

const TAB_KEYCODE = 9;
const ENTER_KEYCODE = 13;

export class ElementEventsHandler {
    constructor(private element: HTMLElement) {
        this.handle();
    }

    unhandle() {
        this.element.removeEventListener("keydown", this.keyPressHandler);
    }

    handle() {
        const elem = this.element;
        elem.addEventListener("keydown", this.keyPressHandler);
    }

    keyPressHandler = (event: KeyboardEvent) => {
        if (focusManager.enabled) {
            if (event.keyCode === TAB_KEYCODE) {
                if (event.shiftKey) {
                    focusManager.focusPrior(this.element);
                } else {
                    focusManager.focusNext(this.element);
                }
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }
}
