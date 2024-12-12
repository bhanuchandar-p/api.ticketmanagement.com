import { and, asc, count, desc, eq, inArray } from "drizzle-orm";
import { db } from '../../db/dbConnection';  
import { DBNewRecord, DBNewRecords, DBTable, DBTableRow, InQueryData, OrderByQueryData,  PaginationInfo,  UpdateRecordData, WhereQueryData } from "../../types/dbtypes";
import { executeQuery, prepareInQueryCondition, prepareOrderByQueryConditions, prepareSelectColumnsForQuery, prepareWhereQueryConditions } from "../../utils/dbUtils";
import { UserTable } from "../../db/schemas/users";


type SelectedKeys<T, K extends keyof T> = {
  [P in K]: T[P]
};

const getRecordById = async<R extends DBTableRow, C extends keyof R = keyof R>(
  table: DBTable,
  id: number,
  columnsToSelect?: any
): Promise<R | Pick<R, C> | null> => {
  const columnsRequired = prepareSelectColumnsForQuery(table, columnsToSelect);

  const result = columnsRequired ?
    await db.select(columnsRequired).from(table).where(eq(table.id, id)) :
    await db.select().from(table).where(eq(table.id, id));

  if (result.length === 0) {
    return null;
  }

  if (columnsRequired) {    
    return result[0] as Pick<R, C>;
  }
  return result[0] as R;
};

const getRecordsConditionally = async<R extends DBTableRow, C extends keyof R = keyof R>(
  table: DBTable,
  whereQueryData?: WhereQueryData<R>,
  columnsToSelect?: any,
  orderByQueryData?: OrderByQueryData<R>,
  inQueryData?: InQueryData<R>,
) => {
  
  const columnsRequired = prepareSelectColumnsForQuery(table, columnsToSelect);
  const whereConditions = prepareWhereQueryConditions(table, whereQueryData);
  const inQueryCondition = prepareInQueryCondition(table, inQueryData);
  const orderByConditions = prepareOrderByQueryConditions(table, orderByQueryData);



  let whereQuery = whereConditions ? and(...whereConditions) : null;

  const results = await executeQuery<R, C>(table, whereQuery, columnsRequired, orderByConditions, inQueryCondition);

  if (!results || results.length === 0) {
    return null;
  }

  return results;
};


// const getPaginatedRecordsConditionally = async<R extends DBTableRow, C extends keyof R = keyof R>(
//   table: DBTable,
//   page: number,
//   pageSize: number,
//   orderByQueryData?: OrderByQueryData<R>,
//   whereQueryData?: WhereQueryData<R>,
//   columnsToSelect?: any,
//   inQueryData?: InQueryData<R>
// ) => {
//   let countQuery = db.select({ total: count(table.id) }).from(table).$dynamic();
//   if (whereQueryData) {
//     const whereConditions = prepareWhereQueryConditions(table, whereQueryData);
//     if (whereConditions) {
//       countQuery = countQuery.where(and(...whereConditions));
//     }
//   }
  
//   if (inQueryData && inQueryData.values.length > 0) {
//     const inQueryCondition = prepareInQueryCondition(table, inQueryData);
//     if (inQueryCondition) {
//       countQuery = countQuery.where(inQueryCondition);
//     }
//   }
  
//   const recordsCount = await countQuery;
//   const total_records = recordsCount[0]?.total || 0;
//   const total_pages = Math.ceil(total_records / pageSize) || 1;

//   const pagination_info: PaginationInfo = {
//     total_records,
//     total_pages,
//     page_size: pageSize,
//     current_page: page > total_pages ? total_pages : page,
//     next_page: page >= total_pages ? null : page + 1,
//     prev_page: page <= 1 ? null : page - 1
//   };

//   if (total_records === 0) {
//     return {
//       pagination_info,
//       records: []
//     };
//   }

//   const columnsRequired = prepareSelectColumnsForQuery(table, columnsToSelect);
//   const whereConditions = prepareWhereQueryConditions(table, whereQueryData);
//   const orderByConditions = prepareOrderByQueryConditions(table, orderByQueryData);
//   const inQueryCondition = prepareInQueryCondition(table, inQueryData);

//   let whereQuery = whereConditions ? and(...whereConditions) : null;

//   const paginationData = { page, pageSize };
//   const results = await executeQuery<R, C>(table, whereQuery, columnsRequired, orderByConditions, inQueryCondition, paginationData);

//   if (!results || results.length === 0) {
//     return null;
//   }

//   return {
//     pagination_info,
//     records: results
//   };
// };

