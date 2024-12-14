import { email, forward, InferOutput, intersect, maxLength, minLength, never, nonNullable, object, optional, partialCheck, picklist, pipe, pipeAsync, rawTransformAsync, regex, string, transform, trim, value } from "valibot";
import { EMAIL_EXISTS, EMAIL_INVALID, EMAIL_MAX_LENGTH, EMAIL_REQ, F_NAME_MAX_LENGTH, F_NAME_MIN_LENGTH, F_NAME_REQ, L_NAME_MAX_LENGTH, L_NAME_REQ, PASSWORD_INVALID, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_MISMATCH, PASSWORD_REQ, PASSWORD_REQ_LOWERCASE, PASSWORD_REQ_NUMBER, PASSWORD_REQ_UPPERCASE, PHONE_MAX_LENGTH, PHONE_MIN_LENGTH, USER_TYPE_INVALID } from "../../constants/appMessages";
import { userEmailExists } from "../customValidation";
import { prepareValibotIssue } from "../prepareValibotIssue";

const user_type = ['admin','user','developer'] as const;

export const VEmailSchema = pipe(
    nonNullable(string(EMAIL_REQ)),
    email(EMAIL_INVALID),
    trim(),
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
                maxLength(40,F_NAME_MAX_LENGTH),
                trim()
    ),
    last_name: pipe(nonNullable(string(L_NAME_REQ)),
                maxLength(40,L_NAME_MAX_LENGTH),
                trim()
              ),
    middle_name: optional(string()),
    email: VEmailSchema,
    password: VPasswordSchema,
    phone_number: optional(pipe(
                    string(),
                    minLength(10,PHONE_MIN_LENGTH),
                    maxLength(14,PHONE_MAX_LENGTH),
                    trim()
    )),

})

export const VForgotSchema = object({
    email: VEmailSchema
})

export const VResetSchema = object({
    new_password: VPasswordSchema,
    confirm_password: VPasswordSchema

})

export const VaPasswordSchema = object({
    new_password: VPasswordSchema,
    confirm_password: VPasswordSchema
})

export const VAdminUserSchema = pipeAsync(
    intersect(
      [
        VUserSchema,
        object({
          user_type: pipe(
            // string(USER_TYPE_INVALID),
            picklist(user_type, USER_TYPE_INVALID),
            value('admin', USER_TYPE_INVALID),
          )
        })
      ]
    ),
    rawTransformAsync(async ({ dataset, addIssue, NEVER }) => {
      if (dataset.value.email) {
        let { email } = dataset.value
        if (await userEmailExists(email)) {
          prepareValibotIssue(dataset, addIssue, 'email', email, EMAIL_EXISTS)
        }
      }
      return dataset.value
    })
  )

export const VDeveloperUserSchema = pipeAsync(
    intersect(
      [
        VUserSchema,
        object({
          user_type: pipe(
            picklist(user_type, USER_TYPE_INVALID),
            value('developer', USER_TYPE_INVALID),
          )
        })
      ]
    ),
    rawTransformAsync(async ({ dataset, addIssue, NEVER }) => {
      if (dataset.value.email) {
        let { email } = dataset.value
        if (await userEmailExists(email)) {
          prepareValibotIssue(dataset, addIssue, 'email', email, EMAIL_EXISTS)
        }
      }
      return dataset.value
    })
  )

export const VRegularUserSchema = pipeAsync(
    intersect(
      [
        VUserSchema,
        object({
          user_type: pipe(
            picklist(user_type, USER_TYPE_INVALID),
            value('user', USER_TYPE_INVALID),
          )
        })
      ]
    ),
    rawTransformAsync(async ({ dataset, addIssue, NEVER }) => {
      if (dataset.value.email) {
        let { email } = dataset.value
        if (await userEmailExists(email)) {
          prepareValibotIssue(dataset, addIssue, 'email', email, EMAIL_EXISTS)
        }
      }
      return dataset.value
    })
  )

export const VUpdatePasswordSchema = pipe(
    intersect([
      VaPasswordSchema,
      object({
        current_password: string(PASSWORD_INVALID),
      })
    ]),
    forward(
      partialCheck(
        [['new_password'], ['confirm_password']],
        (input: any) => input.new_password === input.confirm_password,
        PASSWORD_MISMATCH
      ),    
      ['confirm_password']
    )
  )

export const VUpdateUserSchema = object({
    first_name: optional(pipe(nonNullable(string(F_NAME_REQ)),
                minLength(3,F_NAME_MIN_LENGTH),
                maxLength(40,F_NAME_MAX_LENGTH),
                trim()
      ),
    ),
    last_name: optional(pipe(nonNullable(string(L_NAME_REQ)),
                maxLength(40,L_NAME_MAX_LENGTH),
                trim()
              )),
    middle_name: optional(pipe(string(),trim())),
    email: optional(VEmailSchema),
    phone_number: optional(pipe(
                    string(),
                    minLength(10,PHONE_MIN_LENGTH),
                    maxLength(14,PHONE_MAX_LENGTH),
                    trim()
    )),
})

export type ValidateUserSchema = InferOutput<typeof VUserSchema>;
export type ValidateForgotSchema = InferOutput<typeof VForgotSchema>;
export type ValidateResetSchema = InferOutput<typeof VResetSchema>;
export type ValidateAdminUserSchema = InferOutput<typeof VAdminUserSchema>;
export type ValidateDeveloperUserSchema = InferOutput<typeof VDeveloperUserSchema>;
export type ValidateRegularUserSchema = InferOutput<typeof VRegularUserSchema>;

export type ValidateUpdatePassword = InferOutput<typeof VUpdatePasswordSchema>;
export type ValidateUpdateUserSchema = InferOutput<typeof VUpdateUserSchema>;

