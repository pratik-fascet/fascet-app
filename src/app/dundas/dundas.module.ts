import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import {
    NativeScriptRouterModule,
    NativeScriptCommonModule,
} from "@nativescript/angular";
import { DundasComponent } from "./dundas.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild([
            { path: "", redirectTo: "dundas" },
            { path: "dundas", component: DundasComponent },
        ]),
    ],
    declarations: [DundasComponent],
    providers: [],
    schemas: [NO_ERRORS_SCHEMA],
})
export class DundasModule {}
