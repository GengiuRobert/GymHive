import { Component, OnDestroy, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { finalize, Subscription } from "rxjs"

import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";
import { ProductDetailsModalComponent } from "../product-details-modal/product-details-modal.component";

import { UserProfile } from "../../models/profile.model"
import { Product } from "../../models/product.model";

import { UserService } from "../../services/user.service"
import { UserProfileService } from "../../services/profile.service"
import { SpinnerService } from "../../services/spinner.service"
import { WishlistService } from "../../services/wishlist.service"
import { WishList } from "../../models/wishlist.model"
import { ShoppingCartService } from "../../services/shopping-cart.service"

@Component({
  selector: "app-user-profile",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LoadingSpinnerComponent, ProductDetailsModalComponent],
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit, OnDestroy {

  activeTab = "profile"
  isEditing = false
  isSaving = false
  isModalOpen = false
  isAddingToCart = false

  successMessage = ""

  userId: string | null = null
  cartId: string | null = null
  wishListId: string | null = null
  selectedProduct: Product | null = null
  editedUser: any
  userWishlist: WishList | null = null

  private userSubscription: Subscription | null = null
  private wishListUpdateSubscription: Subscription | null = null

  user: UserProfile = {
    firstName: "",
    lastName: "",
    userEmail: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  }

  orders = [
    {
      id: "ORD-12345",
      date: "2023-06-15",
      total: 129.99,
      status: "Delivered",
      items: [{ name: "Premium Adjustable Dumbbell Set", quantity: 1, price: 129.99 }],
    },
    {
      id: "ORD-12346",
      date: "2023-05-20",
      total: 89.97,
      status: "Delivered",
      items: [
        { name: "Performance Whey Protein", quantity: 1, price: 49.99 },
        { name: "Fitness Resistance Bands", quantity: 1, price: 39.98 },
      ],
    },
  ]

  constructor(private userService: UserService,
    private profileService: UserProfileService,
    private spinnerService: SpinnerService,
    private wishListService: WishlistService,
    private shoppingCartService: ShoppingCartService) { }

  ngOnInit(): void {
    this.spinnerService.showSpinner();
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe()
    }
    if (this.wishListUpdateSubscription) {
      this.wishListUpdateSubscription.unsubscribe()
    }
  }

  ngOnChanges(): void {
    if (this.userId) {
      this.loadUserWishList(this.userId)
    }
  }

  loadUserProfile() {
    this.userSubscription = this.userService.user.subscribe((user) => {
      if (user) {
        this.userId = user.id

        this.profileService.getUserProfile(this.userId).pipe(finalize(() => this.spinnerService.hideSpinner())).subscribe(
          (response) => {
            console.log("profile component" + JSON.stringify(response));
            this.user = response;
          },
          (error) => {
            console.log("profile component error:  " + error);
          }
        )

        this.loadUserCart(this.userId)
        this.loadUserWishList(this.userId);

        this.wishListUpdateSubscription = this.wishListService.wishListUpdated$.subscribe(() => {
          if (this.userId) {
            this.loadUserWishList(this.userId)
          }
        })

      }
    })

  }

  loadUserWishList(userId: string) {
    this.wishListService.getWishlistByUserId(userId).subscribe(
      (wishListResponse) => {
        this.userWishlist = wishListResponse
        console.log("profile component wishlist success");
      }),
      (error: any) => {
        console.log("profile component wishlist error:  " + error);
      }
  }

  loadUserCart(userId: string): void {

    this.shoppingCartService.getShoppingCartByUserId(userId).subscribe({
      next: (cart) => {
        this.cartId = cart.shoppingCartId || null
      },
      error: (err) => {
        console.error("Error loading cart:", err)
        this.cartId = null
      },
    })
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab
  }

  startEditing(): void {
    this.isEditing = true
    this.successMessage = ""
    this.editedUser = { ...this.user }
    console.log(this.editedUser)
    if (!this.editedUser.address) {
      this.editedUser.address = { street: '', city: '', state: '', zipCode: '', country: '' }
    }
  }

  cancelEditing(): void {
    this.isEditing = false
    this.successMessage = ""
    this.editedUser = null
  }

  saveProfile(): void {
    this.isSaving = true

    this.profileService.updateUserProfile(this.userId, this.editedUser).subscribe(
      (response) => {
        this.successMessage = 'Profile updated successfully!';
        this.user = { ...response }
        setTimeout(() => {
          this.successMessage = '';
          this.isSaving = false;
          this.isEditing = false;
        }, 700)
      },
      (error) => {
        console.error(error)
        this.isSaving = false;
        this.isEditing = false;
      }
    )

  }

  removeFromWishlist(id: string | undefined): void {
    this.wishListService.removeProductWishList(this.userWishlist?.wishListId, id).subscribe((wishListResponse) => {
      this.userWishlist = wishListResponse
    })
  }

  addToCart(product: Product): void {

    if (!this.userId) {
      console.log("Please log in to add items to your cart.")
      return
    }

    this.isAddingToCart = true

    if (this.cartId) {
      this.shoppingCartService.addProductToCart(this.cartId, product).subscribe({
        next: () => {
          this.isAddingToCart = false
          this.shoppingCartService.notifyCartUpdated()
        },
        error: (err) => {
          console.error("Error adding product to cart:", err)
          this.isAddingToCart = false
        },
      })
    }
  }

  onLogOut() {
    this.userService.logOutUser();
  }

  openProductDetails(product: Product) {
    this.selectedProduct = product
    this.isModalOpen = true
  }

  closeModal(): void {
    this.isModalOpen = false
  }

}

