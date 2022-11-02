export interface ILogin {
    Username: string;
    Password: string;
}

export class Login implements ILogin {
    Username: string;
    Password: string;
    constructor(username: string, password: string) {
        this.Username = username;
        this.Password = password;
    }
}
