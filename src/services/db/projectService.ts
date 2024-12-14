import { db } from "../../db/dbConnection"
import { project, projects } from "../../db/schemas/projects"
import { projectUsers } from "../../db/schemas/projectUsers"
import { users } from "../../db/schemas/users"
import { and, count, countDistinct, eq } from "drizzle-orm"
import { DBTable, DBTableColumns, DBTableRow, OrderByQueryData, PaginationInfo, SortDirection, UserType, WhereQueryData } from "../../types/dbtypes"
import { prepareOrderByQueryConditions, prepareWhereQueryConditionsForProjects, prepareWhereQueryConditionsForTickets } from "../../utils/dbUtils"
import { tickets } from "../../db/schemas/tickets"


export const fetchProjectUsers = async(id:number) => {
    const res = await db.select({id:projectUsers.id,name:users.first_name})
                        .from(projectUsers)
                        .innerJoin(users,eq(users.id,projectUsers.user_id))
                        .where(eq(projectUsers.project_id,id));           
    return res;
}


export const getAsingleProject = async(id:number) => {
    const res = await db.select({
                        id:projects.id,
                        name:projects.name,
                        description:projects.description,
                        project_code:projects.project_code,
                        project_status:projects.status,
                        created_by:projects.created_by,
                        created_name:users.first_name,
                        created_at:projects.created_at,
                        updated_at:projects.updated_at,  
                        })
                        .from(projects)
                        .innerJoin(users,eq(projects.created_by,users.id))
                        .where(eq(projects.id,id)).limit(1);
    return res[0];
}


export const fetchAllPaginatedProjects = async(
  table:DBTable,
  page:number,
  pageSize:number,
  user_type: UserType|null,
  user_id:number,
  searchString?:string,
  status?:string,
  orderBy?:string,
)=>{

  let orderByQueryData: OrderByQueryData<project> = {
                  columns: ['updated_at'],
                  values: ['desc']
  }

  if (orderBy) {
    let orderByColumns: DBTableColumns<project>[] = []
    let orderByValues: SortDirection[] = []
    const queryStrings = orderBy.split(',')
    for (const queryString of queryStrings) {
      const [column, value] = queryString.split(':')
      orderByColumns.push(column as DBTableColumns<project>)
      orderByValues.push(value as SortDirection)
    }
    orderByQueryData = {
      columns: orderByColumns,
      values: orderByValues
    }
  }
    let whereQueryData: WhereQueryData<project> = {
      // default where query
      columns: ['status'],
      values: ['active'],
    };

    if (searchString) {
      whereQueryData.columns.push('name');
      whereQueryData.values.push(`%${searchString}%`);
    }

    if (status) {
      whereQueryData.columns.push('status');
      whereQueryData.values.push(status);
    }

    let finalRecords;

    if (user_type === 'admin') {
      finalRecords = await getPaginatedProjectsConditionally(table, page, pageSize, whereQueryData, orderByQueryData)
    }

    if (user_type === 'developer'){
      finalRecords = await getPaginatedProjectsForDeveloper(table, page, pageSize, user_id, whereQueryData, orderByQueryData);
    }

    if (user_type === 'user'){
      finalRecords = await getPaginatedProjectsForUsers(table, user_id, page, pageSize, whereQueryData, orderByQueryData);

    }

    return finalRecords;
}

