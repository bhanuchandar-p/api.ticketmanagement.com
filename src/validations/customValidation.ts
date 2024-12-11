import { User, users } from "../db/schemas/users";
import { getSingleRecordByAColumnValue } from "../services/db/baseDbService";

export const userEmailExists = async (email: string) => {

    const columnsToSelect = ['id', 'email'] as const;
  
    const result = await getSingleRecordByAColumnValue<User, typeof columnsToSelect[number]>(users, 'email', email, columnsToSelect);
  
    return !!result;
  };
  