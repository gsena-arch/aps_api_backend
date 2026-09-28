// import { Pool } from "pg";
// import { env } from "./environment.js";

// export const database = new Pool({
//   connectionString: env.databaseUrl,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

import { createClient } from "@supabase/supabase-js";
import { env } from "./environment.js";

if (!env.supabaseUrl || !env.supabaseSecretKey) {
  throw new Error("Variáveis do Supabase não configuradas");
}

const supabase = createClient(
  env.supabaseUrl,
  env.supabaseSecretKey
);

export default supabase;