import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import HospedagemModel from "../../src/models/hospedagem.js";
import UserModel from "../../src/models/user.js";
import supabase from "../../src/config/database.js";

describe("HospedagemModel", () => {
  const suffix = randomUUID();
  const testTitle = `Hospedagem teste ${suffix}`;
  const testCity = `Cidade teste ${suffix}`;
  let anfitriaoId = "";

  const testHospedagem = () => ({
    anfitriao_id: anfitriaoId,
    titulo: testTitle,
    descricao: "Hospedagem criada pelos testes automatizados",
    tipo: "casa",
    preco_diaria: 275,
    capacidade: 4,
    quartos: 2,
    camas: 2,
    banheiros: 1,
    cidade: testCity,
    estado: "PR",
    status: "ATIVA",
  });

  beforeAll(async () => {
    const anfitriao = await UserModel.create({
      nome: `Anfitriao teste ${suffix}`,
      email: `anfitriao-${suffix}@example.test`,
      senha: "senha-teste",
      tipo: "ANFITRIÃO",
    });

    anfitriaoId = anfitriao.id;
  });

  beforeEach(async () => {
    const { error } = await supabase
      .from("hospedagem")
      .delete()
      .eq("anfitriao_id", anfitriaoId)
      .eq("titulo", testTitle);

    if (error) throw error;
  });

  afterAll(async () => {
    if (!anfitriaoId) return;

    const { error } = await supabase
      .from("hospedagem")
      .delete()
      .eq("anfitriao_id", anfitriaoId);

    if (error) throw error;
    await UserModel.del(anfitriaoId);
  });

  it("cria hospedagem para anfitrião com tipo acentuado", async () => {
    const hospedagem = await HospedagemModel.create(testHospedagem());

    expect(hospedagem.id).toBeDefined();
    expect(hospedagem.anfitriao_id).toBe(anfitriaoId);
    expect(hospedagem.tipo).toBe("CASA");
  });

  it("lista a hospedagem criada", async () => {
    const created = await HospedagemModel.create(testHospedagem());

    const hospedagens = await HospedagemModel.findAll();

    expect(hospedagens.some((item) => item.id === created.id)).toBe(true);
  });

  it("busca hospedagem pelo ID", async () => {
    const created = await HospedagemModel.create(testHospedagem());

    const hospedagem = await HospedagemModel.findById(created.id);

    expect(hospedagem.id).toBe(created.id);
    expect(hospedagem.titulo).toBe(testTitle);
  });

  it("busca hospedagem por cidade sem diferenciar maiúsculas", async () => {
    const created = await HospedagemModel.create(testHospedagem());

    const hospedagens = await HospedagemModel.findKeyword(testCity.toLowerCase());

    expect(hospedagens.some((item) => item.id === created.id)).toBe(true);
  });

  it("atualiza hospedagem", async () => {
    const created = await HospedagemModel.create(testHospedagem());

    const updated = await HospedagemModel.update({
      ...testHospedagem(),
      id: created.id,
      titulo: `${testTitle} atualizada`,
      preco_diaria: 300,
    });

    expect(updated.titulo).toBe(`${testTitle} atualizada`);
    expect(Number(updated.preco_diaria)).toBe(300);
    expect(updated.atualizado_em).toBeDefined();
  });

  it("remove hospedagem e retorna undefined quando já não existe", async () => {
    const created = await HospedagemModel.create(testHospedagem());

    const deleted = await HospedagemModel.del(created.id);
    const deletedAgain = await HospedagemModel.del(created.id);

    expect(deleted?.id).toBe(created.id);
    expect(deletedAgain).toBeUndefined();
  });

  it("rejeita usuário que não existe como anfitrião", async () => {
    await expect(
      HospedagemModel.create({
        ...testHospedagem(),
        anfitriao_id: "00000000-0000-0000-0000-000000000000",
      }),
    ).rejects.toThrow("O usuário informado não é um anfitrião válido");
  });
});