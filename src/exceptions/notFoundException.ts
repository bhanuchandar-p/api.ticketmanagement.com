import BaseException from "./baseException";
import { DEF_404, DEF_MSG_404 } from "../constants/appMessages";

class NotFoundException extends BaseException {
    constructor(message: string) {
        super(message || DEF_MSG_404, 404, DEF_404, true);
    }
}

export default NotFoundException