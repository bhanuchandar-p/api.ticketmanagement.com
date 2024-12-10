import { DEF_422, DEF_MSG_422 } from "../constants/appMessages";
import BaseException from "./baseException";

export default class UnProcessableEntityException extends BaseException {
    constructor(message: string, errData?: any) {
        super(message || DEF_MSG_422, 422, DEF_422, true, errData);
    }
    
}