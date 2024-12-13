import { Context } from "hono";
import { validate } from "../validations/validate";
import { ValidateAdminUserSchema, ValidateDeveloperUserSchema, ValidateRegularUserSchema, ValidateUpdatePassword, ValidateUpdateUserSchema } from "../validations/schema/vUserSchema";
import { getPaginatedRecordsConditionally, getRecordById, getSingleRecordByAColumnValue, saveSingleRecord, softDeleteRecordById, updateRecordById } from "../services/db/baseDbService";
import { ADMIN_CREAT_SUCCESS, ADMIN_EXISTS, ADMIN_VALID_ERROR, DATA_N_FOND, DEV_CREAT_SUCCESS, DEV_CREAT_VALID_ERROR, INV_ID, PASSWORD_MISMATCH, PASSWORD_VALID_ERROR, PSWD_UPDATE_SUCCESS, USER_CREAT_SUCCESS, USER_CREAT_VALID_ERROR, USER_DATA_GET_SUCCESS, USER_DEL_SUCCESS, USER_EXISTS, USER_FET_SUCCESS, USER_NOT_FOUND, USER_UPD_SUCCESS, USER_UPD_VALID_ERROR } from "../constants/appMessages";
import ConflictException from "../exceptions/conflictException";
import { User, users } from "../db/schemas/users";
import bcrypt from 'bcrypt';
import { SendSuccessMsg } from "../helpers/sendSuccessMsg";
import BadRequestException from "../exceptions/badReqException";
import { DBTableColumns, JWTPayload, OrderByQueryData, SortDirection, WhereQueryData } from "../types/dbtypes";
import NotFoundException from "../exceptions/notFoundException";

class UserController {
    createadminUser = async(c:Context) => {
        try {
            const req = await c.req.json();

            const validData = await validate<ValidateAdminUserSchema>('user:create-admin-user', req, ADMIN_VALID_ERROR);

            const existingUser = await getSingleRecordByAColumnValue<User>(users, 'user_type', 'admin');
            if (existingUser){
                throw new ConflictException(ADMIN_EXISTS);
            }
            
            const Hashedpassword = await bcrypt.hash(validData.password, 10);
            validData.password = Hashedpassword;

            const res = await saveSingleRecord<User>(users, validData);
            const { password, ...UserDetails } = res;

            return SendSuccessMsg(c, 201, ADMIN_CREAT_SUCCESS, UserDetails);
        } catch (error) {
            throw error;
        }
    }

    createUser = async(c:Context) => {
        try {
            const req = await c.req.json();
            const validData = await validate<ValidateRegularUserSchema>('user:create-user', req, USER_CREAT_VALID_ERROR);

            const existingUser = await getSingleRecordByAColumnValue<User>(users, 'email', validData.email);
            if (existingUser){
                throw new ConflictException(USER_EXISTS);
            }

            const hashedPassword = await bcrypt.hash(validData.password, 10);
            validData.password = hashedPassword;

            const res = await saveSingleRecord<User>(users, validData);

            const { password, ...UserDetails } = res;

            return SendSuccessMsg(c, 201, USER_CREAT_SUCCESS, UserDetails);
        
        } catch (error) {
            throw error;
        }
    }

    createDeveloperUser = async(c:Context) => {
        try {
            const req = await c.req.json();
            const validData = await validate<ValidateDeveloperUserSchema>('user:create-developer', req, DEV_CREAT_VALID_ERROR);

            const existingUser = await getSingleRecordByAColumnValue<User>(users, 'email', validData.email);
            if (existingUser){
                throw new ConflictException(USER_EXISTS);
            }

            const Hashedpassword = await bcrypt.hash(validData.password, 10);
            validData.password = Hashedpassword;

            const res = await saveSingleRecord<User>(users, validData);
            const { password, ...UserDetails } = res;

            return SendSuccessMsg(c, 201, DEV_CREAT_SUCCESS, UserDetails);
        } catch (error) {
            throw error;
        }
    }
    updatePassword = async(c:Context) => {
        try {
            const req = await c.req.json();
            const user: JWTPayload = c.get('user_payload');

            const validData = await validate<ValidateUpdatePassword>('user:update-password', req, PASSWORD_VALID_ERROR);
               
            const columnsToSelect = ['id', 'password'] as const;
            const res = await getSingleRecordByAColumnValue<User, typeof columnsToSelect[number]>(users, 'id', user.id, columnsToSelect);

            const isPasswordMatch = await bcrypt.compare(validData.current_password, res!.password);

            if (!isPasswordMatch) {
                throw new BadRequestException(PASSWORD_MISMATCH);
            }

            const hashedPassword = await bcrypt.hash(validData.new_password, 10);
            validData.new_password = hashedPassword;

            await updateRecordById(users, res!.id, {password:validData.new_password});

            return SendSuccessMsg(c, 200, PSWD_UPDATE_SUCCESS);
        } catch (error) {
            throw error;
        }
    }

