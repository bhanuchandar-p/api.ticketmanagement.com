import { randBetweenDate, randEmail, randFirstName, randLastName, randPassword, randPhoneNumber, randRecentDate, randText } from "@ngneat/falso"
import { Context } from "hono"
import { db } from "../db/dbConnection"
import { users } from "../db/schemas/users"
import bcrypt from 'bcrypt'
import { tickets } from "../db/schemas/tickets"
import { ticketAssignes } from "../db/schemas/ticketAssignes"
import { projectUsers } from "../db/schemas/projectUsers"

const pwd_for_user = bcrypt.hash('User1234',10)
const pwd = '$2a$10$2ghf94cr2gk1IRBOMZSa1ej9d6TMzgIA62WsNjNbE4quOcjZl9vNO'
const pwd_for_developer = '$2a$10$soqWy5AAKgLIdSKrgV0Lmu.Uzg7ZB/cygeTDzxFmQfYIqCgKJ5OkW'
export const seedUsers = async (c:Context) => {
    try{
        const empty:any = []
        for (let i = 0; i < 20; i++) {
            empty.push({
                first_name: randFirstName({ withAccents: false }),
                last_name:randLastName({ withAccents: false }),
                email: randEmail({provider: 'actanos',suffix: 'com'}),
                password: pwd_for_developer,
                phone_number: randPhoneNumber({ countryCode: 'IN' }),
                user_type: 'developer',
                created_at:randBetweenDate({ from: new Date('06/01/2023'), to: new Date('11/01/2023') }),
                updated_at:randRecentDate({days:20})
            })
        }
        await db.insert(users).values(empty)
        return c.json({
            success:true,
            message:"Data seeded successfully"
        })
    }
    catch(err){
        throw err
    }
}

export const seedTickets = async (c: Context) => {
    try {
      const TOTAL_TICKETS = 100000; 
      const BATCH_SIZE = 5000; 

      const statusOptions = ["open", "closed", "inprogress"];
      const priorityOptions = ["low", "medium", "high"];
      const randNumber = (min: number, max:number) => {
        return Math.round(Math.random() * (max - min)) + min;
      }
  
      for (let batch = 0; batch < TOTAL_TICKETS / BATCH_SIZE; batch++) {
        const empty: any = [];
  
        for (let i = 0; i < BATCH_SIZE; i++) {
          const randomUserId = randNumber(4,100)// Generate random user ID
          const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)]; // Random status
          const randomPriority = priorityOptions[Math.floor(Math.random() * priorityOptions.length)]; // Random priority
  
          empty.push({
            title: randText(),
            description: randText(),
            status: randomStatus, 
            priority: randomPriority, 
            requested_by: randomUserId,
            project_id: randNumber(1,6),
            created_at: randBetweenDate({ from: new Date('01/01/2024'), to: new Date('05/01/2024') }),
            updated_at: randRecentDate({days:20})
          });
        }
  
        // Insert batch
        await db.insert(tickets).values(empty);
      }
      return c.json({ success: true, message: 'Data Seeded successfully'});
    } catch (e) {
          throw e;
    }
  };

export const seedProjectMembers = async(c:Context) => {
    try{
        const empty:any = []
        const randNumber = (min: number, max:number) => {
            return Math.round(Math.random() * (max - min)) + min;
        }
        for (let i = 0; i < 100; i++) {
            empty.push({
                user_id: randNumber(104,120),
                project_id: randNumber(1,6),
                created_at:randBetweenDate({ from: new Date('01/01/2024'), to: new Date('03/01/2024') }),
                updated_at:randRecentDate({days:20})
            })
        }
        await db.insert(projectUsers).values(empty)
        return c.json({
            success:true,
            message:"Data seeded successfully"
        })
    }
    catch(err){
        throw err
    }
}

export const seedTicketAssignees = async(c:Context) => {
    try{
        const empty:any = []
        const randNumber = (min: number, max:number) => {
            return Math.round(Math.random() * (max - min)) + min;
        }
        for (let i = 0; i < 100; i++) {
            empty.push({
                ticket_id: randNumber(1,100000),
                user_id: randNumber(104,120),
                created_at:randBetweenDate({ from: new Date('01/01/2024'), to: new Date('03/01/2024') }),
                updated_at:randRecentDate({days:20})
            })
        }
        await db.insert(ticketAssignes).values(empty)
        return c.json({
            success:true,
            message:"Data seeded successfully"
        })
    } catch(err){
        throw err
    }

}