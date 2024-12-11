import { Attachment, AttachmentsTable, NewAttachment } from "../db/schemas/attachments";
import { CommentsTable, NewComment } from "../db/schemas/comments";
import { project, ProjectTable } from "../db/schemas/projects";
import { NewRefreshToken, RefreshToken, RefreshTokenTable } from "../db/schemas/refreshTokens";
import { NewResetPasswordToken, ResetPasswordToken, ResetToken } from "../db/schemas/resetPasswordTokens";
import { NewTicketAssignes, TicketAssignes, TicketAssignesTable } from "../db/schemas/ticketAssignes";
import { NewTicket, Ticket, TicketsTables } from "../db/schemas/tickets";
import { NewUser, User, UserTable } from "../db/schemas/users";

export type DBTable = 
               | UserTable 
               | TicketsTables
               | RefreshTokenTable 
               | TicketAssignesTable 
               | ResetPasswordToken 
               | AttachmentsTable
               | ProjectTable
               | CommentsTable
               | ResetToken
              

export type DBTableRow = 
              | User 
              | ResetPasswordToken 
              | RefreshToken 
              | Ticket 
              | TicketAssignes 
              | Attachment 
              | project 
              | Comment 


export type DBNewRecord = 
            | NewUser 
            | NewResetPasswordToken 
            | NewRefreshToken 
            | NewTicket 
            | NewTicketAssignes 
            | NewAttachment 
            | NewComment 
            | NewTicket

export type DBNewRecords = 
             | NewUser[] 
             | NewResetPasswordToken[] 
             | NewRefreshToken[] 
             | NewTicket[] 
             | NewTicketAssignes[] 
             | NewAttachment[] 
             | NewComment[] 
             | NewTicket[]


export type UpdateRecordData<R extends DBTableRow> = Partial<Omit<R, "id" | "created_at" | "updated_at">>;

export type DBTableColumns<T extends DBTableRow> = keyof T;

export type SortDirection = "asc" | "desc";

export type Priorities = 'low'| 'medium'| 'high'

export type TicketStatus =  'open'| 'closed'| 'inprogress'

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




