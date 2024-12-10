import { DEF_MSG_409, DEF_409 } from "../constants/appMessages";
import BaseException from "./baseException";

export default class ConflictException extends BaseException {
    constructor(message: string) {
        super(message || DEF_MSG_409, 409, DEF_409, true);
    }
}