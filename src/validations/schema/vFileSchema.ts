import { InferOutput, nonEmpty, nullish, number, object, pipe, regex, string } from "valibot";
import { FILE_KEY_INVALID, FILE_KEY_MISSING, FILE_MISSING, FILE_NAME_INVALID, FILE_SIZE_IS_NUMBER, FILE_TYPE_INVALID, FILE_TYPE_MISSING } from "../../constants/appMessages";

export const VUploadFileSchema = object({
  file_type: pipe(
      string(FILE_TYPE_INVALID),
      nonEmpty(FILE_TYPE_MISSING)
  ),
  file_name: pipe(
      string(FILE_NAME_INVALID),
      nonEmpty(FILE_MISSING),
  ),
  file_size: nullish(
      number(FILE_SIZE_IS_NUMBER),
      null
  )

});

export const VDownloadFileSchema = object({
  file_key: pipe(
      string(FILE_KEY_INVALID),
      nonEmpty(FILE_KEY_MISSING),
      // regex(/^attachments\//, FILE_KEY_INVALID),
  ),
  // file_type: pipe(
  //   string(FILE_TYPE_INVALID),
  //   nonEmpty(FILE_TYPE_MISSING),
  // ),
});

export type ValidateUploadFile = InferOutput<typeof VUploadFileSchema>;
export type ValidateDownloadFile = InferOutput<typeof VDownloadFileSchema>;