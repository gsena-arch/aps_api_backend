export interface Hospedagem {
    id: string;
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

    criado_em: Date;
    atualizado_em: Date;
}