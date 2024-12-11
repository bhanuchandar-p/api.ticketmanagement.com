import { createMiddleware } from "hono/factory";
import { getUserDetailsFromToken } from "../utils/jwtUtils";

export const isAuthorized = createMiddleware(async (c, next) => {
    try {
        const userDetails = await getUserDetailsFromToken(c);

        c.set('user_payload', userDetails);
        await next();

    } catch (error) {
        throw error;
    }
})
