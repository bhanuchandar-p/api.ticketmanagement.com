import { NewRefreshToken, RefreshToken, RefreshTokenTable } from "../db/schemas/refreshTokens";
import { NewResetPasswordToken, ResetPasswordToken, ResetToken } from "../db/schemas/resetPasswordTokens";
import { NewUser, User, UserTable } from "../db/schemas/users";

export type DBTable = UserTable | ResetToken | RefreshTokenTable

export type DBTableRow = User | ResetPasswordToken | RefreshToken

export type DBNewRecord = NewUser | NewResetPasswordToken | NewRefreshToken

export type DBNewRecords = NewUser[] | NewResetPasswordToken[] | NewRefreshToken[]


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




