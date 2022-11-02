import StorageService from "./storage.service";

export default class Service extends StorageService {
    static toUTCDateTimeDigits(input: Date): string {
        if (typeof input === "string") {
            input = new Date(input);
        }

        return (
            input.getUTCFullYear() +
            "-" +
            Service.pad(input.getUTCMonth() + 1) +
            "-" +
            Service.pad(input.getUTCDate()) +
            "T" +
            Service.pad(input.getUTCHours()) +
            ":" +
            Service.pad(input.getUTCMinutes()) +
            ":" +
            Service.pad(input.getUTCSeconds()) +
            "Z"
        );
    }

    static pad(number: number): string {
        if (number < 10) {
            return "0" + number;
        }

        return number.toString();
    }

    constructor() {
        super();
    }

    getQueryString(params: any): string {
        if (params === undefined || params === null) {
            return "";
        }
        const esc = encodeURIComponent;

        return (
            "?" +
            Object.keys(params)
                .map((k) => esc(k) + "=" + esc(params[k]))
                .join("&")
        );
    }
}
