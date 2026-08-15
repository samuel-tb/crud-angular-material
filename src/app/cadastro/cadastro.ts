import { Component, OnInit, Inject, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Cliente } from './cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Brasilapi } from '../brasilapi.service';
import { Estado, Municipio } from '../brasilapi.models';
import { errorContext } from 'rxjs/internal/util/errorContext';

@Component({
  selector: 'app-cadastro',
  imports: [
            FlexLayoutModule, 
            MatCardModule, 
            FormsModule, 
            MatFormFieldModule, 
            MatInputModule,
            MatIconModule,
            MatButtonModule,
            MatSelectModule,
            CommonModule,
            NgxMaskDirective
           ], 
  providers: [
              provideNgxMask()
             ],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.scss',
})
export class Cadastro implements OnInit{

  cliente: Cliente = Cliente.newCliente();
  atualizando: boolean = false;
  snack: MatSnackBar = inject(MatSnackBar);
  estados: Estado[] =[];
  municipios: Municipio[] = [];

  constructor(
    private service: ClienteService,
    private brasilApiService: Brasilapi,
    private route: ActivatedRoute, // injetando  os dados da roda que foi ativada
    private router: Router
  ){ }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe( (query: any) =>{ // tipando o parâmetro da arrow funciton
        const params = query['params'] // procura o parâmetro dentro da rota
        const id = params['id'] // recebe o valor do parâmetro id
        if(id){
          let clienteEncontrado = this.service.buscarClientePorId(id) 
          // se ele encontrar o id do cliente ele entra
          if(clienteEncontrado){ 
            this.atualizando = true;
            this.cliente = clienteEncontrado; // recebe os dados do cliente encontrado
            if(this.cliente.uf){
              const event = { value: this.cliente.uf }
              this.carregarMunicipios(event as MatSelectChange)
            }
          }
        }
    })   
    
    this.carregarUFs();
  }

  carregarUFs(){
    // observable vai observar a informação
    // subscriber vai receber a informação
    this.brasilApiService.listarUFs().subscribe({
      next: listaEstados => this.estados = listaEstados, // o que vai acontecer se der sucesso
      error: erro => console.log('Ocorreu um ERRO', erro)
    });
  }

  carregarMunicipios(event: MatSelectChange){
    const ufSelecionada = event.value;
    this.brasilApiService.listarMunicipios(ufSelecionada).subscribe({
      next: listaMunicipios => this.municipios = listaMunicipios,
      error: erro => console.log('Ocorreu um ERRP: ', erro)
    })
  }
  
  salvar(){
    if(!this.atualizando){
      this.service.salvar(this.cliente);
      this.cliente = Cliente.newCliente();
      this.mostrarMensagem('Salvo com sucesso!');
    } else{
      this.service.atualizar(this.cliente);
      this.router.navigate(['/consulta']);
      this.mostrarMensagem('Atualizado com sucesso!');
    }
  }

  mostrarMensagem(mensagem: string){
    this.snack.open(mensagem, 'OK');
  }

}
