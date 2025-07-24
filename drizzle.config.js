/** @type {import('drizzle-kit').Config} */
export default {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
  url: 'postgresql://neondb_owner:npg_CONQmvA18VDR@ep-divine-wind-a11p34s5-pooler.ap-southeast-1.aws.neon.tech/nexprep-ai-database?sslmode=require',
  }
};
