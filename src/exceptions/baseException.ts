import { StatusCode } from "hono/utils/http-status";

class BaseException extends Error {
    status: StatusCode;
    isOperational: boolean;
    errData: any;

    constructor(message: string, status: StatusCode, name: string, isOperational: boolean, errData?: any) {
        super(message);
        this.status = status;
        this.name = name;
        this.isOperational = isOperational;
        this.errData = errData;
    }
}

export default BaseException