    getUserbyId = async(c:Context) => {
        try {
            const user:JWTPayload = c.get('user_payload');

            const userData = await getRecordById<User>(users, user.id);
            if (!userData) {
                throw new NotFoundException(USER_NOT_FOUND);
            }

            const { password, ...userDetails } = userData;
            return SendSuccessMsg(c, 200, USER_FET_SUCCESS, userDetails);
        } catch (error) {
            throw error;
        }
    }

    getUsersPaginated = async(c:Context) => {
        try {
            // const user = c.get('user');
            const page = +(c.req.query('page') || 1);
            const pageSize = +(c.req.query('pageSize') || 10);
            const searchString = c.req.query('search_string') || '';
            const userType = c.req.query('user_type') || '';

            let orderByQueryData: OrderByQueryData<User> = {
                columns: ['updated_at'],
                values: ['desc']
              }
              const orderBy = c.req.query('order_by')
              if (orderBy) {
                let orderByColumns: DBTableColumns<User>[] = []
                let orderByValues: SortDirection[] = []
                const queryStrings = orderBy.split(',')
                for (const queryString of queryStrings) {
                  const [column, value] = queryString.split(':')
                  orderByColumns.push(column as DBTableColumns<User>)
                  orderByValues.push(value as SortDirection)
                }
        
                orderByQueryData = {
                  columns: orderByColumns,
                  values: orderByValues
                }
              }
              let whereQueryData: WhereQueryData<User> = {
                //present change 
                columns: ['is_active'],
                values: [true],
              };
        
              if (searchString) {
                whereQueryData.columns.push('first_name');
                whereQueryData.values.push(`%${searchString}%`);
              }

              if (userType) {
                whereQueryData.columns.push('user_type');
                whereQueryData.values.push(userType);
              }
        
              const res = await getPaginatedRecordsConditionally<User>(users, page, pageSize, orderByQueryData, whereQueryData);
              if (!res) {
                throw new NotFoundException(DATA_N_FOND);  
              }

            return SendSuccessMsg(c, 200, USER_DATA_GET_SUCCESS, res);
        } catch (error) {
            throw error;
        }
    }
    softdeleteUser = async(c:Context) => {
        try {
            const reqId = +c.req.param('id');

            if (!reqId) {
                throw new BadRequestException(INV_ID);
            }

            const userData = await getRecordById<User>(users, reqId);
            if (!userData) {
                throw new BadRequestException(USER_NOT_FOUND);
            }

            await softDeleteRecordById(users, reqId, {is_active: false});

            return SendSuccessMsg(c, 200, USER_DEL_SUCCESS);
        } catch (error) {
            throw error;
        }
    }
    updateUser = async(c:Context) => {
        try {
            const userPayload:JWTPayload = c.get('user_payload');
            const reqBody = await c.req.json();

            const validData = await validate<ValidateUpdateUserSchema>('user:update-user', reqBody, USER_UPD_VALID_ERROR);

            const existingUser = await getRecordById<User>(users, userPayload.id);
            if (!existingUser) {
                throw new BadRequestException(USER_NOT_FOUND);
            }

            const userData = await updateRecordById<User>(users, userPayload.id, validData);

            const { password, ...userDetails } = userData;

            return SendSuccessMsg(c, 200, USER_UPD_SUCCESS, userDetails);
        } catch (error) {
            throw error;
        }
    }
}


export default UserController