export const getPaginatedProjectsConditionally = async<R extends DBTableRow, C extends keyof R = keyof R>(
    table: DBTable,
    page: number,
    pageSize: number,
    whereQueryData: WhereQueryData<R>,
    orderByQueryData?: OrderByQueryData<R>,
  ) => {
    let countQuery = db.select({ total: count(table.id) }).from(table).$dynamic();
    if (whereQueryData) {
      const whereConditions = prepareWhereQueryConditionsForProjects(table, whereQueryData);
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
    const whereConditions = prepareWhereQueryConditionsForProjects(projects, whereQueryData);
    const orderByConditions = prepareOrderByQueryConditions(table, orderByQueryData);

    const results = await db.query.projects.findMany({
        where: whereConditions?.length? and(...whereConditions) : and(),
        with:{
            project_users:  {
                with: {
                    user: true
                }
            },
        },
        limit: pageSize,
        offset: (page - 1) * pageSize,
        orderBy: orderByConditions
    })
    const projectsRecord = results.map((project) => {
        return {
            ...project,
            project_users:project.project_users.map((user1) => {
                return {
                    user_id:user1.user_id,
                    user_first_name:user1.user?.first_name,
                    user_last_name:user1.user?.last_name,
                    user_email:user1.user?.email
                }
            })

        }
        
    })
    return {pagination_info,records:projectsRecord};
  };


export const getPaginatedProjectsForDeveloper = async<R extends DBTableRow, C extends keyof R = keyof R>(
    table: DBTable,
    page: number,
    pageSize: number,
    userId: number,
    whereQueryData: WhereQueryData<R>,
    orderByQueryData?: OrderByQueryData<R>,
  ) => {
    let countQuery = db.select({ total: count(projectUsers.project_id)}).from(projectUsers).where(eq(projectUsers.user_id,userId));

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
    const whereConditions = prepareWhereQueryConditionsForProjects(projects, whereQueryData);
    const orderByConditions = prepareOrderByQueryConditions(table, orderByQueryData);

    const reqRecord = {
      id:projects.id,
      name:projects.name,
      description:projects.description,
      project_code:projects.project_code,
      created_by:projects.created_by,
      status:projects.status,
      created_at:projects.created_at,
      updated_at:projects.updated_at,
  }
    const projectsRecord = await db.selectDistinct({...reqRecord}).from(projects)
                                   .where(whereConditions?.length? and(...whereConditions,eq(projectUsers.user_id,userId)) : and(eq(projectUsers.user_id,userId)))
                                   .innerJoin(projectUsers, eq(projects.id, projectUsers.project_id))
                                   .limit(pageSize)
                                   .offset((page - 1) * pageSize)
                                   .orderBy(...orderByConditions);


    return {pagination_info,records:projectsRecord};
  };


export const getPaginatedProjectsForUsers = async<R extends DBTableRow, C extends keyof R = keyof R>(
    table: DBTable,
    userId: number,
    page: number,
    pageSize: number,
    whereQueryData: WhereQueryData<R>,
    orderByQueryData?: OrderByQueryData<R>,
  ) => {
    let countQuery = db.select({ total: countDistinct(tickets.project_id)})
    .from(tickets)
    .where(eq(tickets.requested_by, userId));
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
    const whereConditions = prepareWhereQueryConditionsForProjects(projects, whereQueryData);
    const orderByConditions = prepareOrderByQueryConditions(table, orderByQueryData);

    const whereCnd = whereConditions?.length? and(...whereConditions,eq(tickets.requested_by, userId)) : and(eq(tickets.requested_by, userId));
    const reqRecord = {
        id:projects.id,
        name:projects.name,
        description:projects.description,
        project_code:projects.project_code,
        created_by:projects.created_by,
        status:projects.status,
        created_at:projects.created_at,
        updated_at:projects.updated_at,
    }

    const projectsRecord = await db.selectDistinct({...reqRecord}).from(tickets)
                                   .innerJoin(users, eq(users.id, tickets.requested_by))
                                   .innerJoin(projects, eq(projects.id,tickets.project_id))
                                   .where((whereCnd))
                                   .limit(pageSize)
                                   .offset((page - 1) * pageSize)
                                   .orderBy(...orderByConditions)
  
    
    return {pagination_info,records:projectsRecord};

  };


export const fetchAllProjects = async() => {
    const res = await db.select({id:projects.id,name:projects.name}).from(projects);
    return res;
}


export const fetchProjectTickets = async<R extends DBTableRow, C extends keyof R = keyof R>(
    table: DBTable,
    reqId:number,
    page: number,
    pageSize: number,
    whereQueryData: WhereQueryData<R>,
    orderByQueryData?: OrderByQueryData<R>,
  ) => {
    let countQuery = db.select({ total: count(table.id) }).from(table).$dynamic();
    if (whereQueryData) {
      const whereConditions = prepareWhereQueryConditionsForTickets(table, whereQueryData);
      if (whereConditions) {
        countQuery = countQuery.where(and(...whereConditions,eq(tickets.project_id,reqId)));
      }
      else{
        countQuery = countQuery.where(eq(tickets.project_id,reqId));
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
    const whereConditions = prepareWhereQueryConditionsForTickets(tickets, whereQueryData);
    const orderByConditions = prepareOrderByQueryConditions(table, orderByQueryData);


    const result = await db.query.tickets.findMany({
        where: whereConditions?.length? and(...whereConditions,eq(tickets.project_id,reqId)) : eq(tickets.project_id,reqId),
        with: {
            ticket_assignes: {
                columns:{},
                with: {
                    user: true
                }
            },
            users: true,
            project: true
        },
        limit: pageSize,
        offset: pageSize * (page - 1),
        orderBy: orderByConditions
    });
    const ticketRecord = result.map((ticket) => {
        return {
            id:ticket.id,
            title:ticket.title,
            project_name:ticket.project.name,
            description:ticket.description,
            status:ticket.status,
            priority:ticket.priority,
            requested_by:ticket.requested_by,
            created_name:ticket.users.first_name,
            ticket_assigned_to: ticket.ticket_assignes[0]?.user.first_name??null,
            due_date:ticket.due_date,
            created_at:ticket.created_at,
            updated_at:ticket.updated_at
        }
    })
    return {pagination_info,records:ticketRecord};
}


