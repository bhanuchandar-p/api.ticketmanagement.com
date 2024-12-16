import { Context, MiddlewareHandler } from 'hono';
import BadRequestException from '../exceptions/badReqException';
import NotfoundException from '../exceptions/notFoundException';
import { SendSuccessMsg } from '../helpers/sendSuccessMsg';
import { validate } from '../validations/validate';
import { tickets, Ticket, NewTicket } from "../db/schemas/tickets";
import { COMMENT_ADDED_SUCCESS, COMMENT_DELETED_SUCCESS, COMMENT_FETCHED_SUCCESS, COMMENT_NOT_FOUND, FILE_ADDED_SUCCESS, FILE_DELETED_SUCCESS, FILE_FETCHED_SUCCESS, FILE_NOT_FOUND, FILE_VALIDATION_ERROR, TICKET_ASSIGNED_SUCCESS, TICKET_CREATED_SUCCESS, TICKET_DELETED_SUCCESS, TICKET_FETCHED_SUCCESS, TICKET_NOT_FOUND, TICKET_UPDATED_SUCCESS } from './../constants/appMessages';
import { ValidateTicketSchema } from '../validations/schema/vTicketSchema';
import { deleteRecordById, getMultipleRecordsByAColumnValue, getRecordById, saveSingleRecord, updateRecordById } from '../services/db/baseDbService';
import { ValidateUpdateTicket } from '../validations/schema/vUpdateTicket';
import { ticketAssignes, TicketAssignes } from '../db/schemas/ticketAssignes';
import { ValidateCommentsSchema } from '../validations/schema/vCommentsSchema';
import { Comment, comments } from '../db/schemas/comments';
import notFoundException from '../exceptions/notFoundException';
import { fetchPaginatedTickets } from '../services/db/ticketService';
import { ValidateDownloadFile, ValidateUploadFile } from '../validations/schema/vFileSchema';
import { fileNameHelper } from '../utils/appUtils';
import S3FileService from '../services/s3/s3DataServiceProvider';
import { JWTPayload } from '../types/dbtypes';
import { Attachment, attachments } from '../db/schemas/attachments';

const s3FileService = new S3FileService();
class TicketController {
    addFileToTicket(arg0: string, isAuthorized: MiddlewareHandler<any, string, {}>, addFileToTicket: any) {
        throw new Error("Method not implemented.");
    }
  // Add a new ticket
  addTicket = async (c:Context) => {
    try {
      const requested_body = await c.req.json();
      const userData: JWTPayload = c.get('user_payload');

      const validData = await validate<ValidateTicketSchema>('ticket: create-ticket', requested_body, "Ticket validation failed");

      const dbData = { ...validData, requested_by:userData.id } as NewTicket;
      const resTicket = await saveSingleRecord<Ticket>(tickets,dbData); //single row

      return SendSuccessMsg(c,201,TICKET_CREATED_SUCCESS, resTicket);
    } catch (err) {
      throw err;
    }
  }
  

  // Get a ticket by its ID
  getTicketById = async(c:Context) => {
    try {
      const ticketId = +c.req.param('id');
      if (!ticketId) {
        throw new BadRequestException("You entered an invalid id")
      }
      const ticket = await getRecordById<Ticket>(tickets, ticketId);
       if (!ticket) {
        throw new NotfoundException(TICKET_NOT_FOUND);
      }
      return SendSuccessMsg(c,  200, TICKET_FETCHED_SUCCESS, ticket);
    } catch (error) {
      throw error
    }
  } 

  //get all tickets

  getPaginatedTickets = async (c:Context) => {
    try {
      const page = +(c.req.query('cur_page')|| 1);
      const pageSize = +(c.req.query('page_size') || 10);
      const searchString = c.req.query('search_string') || '';
      const status = c.req.query('status')
      const priority = c.req.query('priority');
      const orderBy = c.req.query('order_by')

      const userData:JWTPayload = c.get('user_payload');

      const ticketsData = await fetchPaginatedTickets(tickets, page, pageSize, searchString, userData.id, orderBy, userData.user_type, status, priority);

      if (!ticketsData || ticketsData.records.length==0) {
        throw new NotfoundException(TICKET_NOT_FOUND);
      }

      return SendSuccessMsg(c,  200, TICKET_FETCHED_SUCCESS, ticketsData);
    } catch (error) {
      throw error
    }
  }

  

   // Update the ticket
   updateTicket = async (c:Context) => {
    try {
      const ticketId = +c.req.param('id'); 
      if (!(ticketId)) {
        throw new BadRequestException("You entered an invalid id")
      }
      const data= await getRecordById<Ticket>(tickets, ticketId);
      if (!data) {
        throw new NotfoundException(TICKET_NOT_FOUND);
      }
      const ticketData = await c.req.json(); 
      const validData = await validate<ValidateUpdateTicket>('ticket: update', ticketData, "Ticket update failed");
      const updatedTicket = await updateRecordById<Ticket>(tickets,ticketId, validData);
      if (updatedTicket === null) {
        throw new NotfoundException(TICKET_NOT_FOUND);
      }
      return SendSuccessMsg(c, 200,  TICKET_UPDATED_SUCCESS, updatedTicket);
    } catch (error) {
       throw error
    }
  }

