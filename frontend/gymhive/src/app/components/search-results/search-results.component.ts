import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SearchResult } from '../../models/search-result.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-search-results',
  imports: [CommonModule, RouterModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {

  @Input() results: SearchResult[] = []
  @Input() isSearching = false
  @Output() selectProduct = new EventEmitter<Product>()
  @Output() closeResults = new EventEmitter<void>()

  onSelectProduct(product: Product): void {
    this.selectProduct.emit(product)
    this.closeResults.emit()
  }

  handleClickOutside(event: MouseEvent): void {
    if (!(event.target as HTMLElement).closest(".search-results-container")) {
      this.closeResults.emit()
    }
  }
}
