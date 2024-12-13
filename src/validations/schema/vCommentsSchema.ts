import { InferOutput, maxLength, minLength, nonNullable, object, pipe, string } from "valibot";
import { COMMENT_MAX_LENGTH, COMMENT_MIN_LENGTH, COMMENT_REQUIRED } from "../../constants/appMessages";

export const VCommentSchema = object({
    comment:pipe(nonNullable(string(COMMENT_REQUIRED)),
          minLength(5,COMMENT_MIN_LENGTH ),
          maxLength(50,COMMENT_MAX_LENGTH)),
      }            
)

export type ValidateCommentsSchema = InferOutput<typeof VCommentSchema>