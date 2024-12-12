import { relations } from "drizzle-orm";
import { users } from "./users";
import { projects } from "./projects";
import { projectUsers } from "./projectUsers";
import { tickets } from "./tickets";
import { ticketAssignes } from "./ticketAssignes";

export const userRelations = relations(users, ({ many }) => ({
    projects: many(projects),
    project_users: many(projectUsers),
    tickets: many(tickets),
    ticket_assignes: many(ticketAssignes),
}))

export const projectRelations = relations(projects, ({ many }) => ({
    users: many(users),
    project_users: many(projectUsers),
    tickets: many(tickets),
}))

export const projectUserRelations = relations(projectUsers, ({ one }) => ({
    project: one(projects, {
        fields: [projectUsers.project_id],
        references: [projects.id],
    }),
    user: one(users, {
        fields: [projectUsers.user_id],
        references: [users.id],
    }),

}))

export const ticketRelations = relations(tickets, ({ one,many }) => ({
    project: one(projects, {
        fields: [tickets.project_id],
        references: [projects.id],
    }),
    users: one(users, {
        fields: [tickets.requested_by],
        references: [users.id],
    }),
    ticket_assignes: many(ticketAssignes),
}))

export const ticketAssignesRelations = relations(ticketAssignes, ({ one,many }) => ({
    user: one(users, {
        fields: [ticketAssignes.user_id],
        references: [users.id],
    }),
    ticket: one(tickets, {
        fields: [ticketAssignes.ticket_id],
        references: [tickets.id],
    })
}))