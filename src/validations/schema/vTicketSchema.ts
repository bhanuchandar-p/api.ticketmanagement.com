import { InferOutput, maxLength, minLength, nonNullable, number, object, optional, picklist, pipe, string } from "valibot";
import { TICKET_DESCRIPTION_MAX_LENGTH, TICKET_DESCRIPTION_MIN_LENGTH, TICKET_DESCRIPTION_STRING, TICKET_PRIORITY, TICKET_PRIORITY_REQUIRED, TICKET_PRIORITY_VALIDATION, TICKET_TITLE_MAX_LENGTH, TICKET_TITLE_MIN_LENGTH, TICKET_TITLE_REQUIRED, TICKET_TITLE_STRING } from "../../constants/appMessages";

export const VTicketSchema = object({
      title:pipe(nonNullable(string(TICKET_TITLE_REQUIRED)),
            string(TICKET_TITLE_STRING),
            minLength(5,TICKET_TITLE_MIN_LENGTH),
            maxLength(50,TICKET_TITLE_MAX_LENGTH)),
      description:pipe(optional(pipe(string(TICKET_DESCRIPTION_STRING),
                        minLength(20,TICKET_DESCRIPTION_MIN_LENGTH),
                        maxLength(400,TICKET_DESCRIPTION_MAX_LENGTH)))),
      priority:pipe(nonNullable(string(TICKET_PRIORITY_REQUIRED)),
                  picklist(TICKET_PRIORITY,TICKET_PRIORITY_VALIDATION)),
      project_id: nonNullable(number("project_id required")),
      }           
)

export type ValidateTicketSchema = InferOutput<typeof VTicketSchema>