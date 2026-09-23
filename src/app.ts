import express from "express";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(express.json());

app.use("/", (req, res) => {
    res.status(200).json({
        message: "Bem vindo ao Sistema",
        version: "1.0.0"
    });
});

app.use("/users", userRoutes);

export default app;