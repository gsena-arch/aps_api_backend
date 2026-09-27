import { env } from "./config/environment.js";
import app from "./app.js";

app.listen(env.port, () => {
    console.log(`Servidor rodando na porta http://localhost:${env.port}`);
});