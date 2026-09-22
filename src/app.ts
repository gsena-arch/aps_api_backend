import express from 'express';

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Bem Vindo ao Sistema",
        version: "1.0.0",
    });
});

export default app;