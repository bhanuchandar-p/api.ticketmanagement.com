import { DEF_400, DEF_MSG_400 } from "../constants/appMessages";
import BaseException from "./baseException";

export default class BadRequestException extends BaseException {
    constructor(message: string) {
        super(message || DEF_MSG_400, 400, DEF_400, true);
    }
}