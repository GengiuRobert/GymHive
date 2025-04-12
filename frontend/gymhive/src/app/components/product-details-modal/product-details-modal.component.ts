import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Product } from '../../models/product.model';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-product-details-modal',
  imports: [NgIf],
  templateUrl: './product-details-modal.component.html',
  styleUrl: './product-details-modal.component.css'
})
export class ProductDetailsModalComponent {
  @Input() product: Product | null = null
  @Input() isOpen = false
  @Output() closeModal = new EventEmitter<void>()

  onClose(): void {
    this.closeModal.emit()
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains("modal-backdrop")) {
      this.onClose()
    }
  }

  onContentClick(event: MouseEvent): void {
    event.stopPropagation()
  }

}
