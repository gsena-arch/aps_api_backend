import supabase from '../config/database.js';

interface CreateUser {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  tipo: string;
  foto_url?: string;
  data_nascimento?: Date;
}

interface UpdateUser extends CreateUser {
  id: string;
}

async function findAll() {
  const { data, error } = await supabase
    .from('usuario')
    .select('*');

  if (error) throw error;
  return data || [];
}

async function findById(id: string) {
  const { data, error } = await supabase
    .from('usuario')
    .select('*')
    .eq('id', id)
    .single();

  if (error?.code === 'PGRST116') return null;
  if (error) throw error;
  return data;
}

async function findKeyword(name: string) {
  const { data, error } = await supabase
    .from('usuario')
    .select('*')
    .ilike('nome', `%${name}%`);

  if (error) throw error;
  return data || [];
}

async function create(user: CreateUser) {
  const { data, error } = await supabase
    .from('usuario')
    .insert([
      {
        nome: user.nome,
        email: user.email,
        senha: user.senha,
        telefone: user.telefone || null,
        tipo: user.tipo.toUpperCase(),
        foto_url: user.foto_url || null,
        data_nascimento: user.data_nascimento || null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function update(user: UpdateUser) {
  const { data, error } = await supabase
    .from('usuario')
    .update({
      ...user,
      tipo: user.tipo?.toUpperCase(),
      atualizado_em: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function del(id: string) {
  const { data, error } = await supabase
    .from('usuario')
    .delete()
    .eq('id', id)
    .select()
    .maybeSingle()
    ;

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
