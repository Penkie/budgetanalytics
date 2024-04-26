import { Component } from '@angular/core';
import { ModalService } from 'ngx-modal-ease';

@Component({
  selector: 'app-confirm-delete',
  standalone: true,
  imports: [],
  templateUrl: './confirm-delete.component.html',
  styleUrl: './confirm-delete.component.scss'
})
export class ConfirmDeleteComponent {

  constructor(
    private modal: ModalService
  ) {}

  public close(value: boolean): void {
    this.modal.close(value);
  }
}
