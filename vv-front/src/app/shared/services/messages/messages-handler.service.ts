import { Injectable } from '@angular/core';

import { ToastService } from './../toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesHandlerService {

  constructor(
    private toastService: ToastService
  ) { }

  public errorMessageHandler(erro: any, titulo?: string) {

    const message = erro.error.message;
    const title = titulo ? titulo : 'Erro ao enviar requisição.';


    this.toastService.toastError(title, message);
  }
}
