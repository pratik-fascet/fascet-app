import { TokenModel } from "nativescript-ui-autocomplete";

export interface ISearchAddrDTO {
    id: string;
    name: string;
    iconfile: string;
}

export class SearchAddr extends TokenModel implements ISearchAddrDTO {
    id: string;
    name: string;
    iconfile: string;
    constructor(data: ISearchAddrDTO) {
        super(data.name, data.iconfile);
        this.id = data.id;
        this.name = data.name;
        this.iconfile = data.iconfile;
    }
}
