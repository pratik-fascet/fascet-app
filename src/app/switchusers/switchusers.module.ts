import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule } from "@nativescript/angular";
import { SwitchusersComponent } from "./switchusers.component";
import { NativeScriptCommonModule } from "@nativescript/angular/common";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild([
            { path: "", redirectTo: "switchusers" },
            { path: "switchusers", component: SwitchusersComponent },
        ]),
    ],
    declarations: [],
    providers: [],
    schemas: [NO_ERRORS_SCHEMA],
})
export class SwitchusersModule {}
