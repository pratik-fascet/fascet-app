export interface IUser {
    UserId: number;
    Username: string;
    FirstName: string;
    LastName: string;
    DisplayName: string;
    Email: string;
}
export interface IUserPlus extends IUser {
    Title: string;
    ProfilePicBase64: string;
}
