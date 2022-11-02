import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { EventData, Page } from "@nativescript/core";
import DataService from "../shared/data.service";
import { exit } from "nativescript-exit";

@Component({
    selector: "maintenance",
    moduleId: module.id,
    templateUrl: "./maintenance.component.html",
    styleUrls: ["./maintenance.component.scss"],
})
export class MaintenanceComponent {
    constructor(
        private _activeRoute: ActivatedRoute,
        private _routerExtension: RouterExtensions,
        private _page: Page,
        private _dataService: DataService
    ) {
        console.log("Maintenance .ctor");
    }

    doClose(args: EventData): void {
        exit();
    }
}
