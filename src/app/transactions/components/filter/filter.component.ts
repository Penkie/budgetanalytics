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
  public greaterOrLessThan = input<'>' | '<'>();

  public selectedAccountChange = output<string | null>();
  public selectedCategoryChange = output<string | null>();
  public amountChange = output<number | null>();
  public greaterOrLessThanChange = output<'>' | '<'>();

  constructor (
    private pb: PocketbaseService
  ) {}

  onAccountChange(event: Event) {
    const newValue = (event.target as HTMLSelectElement).value;
    this.selectedAccountChange.emit(newValue);
  }

}
