import { Component, Input, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, type FormGroup } from "@angular/forms"

import { CardType } from "../../models/card-type.model"

@Component({
  selector: 'app-payment-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.css'
})
export class PaymentFormComponent {
  @Input() formGroup!: FormGroup
  @Output() formSubmit = new EventEmitter<any>()

  months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    return month < 10 ? `0${month}` : `${month}`
  })

  years = Array.from({ length: 10 }, (_, i) => {
    const currentYear = new Date().getFullYear()
    return (currentYear + i).toString()
  })

  detectedCardType: CardType | null = null
  cardTypes: CardType[] = [
    {
      name: "Visa",
      pattern: /^4/,
      icon: "visa",
      lengths: [16],
      cvvLength: 3,
    },
    {
      name: "Mastercard",
      pattern: /^(5[1-5]|2[2-7])/,
      icon: "mastercard",
      lengths: [16],
      cvvLength: 3,
    },
    {
      name: "Maestro",
      pattern: /^(5018|5020|5038|5893|6304|6759|6761|6762|6763)/,
      icon: "maestro",
      lengths: [13, 15, 16, 19],
      cvvLength: 3,
    },
    {
      name: "American Express",
      pattern: /^3[47]/,
      icon: "amex",
      lengths: [15],
      cvvLength: 4,
    },
    {
      name: "Discover",
      pattern: /^(6011|65|64[4-9]|622)/,
      icon: "discover",
      lengths: [16],
      cvvLength: 3,
    },
  ]

  ngOnInit(): void {
    const currentYear = new Date().getFullYear().toString()

    if (!this.formGroup.get("expiryYear")?.value) {
      this.formGroup.get("expiryYear")?.setValue(currentYear)
    }

    if (!this.formGroup.get("expiryMonth")?.value) {
      this.formGroup.get("expiryMonth")?.setValue("01")
    }

    this.formGroup.get("cardNumber")?.valueChanges.subscribe((value) => {
      this.detectCardType(value)
    })
  }

  detectCardType(cardNumber: string): void {
    if (!cardNumber) {
      this.detectedCardType = null
      return
    }

    const cleanNumber = cardNumber.replace(/\D/g, "")

    this.detectedCardType = this.cardTypes.find((card) => card.pattern.test(cleanNumber)) || null
  }

  isValidCardLength(cardNumber: string): boolean {
    if (!this.detectedCardType) return true

    const cleanNumber = cardNumber.replace(/\D/g, "")
    return this.detectedCardType.lengths.includes(cleanNumber.length)
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.formSubmit.emit(this.formGroup.value)
    } else {
      this.markFormGroupTouched(this.formGroup)
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched()
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup)
      }
    })
  }

  formatCardNumber(event: any): void {
    const input = event.target
    let value = input.value.replace(/\D/g, "")

    if (value.length > 16) {
      value = value.slice(0, 16)
    }

    this.formGroup.get("cardNumber")?.setValue(value, { emitEvent: false })

    this.detectCardType(value)
  }
}
