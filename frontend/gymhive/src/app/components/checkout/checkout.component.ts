import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { concatMap, finalize, Subscription } from 'rxjs';
import { Router } from "@angular/router";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ShoppingCart } from '../../models/shopping-cart.model';
import { Product } from '../../models/product.model';
import { UserProfile } from '../../models/profile.model';
import { EmailOrderRequest } from '../../models/email-request.model';
import { CartItem } from '../../models/cart-item.models';

import { ShoppingCartService } from '../../services/shopping-cart.service';
import { UserService } from '../../services/user.service';
import { UserProfileService } from '../../services/profile.service';
import { EmailService } from '../../services/email.service';
import { SpinnerService } from '../../services/spinner.service';

import { ShippingFormComponent } from '../shipping-form/shipping-form.component';
import { PaymentFormComponent } from '../payment-form/payment-form.component';
import { OrderSummaryComponent } from '../order-summary/order-summary.component';
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ShippingFormComponent, PaymentFormComponent, OrderSummaryComponent, LoadingSpinnerComponent],
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
    private emailService: EmailService,
    private spinnerService: SpinnerService
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
      zipControl.clearValidators()
      phoneControl.clearValidators()

      if (country === "Romania") {
        zipControl.setValidators([
          Validators.required,
          Validators.pattern(/^[0-9]{6}$/),
        ])
        phoneControl.setValidators([
          Validators.required,
          Validators.pattern(/^07[0-9]{8}$/),
        ])
      } else {
        zipControl.setValidators([
          Validators.required,
          Validators.pattern(/^\d{5}(-\d{4})?$/),
        ])
        phoneControl.setValidators([
          Validators.required,
          Validators.pattern(/^\d{10}$/),
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

      const ship = this.shippingForm.value;

      const address = {
        street: ship.address,
        city: ship.city,
        state: ship.state,
        country: ship.country,
        zipCode: ship.zipCode
      };

      const items: CartItem[] = (this.cart!.products || []).map(p => ({
        product: {
          productId: p.productId!,
          name: p.name,
          description: p.description,
          price: p.price,
          categoryId: p.categoryId,
          subCategoryId: p.subCategoryId,
          imageUrl: p.imageUrl
        },
        quantity: p.quantity ?? 1
      }));

      const newOrder: EmailOrderRequest = {
        customerID: this.userId!,
        customerName: ship.fullName,
        customerEmail: ship.email,
        orderID: this.generateOrderID(),
        orderDate: new Date().toISOString().split('T')[0],
        items: items,
        address: address,
        phone: ship.phone,
        shippingCost: 24.99,
        tax: this.calculateTax(items)
      };

      console.log("Sending:", newOrder);

      this.spinnerService.showSpinner()

      this.emailService.sendOrderEmail(newOrder).pipe(
        finalize(() => this.spinnerService.hideSpinner()),
        concatMap(() => this.emailService.createOrder(newOrder))
      ).subscribe({
        next: (msg: string) => {
          console.log("Order saved:", msg);
          this.clearCart()
          this.router.navigate(['/home']);
        },
        error: (err: any) => {
          console.error("Something failed:", err);
        }
      });
    }
  }

  private calculateTax(items: CartItem[]): number {
    const subtotal = items.reduce((sum, ci) => sum + ci.product.price * ci.quantity, 0);
    return +(subtotal * 0.19).toFixed(2);
  }

  private generateOrderID(): string {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `ORD-${ts}-${rand}`;
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

  private clearCart(): void {
    if (!this.cart?.shoppingCartId) return

    const clearedCart: ShoppingCart = {
      shoppingCartId: this.cart.shoppingCartId,
      userId: this.cart.userId,
      userEmail: this.cart.userEmail,
      products: [],
      totalItems: 0,
      totalPrice: 0
    };

    this.shoppingCartService
      .updateShoppingCart(this.cart.shoppingCartId, clearedCart)
      .subscribe({
        next: () => {
          this.cart = clearedCart;
          this.shoppingCartService.notifyCartUpdated()
        },
        error: (err) => console.error("Error clearing cart:", err)
      });
  }
}
