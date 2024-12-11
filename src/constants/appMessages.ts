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

export const EMAIL_REQ = 'Email is required';
export const EMAIL_INVALID = 'Email is invalid';
export const EMAIL_MAX_LENGTH = 'Email must be less than 30 characters';

export const PASSWORD_REQ = 'Password is required';
export const PASSWORD_INVALID = 'Password is invalid';
export const PASSWORD_MIN_LENGTH = 'Password must be at least 8 characters';
export const PASSWORD_MAX_LENGTH = 'Password must be less than 30 characters';
export const PASSWORD_NOT_MATCH = 'Password does not match';
export const PASSWORD_REQ_LOWERCASE = 'Password must contain at least one lowercase letter';
export const PASSWORD_REQ_UPPERCASE = 'Password must contain at least one uppercase letter';
export const PASSWORD_REQ_NUMBER = 'Password must contain at least one number';
export const PASSWORD_MISMATCH = 'Passwords does not match';
export const PASSWORD_RESET_SUCCESS = 'Password reset successful';

export const PHONE_INVALID = 'Phone number is invalid';
export const PHONE_MIN_LENGTH = 'Phone number must be at least 10 characters';
export const PHONE_MAX_LENGTH = 'Phone number must be less than 15 characters';

export const SIGNUP_VALID_ERROR = 'Signup details are invalid';
export const LOGIN_VALID_ERROR = 'Login details are invalid';
export const FORGOT_VALID_ERROR = 'Forgot password details are invalid';
export const RESET_VALID_ERROR = 'Reset password details are invalid';

export const USER_NOT_FOUND = 'User not found';
export const USER_ALREADY_EXISTS = 'User already exists';

export const INVALID_TOKEN = 'Invalid token';
export const INVALID_REFRESH_TOKEN = 'Invalid refresh token';
export const TOKEN_EXPIRED = 'Token has been expired';
export const TOKEN_N_FOND = 'Token not found';

export const FORGOT_EMAIL_SENT = 'Forgot password email link has been sent successfully';
export const LOGIN_SUCCESS = 'User login successful';
export const SIGNUP_SUCCESS = 'User created successfully';


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

