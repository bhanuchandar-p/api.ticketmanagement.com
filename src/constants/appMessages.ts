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
export const PASSWORD_VALID_ERROR = 'Password update details are invalid';

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
export const ADMIN_VALID_ERROR = 'Admin user creation details are invalid';
export const USER_CREAT_VALID_ERROR = 'User creation details are invalid';
export const DEV_CREAT_VALID_ERROR = 'Developer user creation details are invalid';
export const USER_UPD_VALID_ERROR = 'User update details are invalid';

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


export const FILE_KEY_INVALID='File Key Invalid';
export const FILE_KEY_MISSING='File Key Required';
export const FILE_SIZE_IS_NUMBER='File Size must be a number';

// ----------UserModule ---------

export const ADMIN_EXISTS = 'Admin already exists';
export const ADMIN_CREAT_SUCCESS = 'Admin user created successfully';
export const USER_CREAT_SUCCESS = 'User created successfully';
export const DEV_CREAT_SUCCESS = 'Developer user created successfully';
export const CUR_PSWD_WRNG = 'Current password is wrong';
export const PSWD_UPDATE_SUCCESS = 'Password updated successfully';
export const USER_FET_SUCCESS = 'User detailes fetched successfully';
export const USER_DATA_GET_SUCCESS = 'Users data fetched successfully';
export const USER_DEL_SUCCESS = 'User deleted successfully';
export const USER_UPD_SUCCESS = 'User updated successfully';
export const DATA_N_FOND = 'Data not found';

// --------Tickets Module Messages --------

export const TICKET_NOT_FOUND = "Ticket not found";
export const TICKET_CREATED_SUCCESS = "Ticket created successfully";
export const TICKET_UPDATED_SUCCESS = "Ticket updated successfully";
export const TICKET_DELETED_SUCCESS = "Ticket deleted successfully";
export const TICKETS_FETCHED_SUCCESS = "Tickets fetched successfully";
export const TICKET_FETCHED_SUCCESS = "Ticket fetched successfully";
export const TICKET_ASSIGNED_SUCCESS = "Ticket assigned successfully";

export const TICKET_TITLE_REQUIRED = "Ticket title is required";
export const TICKET_TITLE_STRING = "Ticket title must be a string";
export const TICKET_TITLE_MIN_LENGTH = "Ticket title must be at least 5 characters long";
export const TICKET_TITLE_MAX_LENGTH = "Ticket title must be at most 50 characters long";


export const TICKET_DESCRIPTION_STRING = "Ticket description must be a string";
export const TICKET_DESCRIPTION_MIN_LENGTH = "Ticket description must be at least 20 characters long";
export const TICKET_DESCRIPTION_MAX_LENGTH = "Ticket description must be at most 400 characters long";

export const TICKET_PRIORITY_REQUIRED = "Ticket priority is required";
export const TICKET_STATUS_REQUIRED = "Ticket status is required";
export const TICKET_PRIORITY = ['low', 'medium', 'high'] as const;
export const TICKET_STATUS = ['open', 'closed', 'inprogress'] as const;
export const TICKET_PRIORITY_VALIDATION = "Ticket priority must be low, medium or high";
export const TICKET_STATUS_VALIDATION = "Ticket status must be open, closed or inprogress";
export const PAGE_NOT_EXIST = 'The Requested page is doesnot exist';

//--------Comments Module Messages --------

export const COMMENT_NOT_FOUND = "Comment is not found";
export const COMMENT_REQUIRED = "Comment is required";
export const COMMENT_MIN_LENGTH = "Comment must be at least 5 characters long";
export const COMMENT_MAX_LENGTH = "Comment must be at most 400 characters long";
export const COMMENT_ADDED_SUCCESS = "Comment added successfully";
export const COMMENT_DELETED_SUCCESS = "Comment deleted successfully";
export const COMMENT_FETCHED_SUCCESS = "Comment fetched successfully";


//-------attachments module messages ------
export const ATTACHMENT_NOT_FOUND = "Attachment not found";
export const ATTACHMENT_FETCHED_SUCCESS = "Attachment fetched successfully";
export const ATTACHMENT_DELETED_SUCCESS = "Attachment deleted successfully";
export const ATTACHMENT_ADDED_SUCCESS = "Attachment added successfully";
export const FILE_NAME_INVALID = 'File Name Invalid';
export const FILE_MISSING = 'File Required';
export const FILE_TYPE_MISSING = 'File Type Required';
export const FILE_TYPE_INVALID = 'File Type Invalid';
export const FILE_VALIDATION_ERROR = 'File Details provided do not meet the required validation criteria';
export const FILE_ADDED_SUCCESS = 'File added successfully';    
export const FILE_DELETED_SUCCESS = 'File deleted successfully';
export const FILE_NOT_FOUND = 'File not found';
export const FILE_FETCHED_SUCCESS = 'File fetched successfully';



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
export const PROJ_CREAT_VALID_ERROR = 'Project creation details are invalid';
export const PROJ_UPD_VALID_ERROR = 'Project update details are invalid';
export const PROJ_TKT_FETCH_SUCCESS = 'Tickets fetched successfully';