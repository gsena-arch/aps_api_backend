import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  delHosp,
  getHosp,
  getHospById,
  getHospByKeyword,
  postHosp,
  putHosp,
} from "../../src/controllers/hospControllers.js";
import HospedagemModel from "../../src/models/hospedagem.js";

vi.mock("../../src/models/hospedagem.js");

const hospedagem = {
  id: "123",
  anfitriao_id: "456",
  titulo: "Casa no centro",
  descricao: "Casa completa",
  tipo: "CASA",
  preco_diaria: 275,
  capacidade: 4,
  quartos: 2,
  camas: 2,
  banheiros: 1,
  cidade: "Curitiba",
  estado: "PR",
  status: "ATIVA",
};

const createRequest = (
  params: Record<string, unknown> = {},
  body: Record<string, unknown> = {},
) => ({
  params,
  body,
}) as unknown as Request;

const createResponse = () => {
  const response = {
    status: vi.fn(),
    json: vi.fn(),
  };
  response.status.mockReturnValue(response);
  return response;
};

describe("Hospedagem Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getHosp", () => {
    it("retorna a lista com status 200", async () => {
      const hospedagens = [hospedagem];
      const request = createRequest();
      const response = createResponse();
      vi.mocked(HospedagemModel.findAll).mockResolvedValue(hospedagens);

      await getHosp(request, response as unknown as Response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(hospedagens);
    });

    it("retorna 404 quando não há hospedagens", async () => {
      const request = createRequest();
      const response = createResponse();
      vi.mocked(HospedagemModel.findAll).mockResolvedValue(null);

      await getHosp(request, response as unknown as Response);

      expect(response.status).toHaveBeenCalledWith(404);
    });

    it("retorna 500 quando o model falha", async () => {
      const request = createRequest();
      const response = createResponse();
      vi.mocked(HospedagemModel.findAll).mockRejectedValue(
        new Error("Database error"),
      );

      await getHosp(request, response as unknown as Response);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({
        message: "Erro ao buscar hospedagem",
      });
    });
  });

  describe("getHospById", () => {
    it("retorna hospedagem pelo ID", async () => {
      const request = createRequest({ id: hospedagem.id });
      const response = createResponse();
      vi.mocked(HospedagemModel.findById).mockResolvedValue(hospedagem);

      await getHospById(request, response as unknown as Response);

      expect(HospedagemModel.findById).toHaveBeenCalledWith(hospedagem.id);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(hospedagem);
    });

    it("retorna 404 quando o ID não é uma string", async () => {
      const request = createRequest({ id: 123 });
      const response = createResponse();

      await getHospById(request, response as unknown as Response);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(HospedagemModel.findById).not.toHaveBeenCalled();
    });

    it("retorna 500 quando o model falha", async () => {
      const request = createRequest({ id: hospedagem.id });
      const response = createResponse();
      vi.mocked(HospedagemModel.findById).mockRejectedValue(
        new Error("Database error"),
      );

      await getHospById(request, response as unknown as Response);

      expect(response.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getHospByKeyword", () => {
    it("busca hospedagens pela keyword", async () => {
      const hospedagens = [hospedagem];
      const request = createRequest({ keyword: "Curitiba" });
      const response = createResponse();
      vi.mocked(HospedagemModel.findKeyword).mockResolvedValue(hospedagens);

      await getHospByKeyword(request, response as unknown as Response);

      expect(HospedagemModel.findKeyword).toHaveBeenCalledWith("Curitiba");
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(hospedagens);
    });

    it("retorna 404 quando a keyword não é uma string", async () => {
      const request = createRequest({ keyword: 123 });
      const response = createResponse();

      await getHospByKeyword(request, response as unknown as Response);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(HospedagemModel.findKeyword).not.toHaveBeenCalled();
    });

    it("retorna 500 quando o model falha", async () => {
      const request = createRequest({ keyword: "Curitiba" });
      const response = createResponse();
      vi.mocked(HospedagemModel.findKeyword).mockRejectedValue(
        new Error("Database error"),
      );

      await getHospByKeyword(request, response as unknown as Response);

      expect(response.status).toHaveBeenCalledWith(500);
    });
  });

  describe("postHosp", () => {
    it("cria hospedagem com status 201", async () => {
      const request = createRequest({}, hospedagem);
      const response = createResponse();
      vi.mocked(HospedagemModel.create).mockResolvedValue(hospedagem);

      await postHosp(request, response as unknown as Response);

      expect(HospedagemModel.create).toHaveBeenCalledWith(hospedagem);
      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.json).toHaveBeenCalledWith(hospedagem);
    });

    it("retorna 500 quando a criação falha", async () => {
      const request = createRequest({}, hospedagem);
      const response = createResponse();
      vi.mocked(HospedagemModel.create).mockRejectedValue(
        new Error("Database error"),
      );

      await postHosp(request, response as unknown as Response);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({
        message: "Erro ao criar hospedagem",
      });
    });
  });

  describe("putHosp", () => {
    it("atualiza hospedagem pelo ID", async () => {
      const request = createRequest({ id: hospedagem.id }, hospedagem);
      const response = createResponse();
      vi.mocked(HospedagemModel.update).mockResolvedValue(hospedagem);

      await putHosp(request, response as unknown as Response);

      expect(HospedagemModel.update).toHaveBeenCalledWith(hospedagem);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(hospedagem);
    });

    it("retorna 404 quando o ID não é uma string", async () => {
      const request = createRequest({ id: 123 }, hospedagem);
      const response = createResponse();

      await putHosp(request, response as unknown as Response);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(HospedagemModel.update).not.toHaveBeenCalled();
    });

    it("retorna 500 quando a atualização falha", async () => {
      const request = createRequest({ id: hospedagem.id }, hospedagem);
      const response = createResponse();
      vi.mocked(HospedagemModel.update).mockRejectedValue(
        new Error("Database error"),
      );

      await putHosp(request, response as unknown as Response);

      expect(response.status).toHaveBeenCalledWith(500);
    });
  });

  describe("delHosp", () => {
    it("remove hospedagem e retorna status 200", async () => {
      const request = createRequest({ id: hospedagem.id });
      const response = createResponse();
      vi.mocked(HospedagemModel.del).mockResolvedValue(hospedagem);

      await delHosp(request, response as unknown as Response);

      expect(HospedagemModel.del).toHaveBeenCalledWith(hospedagem.id);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        message: "Hospedagem removida!",
      });
    });

    it("retorna 404 se a hospedagem não existir", async () => {
      const request = createRequest({ id: hospedagem.id });
      const response = createResponse();
      vi.mocked(HospedagemModel.del).mockResolvedValue(undefined);

      await delHosp(request, response as unknown as Response);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({
        message: "Hospedagem não encontrada",
      });
    });

    it("retorna 404 quando o ID não é uma string", async () => {
      const request = createRequest({ id: 123 });
      const response = createResponse();

      await delHosp(request, response as unknown as Response);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(HospedagemModel.del).not.toHaveBeenCalled();
    });

    it("retorna 500 quando a exclusão falha", async () => {
      const request = createRequest({ id: hospedagem.id });
      const response = createResponse();
      vi.mocked(HospedagemModel.del).mockRejectedValue(
        new Error("Database error"),
      );

      await delHosp(request, response as unknown as Response);

      expect(response.status).toHaveBeenCalledWith(500);
    });
  });
});