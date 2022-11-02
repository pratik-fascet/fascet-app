import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { IConversationDTO } from "~/models/IInboxDTO";
import { ILoginResponse } from "~/models/ILoginResponse";
import { ITotalsDTO } from "~/models/ITotalsDTO";
import { IUser, IUserPlus } from "~/models/IUser";

@Injectable({
    providedIn: "root",
})
export class AppState {
    loginResponse: BehaviorSubject<ILoginResponse> = new BehaviorSubject<
        ILoginResponse
    >({
        accessToken: "",
        devices: [],
        displayName: "",
        isEmployee: false,
        renewalToken: "",
        userId: -1,
    });
    messages: BehaviorSubject<Array<IConversationDTO>> = new BehaviorSubject<
        Array<IConversationDTO>
    >([]);
    switchUsers: BehaviorSubject<Array<IUser>> = new BehaviorSubject<
        Array<IUser>
    >([]);
    teamUsers: BehaviorSubject<Array<IUserPlus>> = new BehaviorSubject<
        Array<IUserPlus>
    >([]);
    resetMessages: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        true
    );
    resetDundas: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    resetSwitchUsers: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        true
    );
    resetTeamUsers: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        true
    );
    resetDocuments: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        true
    );
    resetHome: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    totals: BehaviorSubject<ITotalsDTO> = new BehaviorSubject<ITotalsDTO>({
        TotalNotifications: 0,
        TotalUnreadMessages: 0,
    });

    constructor() {
        // do nothing
    }

    setTotals(newTotals: ITotalsDTO) {
        if (
            this.totals.value &&
            this.totals.value.TotalUnreadMessages ===
                newTotals.TotalUnreadMessages
        ) {
            return;
        }
        this.totals.next(newTotals);
        this.resetMessages.next(true);
    }
}
