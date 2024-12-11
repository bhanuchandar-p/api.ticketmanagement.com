import { User } from "../db/schemas/users";
import { ValidateLoginSchema } from "../validations/schema/vLoginSchema";
import { ValidateAdminUserSchema, ValidateForgotSchema, ValidateRegularUserSchema, ValidateResetSchema, ValidateUpdateUserSchema, ValidateUserSchema } from "../validations/schema/vUserSchema";

export type Userdetails = Omit<User, 'password'>

export type UserActivity = 'user:signup' | 'user:login' | 'user:create-admin-user' | 'user:create-user' |'user:create-developer-user' | 'user:update-user' | 'user:view-user' | 'user:view-all-users' | 'user:update-password';

export type PasswordActivity = 'password:forgot' | 'password:reset'

export type AppActivity = UserActivity | PasswordActivity

export type ValidateReq = ValidateLoginSchema | ValidateUserSchema | ValidateForgotSchema | ValidateResetSchema | ValidateAdminUserSchema | ValidateUpdateUserSchema | ValidateRegularUserSchema