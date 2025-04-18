import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"

import { ShoppingCart } from "../../models/shopping-cart.model"
import { Product } from "../../models/product.model"

import { ShoppingCartService } from "../../services/shopping-cart.service"
import { UserService } from "../../services/user.service"
import { Subscription } from "rxjs"

@Component({
    selector: 'app-shopping-cart-modal',
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './shopping-cart-modal.component.html',
    styleUrl: './shopping-cart-modal.component.css'
})

export class ShoppingCartModalComponent implements OnInit, OnDestroy, OnChanges {
    @Input() isOpen = false
    @Output() closeModal = new EventEmitter<void>()

    userCart: ShoppingCart | null = null
    userId: string | null = null
    groupedProducts: Product[] = [];
    private cartUpdateSubscription: Subscription | null = null
    private userSubscription: Subscription | null = null

    constructor(private userService: UserService, private shoppingCartService: ShoppingCartService) { }

    ngOnInit(): void {

        this.userSubscription = this.userService.user.subscribe((user) => {
            if (user) {
                this.userId = user.id
                if (this.isOpen) {
                    this.loadCart()
                }
            }
        })

        this.cartUpdateSubscription = this.shoppingCartService.cartUpdated$.subscribe(() => {
            if (this.isOpen && this.userId) {
                this.loadCart()
            }
        })

    }

    ngOnDestroy(): void {
        if (this.cartUpdateSubscription) {
            this.cartUpdateSubscription.unsubscribe()
        }
        if (this.userSubscription) {
            this.userSubscription.unsubscribe()
        }
    }

    ngOnChanges(): void {
        if (this.isOpen && this.userId) {
            this.loadCart()
        }
    }


    loadCart(): void {
        if (!this.userId) return

        this.shoppingCartService.getShoppingCartByUserId(this.userId).subscribe(shoppingCart => {
            this.userCart = shoppingCart
            this.groupedProducts = this.groupProducts(shoppingCart.products || [])
        })

    }

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

    removeProduct(product: Product): void {

        if (!this.userCart?.shoppingCartId || !product.productId) return

        this.shoppingCartService.removeProductFromCart(this.userCart.shoppingCartId, product.productId).subscribe({
            next: (updatedCart) => {
                this.userCart = updatedCart
                this.groupedProducts = this.groupProducts(updatedCart.products || [])
                this.shoppingCartService.notifyCartUpdated()

            },
            error: (err) => {
                console.error("Error removing product:", err)
            },
        })
    }

    clearProductFromCart(product: Product): void {

        if (!this.userCart?.shoppingCartId || !product.productId) return

        this.shoppingCartService.removeAllOfTheSameProductsFromCart(this.userCart.shoppingCartId, product.productId).subscribe({
            next: (updatedCart) => {
                this.userCart = updatedCart
                this.groupedProducts = this.groupProducts(updatedCart.products || [])
                this.shoppingCartService.notifyCartUpdated()

            },
            error: (err) => {
                console.error("Error removing all of these products:", err)
            },
        })
    }

    incrementQuantity(product: Product): void {
        if (!this.userCart?.shoppingCartId || !product.productId) return

        this.shoppingCartService.addProductToCart(this.userCart.shoppingCartId, product).subscribe({
            next: (updatedCart) => {
                this.userCart = updatedCart
                this.groupedProducts = this.groupProducts(updatedCart.products || [])
                this.shoppingCartService.notifyCartUpdated()
            },
            error: (err) => {
                console.error("Error incrementing quantity:", err)
            },
        })
    }

    private groupProducts(products: Product[]): Product[] {
        const map = new Map<string, Product>();

        for (const p of products) {
            if (!p.productId) { continue; }
            if (map.has(p.productId)) {
                const existing = map.get(p.productId)!;
                existing.quantity = (existing.quantity ?? 1) + 1;
            } else {
                map.set(p.productId, { ...p, quantity: 1 });
            }
        }

        return Array.from(map.values());
    }

    clearCart(): void {
        if (!this.userCart?.shoppingCartId) return

        const clearedCart: ShoppingCart = {
            shoppingCartId: this.userCart.shoppingCartId,
            userId: this.userCart.userId,
            userEmail: this.userCart.userEmail,
            products: [],
            totalItems: 0,
            totalPrice: 0
        };

        this.shoppingCartService
            .updateShoppingCart(this.userCart.shoppingCartId, clearedCart)
            .subscribe({
                next: () => {
                    this.userCart = clearedCart;
                    this.groupedProducts = [];
                },
                error: (err) => console.error("Error clearing cart:", err)
            });
    }
}
