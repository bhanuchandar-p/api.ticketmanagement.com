import { sign, verify } from "hono/jwt";
import UnauthorizedException from "../exceptions/unAuthorizedException";
import { JWTPayload, JwtTokenExpired, JwtTokenInvalid, JwtTokenSignatureMismatched } from "hono/utils/jwt/types";
import { jwtConfig, jwtRefreshConfig } from "../config/jwtConfig";
import { Context } from "hono";
import { getRecordById } from "../services/db/baseDbService";
import { User, users } from "../db/schemas/users";


const jwtTime = Math.floor(Date.now() / 1000);

export const generateResetToken = async(payload: any) =>{
    const token = await sign(payload, process.env.JWT_SECRET as string);
    return token;
}

export const genToken = async(user_id: number) =>{
    const payload: JWTPayload = {
        sub:user_id,
        iat:Math.floor(Date.now() / 1000)
    };

    const tokens = await generateAllTokens(payload);
    return tokens;
}

export const generateAllTokens = async(payload: JWTPayload) => {

    const access_token = await sign({...payload, exp: jwtTime+jwtConfig.exp_in}, jwtConfig.secret);
    const refresh_token = await sign({...payload, exp: jwtTime+jwtRefreshConfig.exp_in}, jwtRefreshConfig.secret);
    return { access_token, refresh_token };
}


export const verifyJWT = async(token: string) =>{ 
    try {
        const payload = await verify(token, process.env.JWT_SECRET as string);
        return payload;

        
    } catch (error) {
        if (error instanceof JwtTokenInvalid){
            throw new UnauthorizedException('Invalid token');
        }
        if (error instanceof JwtTokenExpired){
            throw new UnauthorizedException('Token Expired')
        }
        if (error instanceof JwtTokenSignatureMismatched){
            throw new UnauthorizedException('Signature Mismatched')
        }
        else{
            throw error;
        }   
    }  
}

export const getUserDetailsFromToken = async (c: Context) => {
    try {
      const authHeader = c.req.header('Authorization');
      const token = authHeader?.substring(7, authHeader.length);
  
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }
  
      const decodedPayload = await verifyJWT(token);
  
  
      // Check if the user is existing in the system - in case the user is removed from the system the jwt token can still be valid
      const user = await getRecordById<User>(users, decodedPayload.sub as number);
  
      if (!user?.is_active || !user) {
        throw new UnauthorizedException("USER_INACTIVE");
      }
  
      const { password, created_at, updated_at, ...userDetails } = user;
  
      return userDetails;
  
    } catch (error) {
      throw error;
    }
  };

