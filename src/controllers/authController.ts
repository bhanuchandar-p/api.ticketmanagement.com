import { Context } from "hono";
import { validate } from "../validations/validate";
import { EMAIL_NOT_EXISTS, FORGOT_EMAIL_SENT, FORGOT_VALID_ERROR, INV_CREDS, INVALID_TOKEN, LOGIN_SUCCESS, LOGIN_VALID_ERROR, PASSWORD_MISMATCH, PASSWORD_RESET_SUCCESS, RESET_VALID_ERROR, SIGNUP_SUCCESS, SIGNUP_VALID_ERROR, TKN_GEN, TKN_USED, TOKEN_N_FOND, USER_EXISTS, USER_NOT_FOUND } from "../constants/appMessages";
import bcrypt from 'bcrypt';
import { ValidateForgotSchema, ValidateResetSchema, ValidateUserSchema } from "../validations/schema/vUserSchema";
import { getSingleRecordByAColumnValue, getRecordById, saveSingleRecord, updateRecordById } from "../services/db/baseDbService";
import { User, users } from "../db/schemas/users";
import { SendSuccessMsg } from "../helpers/sendSuccessMsg";
import { ValidateLoginSchema } from "../validations/schema/vLoginSchema";
import ConflictException from "../exceptions/conflictException";
import NotFoundException from "../exceptions/notFoundException";
import BadRequestException from "../exceptions/badReqException";
import { generateResetToken, genToken, verifyJWT } from "../utils/jwtUtils";
import { jwtConfig } from "../config/jwtConfig";
import { sendEmailtoResetPassword } from "../services/email/brevoEmailService";
import { ResetPasswordToken, resetPasswordTokens } from "../db/schemas/resetPasswordTokens";
import { emailConfig } from "../config/emailConfig";
import { RefreshToken, refreshTokens } from "../db/schemas/refreshTokens";


class AuthController {
    signup = async(c:Context) => {
        try {
            const reqBody = await c.req.json();

            const validData = await validate<ValidateUserSchema>('user:signup', reqBody, SIGNUP_VALID_ERROR);

            const existingUser = await getSingleRecordByAColumnValue<User>(users, 'email', validData.email);
            if (existingUser){
                throw new ConflictException(USER_EXISTS);
            }
             
            const Hashedpassword = await bcrypt.hash(validData.password, 10);
            validData.password = Hashedpassword;

            const res = await saveSingleRecord<User>(users, validData);
            const { password, ...UserDetails } = res;

            return SendSuccessMsg(c, 201, SIGNUP_SUCCESS, UserDetails);
        } catch (error:any){
            throw error;
        }
    }

    login = async(c:Context) => {
        try {
            const reqBody = await c.req.json();

            const validData = await validate<ValidateLoginSchema>('user:login',reqBody, LOGIN_VALID_ERROR);

            const res = await getSingleRecordByAColumnValue<User>(users, 'email', validData.email);
            if (!res){
                throw new NotFoundException(USER_NOT_FOUND);
            }

            const isPasswordMatch = await bcrypt.compare(validData.password, res.password);
            if (!isPasswordMatch){
                throw new BadRequestException(INV_CREDS);
            }
            const { password, ...UserDetails } = res;

            const tokens = await genToken(res.id);
            
            await saveSingleRecord<RefreshToken>(refreshTokens, {token: tokens.refresh_token, user_id: res.id});

            return SendSuccessMsg(c, 200, LOGIN_SUCCESS, {...UserDetails, ...tokens});

        } catch (error){
            throw error;
        }
    }

    forgotPassword = async(c:Context) => {
        try {
            const reqBody = await c.req.json();

            const validData = await validate<ValidateForgotSchema>('password:forgot',reqBody, FORGOT_VALID_ERROR);

            const userData = await getSingleRecordByAColumnValue<User>(users, 'email', validData.email);
            if (!userData){
                throw new NotFoundException(EMAIL_NOT_EXISTS);
            }

            const payload = { userId: userData.id, exp: Math.floor(Date.now() / 1000) + jwtConfig.exp_in };

            const token = await generateResetToken(payload);
            await saveSingleRecord<ResetPasswordToken>(resetPasswordTokens, {token, user_id: userData.id});

            const link = emailConfig.BASE_URL+`/auth/reset-password?token=${token}`;
            await sendEmailtoResetPassword(validData.email, link);

            return SendSuccessMsg(c, 200, FORGOT_EMAIL_SENT);
        } catch (error){
            throw error;
        }

    }

    resetPassword = async(c:Context) => {
        try {
            const reqBody = await c.req.json();

            const validData = await validate<ValidateResetSchema>('password:reset',reqBody, RESET_VALID_ERROR);
            if(validData.new_password !== validData.confirm_password){
                throw new BadRequestException(PASSWORD_MISMATCH);
            }
            
            const userId = await this._resetTokenVerify(c);
            if (!userId){
                throw new BadRequestException(INVALID_TOKEN);
            }

            const userData = await getRecordById<User>(users, userId);
            if (!userData){
                throw new NotFoundException(USER_NOT_FOUND);
            }

            const hashedPassword = await bcrypt.hash(validData.new_password, 10);
            userData.password = hashedPassword;
            
            await updateRecordById<User>(users, userData.id, {password: hashedPassword});
            await updateRecordById<ResetPasswordToken>(resetPasswordTokens, userId, {is_verified: true});

            return SendSuccessMsg(c, 200, PASSWORD_RESET_SUCCESS);
        } catch(error){
            throw error;

        }
    }

    _resetTokenVerify = async(c:Context) => {
        try {
            const token = c.req.query('token');

            const columnsToSelect = ['user_id', 'token', 'is_verified'] as const;

            const tokenData = await getSingleRecordByAColumnValue<ResetPasswordToken>(resetPasswordTokens, 'token', token, columnsToSelect);

            if (!tokenData){
                throw new NotFoundException(TOKEN_N_FOND);
            }

            await verifyJWT(tokenData.token);

            if (tokenData.is_verified === true){
                throw new BadRequestException(TKN_USED);
            }
            return tokenData.user_id;
        } catch (error){
            throw error;
        }
    }  

    generateTokenfromRefreshToken = async(c:Context) => {
        try {
            const reqBody = await c.req.json();
            
            const tokenData = await getSingleRecordByAColumnValue<RefreshToken>(refreshTokens, 'token', reqBody.refreshToken);

            if (!tokenData){
                throw new NotFoundException(TOKEN_N_FOND);
            }

            await verifyJWT(tokenData.token);

            const token = await genToken(tokenData.user_id);    
            return SendSuccessMsg(c, 200,TKN_GEN , {access_token:token.access_token});

        } catch (error){
            throw error;
        }  
    }
}


export default AuthController;