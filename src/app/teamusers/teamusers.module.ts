import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import {
    NativeScriptRouterModule,
    NativeScriptCommonModule,
} from "@nativescript/angular";
import { TeamusersComponent } from "./teamusers.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild([
            { path: "", redirectTo: "teamusers" },
            { path: "teamusers", component: TeamusersComponent },
        ]),
    ],
    declarations: [],
    providers: [],
    schemas: [NO_ERRORS_SCHEMA],
})
export class TeamusersModule {}
