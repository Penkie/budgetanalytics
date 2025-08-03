import { Component } from '@angular/core';

@Component({
    selector: 'app-confirm-delete',
    imports: [],
    templateUrl: './confirm-delete.component.html',
    styleUrl: './confirm-delete.component.scss'
})
export class ConfirmDeleteComponent {

  constructor(
  ) {}

  public close(value: boolean): void {
  }
}
