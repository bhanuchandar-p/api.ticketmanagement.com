import { Context } from 'hono';
import BadRequestException from '../exceptions/badReqException';
import NotfoundException from '../exceptions/notFoundException';
import { SendSuccessMsg } from '../helpers/sendSuccessMsg';
import { validate } from '../validations/validate';
import { tickets, Ticket, NewTicket } from "./../db/schemas/tickets"
import { TICKET_CREATED_SUCCESS, TICKET_DELETED_SUCCESS, TICKET_FETCHED_SUCCESS, TICKET_NOT_FOUND, TICKET_UPDATED_SUCCESS, TICKETS_FETCHED_SUCCESS } from './../constants/appMessages';
import { ValidateTicketSchema } from '../validations/schema/vTicketSchema';
import { deleteRecordById, getRecordById, saveSingleRecord, updateRecordById } from '../services/db/baseDbService';
import { ValidateUpdateTicket } from '../validations/schema/vUpdateTicket';


class TicketController {
    

  // Add a new ticket
  addTicket = async (c:Context) => {
    try {
      const requested_body = await c.req.json();

    //   const requested_by = c.get('user').id as number;
      const validData = await validate<ValidateTicketSchema>('ticket: create-ticket', requested_body, "Ticket validation failed");

      const dbData = { ...validData, requested_by: 1 } as NewTicket;
      const resTicket = await saveSingleRecord<Ticket>(tickets,dbData);//single row

      return SendSuccessMsg(c,201,TICKET_CREATED_SUCCESS, resTicket);
    } catch (err) {
      throw err;
    }
  }

    // Get all tickets with filters and pagination
//     filterAllTickets= async (c:Context) => {
//       try {
//           const page = +(c.req.query('page')||1);
//           const limit = +(c.req.query('limit')||10);
//           const offset = (page - 1) * limit; //it tells about the starting point of the data 
          
//           const query = c.req.query() as unknown as TicketQuery; 
//           const filterQuery = await filtersToApply(query);

//           const userType = c.get('user').user_type;
//           const userId =c.get('user').id

//           const filteredData = await filterBasedOnUserType(userId,userType,offset,limit,filterQuery);
//           const metadata = await metaData(tickets,page,limit)
//           if (!filteredData || filteredData.length==0) {
//             throw new NotfoundException(PAGE_NOT_EXIST);
//           }
//           return SendSuccessMsg(c, TICKETS_FETCHED_SUCCESS, 200, filteredData,metadata);
//       } catch (error) {
//           throw error
//       }
//   };
  

  // Get a ticket by its ID
  getTicketById = async(c:Context) => {
    try {
      const ticketId = +c.req.param('id');
      if (!(ticketId)) {
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


   // Update the ticket
   updateTicket = async (c:Context) => {
    try {
      const ticketId = +c.req.param('id'); 
      if (!(ticketId)) {
        throw new BadRequestException("You entered an invalid id")
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
      await deleteRecordById<Ticket>(tickets,ticketId)
      return SendSuccessMsg(c,  200, TICKET_DELETED_SUCCESS, null);
    }catch (error) {
      throw error
    }
  }
}

export default TicketController