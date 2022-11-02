import { Component, HostListener, Input } from "@angular/core";
import { Dialogs, ItemEventData, Page, TextField } from "@nativescript/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import DataService from "../shared/data.service";
import { IUser } from "~/models/IUser";
import { AppState } from "../shared/app.state";

@Component({
    selector: "switchusers",
    moduleId: module.id,
    templateUrl: "./switchusers.component.html",
})
export class SwitchusersComponent {
    users: Array<IUser>;
    _filter: string = "";

    constructor(
        private _activeRoute: ActivatedRoute,
        private _routerExtension: RouterExtensions,
        private _page: Page,
        private _dataService: DataService,
        private _appState: AppState
    ) {
        console.log("Switchusers .ctor");
        this.users = this._appState.switchUsers.value;
    }

    set filter(val) {
        const textField = <TextField>val.object;
        this._filter = textField.text;
        this.filterUsers();
    }

    @Input()
    get name() {
        return this._filter;
    }

    @HostListener("loaded")
    loaded(): void {
        console.log("SwitchUsers loaded");
        if (this._appState.resetSwitchUsers.value) {
            this._appState.resetSwitchUsers.next(false);
            this.users = this._appState.switchUsers.value;
        }
    }

    filterUsers(): void {
        const filter = this._filter.toLowerCase();
        if (filter.length > 1) {
            this.users = this._appState.switchUsers.value.filter((u: IUser) => {
                return u.DisplayName.toLowerCase().indexOf(filter) !== -1;
            });
        } else {
            this.users = this._appState.switchUsers.value;
        }
    }

    onItemTap(args: ItemEventData) {
        const index = args.index;
        const user = this.users[index];
        console.log("Switching to user " + user.DisplayName);
        Dialogs.confirm({
            title: "Switch User",
            message: `Do you wish to log off and log in as ${user.DisplayName}?`,
            okButtonText: "Yes",
            cancelButtonText: "No",
        }).then((result) => {
            if (result) {
                this._dataService
                    .switchUser(this.users[index])
                    .then((success) => {
                        this._appState.resetDocuments.next(true);
                        this._appState.resetDundas.next(true);
                        this._appState.resetHome.next(true);
                        this._appState.resetMessages.next(true);
                        this._appState.resetSwitchUsers.next(true);
                        // if (global.android) {
                        if (global.android) {
                            Dialogs.alert({
                                title: "Restart",
                                message: "The app will need to restart",
                                okButtonText: "Ok",
                                cancelable: false,
                            }).then(() => {
                                if ((global as any).process.restart) {
                                    console.log("Restarting");
                                    (global as any).process.restart();
                                }
                            });
                        } else {
                            this._routerExtension.back();
                        }
                    })
                    .catch((error: Error) => {
                        console.log("Switching error", error);
                        Dialogs.alert({
                            title: "Problem switching user",
                            message: error.message,
                            okButtonText: "Ok",
                            cancelable: false,
                        });
                    });
            }
        });
    }
}
