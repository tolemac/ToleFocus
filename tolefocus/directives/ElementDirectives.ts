import { Directive, ElementRef, Input } from "@angular/core";
import { FocusGroupDirective } from "./FocusGroupDirective";

export class FocusElementDirectiveBase {
    protected focusOrder: number;
    private added = false;

    constructor(protected fg: FocusGroupDirective, protected element: ElementRef) {
    }

    ngOnInit() {
        if (this.fg) {
            this.added = true;
            this.fg.registerChild(this.element.nativeElement, this.focusOrder);
        }
    }

    ngOnDestroy() {
        if (this.added) {
            this.fg.group.remove(this.element.nativeElement);
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

function createDirective(selector: string) {
    @Directive({selector})
    class ElementDirective extends FocusElementDirectiveBase {
        constructor (fg: FocusGroupDirective, element: ElementRef) {
            super(fg, element);
        }
    }
    return ElementDirective;
}

const focusableSelectors = ["a", "select", "button", "input", "textarea"];

export function createElementDirectives() {
    const result = [] as any[];

    for (let selector of focusableSelectors) {
        result.push(createDirective(selector));
    }

    return result;
}