const getMultipleRecordsByAColumnValue = async<R extends DBTableRow, C extends keyof R = keyof R>(
  table: DBTable,
  column: C,
  value: any,
  columnsToSelect?: any,
  orderByQueryData?: OrderByQueryData<R>,
  inQueryData?: InQueryData<R>
) => {

  const whereQueryData: WhereQueryData<R> = {
    columns: [column],
    values: [value]
  };

  const results = await getRecordsConditionally<R, C>(table, whereQueryData, columnsToSelect, orderByQueryData, inQueryData);

  if (!results) {
    return null;
  }
  return results;
};

const getMultipleRecordsByMultipleColumnValues = async<R extends DBTableRow, C extends keyof R = keyof R>(
  table: DBTable,
  columns: C[],
  values: any[],
  columnsToSelect?: any,
  orderByQueryData?: OrderByQueryData<R>,
  inQueryData?: InQueryData<R>
) => {

  const whereQueryData: WhereQueryData<R> = {
    columns,
    values
  };

  const results = await getRecordsConditionally<R, C>(table, whereQueryData, columnsToSelect, orderByQueryData, inQueryData);

  if (!results) {
    return null;
  }
  return results;
};


const getSingleRecordByAColumnValue = async<R extends DBTableRow, C extends keyof R = keyof R>(
  table: DBTable,
  column: C,
  value: any,
  columnsToSelect?: any,
  orderByQueryData?: OrderByQueryData<R>,
  inQueryData?: InQueryData<R>
) => {
  const whereQueryData: WhereQueryData<R> = {
    columns: [column],
    values: [value]
  };

  const results = await getRecordsConditionally<R, C>(table, whereQueryData, columnsToSelect, orderByQueryData, inQueryData);

  if (!results) {
    return null;
  }
  return results[0];
};

const getSingleRecordByMultipleColumnValues = async<R extends DBTableRow, C extends keyof R = keyof R>(
  table: DBTable,
  columns: C[],
  values: any[],
  columnsToSelect?: any,
  orderByQueryData?: OrderByQueryData<R>,
  inQueryData?: InQueryData<R>
) => {

  const whereQueryData: WhereQueryData<R> = {
    columns,
    values
  };

  const results = await getRecordsConditionally<R, C>(table, whereQueryData, columnsToSelect, orderByQueryData, inQueryData);

  if (!results) {
    return null;
  }
  return results[0];
};

const saveSingleRecord = async<R extends DBTableRow>(table: DBTable, record: DBNewRecord, trx?: any) => {
  const query = trx ? trx.insert(table).values(record).returning() : db.insert(table).values(record).returning();
  const recordSaved = await query;
  return recordSaved[0] as R;
};

const saveRecords = async<R extends DBTableRow>(table: DBTable, records: DBNewRecords, trx?: any) => {
  const query = trx ? trx.insert(table).values(records).returning() : db.insert(table).values(records).returning();
  const recordsSaved = await query;
  return recordsSaved as R[];
};

const updateRecordById = async<R extends DBTableRow>(table: DBTable, id: number, record: UpdateRecordData<R>) => {
  const dataWithTimeStamps = { ...record };

  const recordUpdated = await db
    .update(table)
    .set(dataWithTimeStamps)
    .where(eq(table.id, id))
    .returning();
  return recordUpdated[0] as R;
};

const deleteRecordById = async<R extends DBTableRow>(table: DBTable, id: number) => {
  const deletedRecord = await db.delete(table).where(eq(table.id, id)).returning();
  return deletedRecord[0] as R;
};

const softDeleteRecordById = async<R extends DBTableRow>(table: DBTable, id: number, record: UpdateRecordData<R>) => {
  return await db
  .update(table)
  .set(record)
  .where(eq(table.id, id) )
  .returning();
};

const updateMultipleRecords = async<R extends DBTableRow>(table: DBTable, ids: number[], record: Partial<R>): Promise<number> => {
  const updatedRecords = await db.update(table)
    .set(record)
    .where(inArray(table.id, ids))
    .returning();

  return updatedRecords.length;
};

const exportData = async (table: DBTable, projection?: any, filters?: any) => {
  let intialQuery = db.select(projection).from(table);
  let finalQuery;
  if (filters && filters.length > 0) {
    finalQuery = intialQuery.where(and(...filters));
  }
  const result = await intialQuery;
  return result;
};

const getPaginatedRecords = async (table: DBTable, skip: number, limit: number, filters?: any, sorting?: any, projection?: any) => {
  let intialQuery: any = db.select(projection).from(table);
  if (filters && filters.length > 0) {
    intialQuery = intialQuery.where(and(...filters));
  }
  if (sorting) {
    const columnExpression = (table as any)[sorting.sort_by];
    if (sorting.sort_type === "asc") {
      intialQuery = intialQuery.orderBy(asc(columnExpression));
    } else {
      intialQuery = intialQuery.orderBy(desc(columnExpression));
    }
  } else {
    intialQuery = intialQuery.orderBy(desc(table.id));
  }
  const result = await intialQuery.limit(limit).offset(skip);
  return result;
};

