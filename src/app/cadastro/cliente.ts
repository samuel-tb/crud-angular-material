import { v4 as uuid} from 'uuid';

export class Cliente{
    id?: string;
    nome?: string;
    cpf?: string;
    dataNascimento?: string;
    email?: string;
    deletando: boolean = false;
    uf?: string;
    municipio?: string;

    static newCliente(){
        const cliente = new Cliente; // bom utilizar const ao invés de let, pois assim só é alterado as propriedades dele
        cliente.id = uuid(); // toda vez que chamar a função o cliente já vai vim com um id unico
        return cliente
    }
}