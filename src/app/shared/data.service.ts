import { Injectable } from "@angular/core";
import DnnService from "./dnn.service";
import { ITotalsDTO } from "~/models/ITotalsDTO";
import { IInboxDTO } from "~/models/IInboxDTO";
import { IThreadDTO } from "~/models/IThreadDTO";
import { IReplyDTO } from "~/models/IReplyDTO";
import { ISearchAddrDTO } from "~/models/ISearchAddrDTO";
import { ISendMessageResultDTO } from "~/models/ISendMessageResultDTO";
import { IDmxEntry } from "~/models/IDmxEntry";
import { IUser, IUserPlus } from "~/models/IUser";
import { IGenericResultDTO } from "~/models/IGenericResultDTO";

@Injectable({
    providedIn: "root",
})
export default class DataService extends DnnService {
    getTotals(): Promise<ITotalsDTO> {
        return this.request<ITotalsDTO>(
            "GET",
            this.MessagesModule,
            "MessagingService",
            "GetTotals",
            null,
            null,
            this.config.site.MessagesModuleId,
            this.config.site.MessagesTabId
        );
    }

    getInbox(
        afterMessageId: number,
        numberOfRecords: number
    ): Promise<IInboxDTO> {
        return this.request<IInboxDTO>(
            "GET",
            this.MessagesModule,
            "MessagingService",
            "Inbox",
            {
                afterMessageId,
                numberOfRecords,
            },
            null,
            this.config.site.MessagesModuleId,
            this.config.site.MessagesTabId
        );
    }

    getThread(
        conversationId: number,
        afterMessageId: number,
        numberOfRecords: number
    ): Promise<IThreadDTO> {
        return this.request<IThreadDTO>(
            "GET",
            this.MessagesModule,
            "MessagingService",
            "Thread",
            {
                conversationId,
                afterMessageId,
                numberOfRecords,
            },
            null,
            this.config.site.MessagesModuleId,
            this.config.site.MessagesTabId
        );
    }

    reply(conversationId: number, body: string): Promise<IReplyDTO> {
        return this.request<IReplyDTO>(
            "POST",
            this.MessagesModule,
            "MessagingService",
            "Reply",
            null,
            {
                conversationId,
                body,
            },
            this.config.site.MessagesModuleId,
            this.config.site.MessagesTabId
        );
    }

    markRead(conversationId: number): Promise<IGenericResultDTO> {
        return this.request<IGenericResultDTO>(
            "POST",
            this.MessagesModule,
            "MessagingService",
            "MarkRead",
            null,
            {
                conversationId,
            },
            this.config.site.MessagesModuleId,
            this.config.site.MessagesTabId
        );
    }

    searchAddressees(searchString: string): Promise<Array<ISearchAddrDTO>> {
        return this.request<Array<ISearchAddrDTO>>(
            "GET",
            this.MessagesModule,
            "MessagingService",
            "Search",
            { q: searchString },
            null,
            this.config.site.MessagesModuleId,
            this.config.site.MessagesTabId
        );
    }

    sendMessage(
        subject,
        body,
        userIds: Array<number>,
        roleIds: Array<number>
    ): Promise<ISendMessageResultDTO> {
        return this.request<ISendMessageResultDTO>(
            "POST",
            this.InternalServices,
            "MessagingService",
            "Create",
            null,
            {
                subject,
                body,
                userIds: JSON.stringify(userIds),
                roleIds: JSON.stringify(roleIds),
                fileIds: "[]",
            },
            this.config.site.MessagesModuleId,
            this.config.site.MessagesTabId
        );
    }

    getDmxFolderContents(folderId: number): Promise<Array<IDmxEntry>> {
        return this.request(
            "GET",
            this.FascetModule,
            "Dmx",
            "FolderContents",
            {
                CollectionId: folderId,
            },
            null
        );
    }

    getDashboardUrl(): Promise<string> {
        return this.request(
            "GET",
            this.FascetModule,
            "Dashboard",
            "GetUrl",
            null,
            null
        );
    }

    getSwitchableUsers(): Promise<Array<IUser>> {
        return this.request(
            "GET",
            this.FascetModule,
            "Dnn",
            "SwitchableUsers",
            null,
            null
        );
    }

    getTeamUsers(): Promise<Array<IUserPlus>> {
        return this.request(
            "GET",
            this.FascetModule,
            "Dnn",
            "TeamUsers",
            null,
            null
        );
    }
}