  // Delete the ticket
  deleteTicket = async (c:Context) =>{
    try{
      const ticketId= +c.req.param('id');
      if (!ticketId) {
        throw new BadRequestException("You entered an invalid id")
      }
      const ticket = await getRecordById<Ticket>(tickets, ticketId);
      if (!ticket) {
        throw new NotfoundException(TICKET_NOT_FOUND);
      }
      await deleteRecordById<Ticket>(tickets,ticketId)
      return SendSuccessMsg(c,  200, TICKET_DELETED_SUCCESS, null);
    }catch (error) {
      throw error
    }
  }


//assign ticket
assignTicket = async (c:Context) => {
  try {
    console.log("hi")
      const ticketId = +c.req.param('id');
      const agentId = +c.req.param('agentId');
      console.log("agentId",agentId);

      if (!ticketId || !agentId) {
          throw new BadRequestException("You entered an invalid id")
      }
      const data= await getRecordById<Ticket>(tickets, ticketId);
      if (!data) {
          throw new NotfoundException(TICKET_NOT_FOUND);
      }
      const assignedTicket = await saveSingleRecord<TicketAssignes>(ticketAssignes,{ticket_id:ticketId,user_id:agentId});
      if (assignedTicket === null) {  
          throw new NotfoundException(TICKET_NOT_FOUND);
      }
      return SendSuccessMsg(c,  200, TICKET_ASSIGNED_SUCCESS,assignedTicket);

  } catch(err){
      throw err
  }

}

//add comment
addComment = async(c: Context) => {
  try {
    const comment = await c.req.json();
    const ticket_id = +c.req.param("id");

  const validData = await validate<ValidateCommentsSchema>( 'comment: create-comment', comment, "Comment validation failed");
    const {...commentData }= { comment:validData.comment,ticket_id:ticket_id ,user_id:1}; 
    const newComment = await saveSingleRecord<Comment>(comments,commentData);
   

    return SendSuccessMsg(c,  201, COMMENT_ADDED_SUCCESS,newComment);
  } catch (err) {
    throw err;
  }
}

//get comments
getComments = async(c: Context) => {
  try {
    const id = +c.req.param("id");
    
    const commentsData = await getMultipleRecordsByAColumnValue<Comment>(comments,'ticket_id',id);
    if (!commentsData) {
      throw new notFoundException(COMMENT_NOT_FOUND);
    }
    return SendSuccessMsg(c, 200, COMMENT_FETCHED_SUCCESS, commentsData);
    
  } catch (err) {
    throw err;
  }
}

//delete comment
deleteComment = async (c:Context) =>{
  try{
    const commentId= +c.req.param('commentId');
    if (!commentId) {
      throw new BadRequestException("You entered an invalid id")
    }
    const comment = await getRecordById<Comment>(comments, commentId);
    if (!comment) {
      throw new NotfoundException(COMMENT_NOT_FOUND);
    }
    await deleteRecordById<Comment>(comments,commentId)
    return SendSuccessMsg(c,  200, COMMENT_DELETED_SUCCESS, null);
  }catch (error) {
    throw error
  }
}

//upload attachment url
getUploadURL = async (c: Context) => {

  try {
    const reqData = await c.req.json();

    let responseData;

    const validatedReq = await validate<ValidateUploadFile>('file: upload', reqData, FILE_VALIDATION_ERROR);

    let fileKey = fileNameHelper(validatedReq.file_name);

    responseData = await s3FileService.generateUploadPresignedUrl(fileKey, validatedReq.file_type);

    return SendSuccessMsg(c, 200, "Upload URL generated successfully", responseData);

  } catch (error) {
    throw error;
  }
};


//download attachment url
getDownloadURL = async (c: Context) => {
  try {
    const reqData = await c.req.json();
    if (!reqData) {
      throw new BadRequestException('Invalid request body');
    }
    console.log(reqData);
    

    const validatedReq = await validate<ValidateDownloadFile>('file: download', reqData, FILE_VALIDATION_ERROR);
    console.log(validatedReq.file_key);
    const responseData = await s3FileService.generateDownloadPresignedUrl(validatedReq.file_key);

    return SendSuccessMsg(c, 200, "Download URL generated successfully", responseData);

  } catch (error) {
    throw error;
  }
};


//add
addAttachmentToTicket = async (c: Context) => {
  try {
    const reqData = await c.req.json();
    const ticketId = +c.req.param('id');

    if (!ticketId) {
      throw new BadRequestException("You entered an invalid id")
    }

    const validatedReq = await validate<ValidateUploadFile>('file: upload', reqData, FILE_VALIDATION_ERROR);

    const fileKey = fileNameHelper(validatedReq.file_name);

    const {...metaData} = {file_size:validatedReq.file_size,file_name:validatedReq.file_name,file_type:validatedReq.file_type};

    const fileData = await saveSingleRecord<Attachment>(attachments,{file_key:fileKey,ticket_id:ticketId,meta_data:metaData});

    return SendSuccessMsg(c, 200, FILE_ADDED_SUCCESS);
  } catch (error) {
    throw error;
  }   
}

//delete file from ticket
deleteTicketAttachmentById = async (c: Context) => {
  try {
   
    const attachmentId = +c.req.param('attachmentId');
    if (!attachmentId) {
      throw new BadRequestException("You entered an invalid id")
    }
    const attachment = await deleteRecordById<Attachment>(attachments,attachmentId);
    if (!attachment) {
      throw new NotfoundException(FILE_NOT_FOUND);
    }  
     
    return SendSuccessMsg(c, 200, FILE_DELETED_SUCCESS);
  } catch (error) {
    throw error;
  }
}

//get files from ticket
getAttachmentsByTicketId = async (c: Context) => {
  try {
    const ticketId = +c.req.param('id');
    if (!ticketId) {
      throw new BadRequestException("You entered an invalid id")
    }
    const files = await getMultipleRecordsByAColumnValue<Attachment>(attachments,'ticket_id',ticketId);
    if  (!files) {
      throw new NotfoundException(FILE_NOT_FOUND);
    }
    return SendSuccessMsg(c, 200, FILE_FETCHED_SUCCESS, files);
  } catch (error) {
    throw error;
  } 
}



}
export default TicketController