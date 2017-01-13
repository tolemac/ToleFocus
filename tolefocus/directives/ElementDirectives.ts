import { Directive, ElementRef, Input } from "@angular/core";
import { FocusGroupDirective } from "./FocusGroupDirective";
import { focusOrderAttributeName, focusableTagNames } from "../core/FocusManager";

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
    selector: `[${focusOrderAttributeName}]`
})
export class FocusOrderDirective extends FocusElementDirectiveBase {
    @Input() focusOrder: number;
    constructor(fg: FocusGroupDirective, element: ElementRef) {
        super(fg, element);
    }
}

function createDirective(selector: string) {
    @Directive({ selector })
    class ElementDirective extends FocusElementDirectiveBase {
        constructor(fg: FocusGroupDirective, element: ElementRef) {
            super(fg, element);
        }
    }
    return ElementDirective;
}



export function createElementDirectives() {
    const result = [] as any[];

    for (let selector of focusableTagNames) {
        result.push(createDirective(selector));
    }

    return result;
}
