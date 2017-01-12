import { Directive, ElementRef, Input } from "@angular/core";
import { FocusElementDirectiveBase } from "./focus-element-directive-base";
import { FocusGroupDirective } from "./focus-group.directive";

@Directive({
    selector: "[focusOrder]"
})
export class FocusOrderDirective extends FocusElementDirectiveBase {
    @Input() focusOrder: number;
    constructor (fg: FocusGroupDirective, element: ElementRef) {
        super(fg, element);
    }
}

@Directive({
    selector: "input"
})
export class InputFocusDirective extends FocusElementDirectiveBase {
    constructor (fg: FocusGroupDirective, element: ElementRef) {
        super(fg, element);
    }
}
