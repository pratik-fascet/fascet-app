import { Component, HostListener, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { ItemEventData, Page } from "@nativescript/core";
import DataService from "../shared/data.service";
import { IUserPlus } from "~/models/IUser";
import { AppState } from "../shared/app.state";
import { SiteUrl } from "../shared/globals";

@Component({
    selector: "teamusers",
    moduleId: module.id,
    templateUrl: "./teamusers.component.html",
    styleUrls: ["./teamusers.component.scss"],
})
export class TeamusersComponent {
    users: Array<IUserPlus>;
    baseUrl: string;

    constructor(
        private _activeRoute: ActivatedRoute,
        private _routerExtension: RouterExtensions,
        private _page: Page,
        private _dataService: DataService,
        private _appState: AppState
    ) {
        console.log("Teamusers .ctor");
        this.baseUrl = `https://${SiteUrl}/DnnImageHandler.ashx?mode=profilepic&h=32&w=32&userId=`;
        this.users = this._appState.teamUsers.value;
    }

    @HostListener("loaded")
    loaded(): void {
        console.log("Teamusers loaded");
        if (this._appState.resetTeamUsers.value) {
            this._appState.resetTeamUsers.next(false);
            this.users = this._appState.teamUsers.value;
        }
    }

    onItemTap(args: ItemEventData) {
        const index = args.index;
        const user = this.users[index];
        this._routerExtension.navigate(["/messagecompose", user.UserId]);
    }
}
