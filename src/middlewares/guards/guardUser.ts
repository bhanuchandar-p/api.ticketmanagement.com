import { Context } from "hono";
import { createMiddleware } from "hono/factory";
import { getUserDetailsFromToken } from "../../utils/jwtUtils";
import { UserActivity } from "../../types/appType";
import { getRecordById } from "../../services/db/baseDbService";
import { User, users } from "../../db/schemas/users";
import NotFoundException from "../../exceptions/notFoundException";
import { USER_NOT_FOUND } from "../../constants/appMessages";
import ForbiddenException from "../../exceptions/forbiddenException";

const canCreateRegularUser = createMiddleware(async (c: Context, next) => {
    try {
      await _canManageUser(c, 'user:create-user');
      await next();
    } catch (error: any) {
      throw error;
    }
  });
  
  const canViewAllUsers = createMiddleware(async (c: Context, next) => {
    try {
      await _canManageUser(c, 'user:view-all-users');
      await next();
    } catch (error: any) {
      throw error;
    }
  });
  
  const _canManageUser = async (c: Context, activity: UserActivity, orgId?: number, userId?: number) => {
  
    const userPayload = await getUserDetailsFromToken(c);
    const topDogs = ['admin'] as const;
  
    let canProceed = false;
    let isTopDog = topDogs.includes(userPayload.user_type);
  
    switch (activity) {
  
      case 'user:create-admin-user':
        canProceed = userPayload.user_type === 'admin';
        break;
  
      case 'user:create-user':
        canProceed = isTopDog;
        break;
  
      case 'user:view-user':
      case 'user:update-user':
        // If user_type is of topDog category, then action can be done only by topDogs
        const userBeingUpdated = await getRecordById<User>(users, userId!);
  
        if (!userBeingUpdated) {
          throw new NotFoundException(USER_NOT_FOUND);
        }
  
        if (topDogs.includes(userBeingUpdated.user_type)) {
          canProceed = isTopDog;
        } else {
          // user_type is 'user' - action can be edited in the following 2 cases
          // 1. can be done by topDog
          // 2. can be done by the user himself/herself
          if (isTopDog || userPayload.id === userId) {
            canProceed = true;
          }
        }
  
        break;
  
      case 'user:view-all-users':
        canProceed = isTopDog;
        break;
  
      default:
        break;
    }
  
    if (!canProceed) {
      throw new ForbiddenException("FORBIDDEN_ACCESS");
    }
    c.set('user_payload', userPayload);
  
    return;
  };