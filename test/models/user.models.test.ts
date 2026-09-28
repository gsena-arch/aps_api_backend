import { describe, it, expect, beforeEach, afterAll } from "vitest";
import UserModel from "../../src/models/user.js";
import supabase from "../../src/config/database.js";

describe("UserModel", () => {
  const mockUser = {
    nome: "João Silva",
    email: "joao.teste@hostelix.com",
    senha: "senha123",
    telefone: "41999999999",
    tipo: "HOSPEDE",
    foto_url: "",
    data_nascimento: new Date("1995-01-15"),
  };

  beforeEach(async () => {
    const { error } = await supabase
      .from("usuario")
      .delete()
      .eq("email", mockUser.email);

    if (error) {
      throw error;
    }
  });

  afterAll(async () => {
    const { error } = await supabase
      .from("usuario")
      .delete()
      .eq("email", mockUser.email);

    if (error) {
      throw error;
    }
  });

  describe("create", () => {
    it("deve criar um usuário", async () => {
      const user = await UserModel.create(mockUser);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.nome).toBe(mockUser.nome);
      expect(user.email).toBe(mockUser.email);
      expect(user.tipo).toBe(mockUser.tipo);
    });
  });

  describe("findAll", () => {
    it("deve retornar uma lista de usuários", async () => {
      await UserModel.create(mockUser);

      const users = await UserModel.findAll();

      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe("findById", () => {
    it("deve encontrar um usuário pelo ID", async () => {
      const createdUser = await UserModel.create(mockUser);

      const user = await UserModel.findById(createdUser.id);

      expect(user).toBeDefined();
      expect(user?.id).toBe(createdUser.id);
      expect(user?.nome).toBe(mockUser.nome);
    });

    it("deve retornar null caso o usuário não exista", async () => {
      const user = await UserModel.findById(
        "00000000-0000-0000-0000-000000000000"
      );

      expect(user).toBeNull();
    });
  });

  describe("findKeyword", () => {
    it("deve encontrar usuário pelo nome", async () => {
      await UserModel.create(mockUser);

      const users = await UserModel.findKeyword("João");

      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
      expect(users[0].nome).toContain("João");
    });

    it("deve ignorar maiúsculas e minúsculas", async () => {
      await UserModel.create(mockUser);

      const users = await UserModel.findKeyword("JOÃO");

      expect(users.length).toBeGreaterThan(0);
    });

    it("deve retornar array vazio quando não encontrar", async () => {
      const users = await UserModel.findKeyword(
        "USUARIOQUE_NAO_EXISTE_123"
      );

      expect(users).toEqual([]);
    });
  });

  describe("update", () => {
    it("deve atualizar um usuário", async () => {
      const createdUser = await UserModel.create(mockUser);

      const updatedUser = await UserModel.update({
        id: createdUser.id,
        nome: "João Atualizado",
        email: mockUser.email,
        senha: "novaSenha123",
        telefone: "41988888888",
        tipo: "ANFITRIAO",
        foto_url: "",
        data_nascimento: new Date("1995-01-15"),
      });

      expect(updatedUser).toBeDefined();
      expect(updatedUser.nome).toBe("João Atualizado");
      expect(updatedUser.telefone).toBe("41988888888");
      expect(updatedUser.tipo).toBe("ANFITRIAO");
      expect(updatedUser.atualizado_em).toBeDefined();
    });
  });

  describe("del", () => {
    it("deve deletar um usuário", async () => {
      const createdUser = await UserModel.create(mockUser);

      const deletedUser = await UserModel.del(createdUser.id);

      expect(deletedUser).toBeDefined();
      expect(deletedUser?.id).toBe(createdUser.id);

      const user = await UserModel.findById(createdUser.id);

      expect(user).toBeNull();
    });

    it("deve retornar undefined se usuário não existir", async () => {
      const deletedUser = await UserModel.del(
        "00000000-0000-0000-0000-000000000000"
      );

      expect(deletedUser).toBeUndefined();
    });
  });
});