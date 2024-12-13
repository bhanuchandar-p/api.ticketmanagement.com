import { flatten, safeParseAsync } from "valibot";
import UnProcessableEntityException from "../exceptions/unProcessableEntityException";
import { AppActivity, ValidateReq } from "../types/appType";
import { VAdminUserSchema, VDeveloperUserSchema, VForgotSchema, VRegularUserSchema, VResetSchema, VUpdateUserSchema, VUserSchema } from "./schema/vUserSchema";
import { VLoginSchema } from "./schema/vLoginSchema";
import { VUpdateTicketSchema } from "./schema/vUpdateTicket";
import { VTicketSchema } from "./schema/vTicketSchema";
import { VCommentSchema} from "./schema/vCommentsSchema";
import { VUploadFileSchema, VDownloadFileSchema } from "./schema/vFileSchema";
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
        case 'ticket: create-ticket':
            schema = VTicketSchema;
            break;
        case 'ticket: update':
            schema = VUpdateTicketSchema;
            break;
        case 'comment: create-comment':
            schema = VCommentSchema;
            break;
        case 'comment: delete' :
            schema = VCommentSchema;            
            break;
        case "file: upload":
            schema = VUploadFileSchema;
            break;
        case "file: download":
            schema = VDownloadFileSchema;
            break;       
        case 'add:project':
            schema = VProjectSchema;
            break;
        case 'update:project':
            schema = VProjectSchema;
            break;
    }


    const res = await safeParseAsync(schema!, reqData, { abortEarly: true});
    if (!res.success){
        const errData = flatten(res.issues).nested
        throw new UnProcessableEntityException(errMsg, errData);
    }
    return res.output as R;
}