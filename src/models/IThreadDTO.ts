import { IConversationDTO } from "./IInboxDTO";

export interface IThreadDTO {
    TotalThreads: number;
    TotalNewThreads: number;
    TotalArchivedThreads: number;
    Conversations: Array<IThreadConversationDTO>;
}

export interface IThreadConversationDTO {
    Conversation: IConversationDTO;
}
