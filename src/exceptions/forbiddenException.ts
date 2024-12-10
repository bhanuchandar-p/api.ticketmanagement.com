import { DEF_MSG_403, DEF_403 } from "../constants/appMessages";
import BaseException from "./baseException";

export default class ForbiddenException extends BaseException {
    constructor(message: string) {
        super(message || DEF_MSG_403, 403, DEF_403, true);
    }
}