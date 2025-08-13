import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core";

export const MockInterview = pgTable("mockInterview", {
  id: serial("id").primaryKey(),
  jsonMockResp: text("jsonMockResp").notNull(),
  jobPosition: varchar("jobPosition", { length: 2000 }).notNull(),
  jobDescription: varchar("jobDescription", { length: 2000 }).notNull(), 
  jobExperience: varchar("jobExperience", { length: 2000 }).notNull(),
  createdBy: varchar("createdBy", { length: 2000 }).notNull(),
  createdAt: varchar("createdAt", { length: 2000 }),
  mockId: varchar("mockId", { length: 2000 }).notNull(),
  selectedDifficulty: varchar("selectedDifficulty", { length: 2000 }).notNull(),

})

export const UserAnswer=pgTable('userAnswer',{
  id: serial("id").primaryKey(),
  mockIdRef:varchar('mockId', { length: 2000 }).notNull(),
  question:varchar('question').notNull(),
  correctAns:text('correctAns'),
  userAns:text('userAns'),
  feedback:text('feedback'),
  rating:varchar('rating'),
  userEmail:varchar('userEmail'),
  createdAt: varchar("createdAt", { length: 2000 }),
  strength:varchar('strength')
})
