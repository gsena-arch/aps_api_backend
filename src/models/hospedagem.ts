import { randomUUID } from "node:crypto";
import supabase from "../config/database.js";
import user from "./user.js";

interface HospedagemCreate {
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
}

interface HospedagemUpdate extends HospedagemCreate {
  id: string;
}

async function findAll() {
  const { data, error } = await supabase.from("hospedagem").select("*");
  if (error) throw error;
  return data;
}
async function findById(id: string) {
  const { data, error } = await supabase
    .from("hospedagem")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}
async function findKeyword(name: string) {
  const { data, error } = await supabase
    .from("hospedagem")
    .select("*")
    .ilike("cidade", `%${name}%`);
  if (error) throw error;
  return data;
}
async function create(hosp: HospedagemCreate) {
  const anfitriao = await user.findById(hosp.anfitriao_id);
  const tipoAnfitriao = anfitriao?.tipo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
  if (!anfitriao || tipoAnfitriao !== "ANFITRIAO") {
    throw new Error("O usuário informado não é um anfitrião válido");
  }

  const { data, error } = await supabase
    .from("hospedagem")
    .insert({
      ...hosp,
      id: randomUUID(),
      tipo: hosp.tipo?.toUpperCase(),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
async function update(hosp: HospedagemUpdate) {
  const { data, error } = await supabase
    .from("hospedagem")
    .update({
      ...hosp,
      tipo: hosp.tipo?.toUpperCase(),
      atualizado_em: new Date().toISOString(),
    })
    .eq("id", hosp.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
async function del(id: string) {
  const { data, error } = await supabase
    .from("hospedagem")
    .delete()
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data ?? undefined;
}

export default {
  findAll,
  findById,
  findKeyword,
  create,
  update,
  del,
};
