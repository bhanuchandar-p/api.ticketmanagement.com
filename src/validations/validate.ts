import { flatten, safeParseAsync } from "valibot";
import UnProcessableEntityException from "../exceptions/unProcessableEntityException";
import { AppActivity, ValidateReq } from "../types/appType";
import { VAdminUserSchema, VDeveloperUserSchema, VForgotSchema, VRegularUserSchema, VResetSchema, VUpdateUserSchema, VUserSchema } from "./schema/vUserSchema";
import { VLoginSchema } from "./schema/vLoginSchema";
import { VProjectSchema } from "./schema/vProjectSchema";


export const validate = async<R extends ValidateReq>(actionType: AppActivity, reqData: any, errMsg: string) => {
    let schema;
    switch (actionType) {
        case 'user:signup':
            schema = VUserSchema;
            break;
        case 'user:login':
            schema = VLoginSchema;
            break;   
        case 'password:forgot':
            schema = VForgotSchema;
            break;
        case 'password:reset':
            schema = VResetSchema;
            break;
        case 'user:create-admin-user':
            schema = VAdminUserSchema;
            break;
        case 'user:update-user':
            schema = VUpdateUserSchema;
            break;
        case 'user:update-password':
            schema = VUpdateUserSchema;
            break;
        case 'user:create-developer':
            schema = VDeveloperUserSchema;
            break;
        case 'user:create-user':
            schema = VRegularUserSchema;
            break;
        case 'add:project':
            schema = VProjectSchema;
            break;
        case 'update:project':

    }


    const res = await safeParseAsync(schema!, reqData, { abortEarly: true});
    if (!res.success){
        const errData = flatten(res.issues).nested
        throw new UnProcessableEntityException(errMsg, errData);
    }
    return res.output as R;
}