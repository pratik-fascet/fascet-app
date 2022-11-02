import {
    Component,
    HostListener,
    NgZone,
    OnDestroy,
    OnInit,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import DataService from "../shared/data.service";
import { IInboxDTO, IConversationDTO } from "~/models/IInboxDTO";
import { EventData, ItemEventData, ListView, Page } from "@nativescript/core";
import { AppState } from "../shared/app.state";
import { Subscription } from "rxjs";

@Component({
    templateUrl: "./messages.component.html",
    moduleId: module.id,
    styleUrls: ["./messages.component.scss"],
})
export class MessagesComponent implements OnInit, OnDestroy {
    inbox: IInboxDTO;
    messages: Array<IConversationDTO>;
    private messagesSub: Subscription;
    private resetMessagesSub: Subscription;

    constructor(
        private _ngZone: NgZone,
        private _activeRoute: ActivatedRoute,
        private _routerExtension: RouterExtensions,
        private _page: Page,
        private _dataService: DataService,
        private _appState: AppState
    ) {
        console.log("Messages .ctor");
        this._page.actionBarHidden = true;
    }

    ngOnInit() {
        this.messagesSub = this._appState.messages.subscribe((value) => {
            console.log("messages.subscribe", value);
            this._ngZone.run(() => (this.messages = value));
        });
        this.resetMessagesSub = this._appState.resetMessages.subscribe(
            (value) => {
                console.log("resetMessages.subscribe", value);
                this._ngZone.run(() => {
                    if (value) {
                        this.reloadMessages();
                    }
                });
            }
        );
    }

    ngOnDestroy() {
        this.messagesSub.unsubscribe();
        this.resetMessagesSub.unsubscribe();
    }

    @HostListener("loaded")
    loaded(): void {
        console.log("Messages loaded");
        if (this._appState.resetMessages.value) {
            this.reloadMessages();
        }
    }

    reloadMessages(): void {
        this._appState.resetMessages.next(false);
        if (!this._dataService.config.token) {
            return;
        }
        this._dataService
            .getInbox(-1, 20)
            .then((inbox) => {
                this._appState.messages.next(inbox.Conversations);
            })
            .catch((err) => {
                console.log("getInbox error " + err);
            });
    }

    composeMessage(ev) {
        console.log("composeMessage");
        this._routerExtension.navigate(["/messagecompose", -1]);
    }

    onListViewLoaded(args: EventData) {
        const listView = <ListView>args.object;
    }

    onItemTap(args: ItemEventData) {
        const index = args.index;
        console.log(`Second ListView item tap ${index}`);
        this._routerExtension.navigate([
            "/messagethread",
            this.messages[index].ConversationId,
        ]);
    }
}
