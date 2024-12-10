import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";

export const SendSuccessMsg = async (c: Context, status: StatusCode, message: string, data?: any) => {
    c.status(status);
    return c.json({
        success: true,
        status: status,
        message,
        data
    })
}