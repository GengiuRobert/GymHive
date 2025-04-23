import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { XMLReceiptService } from '../../services/xml-receipt.service';

@Component({
  selector: 'app-xml-receipt',
  imports: [CommonModule],
  templateUrl: './xml-receipt.component.html',
  styleUrl: './xml-receipt.component.css'
})
export class XmlReceiptComponent {
  @Input() userId!: string
  @Input() orderId!: string
  @Input() buttonText = "Download Receipt (XML)"

  isGenerating = false

  constructor(private receiptService: XMLReceiptService) { }

  generateReceipt(): void {
    if (!this.userId || !this.orderId || this.isGenerating) return

    this.isGenerating = true

    this.receiptService.generateAndDownloadReceipt(this.userId, this.orderId).subscribe({
      next: () => {
        this.isGenerating = false
        console.log("SUCCESS generating receipt as XML")
      },
      error: (err) => {
        console.error("Error generating receipt as XML:", err)
        this.isGenerating = false
      },
    })
  }
}
