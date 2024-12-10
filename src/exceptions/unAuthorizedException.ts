import { DEF_401, DEF_MSG_401 } from "../constants/appMessages";
import BaseException from "./baseException";

class UnauthorizedException extends BaseException {
    constructor(message: string) {
        super(message || DEF_MSG_401, 401, DEF_401, true);
    }
}

export default UnauthorizedException