import { Component, EventEmitter, input } from '@angular/core';
import { PocketbaseService } from '../../../common/services/pocketbase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {

  public accounts$ = this.pb.getAccounts();
  public categories$ = this.pb.getCategories();

  public selectedAccount = input<string | null>();
  public selectedCategory = input<string | null>();
  public amount = input<number | null>();
  public greaterOrLessThan = input<'>' | '<'>();

  // public selectedAccountChange = output<void>();

  // @Output() selectedAccountChange = new EventEmitter<string | null>();
  // @Output() selectedCategoryChange = new EventEmitter<string | null>();
  // @Output() amountChange = new EventEmitter<number | null>();
  // @Output() greaterOrLessThanChange = new EventEmitter<'>' | '<'>();

  constructor (
    private pb: PocketbaseService
  ) {}

}
