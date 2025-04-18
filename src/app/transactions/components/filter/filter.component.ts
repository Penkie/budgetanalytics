import { Component, input, output } from '@angular/core';
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
  public greaterOrLessThan = input<string | null>();
  public fromDate = input<string | null>();
  public toDate = input<string | null>();

  public selectedAccountChange = output<string | null>();
  public selectedCategoryChange = output<string | null>();
  public amountChange = output<number | null>();
  public greaterOrLessThanChange = output<string | null>();
  public fromDateChange = output<string | null>();
  public toDateChange = output<string | null>();

  constructor (
    private pb: PocketbaseService
  ) {}

  onAccountChange(event: Event) {
    const newValue = (event.target as HTMLSelectElement).value;
    this.selectedAccountChange.emit(newValue);
  }

  onCategoryChange(event: Event) {
    const newValue = (event.target as HTMLSelectElement).value;
    this.selectedCategoryChange.emit(newValue);
  }

  onAmountChange(event: Event) {
    const newValue = parseInt((event.target as HTMLSelectElement).value);
    this.amountChange.emit(newValue);
  }

  onGreateOrLessThanChange(event: Event) {
    const newValue = (event.target as HTMLSelectElement).value;
    this.greaterOrLessThanChange.emit(newValue);
  }

  onFromDateChange(event: Event) {
    const newValue = (event.target as HTMLSelectElement).value;
    this.fromDateChange.emit(newValue);
  }

  onToDateChange(event: Event) {
    const newValue = (event.target as HTMLSelectElement).value;
    this.toDateChange.emit(newValue);
  }

}
