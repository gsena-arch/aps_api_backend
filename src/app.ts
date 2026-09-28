import express from "express";
import userRoutes from "./routes/userRoutes.js";
import hospRoutes from "./routes/hospRoutes.js";

const app = express();

app.use(express.json());


app.use("/users", userRoutes);
app.use("/hospedagem", hospRoutes);
app.use("/", (req, res) => {
    res.status(200).json({
        message: "Bem vindo ao Hostlix",
        version: "1.0.0"
    });
});

export default app;
