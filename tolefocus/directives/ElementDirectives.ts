import { Directive, ElementRef, Input } from "@angular/core";
import { FocusGroupDirective } from "./FocusGroupDirective";

export class FocusElementDirectiveBase {
    protected focusOrder: number;
    constructor(protected fg: FocusGroupDirective, protected element: ElementRef) {
    }

    ngOnInit() {
        if (this.fg) {
            this.fg.registerChild(this.element.nativeElement, this.focusOrder);
        }
    }
}

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
