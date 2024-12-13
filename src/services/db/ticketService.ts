// import { tickets } from "../../db/schemas/tickets";
import { and, count, eq } from 'drizzle-orm';
import { db } from '../../db/dbConnection'; 
import { Ticket, tickets } from '../../db/schemas/tickets';
import { DBTable, DBTableColumns, OrderByQueryData, PaginationInfo, SortDirection, WhereQueryData } from "../../types/dbtypes";
import { prepareOrderByQueryConditions, prepareWhereQueryConditionsForTickets } from '../../utils/dbUtils';
import { ticketAssignes } from '../../db/schemas/ticketAssignes';
import { users } from '../../db/schemas/users';


export const fetchPaginatedTickets = async(
    table: DBTable,
    page: number,
    pageSize: number,
    searchString: string,
    reqId: number,
    orderBy?: string,
    user_type?:string,
    status?:string,
    priority?:string,

) => {
    let orderByQueryData: OrderByQueryData<Ticket> = {
        columns: ['updated_at'],
        values: ['desc']
    }
    
    if (orderBy) {
        let orderByColumns: DBTableColumns<Ticket>[] = []
        let orderByValues: SortDirection[] = []
        const queryStrings = orderBy.split(',')
            for (const queryString of queryStrings) {
                const [column, value] = queryString.split(':')
                orderByColumns.push(column as DBTableColumns<Ticket>)
                orderByValues.push(value as SortDirection)
            }
        orderByQueryData = {
            columns: orderByColumns,
            values: orderByValues
        }
    }
    let whereQueryData: WhereQueryData<Ticket> = {
    // default where query
    columns: [],
    values: [],
    };

    if (searchString) {
        whereQueryData.columns.push('title');
        whereQueryData.values.push(`%${searchString}%`);
    }

    if (status) {
        whereQueryData.columns.push('status');
        whereQueryData.values.push(status);
    }

    if (priority) {
        whereQueryData.columns.push('priority');
        whereQueryData.values.push(priority);
    }

    let finalRecords;
    if (user_type === 'admin') {
        finalRecords = await fetchTicketsForAdmin(table, page, pageSize, whereQueryData, orderByQueryData);
    }

    if (user_type === 'user') {
        finalRecords = await fetchTicketsForUser(table, page, pageSize, reqId, whereQueryData, orderByQueryData);
    }

    if (user_type === 'developer') {
        finalRecords = await fetchTicketsForDeveloper(table, page, pageSize, reqId, whereQueryData, orderByQueryData);
    }

    return finalRecords;
}

const fetchTicketsForAdmin = async(
    table: DBTable,
    page: number,
    pageSize: number,
    whereQueryData: WhereQueryData<Ticket>,
    orderByQueryData: OrderByQueryData<Ticket>
) => {
    let countQuery = db.select({ total: count(table.id) }).from(table).$dynamic();
    if (whereQueryData) {
      const whereConditions = prepareWhereQueryConditionsForTickets(table, whereQueryData);
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
    const whereConditions = prepareWhereQueryConditionsForTickets(table, whereQueryData);
    const orderByConditions = prepareOrderByQueryConditions(table, orderByQueryData);

    const ticketsData = await db.query.tickets.findMany({
      where: whereConditions?.length? and(...whereConditions): and(),
      orderBy: orderByConditions,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
  
    return {
      pagination_info,
      records: ticketsData
    };
}

const fetchTicketsForUser = async(
    table: DBTable,
    page: number,
    pageSize: number,
    reqId: number,
    whereQueryData: WhereQueryData<Ticket>,
    orderByQueryData: OrderByQueryData<Ticket>
) => {
    let countQuery = db.select({ total: count(tickets.requested_by) }).from(tickets).$dynamic();
    if (whereQueryData) {
      const whereConditions = prepareWhereQueryConditionsForTickets(tickets, whereQueryData);
      if (whereConditions) {
        countQuery = countQuery.where(and(...whereConditions,eq(tickets.requested_by,reqId)));
      }
      else {
        countQuery = countQuery.where(eq(tickets.requested_by,reqId));
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
    const whereConditions = prepareWhereQueryConditionsForTickets(table, whereQueryData);
    const orderByConditions = prepareOrderByQueryConditions(table, orderByQueryData);

    const ticketData = await db.query.tickets.findMany({
      where: whereConditions?.length? and(...whereConditions,eq(tickets.requested_by,reqId)): and(eq(tickets.requested_by,reqId)),
      orderBy: orderByConditions,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      with: {
        ticket_assignes:{
          with: {
            user: true
          }
        },
        users: true
      }
    })

    const ticketRecords = ticketData.map((ticket) => {
        return {
            id: ticket.id,
            title: ticket.title,
            description: ticket.description,
            priority: ticket.priority,
            status: ticket.status,
            requested_by: ticket.requested_by,
            project_id: ticket.project_id,
            created_name: ticket.users.first_name,
            assigned_to: ticket.ticket_assignes[0]?.user.first_name ?? null,
            due_date: ticket.due_date,
            created_at: ticket.created_at,
            updated_at: ticket.updated_at,
        }
    })
    return {
        pagination_info,
        records: ticketRecords
    }
}

const fetchTicketsForDeveloper = async(
    table: DBTable,
    page: number,
    pageSize: number,
    reqId: number,
    whereQueryData: WhereQueryData<Ticket>,
    orderByQueryData: OrderByQueryData<Ticket>
) => {

    const countQuery = db.select({ total: count(ticketAssignes.id) }).from(ticketAssignes).where(eq(ticketAssignes.user_id,reqId));

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
    const whereConditions = prepareWhereQueryConditionsForTickets(table, whereQueryData);
    const orderByConditions = prepareOrderByQueryConditions(table, orderByQueryData);

    const  whereCntd = whereConditions?.length? and(...whereConditions): and();
    const req = {
        id: tickets.id,
        title: tickets.title,
        description: tickets.description,
        priority: tickets.priority,
        status: tickets.status,
        requested_by: tickets.requested_by,
        created_name: users.first_name,
        project_id: tickets.project_id,
        due_date: tickets.due_date,
        created_at: tickets.created_at,
        updated_at: tickets.updated_at
    }

    const ticketRecords = await db.select({...req}).from(tickets)
                                  .where(whereCntd)
                                  .orderBy(...orderByConditions)
                                  .innerJoin(ticketAssignes, eq(tickets.id, ticketAssignes.ticket_id))
                                  .innerJoin(users, eq(tickets.requested_by, users.id))
                                  .limit(pageSize)
                                  .offset((page - 1) * pageSize);
    return {
        pagination_info,
        records: ticketRecords
    }
}