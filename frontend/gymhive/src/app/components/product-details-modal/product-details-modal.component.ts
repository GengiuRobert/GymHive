import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Product } from '../../models/product.model';

import { UserService } from '../../services/user.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-product-details-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details-modal.component.html',
  styleUrl: './product-details-modal.component.css'
})
export class ProductDetailsModalComponent implements OnInit, OnChanges {
  @Input() product: Product | null = null
  @Input() isOpen = false
  @Output() closeModal = new EventEmitter<void>()
  @Output() productAdded = new EventEmitter<{ product: Product, quantity: number }>()
  @Output() wishlistUpdated = new EventEmitter<{ product: Product; added: boolean }>

  quantity = 1

  isAddingToCart = false
  isInWishlist = false
  isWishlistProcessing = false

  userId: string | null = null
  cartId: string | null = null
  wishlistId: string | null = null

  constructor(private userService: UserService, private shoppingCartService: ShoppingCartService, private wishListService: WishlistService) { }

  ngOnInit(): void {

    this.userService.user.subscribe((user) => {
      if (user) {
        this.userId = user.id
        this.loadCart()
        this.loadWishlist()
      } else {
        this.userId = null
        this.wishlistId = null
      }
    })

  }

  ngOnChanges(): void {

    if (this.isOpen && this.product) {
      this.quantity = 1
      if (this.userId) {
        this.checkIfInWishlist()
      }
    }

  }

  loadCart() {

    if (!this.userId) return

    this.shoppingCartService.getShoppingCartByUserId(this.userId).subscribe({
      next: (cart) => {
        this.cartId = cart.shoppingCartId || null
      },
      error: (err) => {
        console.log("error loading cart in product modal " + err)
        this.cartId = null
      }
    })

  }

  loadWishlist() {
    if (!this.userId) return

    this.wishListService.getWishlistByUserId(this.userId).subscribe({
      next: (wishlist) => {
        this.wishlistId = wishlist?.wishListId || null
        if (this.product && this.wishlistId) {
          this.checkIfInWishlist()
        }
      },
      error: (err) => {
        console.error("Error loading wishlist: " + err)
        this.wishlistId = null
      },
    })
  }

  checkIfInWishlist() {
    if (!this.product || !this.wishlistId || !this.userId) {
      this.isInWishlist = false
      return
    }

    this.wishListService.getByWishlistId(this.wishlistId).subscribe({
      next: (wishlist) => {
        if (wishlist && wishlist.favoriteProducts) {
          this.isInWishlist = wishlist.favoriteProducts.some((p) => p.productId === this.product?.productId)
        } else {
          this.isInWishlist = false
        }
      },
      error: (err) => {
        console.error("Error checking wishlist: " + err)
        this.isInWishlist = false
      },
    })
  }

  toggleWishlist() {
    if (!this.product || !this.userId) return

    this.isWishlistProcessing = true

    this.addOrRemoveFromWishlist()

  }

  addOrRemoveFromWishlist() {
    if (!this.product || !this.wishlistId) {
      this.isWishlistProcessing = false
      return
    }

    if (this.isInWishlist) {
      this.wishListService.removeProductWishList(this.wishlistId, this.product.productId!).subscribe({
        next: () => {
          this.isInWishlist = false
          this.isWishlistProcessing = false
          this.wishlistUpdated.emit({ product: this.product!, added: false })
          this.wishListService.notifyWishListUpdated()
        },
        error: (err) => {
          console.error("Error removing from wishlist:", err)
          this.isWishlistProcessing = false
          this.wishListService.notifyWishListUpdated()
        },
      })
    } else {
      this.wishListService.addProductToWishList(this.wishlistId, this.product).subscribe({
        next: () => {
          this.isInWishlist = true
          this.isWishlistProcessing = false
          this.wishlistUpdated.emit({ product: this.product!, added: true })
          this.wishListService.notifyWishListUpdated()
        },
        error: (err) => {
          console.error("Error adding to wishlist:", err)
          this.isWishlistProcessing = false
          this.wishListService.notifyWishListUpdated()
        },
      })
    }
  }

  addToCart(): void {
    if (!this.product) return

    if (!this.userId) {
      console.log("Please log in to add items to your cart.")
      return
    }

    this.isAddingToCart = true

    const productToAdd = { ...this.product, quantity: this.quantity }

    if (this.cartId) {

      this.shoppingCartService.addProductToCart(this.cartId, productToAdd, this.quantity).subscribe({
        next: () => {
          this.isAddingToCart = false
          this.productAdded.emit({ product: productToAdd, quantity: this.quantity })
          this.quantity = 1
          this.shoppingCartService.notifyCartUpdated()
        },
        error: (err) => {
          console.error("Error adding product to cart:", err)
          this.isAddingToCart = false
          this.shoppingCartService.notifyCartUpdated()
        },
      })

    }

  }

  incrementQuantity(): void {
    this.quantity++
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--
    }
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

  onQuantityInput(e: Event) {
    const input = e.target as HTMLInputElement;
    let v = parseInt(input.value, 10);

    if (!isNaN(v) && v < 1) {
      v = 1;
    }
    this.quantity = isNaN(v) ? this.quantity : v;
  }

}
