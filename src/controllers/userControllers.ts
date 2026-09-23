import type { Request, Response } from "express";
import type { User } from "../models/user.js";
import { randomUUID } from "node:crypto";

const users: User[] = [
    
    {
        id: "1",
        name: "Gabriel",
        email: "gabriel@email.com"
    },
    {
        id: randomUUID(),
        name: "João",
        email: "joao@email.com"
    }
];

export function getUsers(req:Request, res:Response) {
    return res.status(200).json(users);
}

export function getUsersId(req:Request, res:Response) {
    return res.status(200).json(users.find(item => item.id === req.params.id));
}

export function getUsersKeyword(req:Request, res:Response) {
    const { keyword } = req.params;

    if (typeof keyword !== "string") {
        return res.status(400).json({ message: "Keyword is required" });
    }

    return res.status(200).json(users.filter(item => item.name.toLowerCase() === keyword.toLowerCase()));
}

export function postUsers(req:Request, res:Response) {
    
    const newUser: User = {
        id: randomUUID(),
        name: req.body.name,
        email: req.body.email
    };

    users.push(newUser);

    return res.status(201).json(newUser);
}

export function delUsers(req:Request, res:Response) {
    const index = users.findIndex(item => item.id === req.params.id);
    const aux = users[index];
    users.splice(index, 1);
    return res.status(200).json(aux);
}

export function putUsers(req:Request, res:Response) {
    const aux = users.findIndex(item => item.id === req.params.id);
    const user = users[aux];

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    users[aux] = {
        ...user,
        name: req.body.name ? req.body.name : user.name,
        email: req.body.email ? req.body.email : user.email
    }

    return res.status(200).json(users[aux]);
}