import { email, InferOutput, maxLength, minLength, nonNullable, object, optional, pipe, regex, string } from "valibot";
import { EMAIL_INVALID, EMAIL_MAX_LENGTH, EMAIL_REQ, F_NAME_MAX_LENGTH, F_NAME_MIN_LENGTH, F_NAME_REQ, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_REQ, PASSWORD_REQ_LOWERCASE, PASSWORD_REQ_NUMBER, PASSWORD_REQ_UPPERCASE, PHONE_MAX_LENGTH, PHONE_MIN_LENGTH } from "../../constants/appMessages";

export const VEmailSchema = pipe(
    nonNullable(string(EMAIL_REQ)),
    email(EMAIL_INVALID),
    maxLength(30,EMAIL_MAX_LENGTH)
)

export const VPasswordSchema = pipe(
    nonNullable(string(PASSWORD_REQ)),
    string(),
    regex(/[A-Z]/, PASSWORD_REQ_UPPERCASE),
    regex(/[a-z]/, PASSWORD_REQ_LOWERCASE),
    regex(/[0-9]/, PASSWORD_REQ_NUMBER),
    minLength(8,PASSWORD_MIN_LENGTH),
    maxLength(30,PASSWORD_MAX_LENGTH)
)

export const VUserSchema = object({
    first_name: pipe(nonNullable(string(F_NAME_REQ)),
                minLength(3,F_NAME_MIN_LENGTH),
                maxLength(40,F_NAME_MAX_LENGTH)
    ),
    last_name: optional(string()),
    email: VEmailSchema,
    password: VPasswordSchema,
    phone_number: optional(pipe(
                    string(),
                    minLength(10,PHONE_MIN_LENGTH),
                    maxLength(14,PHONE_MAX_LENGTH)
    )),

})

export const VForgotSchema = object({
    email: VEmailSchema
})

export const VResetSchema = object({
    new_password: VPasswordSchema,
    confirm_password: VPasswordSchema

})

export type ValidateUserSchema = InferOutput<typeof VUserSchema>;
export type ValidateForgotSchema = InferOutput<typeof VForgotSchema>;
export type ValidateResetSchema = InferOutput<typeof VResetSchema>;