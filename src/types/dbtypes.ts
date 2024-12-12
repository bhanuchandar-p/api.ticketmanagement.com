import { NewProject, project, ProjectTable } from "../db/schemas/projects";
import { NewProjectuser, ProjectUser, ProjectUserTable } from "../db/schemas/projectUsers";
import { NewRefreshToken, RefreshToken, RefreshTokenTable } from "../db/schemas/refreshTokens";
import { NewResetPasswordToken, ResetPasswordToken, ResetToken } from "../db/schemas/resetPasswordTokens";
import { NewTicket, Ticket, TicketsTables } from "../db/schemas/tickets";
import { NewUser, User, UserTable } from "../db/schemas/users";

export type DBTable = UserTable | ResetToken | RefreshTokenTable | ProjectTable | ProjectUserTable | TicketsTables

export type DBTableRow = User | ResetPasswordToken | RefreshToken | project | ProjectUser | Ticket

export type DBNewRecord = NewUser | NewResetPasswordToken | NewRefreshToken | NewProject | NewProjectuser | NewTicket 

export type DBNewRecords = NewUser[] | NewResetPasswordToken[] | NewRefreshToken[] | NewProjectuser[]


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




