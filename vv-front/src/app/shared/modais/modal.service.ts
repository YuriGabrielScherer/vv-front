import { EnviaEmailComponent } from './envia-email/envia-email.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { Injectable } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Injectable({ providedIn: 'root' })
export class ModalService {

  constructor(
    private modalService: BsModalService
  ) { }

  // Show Confirm Modal
  showConfirmModal(title: string, msg: string, okTxt?: string, cancelTxt?: string) {
    const bsModalRef: BsModalRef = this.modalService.show(ConfirmModalComponent);
    bsModalRef.content.title = title;
    bsModalRef.content.mensagem = msg;

    if (okTxt) {
      bsModalRef.content.okTxt = okTxt;
    }

    if (cancelTxt) {
      bsModalRef.content.cancelTxt = cancelTxt;
    }

    return (bsModalRef.content as ConfirmModalComponent).respostaModal;
  }

  // Show Enviar E-mail Modal
  showEmailModal() {
    const bsModalRef: BsModalRef = this.modalService.show(EnviaEmailComponent);

    return (bsModalRef.content as EnviaEmailComponent);
  }


}
