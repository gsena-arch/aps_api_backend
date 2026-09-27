import type { Request, Response } from "express";
import UserModel from "../models/user.js";

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await UserModel.findAll();

    if (!users) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar usuários",
    });
  }
}

export async function getUsersKeyword(req: Request, res: Response) {
  const { keyword } = req.params;

  if (typeof keyword !== "string") {
    return res.status(400).json({
      message: "Keyword inválida",
    });
  }

  try {
    const users = await UserModel.findKeyword(keyword);
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar usuário",
    });
  }
}

export async function getUsersId(req: Request, res: Response) {
  const { id } = req.params;

  if (typeof id !== "string") {
    return res.status(400).json({
      message: "Id inválido",
    });
  }

  try {
    const users = await UserModel.findById(id);

    if (!users) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar usuário",
    });
  }
}

export async function postUser(req: Request, res: Response) {
  const userObj = {
    nome: req.body.nome,
    email: req.body.email,
    senha: req.body.senha,
    telefone: req.body.telefone,
    tipo: req.body.tipo,
    foto_url: req.body.foto_url,
    data_nascimento: req.body.data_nascimento,
  };

  try {
    const user = await UserModel.create(userObj);

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao criar usuário",
    });
  }
}

export async function putUser(req: Request, res: Response) {
  const userObj = {
    id: req.body.id,
    nome: req.body.nome,
    email: req.body.email,
    senha: req.body.senha,
    telefone: req.body.telefone,
    tipo: req.body.tipo,
    foto_url: req.body.foto_url,
    data_nascimento: req.body.data_nascimento,
  };
  try {
    const user = await UserModel.update(userObj);

    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao atualizar o usuário",
    });
  }
}

export async function delUser(req: Request, res: Response) {
  const { id } = req.params;

  if (typeof id !== "string") {
    return res.status(400).json({
      message: "Id inválido",
    });
  }

  try {
    const user = await UserModel.del(id);

    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    return res.status(200).json({
      message: "Usuário removido!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao remover o usuário",
    });
  }
}
