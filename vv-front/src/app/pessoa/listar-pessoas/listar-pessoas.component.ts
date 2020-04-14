import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { Pessoa } from './../../shared/model/pessoa';

@Component({
  selector: 'app-listar-pessoas',
  templateUrl: './listar-pessoas.component.html',
  styleUrls: ['./listar-pessoas.component.scss'],
  preserveWhitespaces: true
})
export class ListarPessoasComponent implements OnInit {

  // Lista de Informacoes do Banco
  listaPessoa: Pessoa[] = null;

  // Inscricao nos dados vindos do Resolver
  private inscricao: Subscription;

  // Inscricao pessoa
  pessoas$: Observable<Data>;

  // Formulario de Filtragem
  formularioFiltro: FormGroup;

  // Objeto Campeonato
  // campeonatos = [
  //   'Olesc',
  //   'Joguinhos',
  //   'Jasc',
  //   'Brasileiro'
  // ];

  // Objeto tipo usuario
  tipoUsuario = [
    { id: 0, tipo: 'Todos' },
    { id: 1, tipo: 'Atleta' },
    { id: 2, tipo: 'Usuário' },
    { id: 3, tipo: 'Responsável' }
  ];


  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    // Pegando valores do Banco de dados
    this.route.data.subscribe(
      (dados) => {
        this.listaPessoa = dados.pessoa;
      });


    // Iniciando o Formulario
    this.formularioFiltro = this.formBuilder.group({
      nome: [null],
      tipoUsuario: [0],
    });
  }


  obterUsuarios() {

    // Filtragem por nome
    if (
      (this.formularioFiltro.get('nome').value != null)
      && (this.formularioFiltro.get('nome').value.trim() !== '')) {

      // Nome para Filtrar
      const nome = this.formularioFiltro.get('nome').value.toLocaleLowerCase();

      // Retornando Lista filtrada
      return this.listaPessoa.filter(
        (pessoa) =>
          pessoa.nomePessoa.toLocaleLowerCase().includes(nome)
      );

    } else if (this.formularioFiltro.get('tipoUsuario').value !== 0) {

      const tipo = this.formularioFiltro.get('tipoUsuario').value;

      // Retornando Lista filtrada
      return this.listaPessoa.filter(
        (pessoa) =>
          pessoa.tipoUsuarioPessoa === tipo
      );
    } else {
      return this.listaPessoa;
    }
  }



  // // Metodo para formar os CheckBoxes de Filtros de Camp.
  // private buildCampeonatos() {

  //   // Pegando os valores dos Campeonatos
  //   const values = this.campeonatos.map(v => new FormControl(false));
  //   // O Map pega um valor e imprime outro
  //   // Nesse caso, pega a quantidade de valores do Campeonato e vai imprimir no formato FormControl(false)

  //   // Criando um array de FormControl(false)
  //   return this.formBuilder.array(values);
  // }

}
