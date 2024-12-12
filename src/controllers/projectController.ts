import { Context } from "hono";
import { validate } from "../validations/validate";
import { ValidateProjectSchema, ValidateProjectUpdateSchema } from "../validations/schema/vProjectSchema";
import { getMultipleRecordsByAColumnValue, getPaginatedRecordsConditionally, getRecordById, getSingleRecordByAColumnValue, saveRecords, saveSingleRecord, softDeleteRecordById, updateRecordById } from "../services/db/baseDbService";
import { project, projects } from "../db/schemas/projects";
import ConflictException from "../exceptions/conflictException";
import { NewProjectuser, ProjectUser, projectUsers } from "../db/schemas/projectUsers";
import { SendSuccessMsg } from "../helpers/sendSuccessMsg";
import NotFoundException from "../exceptions/notFoundException";
import BadRequestException from "../exceptions/badReqException";
import { fetchProjectTickets, fetchProjectUsers, getAsingleProject, getPaginatedProjectsConditionally } from "../services/db/projectService";
import { DBTableColumns, OrderByQueryData, SortDirection, WhereQueryData } from "../types/dbtypes";
import { DEV_FETCH_SUCCESS, INV_ID, PROJ_ALL_FETCH_SUCCESS, PROJ_CD_EXISTS, PROJ_CREATED, PROJ_DELETED, PROJ_FETCH_SUCCESS, PROJ_NM_EXISTS, PROJ_NOT_FOUND, PROJ_UPDATED, PROJ_USERS_ADD_SUCCESS } from "../constants/appMessages";
import { Ticket, tickets, TicketsTables } from "../db/schemas/tickets";


class ProjectController {
    addProject = async(c:Context) =>{
        try {
            const req = await c.req.json();
            const userPayload = c.get('user_payload');

            const validData = await validate<ValidateProjectSchema>('add:project',req,'Project Creation Validation Failed');

            const projectRecordByName = await getSingleRecordByAColumnValue<project>(projects,'name', validData.name)
            if (projectRecordByName){
                throw new ConflictException(PROJ_NM_EXISTS);
            }
            const projectRecordbyCode = await getSingleRecordByAColumnValue<project>(projects,'project_code',validData.project_code);
            if (projectRecordbyCode){
                throw new ConflictException(PROJ_CD_EXISTS);
            }

            validData.created_by = userPayload.id
            const { project_members, ...dbData} = validData
            const res = await saveSingleRecord<project>(projects,dbData);

            const projectMembers = project_members ?? []
            if (projectMembers.length > 0) {
                const projectUsersToAdd: NewProjectuser[] = []
                validData.project_members?.forEach((id)=>{
                    projectUsersToAdd.push({user_id: Number(id), project_id: res.id})
                });
             await saveRecords<ProjectUser>(projectUsers,projectUsersToAdd)
            }

            return SendSuccessMsg(c,201,PROJ_CREATED,res);
        } catch (err){
            throw err;
        }
    }

    getProjectbyId = async(c:Context) => {
        try {
            const reqId = +c.req.param('id');
            if (!reqId){
                throw new BadRequestException(INV_ID);
            }

            const projectRecord = await getAsingleProject(reqId);
            if(!projectRecord){
                throw new NotFoundException(PROJ_NOT_FOUND);
            }

            return SendSuccessMsg(c,200,PROJ_FETCH_SUCCESS,projectRecord);

        } catch (err) {
            throw err;
        }
    }

    updateProject = async(c:Context) => {
        try {
            const req = await c.req.json();
            const reqId = +c.req.param('id');

            const validData = await validate<ValidateProjectUpdateSchema>('update:project',req,'Update Project Validation');
            const projectRecordByName = await getSingleRecordByAColumnValue<project>(projects,'name', validData.name)
            if (projectRecordByName){
                throw new ConflictException(PROJ_NM_EXISTS)
            }
            const projectRecordbyCode = await getSingleRecordByAColumnValue<project>(projects,'project_code',validData.project_code);
            if (projectRecordbyCode){
                throw new ConflictException(PROJ_CD_EXISTS)
            }

            const updatedRecord = await updateRecordById<project>(projects,reqId, validData)
            return SendSuccessMsg(c,200,PROJ_UPDATED,updatedRecord);

        } catch (err) {
            throw err;
        }
    }

    addProjectUsers = async(c:Context) => {
        try {
            const reqId = +c.req.param('id');
            const req = await c.req.json();

            const projectRecord = await getSingleRecordByAColumnValue<ProjectUser>(projectUsers,'id',reqId)
            if (projectRecord) {
                throw new NotFoundException(PROJ_NOT_FOUND);
            }

            const { project_members } = await req
            const projectUsersToAdd: NewProjectuser[] = []
            project_members.forEach((id: any)=>{
                projectUsersToAdd.push({user_id: Number(id), project_id: reqId})
            })

            await saveRecords(projectUsers, projectUsersToAdd)

            return SendSuccessMsg(c,201,PROJ_USERS_ADD_SUCCESS);
        } catch (err) {
            throw err;
        }
    }

    getProjectusers = async(c:Context) => {
        try {
            const reqId = +c.req.param('id');
            if (!reqId){
                throw new BadRequestException('Invalid Id');
            }

            const projectUserData = await fetchProjectUsers(reqId);
            if (projectUserData.length===0){
                throw new NotFoundException('Developers not found');
            }

            return SendSuccessMsg(c,200, DEV_FETCH_SUCCESS, projectUserData)

        } catch (err) {
            throw err;
        }
    }

    getAllProjects = async(c:Context) => {
        try {
            const page = +(c.req.param('page')) || 1
            const pageSize = +(c.req.query('pageSize') || 10);
            const searchString = c.req.query('search_string') || '';
            const status = c.req.query('status')

            let orderByQueryData: OrderByQueryData<project> = {
                columns: ['updated_at'],
                values: ['desc']
              }
              const orderBy = c.req.query('order_by')
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

              const result = await getPaginatedProjectsConditionally(projects, page, pageSize, whereQueryData, orderByQueryData);
              if (!result) {
                throw new NotFoundException("Data is not found");
              }

            return SendSuccessMsg(c, 200, PROJ_ALL_FETCH_SUCCESS, result);
        } catch (error) {
            throw error;
        }
    }

    deleteProject = async(c:Context) => {
        try {
            const reqId = +c.req.param('id');

            if(!reqId){
                throw new BadRequestException(INV_ID);
            }

            await softDeleteRecordById(projects,reqId,{status:'inactive'});

            return SendSuccessMsg(c,200,PROJ_DELETED);
        } catch (err) {
            throw err;
        }
    }

    getProjectbasedTickets = async(c:Context) => {
        try {
            const reqProjId = +c.req.param('id');
            const page = +(c.req.param('page')) || 1
            const pageSize = +(c.req.query('pageSize') || 10);
            const searchString = c.req.query('search_string') || '';
            const status = c.req.query('status')
            const priority = c.req.query('priority')

            let orderByQueryData: OrderByQueryData<Ticket> = {
                columns: ['updated_at'],
                values: ['desc']
              }
              const orderBy = c.req.query('order_by')
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
            const result = await fetchProjectTickets(tickets, reqProjId, page, pageSize, whereQueryData, orderByQueryData);

            if (!result) {
                throw new NotFoundException("Data is not found");
            }

            return SendSuccessMsg(c,200, 'Project Tickets fetched successfully', result);
        } catch (err) {
            throw err;
        }
    }
}

export default ProjectController;