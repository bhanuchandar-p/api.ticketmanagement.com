import { array, InferOutput, maxLength, minLength, nonEmpty, nonNullable, nullable, number, object, optional, pipe, string, transform } from "valibot";
import { PROJ_CODE_MAX_LENGTH, PROJ_CODE_MIN_LENGTH, PROJ_CODE_REQ, PROJ_NAME_REQ } from "../../constants/appMessages";

export const VProjectSchema = object({
    name: pipe(
        nonNullable(string(PROJ_NAME_REQ)),
        transform((value) => value.trim()),
        minLength(3,PROJ_CODE_MIN_LENGTH),
        maxLength(40,PROJ_CODE_MAX_LENGTH),
    ),
    description: nullable(pipe(string(),transform((value) => value.trim())),null),
    project_code: pipe(
        nonNullable(string(PROJ_CODE_REQ)),
        minLength(2,PROJ_CODE_MIN_LENGTH),
        maxLength(10,PROJ_CODE_MAX_LENGTH),
    ),
    created_by: (number()),
    project_members: optional(pipe(
        array(
          object({
            user_id: nonNullable(nullable(number()), 'user_id required')
          })
        )
      ))
})

export const VUpdateProjectSchema = object({
    name: pipe(
        nonNullable(string()),
        transform((value) => value.trim()),
        minLength(3),
        maxLength(40),
    ),
    description: nullable(pipe(string(),transform((value) => value.trim()))),
    project_code: pipe(
        nonNullable(string()),
        minLength(2),
        maxLength(10),
    ),
})

export type ValidateProjectSchema = InferOutput<typeof VProjectSchema>
export type ValidateProjectUpdateSchema = InferOutput<typeof VUpdateProjectSchema>
