import { describe, it, expect, beforeAll, vi } from "vitest";
import type { Request, Response } from "express";

import {
  getUsers,
  getUsersKeyword,
  getUsersId,
  postUser,
  putUser,
  delUser,
} from "../../src/controllers/userControllers.js";

import UserModel from "../../src/models/user.js";

vi.mock("../../src/models/user.js");

describe("User Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJsonFn: any;
  let mockStatusFn: any;

  beforeAll(() => {
    mockJsonFn = vi.fn().mockReturnValue(undefined);
    mockStatusFn = vi.fn().mockReturnValue({ json: mockJsonFn });

    mockResponse = {
      status: mockStatusFn,
    };
  });

  describe("getUsers", () => {
    it("deve retornar lista de usuários com status 200", async () => {
      const mockUsers = [
        {
          id: "123",
          nome: "João Silva",
          email: "joao@example.com",
          tipo: "CLIENTE",
        },
      ];

      vi.mocked(UserModel.findAll).mockResolvedValue(mockUsers);
      mockRequest = {};

      await getUsers(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockJsonFn).toHaveBeenCalledWith(mockUsers);
    });

    it("deve retornar erro 500 se falhar", async () => {
      vi.mocked(UserModel.findAll).mockRejectedValue(
        new Error("Database error"),
      );
      mockRequest = {};

      await getUsers(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(500);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: "Erro ao buscar usuários",
      });
    });
  });

  describe("getUsersKeyword", () => {
    it("deve buscar usuários por keyword com status 200", async () => {
      const mockUsers = [
        {
          id: "123",
          nome: "João Silva",
          email: "joao@example.com",
        },
      ];

      vi.mocked(UserModel.findKeyword).mockResolvedValue(mockUsers);
      mockRequest = {
        params: { keyword: "João" },
      };

      await getUsersKeyword(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockJsonFn).toHaveBeenCalledWith(mockUsers);
    });

    it("deve retornar 400 se keyword for inválida", async () => {
      mockRequest = {
        params: { keyword: 123 as unknown as string },
      };

      await getUsersKeyword(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: "Keyword inválida",
      });
    });

    it("deve retornar erro 500 se falhar", async () => {
      vi.mocked(UserModel.findKeyword).mockRejectedValue(
        new Error("Database error"),
      );
      mockRequest = {
        params: { keyword: "João" },
      };

      await getUsersKeyword(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(500);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: "Erro ao buscar usuário",
      });
    });
  });

  describe("getUsersId", () => {
    it("deve retornar usuário por ID com status 200", async () => {
      const mockUser = {
        id: "123",
        nome: "João Silva",
        email: "joao@example.com",
      };

      vi.mocked(UserModel.findById).mockResolvedValue(mockUser);
      mockRequest = {
        params: { id: "123" as unknown as string },
      };

      await getUsersId(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockJsonFn).toHaveBeenCalledWith(mockUser);
    });

    it("deve retornar 404 se usuário não existir", async () => {
      vi.mocked(UserModel.findById).mockResolvedValue(null);
      mockRequest = {
        params: { id: "123" },
      };

      await getUsersId(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(404);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: "Usuário não encontrado",
      });
    });

    it("deve retornar 400 se ID for inválido", async () => {
      mockRequest = {
        params: { id: 123 as unknown as string },
      };

      await getUsersId(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: "Id inválido",
      });
    });

    it("deve retornar erro 500 se falhar", async () => {
      vi.mocked(UserModel.findById).mockRejectedValue(
        new Error("Database error"),
      );
      mockRequest = {
        params: { id: "123" },
      };

      await getUsersId(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(500);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: "Erro ao buscar usuário",
      });
    });
  });

  describe("postUser", () => {
    it("deve criar novo usuário com status 201", async () => {
      const newUser = {
        nome: "Maria Santos",
        email: "maria@example.com",
        senha: "senha123",
        telefone: "11988888888",
        tipo: "cliente",
        foto_url: null,
        data_nascimento: new Date("1990-05-20"),
      };

      const createdUser = {
        id: "456",
        ...newUser,
      };

      vi.mocked(UserModel.create).mockResolvedValue(createdUser);
      mockRequest = {
        body: newUser,
      };

      await postUser(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(201);
      expect(mockJsonFn).toHaveBeenCalledWith(createdUser);
      expect(UserModel.create).toHaveBeenCalledWith(newUser);
    });

    it("deve retornar erro 500 se falhar", async () => {
      const newUser = {
        nome: "Test",
        email: "test@example.com",
        senha: "senha123",
        tipo: "cliente",
      };

      vi.mocked(UserModel.create).mockRejectedValue(
        new Error("Database error"),
      );
      mockRequest = {
        body: newUser,
      };

      await postUser(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(500);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: "Erro ao criar usuário",
      });
    });
  });

  describe("putUser", () => {
    it("deve atualizar usuário com status 200", async () => {
      const updateData = {
        id: "123",
        nome: "João Silva Atualizado",
        email: "joao.novo@example.com",
        senha: "novaSenha123",
        telefone: "11988888888",
        tipo: "admin",
        foto_url: "https://example.com/foto.jpg",
        data_nascimento: new Date("1990-05-20"),
      };

      const updatedUser = {
        id: "123",
        nome: "João Silva Atualizado",
        email: "joao.novo@example.com",
        tipo: "ADMIN",
        atualizado_em: new Date(),
      };

      vi.mocked(UserModel.update).mockResolvedValue(updatedUser);
      mockRequest = {
        body: updateData,
      };

      await putUser(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockJsonFn).toHaveBeenCalledWith(updatedUser);
      expect(UserModel.update).toHaveBeenCalledWith(updateData);
    });

    it("deve retornar 404 se usuário não existir", async () => {
      const updateData = {
        id: "999",
        nome: "Test",
        email: "test@example.com",
        senha: "senha123",
        tipo: "cliente",
      };

      vi.mocked(UserModel.update).mockResolvedValue(null);
      mockRequest = {
        body: updateData,
      };

      await putUser(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(404);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: "Usuário não encontrado",
      });
    });

    it("deve retornar erro 500 se falhar", async () => {
      const updateData = {
        id: "123",
        nome: "Test",
        email: "test@example.com",
        senha: "senha123",
        tipo: "cliente",
      };

      vi.mocked(UserModel.update).mockRejectedValue(
        new Error("Database error"),
      );
      mockRequest = {
        body: updateData,
      };

      await putUser(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(500);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: "Erro ao atualizar o usuário",
      });
    });
  });

  describe("delUser", () => {
    it("deve deletar usuário com status 200", async () => {
      vi.mocked(UserModel.del).mockResolvedValue({ id: "123" });
      mockRequest = {
        params: { id: "123" },
      };

      await delUser(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: "Usuário removido!",
      });
      expect(UserModel.del).toHaveBeenCalledWith("123");
    });

    it("deve retornar 400 se ID for inválido", async () => {
      mockRequest = {
        params: { id: 123 as unknown as string },
      };

      await delUser(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: "Id inválido",
      });
    });

    it("deve retornar erro 500 se falhar", async () => {
      vi.mocked(UserModel.del).mockRejectedValue(new Error("Database error"));
      mockRequest = {
        params: { id: "123" },
      };

      await delUser(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(500);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: "Erro ao remover o usuário",
      });
    });
  });
});
