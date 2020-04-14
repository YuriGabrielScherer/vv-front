import { Component, OnInit, Input } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

  @Input() title: string;
  @Input() mensagem: string;
  @Input() okTxt = 'Confirmar';
  @Input() cancelTxt = 'Cancelar';

  constructor(
    public bsModalRef: BsModalRef
  ) { }

  respostaModal: Subject<boolean>;

  ngOnInit() {
    this.respostaModal = new Subject();
  }


  onClose() {
    // Resposta
    this.confirmAndClose(false);
  }

  onConfirm() {
    // Resposta
    this.confirmAndClose(true);
  }

  private confirmAndClose(value: boolean) {
    this.respostaModal.next(value);
    this.bsModalRef.hide();
  }

}
