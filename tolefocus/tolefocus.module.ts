import { NgModule } from "@angular/core";
//import { BrowserModule } from "@angular/platform-browser";

//import { FocusElementDirective } from "./directives/focus-element.directive";
import { FocusGroupDirective } from "./directives/focus-group.directive";
import { InputFocusDirective } from "./directives/directives";

const exportedDeclarations = [
    FocusGroupDirective,
    InputFocusDirective
];

@NgModule({
    //imports: [BrowserModule],
    declarations: [...exportedDeclarations],
    exports: [...exportedDeclarations]
})
export class ToleFocusModule { }
