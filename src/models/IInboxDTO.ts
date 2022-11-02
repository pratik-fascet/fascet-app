export interface IInboxDTO {
    TotalConversations: number;
    TotalNewThreads: number;
    Conversations: Array<IConversationDTO>;
}

export interface IConversationDTO {
    AttachmentCount: number;
    Body: string;
    ConversationId: number;
    DisplayDate: string;
    From: string;
    KeyID: number;
    MessageID: number;
    NewThreadCount: number;
    PortalID: number;
    ReplyAllAllowed: boolean;
    RowNumber: number;
    SenderProfileUrl: string;
    SenderUserID: number;
    Subject: string;
    ThreadCount: number;
    To: string;
}
