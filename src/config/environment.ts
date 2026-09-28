import dotenv from "dotenv";

dotenv.config({
  path: "./src/config/.env",
});

export const env = {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,
};