const getPaginatedRecordsConditionally = async<R extends DBTableRow, C extends keyof R = keyof R>(
  table: DBTable,
  page: number,
  pageSize: number,
  orderByQueryData?: OrderByQueryData<R>,
  whereQueryData?: WhereQueryData<R>,
  columnsToSelect?: any,
  inQueryData?: InQueryData<R>
) => {
  let countQuery = db.select({ total: count(table.id) }).from(table).$dynamic();
  if (whereQueryData) {
    const whereConditions = prepareWhereQueryConditions(table, whereQueryData);
    if (whereConditions) {
      countQuery = countQuery.where(and(...whereConditions));
    }
  }


  const recordsCount = await countQuery;
  const total_records = recordsCount[0]?.total || 0;
  const total_pages = Math.ceil(total_records / pageSize) || 1;

  const pagination_info: PaginationInfo = {
    total_records,
    total_pages,
    page_size: pageSize,
    current_page: page > total_pages ? total_pages : page,
    next_page: page >= total_pages ? null : page + 1,
    prev_page: page <= 1 ? null : page - 1
  };

  if (total_records === 0) {
    return {
      pagination_info,
      records: []
    };
  }

  const columnsRequired = prepareSelectColumnsForQuery(table, columnsToSelect);
  const whereConditions = prepareWhereQueryConditions(table, whereQueryData);
  const orderByConditions = prepareOrderByQueryConditions(table, orderByQueryData);
  const inQueryCondition = prepareInQueryCondition(table, inQueryData);

  let whereQuery = whereConditions ? and(...whereConditions) : null;

  const paginationData = { page, pageSize };
  const results = await executeQuery<R, C>(table, whereQuery, columnsRequired, orderByConditions, inQueryCondition, paginationData);

  if (!results || results.length === 0) {
    return null;
  }

  return {
    pagination_info,
    records: results
  };
};


const getRecordsCount = async (table: DBTable, filters?: any) => {
  let intialQuery = db.select({ total: count() }).from(table);
  
  let finalQuery;
  if (filters && filters.length > 0) {
    finalQuery = intialQuery.where(and(...filters));
  } else {
    finalQuery = intialQuery;
  }
  let result = await intialQuery;
  
  return result[0].total;
};

const getRecordsCountByCondition = async (table: DBTable, filters?: any, ) => {

  let initialQuery = db.select({ total: count()  }).from(table);
  
  let finalQuery;

  if (filters && filters.length > 0) {
    
    finalQuery = initialQuery.where(and(...filters));
    
  } else {
    finalQuery = initialQuery;
  }
  
  const result = await finalQuery;

  console.log("result",result);
  

  return result[0]?.total || 0;
};

const deleteRecordByCondition = async <R extends DBTableRow>(
  table: DBTable,
  whereQueryData: WhereQueryData<R>
): Promise<R[] | null> => {
  const deletedRecords = await db
    .delete(table) // No transaction used, directly use `db.delete`
    .where(
      and(
        ...whereQueryData.columns.map((column, index) =>
          eq((table as Record<keyof R, any>)[column], whereQueryData.values[index])
        )
      )
    )
    .returning();

  // Return all deleted records or null if no records were deleted
  return deletedRecords.length > 0 ? deletedRecords as R[] : null;
};

const getSingleRecordById = async<R extends DBTableRow>(tableName: DBTable, id: number) => {
    const res = await db.select().from(tableName).where(eq(tableName.id, id)).limit(1);
    return res[0] as R;
}

const getSingleRecordByEmail = async<R extends DBTableRow>(tableName: UserTable, email: string) => {
    const res = await db.select().from(tableName).where(eq(tableName.email, email)).limit(1);
    return res[0] as R;
}



export {
  deleteRecordByCondition, deleteRecordById, exportData, getMultipleRecordsByAColumnValue,
  getMultipleRecordsByMultipleColumnValues, getPaginatedRecords, getRecordById,
  getRecordsConditionally,
  getRecordsCount, getRecordsCountByCondition, getSingleRecordByAColumnValue,
  getSingleRecordByMultipleColumnValues, saveRecords, saveSingleRecord, softDeleteRecordById,
  updateMultipleRecords, updateRecordById, getSingleRecordByEmail, getSingleRecordById,
  getPaginatedRecordsConditionally
};


