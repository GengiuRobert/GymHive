import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from "@angular/router";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ShoppingCart } from '../../models/shopping-cart.model';
import { Product } from '../../models/product.model';
import { UserProfile } from '../../models/profile.model';

import { ShoppingCartService } from '../../services/shopping-cart.service';
import { UserService } from '../../services/user.service';
import { UserProfileService } from '../../services/profile.service';

import { ShippingFormComponent } from '../shipping-form/shipping-form.component';
import { PaymentFormComponent } from '../payment-form/payment-form.component';
import { OrderSummaryComponent } from '../order-summary/order-summary.component';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ShippingFormComponent, PaymentFormComponent, OrderSummaryComponent,],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit, OnDestroy {

  cart: ShoppingCart | null = null
  userId: string | null = null
  userProfile: UserProfile | null = null

  step = 1 // 1: Shipping, 2: Payment, 3: Review

  shippingForm: FormGroup
  paymentForm: FormGroup

  private userSubscription: Subscription | null = null
  private cartSubscription: Subscription | null = null
  private profileSubscription: Subscription | null = null

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private shoppingCartService: ShoppingCartService,
    private userService: UserService,
    private profileService: UserProfileService,
  ) {
    // Get current year for default value
    const currentYear = new Date().getFullYear().toString()

    this.shippingForm = this.fb.group({
      fullName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      address: ["", [Validators.required]],
      city: ["", [Validators.required]],
      state: ["", [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      country: ['Romania', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^07[0-9]{8}$/)]]
    })

    this.paymentForm = this.fb.group({
      cardNumber: ["", [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cardName: ["", [Validators.required]],
      expiryMonth: ["", [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])$/)]],
      expiryYear: [currentYear, [Validators.required]],
      cvv: ["", [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    })
  }

  ngOnInit(): void {
    this.userSubscription = this.userService.user.subscribe((user) => {
      if (user) {
        this.userId = user.id
        this.loadCart()
        this.loadUserProfile()
      } else {
        this.userId = null
        this.cart = null
        this.userProfile = null
        this.router.navigate(["/login"], { queryParams: { returnUrl: "/checkout" } })
      }
    })
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe()
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe()
    }
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe()
    }
  }

  loadCart(): void {
    if (!this.userId) return

    this.cartSubscription = this.shoppingCartService.getShoppingCartByUserId(this.userId).subscribe({
      next: (cart) => {
        this.cart = cart
        this.cart.products = this.groupProducts(this.cart.products || [])

        if (cart.userEmail) {
          this.shippingForm.patchValue({ email: cart.userEmail })
        }
      },
      error: (err) => {
        console.error("Error loading cart:", err)
      },
    })
  }

  loadUserProfile(): void {
    if (!this.userId) return

    this.profileSubscription = this.profileService.getUserProfile(this.userId).subscribe({
      next: (profile) => {
        this.userProfile = profile
        this.prefillShippingForm()
      },
      error: (err) => {
        console.error("Error loading user profile:", err)
      },
    })
  }

  prefillShippingForm(): void {
    if (!this.userProfile) return

    // Create full name from first and last name
    const fullName = `${this.userProfile.firstName} ${this.userProfile.lastName}`.trim()

    // Prefill the form with user profile data
    this.shippingForm.patchValue({
      fullName: fullName,
      email: this.userProfile.userEmail,
      phone: this.userProfile.phone || "",
      address: this.userProfile.address?.street || "",
      city: this.userProfile.address?.city || "",
      state: this.userProfile.address?.state || "",
      zipCode: this.userProfile.address?.zipCode || "",
      country: this.userProfile.address?.country || "United States",
    })

    this.onCountryChange(this.shippingForm.get("country")?.value || "Romania")
  }

  onCountryChange(country: string): void {
    const zipControl = this.shippingForm.get("zipCode")
    const phoneControl = this.shippingForm.get("phone")

    if (zipControl && phoneControl) {
      // Reset validators
      zipControl.clearValidators()
      phoneControl.clearValidators()

      // Set country-specific validators
      if (country === "Romania") {
        zipControl.setValidators([
          Validators.required,
          Validators.pattern(/^[0-9]{6}$/), // Romanian postal code: 6 digits
        ])
        phoneControl.setValidators([
          Validators.required,
          Validators.pattern(/^07[0-9]{8}$/), // Romanian mobile: starts with 07, followed by 8 digits
        ])
      } else {
        zipControl.setValidators([
          Validators.required,
          Validators.pattern(/^\d{5}(-\d{4})?$/), // US ZIP: 5 digits or 5+4 format
        ])
        phoneControl.setValidators([
          Validators.required,
          Validators.pattern(/^\d{10}$/), // US phone: 10 digits
        ])
      }

      // Update validators
      zipControl.updateValueAndValidity()
      phoneControl.updateValueAndValidity()
    }
  }

  useProfileData(): void {
    this.prefillShippingForm()
  }

  nextStep(): void {
    if (this.step === 1 && this.shippingForm.valid) {
      this.step = 2
    } else if (this.step === 2 && this.paymentForm.valid) {
      this.step = 3
    } else {
      // Force validation to show errors
      if (this.step === 1) {
        this.markFormGroupTouched(this.shippingForm)
      } else if (this.step === 2) {
        this.markFormGroupTouched(this.paymentForm)
      }
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

  previousStep(): void {
    if (this.step > 1) {
      this.step--
    }
  }

  onShippingFormSubmit(formData: any): void {
    if (this.shippingForm.valid) {
      this.step = 2
    }
  }

  onPaymentFormSubmit(formData: any): void {
    if (this.paymentForm.valid) {
      this.step = 3
    }
  }

  placeOrder(): void {
    if (this.shippingForm.valid && this.paymentForm.valid) {
     
      console.log("Order placed!")
      console.log("Shipping details:", this.shippingForm.value)
      console.log("Payment details:", this.paymentForm.value)

      setTimeout(() => {
        this.router.navigate(["/order-confirmation"])
      }, 1000)
    }
  }

  private groupProducts(products: Product[]): Product[] {
    const map = new Map<string, Product>()

    for (const p of products) {
      if (!p.productId) {
        continue
      }
      if (map.has(p.productId)) {
        const existing = map.get(p.productId)!
        existing.quantity = (existing.quantity ?? 1) + 1
      } else {
        map.set(p.productId, { ...p, quantity: 1 })
      }
    }

    return Array.from(map.values())
  }
}
