export interface Estado{ // utilizando interface, pois ela só vai receber informação da api, 
    sigla: string;       // não vai editar a informação
    nome: string;
}

export interface Municipio{
    nome: string;
    codigo_ibge: string;
}