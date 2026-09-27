import { database } from "../config/database.js";

interface CreateUser {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  tipo: string;
  foto_url?: string;
  data_nascimento?: Date;
}

interface UpdateUser {
  id: string;
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  tipo: string;
  foto_url?: string;
  data_nascimento?: Date;
}

async function findAll() {
  const result = await database.query("SELECT * FROM usuario");

  return result.rows;
}

async function findById(id: string) {
  const result = await database.query("SELECT * FROM usuario WHERE id = $1", [
    id,
  ]);

  return result.rows[0] ?? null;
}

async function findKeyword(name: string) {
  const result = await database.query(
    "SELECT * FROM usuario WHERE nome ILIKE $1",
    [`%${name}%`],
  );
  return result.rows;
}

async function create(user: CreateUser) {
  const result = await database.query(
    `INSERT INTO usuario
            ( nome, email, senha, telefone, tipo, foto_url, data_nascimento)
         VALUES
            ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
    [
      user.nome,
      user.email,
      user.senha,
      user.telefone,
      user.tipo,
      user.foto_url,
      user.data_nascimento,
    ],
  );

  return result.rows[0];
}

async function update(user: UpdateUser) {
  const data = new Date();

  const result = await database.query(
    `UPDATE usuario SET 
            nome = $1,
            email = $2,
            senha = $3,
            telefone = $4,
            tipo = $5,
            foto_url = $6,
            data_nascimento = $7,
            updated_at  = $8
        WHERE id = $9 RETURNING *`,
    [
      user.nome,
      user.email,
      user.senha,
      user.telefone,
      user.tipo.toUpperCase(),
      user.foto_url,
      user.data_nascimento,
      data,
      user.id,
    ],
  );

  return result.rows[0];
}

async function del(id: string) {
  const result = await database.query(
    `DELETE FROM usuario
         WHERE id = $1
         RETURNING *`,
    [id],
  );

  return result.rows[0];
}

export default {
  findAll,
  findById,
  findKeyword,
  create,
  update,
  del,
};
