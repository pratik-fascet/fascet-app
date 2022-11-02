import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import DataService from "../shared/data.service";
import { IThreadDTO } from "~/models/IThreadDTO";
import { IConversationDTO } from "~/models/IInboxDTO";
import {
    EventData,
    Page,
    ItemEventData,
    TextView,
    Application,
} from "@nativescript/core";

@Component({
    moduleId: module.id,
    selector: "mesagethread",
    templateUrl: "./messagethread.component.html",
    styleUrls: ["./messagethread.component.scss"],
})
export class MessagethreadComponent {
    conversationId: number;
    thread: IThreadDTO;
    messages: Array<IConversationDTO>;
    title: string = "";
    contact: string = "";
    replyText: string = "";

    constructor(
        private _activeRoute: ActivatedRoute,
        private _routerExtension: RouterExtensions,
        private _page: Page,
        private _dataService: DataService
    ) {
        console.log("Messagethread .ctor");
        this.messages = [];
        this._activeRoute.params.subscribe((params) => {
            this.conversationId = params.id;
            this.refresh();
        });
        _page.on("loaded", (args) => {
            if (this._page.android) {
                const window = Application.android.startActivity.getWindow();
                window.setSoftInputMode(
                    android.view.WindowManager.LayoutParams
                        .SOFT_INPUT_ADJUST_PAN
                );
            }
        });
    }

    refresh() {
        this._dataService
            .getThread(this.conversationId, -1, 10)
            .then((thread) => {
                this.thread = thread;
                this.messages = thread.Conversations.map((m) => m.Conversation);
                this.title = thread.Conversations[0].Conversation.Subject;
                this.contact = thread.Conversations[0].Conversation.From;
                console.log(JSON.stringify(thread));
                this._dataService.markRead(this.conversationId).then((r) => {
                    console.log("Marked as read", r);
                });
            })
            .catch((err) => {
                console.log("getThread error " + err);
            });
    }

    onItemTap(args: ItemEventData) {
        const index = args.index;
        console.log(`Second ListView item tap ${index}`);
    }

    onTextChange(args: EventData) {
        const tv = args.object as TextView;
        this.replyText = tv.text;
    }

    onReply(args: EventData) {
        console.log(this.replyText);
        this._dataService
            .reply(this.conversationId, this.replyText)
            .then((reply) => {
                this.thread.TotalThreads = reply.TotalThreads;
                this.thread.TotalNewThreads = reply.TotalNewThreads;
                this.thread.TotalArchivedThreads = reply.TotalArchivedThreads;
                this.thread.Conversations.push({
                    Conversation: reply.Conversation,
                });
                this.messages.unshift(reply.Conversation);
                this.replyText = "";
            })
            .catch((err) => {
                console.log("reply error " + err);
            });
    }
}
