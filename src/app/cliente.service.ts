import { Injectable } from '@angular/core';
import { Cliente } from './cadastro/cliente';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {

  static REPO_CLIENTES = '_CLIENTES';

  constructor () { }

  salvar(cliente: Cliente){
    const storage = this.obterStorage();
    storage.push(cliente);  //<--- metodo do array que adiciona um item dentro de um array

    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(storage));
  }

  atualizar(cliente: Cliente){
    const storage = this.obterStorage();
    storage.forEach( c => { // forEach percorre a lista do array
      if(c.id === cliente.id){
        Object.assign(c, cliente) // vai substituir o cliente por c
                                  // que é o cliente atualizado
      }
    }) 
    // atualiza o localstorege
    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(storage));
  }

  deletar(cliente: Cliente){
    const storage = this.obterStorage();

    // vai trazer todos os clientes diferentes do id que está sendo deletado
    const novaLista = storage.filter( c => c.id !== cliente.id) 

    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(novaLista));
  }

  // outra forma de fazer o deletar:

  // deletar(cliente: Cliente){
  //   const storage = this.obterStorage();

  //   const indexItem = storage.indexOf(cliente);
  //   if(indexItem > -1){ // se ele achar o cliente
  //     // pega a posição e quantos itens que deletar a partir dessa posição
  //     storage.splice(indexItem, 1) 
  //   }

  //   localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(storage));
  // }


  pesquisarClientes(nomeBusca: string) : Cliente[] {
    
    const clientes = this.obterStorage();

    if (!nomeBusca){
      return clientes;
    }    

    return clientes.filter(cliente => cliente.nome?.indexOf(nomeBusca) !== -1)

    /* 
       encontra se a string digitado contém dentro do nome do cliente
       ex: nomeBusca = Sam
       cliente.nome = Samuel
       ele vai encontrar pois a string "sam" contém na string "samuel" 
       quando ele retorna -1 é porque ele não achou dentro da palavra
    */
  }

  buscarClientePorId(id: string): Cliente | undefined{
    const clientes = this.obterStorage();
    return clientes.find(cliente => cliente.id === id) // quando quer encontrar apenas um elemento dentro de um array
  }

  private obterStorage() : Cliente[] {
    const repositorioClientes = localStorage.getItem(ClienteService.REPO_CLIENTES);

    if(repositorioClientes){
      const clientes: Cliente[] = JSON.parse(repositorioClientes);
      return clientes;
    }

    const clientes: Cliente[] = [];
    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(clientes)); // <--- transforma o objeto do tipo json em string
    return clientes;
  }
  
}
