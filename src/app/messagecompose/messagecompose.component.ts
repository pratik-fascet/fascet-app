import { Component, ViewChild, OnInit, HostListener } from "@angular/core";
import { Dialogs, EventData, Page } from "@nativescript/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { RadAutoCompleteTextViewComponent } from "nativescript-ui-autocomplete/angular";
import DataService from "../shared/data.service";
import { SearchAddr } from "~/models/ISearchAddrDTO";
import { AppState } from "../shared/app.state";

@Component({
    selector: "messagecompose",
    moduleId: module.id,
    templateUrl: "./messagecompose.component.html",
    styleUrls: ["./messagecompose.component.scss"],
})
export class MessagecomposeComponent implements OnInit {
    messageSubject: string = "";
    messageBody: string = "";
    isBusy: boolean = true;
    isOK: boolean = false;
    addressee: number = -1;
    showAutoComplete: boolean = true;

    @ViewChild("autocomplete", { static: true })
    autocomplete: RadAutoCompleteTextViewComponent;

    constructor(
        private _activeRoute: ActivatedRoute,
        private _routerExtension: RouterExtensions,
        private _page: Page,
        private _dataService: DataService,
        private _appState: AppState
    ) {
        console.log("Messagecompose .ctor");
        this.isBusy = false;
        this._activeRoute.params.subscribe((params) => {
            console.log("MessageCompose params", params);
            this.addressee = +params.addr;
        });
    }

    @HostListener("loaded")
    loaded(): void {
        this.showAutoComplete = this.addressee === -1;
        console.log("MessageCompose loaded", this.addressee);
    }

    ngOnInit() {
        console.log("MessageCompose ngOnInit");
        this.autocomplete.nativeElement.loadSuggestionsAsync = (text) => {
            return this._dataService
                .searchAddressees(text)
                .then((result) => {
                    return result.map((r) => new SearchAddr(r));
                })
                .catch((err) => {
                    console.log("searchAddressees error " + err);
                });
        };
    }

    changed() {
        console.log("changed");
        this.isOK =
            this.messageSubject.trim() !== "" &&
            this.messageBody.trim() !== "" &&
            (!this.showAutoComplete ||
                this.autocomplete.nativeElement.selectedTokens.length > 0);
    }

    send(args: EventData) {
        const addressees = this.autocomplete.nativeElement
            .selectedTokens as Array<SearchAddr>;
        const userAddressees = this.showAutoComplete
            ? addressees
                  .filter((a) => a.id.startsWith("user"))
                  .map((a) => +a.id.substring(5))
            : [this.addressee];
        const roleAddressees = this.showAutoComplete
            ? addressees
                  .filter((a) => a.id.startsWith("role"))
                  .map((a) => +a.id.substring(5))
            : [];
        this._dataService
            .sendMessage(
                this.messageSubject,
                this.messageBody,
                userAddressees,
                roleAddressees
            )
            .then((result) => {
                if (result.Result === "success") {
                    this._appState.resetMessages.next(true);
                    Dialogs
                        .alert({
                            title: "Success",
                            message: "Your message has been sent successfully",
                            okButtonText: "Ok",
                        })
                        .then((r) => {
                            this._routerExtension.back();
                        });
                }
            })
            .catch((err) => {
                console.log("sendMessage error " + err);
            });
    }
}
