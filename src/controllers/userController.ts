import { Context } from "hono";
import { validate } from "../validations/validate";
import { VAdminUserSchema, ValidateAdminUserSchema, ValidateDeveloperUserSchema, ValidateRegularUserSchema, ValidateUpdatePassword, ValidateUpdateUserSchema, VDeveloperUserSchema, VRegularUserSchema, VUpdateUserSchema } from "../validations/schema/vUserSchema";
import { getMultipleRecordsByAColumnValue, getPaginatedRecordsConditionally, getRecordById, getSingleRecordByAColumnValue, saveSingleRecord, softDeleteRecordById, updateRecordById } from "../services/db/baseDbService";
import { PASSWORD_MISMATCH, USER_EXISTS } from "../constants/appMessages";
import ConflictException from "../exceptions/conflictException";
import { User, users } from "../db/schemas/users";
import bcrypt from 'bcrypt';
import { SendSuccessMsg } from "../helpers/sendSuccessMsg";
import BadRequestException from "../exceptions/badReqException";
import { DBTableColumns, OrderByQueryData, SortDirection, WhereQueryData } from "../types/dbtypes";

class UserController {
    createadminUser = async(c:Context) => {
        try {
            const req = await c.req.json();

            const validData = await validate<ValidateAdminUserSchema>('user:create-admin-user', req, "Admin User creation Validation Error");

            const existingUser = await getSingleRecordByAColumnValue<User>(users, 'user_type', 'admin');
            if (existingUser){
                throw new ConflictException('admin already exists');
            }
            
            const Hashedpassword = await bcrypt.hash(validData.password, 10);
            validData.password = Hashedpassword;

            const res = await saveSingleRecord<User>(users, validData);
            const { password, ...UserDetails } = res;

            return SendSuccessMsg(c, 201, 'Admin user created successfully', UserDetails);
        } catch (error) {
            throw error;
        }
    }

    createUser = async(c:Context) => {
        try {
            const req = await c.req.json();
            const validData = await validate<ValidateRegularUserSchema>('user:create-user',VRegularUserSchema, req);

            const existingUser = await getSingleRecordByAColumnValue<User>(users, 'email', validData.email);
            if (existingUser){
                throw new ConflictException(USER_EXISTS);
            }

            const hashedPassword = await bcrypt.hash(validData.password, 10);
            validData.password = hashedPassword;

            const res = await saveSingleRecord<User>(users, validData);

            const { password, ...UserDetails } = res;

            return SendSuccessMsg(c, 201, 'User created successfully', UserDetails);
        
        } catch (error) {
            throw error;
        }
    }

    createDeveloperUser = async(c:Context) => {
        try {
            const req = await c.req.json();
            const validData = await validate<ValidateDeveloperUserSchema>('user:create-developer', req, "Developer User creation Validation Error");

            const existingUser = await getSingleRecordByAColumnValue<User>(users, 'email', validData.email);
            if (existingUser){
                throw new ConflictException(USER_EXISTS);
            }

            const Hashedpassword = await bcrypt.hash(validData.password, 10);
            validData.password = Hashedpassword;

            const res = await saveSingleRecord<User>(users, validData);
            const { password, ...UserDetails } = res;

            return SendSuccessMsg(c, 201, 'Developer user created successfully', UserDetails);
        } catch (error) {
            throw error;
        }
    }
    updatePassword = async(c:Context) => {
        try {
            const req = await c.req.json();
            const user = c.get('user_payload');

            const validData = await validate<ValidateUpdatePassword>('user:update-password', req, "Password update Validation Error");
               
            const columnsToSelect = ['id', 'password'] as const;
            const res = await getSingleRecordByAColumnValue<User, typeof columnsToSelect[number]>(users, 'id', user.id, columnsToSelect);

            const isPasswordMatch = await bcrypt.compare(validData.current_password, res!.password);

            if (!isPasswordMatch) {
                throw new BadRequestException("Current Password is wrong");
            }

            const hashedPassword = await bcrypt.hash(validData.new_password, 10);
            validData.new_password = hashedPassword;

            await updateRecordById(users, res!.id, {password:validData.new_password});

            return SendSuccessMsg(c, 200, 'Password updated successfully');
        } catch (error) {
            throw error;
        }
    }

    getUserbyId = async(c:Context) => {
        try {
            const user = c.get('user_payload');

            const userData = await getRecordById<User>(users, user.id);
            if (!userData) {
                throw new BadRequestException("User not found");
            }

            const { password, ...userDetails } = userData;
            return SendSuccessMsg(c, 200, 'User details', userDetails);
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
                throw new BadRequestException("Data is not found");
              }

            return SendSuccessMsg(c, 200, 'User details fetched Successfully', res);
        } catch (error) {
            throw error;
        }
    }
    softdeleteUser = async(c:Context) => {
        try {
            const reqId = +c.req.param('id');

            if (!reqId) {
                throw new BadRequestException("User id is required");
            }

            const userData = await getRecordById<User>(users, reqId);
            if (!userData) {
                throw new BadRequestException("User not found");
            }

            await softDeleteRecordById(users, reqId, {is_active: false});

            return SendSuccessMsg(c, 200, 'User deleted successfully');
        } catch (error) {
            throw error;
        }
    }
    updateUser = async(c:Context) => {
        try {
            const userPayload = c.get('user_payload');
            const reqBody = await c.req.json();

            const validData = await validate<ValidateUpdateUserSchema>('user:update-user', reqBody, "User update Validation Error");

            const existingUser = await getRecordById<User>(users, userPayload.id);
            if (!existingUser) {
                throw new BadRequestException("User not found");
            }

            const userData = await updateRecordById<User>(users, userPayload.id, validData);

            const { password, ...userDetails } = userData;

            return SendSuccessMsg(c, 200, 'User updated successfully', userDetails);
        } catch (error) {
            throw error;
        }
    }
}


export default UserController