import type { Request, Response } from "express";
import hospedagem from "../models/hospedagem.js";

export async function getHosp(req: Request, res: Response) {
  try {
    const hosp = await hospedagem.findAll();
    if (!hosp)
      return res.status(404).json({
        message: "Não à hospedagens",
      });
    return res.status(200).json(hosp);
  } catch {
    return res.status(500).json({
      message: "Erro ao buscar hospedagem",
    });
  }
}
export async function getHospById(req: Request, res: Response) {
  const { id } = req.params;
  if (typeof id !== "string") {
    return res.status(404).json({
      message: "Id invalido",
    });
  }
  try {
    const hosp = await hospedagem.findById(id);
    return res.status(200).json(hosp);
  } catch {
    return res.status(500).json({
      message: "Erro ao buscar hospedagem",
    });
  }
}
export async function getHospByKeyword(req: Request, res: Response) {
  const { keyword } = req.params;
  if (typeof keyword !== "string") {
    return res.status(404).json({
      message: "Cidade invalido",
    });
  }
  try {
    const hosp = await hospedagem.findKeyword(keyword);
    return res.status(200).json(hosp);
  } catch {
    return res.status(500).json({
      message: "Erro ao buscar hospedagem",
    });
  }
}
export async function putHosp(req: Request, res: Response) {
  const { id } = req.params;
  if (typeof id !== "string") {
    return res.status(404).json({
      message: "Nome invalido",
    });
  }
  const hospObj = {
    id,
    anfitriao_id: req.body.anfitriao_id,
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    tipo: req.body.tipo,
    preco_diaria: req.body.preco_diaria,
    capacidade: req.body.capacidade,
    quartos: req.body.quartos,
    camas: req.body.camas,
    banheiros: req.body.banheiros,
    cep: req.body.cep,
    logradouro: req.body.logradouro,
    numero: req.body.numero,
    complemento: req.body.complemento,
    bairro: req.body.bairro,
    cidade: req.body.cidade,
    estado: req.body.estado,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    status: req.body.status,
  };
  try {
    const hosp = await hospedagem.update(hospObj);
    return res.status(200).json(hosp);
  } catch {
    return res.status(500).json({
      message: "Erro ao atualizar hospedagem",
    });
  }
}
export async function postHosp(req: Request, res: Response) {
  const hospObj: {
    anfitriao_id: string;
    titulo: string;
    descricao?: string;
    tipo?: string;
    preco_diaria?: number;
    capacidade?: number;
    quartos?: number;
    camas?: number;
    banheiros?: number;
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    latitude?: number;
    longitude?: number;
    status?: string;
  } = req.body;
  try {
    const hosp = await hospedagem.create(hospObj);
    return res.status(201).json(hosp);
  } catch {
    return res.status(500).json({
      message: "Erro ao criar hospedagem",
    });
  }
}
export async function delHosp(req: Request, res: Response) {
  const { id } = req.params;
  if (typeof id !== "string") {
    return res.status(404).json({
      message: "id invalido",
    });
  }
  try {
    const hosp = await hospedagem.del(id);
    if (!hosp) {
      return res.status(404).json({
        message: "Hospedagem não encontrada",
      });
    }
    return res.status(200).json({
      message: "Hospedagem removida!",
    });
  } catch {
    return res.status(500).json({
      message: "Erro ao remover hospedagem",
    });
  }
}
