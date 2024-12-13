// import { tickets } from "../../db/schemas/tickets";
import { db } from '../../db/dbConnection'; 
import { DBTable } from "../../types/dbtypes";
const getAllRecords = async (table: DBTable) => {
    return await db.select().from(table);
}
export {getAllRecords}