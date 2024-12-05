import config from "../config/Config";
import { Request, Response } from 'express';

export default class Token {
    user_id: string = "";
    from_ip: string = "";
    roles: string[] = [];

    constructor(header: Request["header"]) { 
        this.user_id = "AAAA00000000000000000000";
        this.from_ip = "127.0.0.1";
        this.roles = ["staff"];
    }
}
