import { User } from "../db/schemas/users";
import { ValidateLoginSchema } from "../validations/schema/vLoginSchema";
import { ValidateForgotSchema, ValidateResetSchema, ValidateUserSchema } from "../validations/schema/vUserSchema";

export type Userdetails = Omit<User, 'password'>

export type UserActivity = 'user: signup' | 'user: login'

export type PasswordActivity = 'password: forgot' | 'password: reset'

export type AppActivity = UserActivity | PasswordActivity

export type ValidateReq = ValidateLoginSchema | ValidateUserSchema | ValidateForgotSchema | ValidateResetSchema