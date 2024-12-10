import { flatten, safeParseAsync } from "valibot";
import UnProcessableEntityException from "../exceptions/unProcessableEntityException";
import { AppActivity, ValidateReq } from "../types/appType";
import { VForgotSchema, VResetSchema, VUserSchema } from "./schema/vUserSchema";
import { VLoginSchema } from "./schema/vLoginSchema";


export const validate = async<R extends ValidateReq>(actionType: AppActivity, reqData: any, errMsg: string) => {
    let schema;
    switch (actionType) {
        case 'user: signup':
            schema = VUserSchema;
            break;
        case 'user: login':
            schema = VLoginSchema;
            break;   
        case 'password: forgot':
            schema = VForgotSchema;
            break;
        case 'password: reset':
            schema = VResetSchema;
            break;
    }

    const res = await safeParseAsync(schema!, reqData, { abortEarly: true});
    if (!res.success){
        const errData = flatten(res.issues).nested
        throw new UnProcessableEntityException(errMsg, errData);
    }
    return res.output as R;
}