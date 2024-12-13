import { User } from "../db/schemas/users";
import { ValidateCommentsSchema } from "../validations/schema/vCommentsSchema";
import { ValidateDownloadFile, ValidateUploadFile } from "../validations/schema/vFileSchema";
import { ValidateLoginSchema } from "../validations/schema/vLoginSchema";
import { ValidateProjectSchema, ValidateProjectUpdateSchema } from "../validations/schema/vProjectSchema";
import { ValidateAdminUserSchema, ValidateForgotSchema, ValidateRegularUserSchema, ValidateResetSchema, ValidateUpdateUserSchema, ValidateUserSchema } from "../validations/schema/vUserSchema";
import { ValidateTicketSchema } from "../validations/schema/vTicketSchema"; 
import { ValidateUpdateTicket } from "../validations/schema/vUpdateTicket"

export type Userdetails = Omit<User, 'password'>

export type UserActivity = 'user:signup' | 'user:login' | 'user:create-admin-user' | 'user:create-user' |'user:create-developer' | 'user:update-user' | 'user:view-user' | 'user:view-all-users' | 'user:update-password';

export type PasswordActivity = 'password:forgot' | 'password:reset'

export type TicketActivity = 'ticket: create-ticket' | 'ticket: update' | 'ticket: delete' | 'ticket: assign' 

export type CommentActivity = 'comment: create-comment' |  'comment: delete' 

export type FileActivity = 'file: upload' | 'file: download'

export type AppActivity = UserActivity | PasswordActivity | ProjectActivity | TicketActivity | CommentActivity | FileActivity

export type ProjectActivity = 'add:project' | 'update:project'

export type ValidateReq = ValidateLoginSchema | ValidateUserSchema | ValidateForgotSchema 
                            | ValidateResetSchema | ValidateAdminUserSchema | ValidateUpdateUserSchema 
                            | ValidateRegularUserSchema | ValidateTicketSchema | ValidateUpdateTicket 
                            | ValidateCommentsSchema | ValidateUploadFile | ValidateDownloadFile 
                            | ValidateProjectSchema | ValidateProjectUpdateSchema



