import { Attachment, AttachmentsTable, NewAttachment } from "../db/schemas/attachments";
import { CommentsTable, NewComment ,Comment} from "../db/schemas/comments";
import { NewProject, project, ProjectTable } from "../db/schemas/projects";
import { NewProjectuser, ProjectUser, ProjectUserTable } from "../db/schemas/projectUsers";
import { NewRefreshToken, RefreshToken, RefreshTokenTable } from "../db/schemas/refreshTokens";
import { NewResetPasswordToken, ResetPasswordToken, ResetToken } from "../db/schemas/resetPasswordTokens";
import { NewTicketAssignes, TicketAssignes, TicketAssignesTable } from "../db/schemas/ticketAssignes";
import { NewTicket, Ticket, TicketsTable } from "../db/schemas/tickets";
import { NewUser, User, UserTable } from "../db/schemas/users";

export type DBTable = UserTable | ResetToken 
                                | RefreshTokenTable 
                                | ProjectTable 
                                | AttachmentsTable 
                                | CommentsTable
                                | TicketAssignesTable
                                | TicketsTable
                                | ProjectUserTable



export type DBTableRow = User | ResetPasswordToken 
                              | RefreshToken 
                              | project 
                              | Attachment 
                              | Comment 
                              | Ticket 
                              | TicketAssignes
                              | ProjectUser

export type DBNewRecord = NewUser | NewResetPasswordToken 
                                  | NewRefreshToken 
                                  | NewAttachment 
                                  | NewComment 
                                  | NewTicket 
                                  | NewTicketAssignes
                                  | NewProject
                                  | NewProjectuser

export type DBNewRecords = NewUser[] | NewResetPasswordToken[] 
                                     | NewRefreshToken[] 
                                     | NewRefreshToken [] 
                                     | NewAttachment[]
                                     | NewComment[]
                                     | NewTicket[]
                                     | NewTicketAssignes[]
                                     | NewProject[]
                                     | NewProjectuser[]



export type UpdateRecordData<R extends DBTableRow> = Partial<Omit<R, "id" | "created_at" | "updated_at">>;

export type DBTableColumns<T extends DBTableRow> = keyof T;

export type SortDirection = "asc" | "desc";

export type WhereQueryData<T extends DBTableRow> = {
  columns: Array<keyof T>,
  values: any[];
};

export type OrderByQueryData<T extends DBTableRow> = {
  columns: Array<DBTableColumns<T>>,
  values: SortDirection[];  
};

export type InQueryData<T extends DBTableRow> = {
  key: keyof T,
  values: any[];
};

export type PaginationInfo = {
  total_records: number,
  total_pages: number,
  page_size: number,
  current_page: number,
  next_page: number | null,
  prev_page: number | null;
};

export type PaginatedRecords<T extends DBTableRow> = {
  pagination_info: PaginationInfo,
  records: T[];
};

export type JWTPayload = {
  id: number,
  email: string,
  user_type: UserType | null,
  first_name: string,
  last_name: string,
  middle_name: string | null,
  phone_number: string | null,
  is_active: string | null
}


export type UserType = 'admin'| 'user' | 'developer';


