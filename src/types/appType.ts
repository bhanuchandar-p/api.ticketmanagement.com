import { User } from "../db/schemas/users";
import { ValidateLoginSchema } from "../validations/schema/vLoginSchema";
import { ValidateTicketSchema } from "../validations/schema/vTicketSchema";
import { ValidateUpdateTicket } from "../validations/schema/vUpdateTicket";
import { ValidateForgotSchema, ValidateResetSchema, ValidateUserSchema } from "../validations/schema/vUserSchema";

export type Userdetails = Omit<User, 'password'>

export type UserActivity = 'user: signup' | 'user: login'

export type PasswordActivity = 'password: forgot' | 'password: reset' 

export type TicketActivity = 'ticket: create-ticket' | 'ticket: update' | 'ticket: delete' | 'ticket: assign' | 'ticket: edit'

export type AppActivity = UserActivity | PasswordActivity | TicketActivity

export type ValidateReq = ValidateLoginSchema | ValidateUserSchema | ValidateForgotSchema | ValidateResetSchema | ValidateTicketSchema |ValidateUpdateTicket