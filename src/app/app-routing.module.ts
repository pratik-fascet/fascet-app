import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";
import { LoginComponent } from "./login/login.component";
import { DuoComponent } from "./duo/duo.component";
import { MessagethreadComponent } from "./messagethread/messagethread.component";
import { MessagecomposeComponent } from "./messagecompose/messagecompose.component";
import { MaintenanceComponent } from "./maintenance/maintenance.component";
import { SwitchusersComponent } from "./switchusers/switchusers.component";
import { TeamusersComponent } from "./teamusers/teamusers.component";

const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "maintenance", component: MaintenanceComponent },
    { path: "login", component: LoginComponent },
    { path: "duo", component: DuoComponent },
    {
        path: "home",
        loadChildren: () =>
            import("~/app/home/home.module").then((m) => m.HomeModule),
    },
    { path: "messagethread/:id", component: MessagethreadComponent },
    { path: "messagecompose/:addr", component: MessagecomposeComponent },
    { path: "switchusers", component: SwitchusersComponent },
    { path: "teamusers", component: TeamusersComponent }
];

@NgModule({
    imports: [
        NativeScriptRouterModule.forRoot(routes, { enableTracing: true }),
    ],
    exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
