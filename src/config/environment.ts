import dotenv from "dotenv";

dotenv.config({
  path: "./src/config/.env",
});

export const env = {
  port: Number(process.env.PORT) || 3000,

  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
};
