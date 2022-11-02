import { IConversationDTO } from "./IInboxDTO";

export interface IReplyDTO {
    TotalThreads: number;
    TotalNewThreads: number;
    TotalArchivedThreads: number;
    Conversation: IConversationDTO;
}
