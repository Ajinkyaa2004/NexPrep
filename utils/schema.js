import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core";

export const MockInterview = pgTable("mockInterview", {
  id: serial("id").primaryKey(),
  jsonMockResp: text("jsonMockResp").notNull(), 
  jobPosition: varchar("jobPosition", { length: 500 }).notNull(), 
  jobDescription: text("jobDescription").notNull(), 
  jobExperience: varchar("jobExperience", { length: 100 }).notNull(), 
  createdBy: varchar("createdBy", { length: 320 }).notNull(), 
  createdAt: varchar("createdAt", { length: 50 }), 
  mockId: varchar("mockId", { length: 100 }).notNull(),
  selectedDuration: varchar("selectedDuration", { length: 20 }).notNull(),
  selectedDifficulty: varchar("selectedDifficulty", { length: 50 }).notNull(),
});


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
