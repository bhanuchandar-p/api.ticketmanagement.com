// --------Exception Errors --------

export const DEF_400 = 'Bad Request';
export const DEF_401 = 'Unauthorized';
export const DEF_403 = 'Forbidden';
export const DEF_404 = 'Not Found';
export const DEF_409 = 'Conflict';
export const DEF_422 = 'Unprocessable Entity';
export const DEF_500 = 'Internal Server Error';

export const DEF_MSG_400 = 'Bad Request';
export const DEF_MSG_401 = 'Unauthorized request';
export const DEF_MSG_403 = 'Forbidden request';
export const DEF_MSG_404 = 'Data not Found';
export const DEF_MSG_409 = 'Conflict occurred';
export const DEF_MSG_422 = 'Unprocessable Entity';


// --------Validation Errors --------


export const F_NAME_REQ = 'First name is required';
export const F_NAME_MAX_LENGTH = 'First name must be less than 40 characters';
export const F_NAME_MIN_LENGTH = 'First name must be at least 3 characters';

export const L_NAME_REQ = 'Last name is required';
export const L_NAME_MAX_LENGTH = 'Last name must be less than 40 characters';


export const EMAIL_REQ = 'Email is required';
export const EMAIL_INVALID = 'Email is invalid';
export const EMAIL_MAX_LENGTH = 'Email must be less than 30 characters';
export const EMAIL_EXISTS = 'Email already exists';
export const EMAIL_NOT_EXISTS = 'User not found with the given email';

export const PASSWORD_REQ = 'Password is required';
export const PASSWORD_INVALID = 'Password is invalid';
export const PASSWORD_MIN_LENGTH = 'Password must be at least 8 characters';
export const PASSWORD_MAX_LENGTH = 'Password must be less than 30 characters';
export const PASSWORD_NOT_MATCH = 'Password does not match';
export const PASSWORD_REQ_LOWERCASE = 'Password must contain at least one lowercase letter';
export const PASSWORD_REQ_UPPERCASE = 'Password must contain at least one uppercase letter';
export const PASSWORD_REQ_NUMBER = 'Password must contain at least one number';
export const PASSWORD_MISMATCH = 'Passwords does not match';
export const PASSWORD_RESET_SUCCESS = 'Password reset successfully';

export const PHONE_INVALID = 'Phone number is invalid';
export const PHONE_MIN_LENGTH = 'Phone number must be at least 10 characters';
export const PHONE_MAX_LENGTH = 'Phone number must be less than 15 characters';

export const SIGNUP_VALID_ERROR = 'Signup details are invalid';
export const LOGIN_VALID_ERROR = 'Login details are invalid';
export const FORGOT_VALID_ERROR = 'Forgot password details are invalid';
export const RESET_VALID_ERROR = 'Reset password details are invalid';

export const USER_NOT_FOUND = 'User not found';
export const USER_EXISTS = 'User already exists';
export const USER_TYPE_INVALID = 'User type is invalid';

export const INVALID_TOKEN = 'Invalid token';
export const INVALID_REFRESH_TOKEN = 'Invalid refresh token';
export const TOKEN_EXPIRED = 'Token has been expired';
export const TOKEN_N_FOND = 'Token not found';
export const INV_CREDS = 'Invalid credentials';
export const TKN_USED = 'Token has been used already';
export const TKN_VERIFIED = 'Token has been verified successfully';
export const TKN_GEN = 'Token has been generated successfully';

export const FORGOT_EMAIL_SENT = 'Forgot password email link has been sent successfully';
export const LOGIN_SUCCESS = 'User login successful';
export const SIGNUP_SUCCESS = 'User created successfully';


export const PROJ_NAME_REQ = 'Project name is required';
export const PROJ_NAME_MAX_LENGTH = 'Project name must be less than 40 characters';
export const PROJ_NAME_MIN_LENGTH = 'Project name must be at least 3 characters';

export const PROJ_CODE_REQ = 'Project code is required';
export const PROJ_CODE_MAX_LENGTH = 'Project code must be less than 10 characters';
export const PROJ_CODE_MIN_LENGTH = 'Project code must be at least 2 characters';

export const PROJ_VALID_ERROR = 'Project details are invalid';
export const PROJ_NOT_FOUND = 'Project not found';
export const PROJ_NM_EXISTS = 'Project name already exists';
export const PROJ_CD_EXISTS = 'Project code already exists';
export const PROJ_CREATED = 'Project created successfully';
export const PROJ_UPDATED = 'Project updated successfully';
export const PROJ_DELETED = 'Project deleted successfully';
export const PROJ_FETCH_SUCCESS = 'Project details fetched successfully';
export const PROJ_USERS_ADD_SUCCESS = 'Developers added to project successfully';
export const INV_ID = 'Invalid id';
export const DEV_NOT_FND = 'Developers not found';
export const DEV_FETCH_SUCCESS = 'Developers fetched successfully';
export const PROJ_ALL_FETCH_SUCCESS = 'Projects fetched successfully';