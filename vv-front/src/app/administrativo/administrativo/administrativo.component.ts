import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


import { Pessoa } from './../../shared/model/pessoa';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-administrativo',
  templateUrl: './administrativo.component.html',
  styleUrls: ['./administrativo.component.scss']
})
export class AdministrativoComponent implements OnInit {

  // Usuario autenticado
  usuarioAutenticado: Pessoa = null;

  isCollapsedUsuarios = false;
  isCollapsedAtletas = false;
  isCollapsedCampeonatos = false;
  isCollapsedExames = false;

  constructor(
    private title: Title,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.title.setTitle('Administrativo Karatê');
    this.getUsuarioLogado();
  }

  // // Retornando Usuario logado
  private getUsuarioLogado() {
    // Pegando valores do Banco de dados
    this.route.data.subscribe(
      (pessoa) => {
        this.usuarioAutenticado = pessoa.pessoa;
      });
  }
}
