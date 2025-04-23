import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { XMLReceiptService } from '../../services/xml-receipt.service';

@Component({
  selector: 'app-pdf-receipt',
  imports: [CommonModule],
  templateUrl: './pdf-receipt.component.html',
  styleUrl: './pdf-receipt.component.css'
})
export class PdfReceiptComponent {
  @Input() userId!: string
  @Input() orderId!: string
  @Input() buttonText = "Download Receipt (PDF)"

  isGenerating = false

  constructor(private receiptService: XMLReceiptService) { }

  generateReceipt(): void {
    if (!this.userId || !this.orderId || this.isGenerating) return

    this.isGenerating = true

    this.receiptService.generateAndDownloadPdf(this.userId, this.orderId).subscribe({
      next: () => {
        this.isGenerating = false
        console.log("SUCCESS generating receipt as PDF")
      },
      error: (err) => {
        console.error("Error generating receipt as PDF:", err)
        this.isGenerating = false
      },
    })
  }
}
