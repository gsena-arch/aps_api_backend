import { Pool } from "pg";
import { env } from "./environment.js";

export const database = new Pool({
    host: env.database.host,
    port: env.database.port,
    user: env.database.user,
    password: env.database.password,
    database: env.database.database
});

database.query("SELECT NOW()")
    .then(() => {
        console.log("PostgreSQL conectado com sucesso!");
    })
    .catch((error) => {
        console.error("Erro ao conectar ao PostgreSQL:");
        console.error(error);
    });