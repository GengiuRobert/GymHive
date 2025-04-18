import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, NgForm } from "@angular/forms"
import { RouterModule } from "@angular/router"

import { UserService } from "../../services/user.service"
import { UserProfileService } from "../../services/profile.service"
import { ShoppingCartService } from "../../services/shopping-cart.service"
import { WishlistService } from "../../services/wishlist.service"

import { RegisterData } from "../../models/register.model"
import { AuthResponseData } from "../../models/auth.model"
import { ShoppingCart } from "../../models/shopping-cart.model"
import { WishList } from "../../models/wishlist.model"


@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {

  constructor(private userService: UserService,
    private profileService: UserProfileService,
    private shoppingCartService: ShoppingCartService,
    private wishListService: WishlistService) { }

  userData: RegisterData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  }

  isSubmitting = false
  errorMessage = ""

  onSubmit(form: NgForm): void {

    this.isSubmitting = true
    this.errorMessage = ""

    if (!form.valid) {
      this.errorMessage = "Form is invalid!"
      this.isSubmitting = false;
      return
    }

    if (this.userData.password !== this.userData.confirmPassword) {
      this.errorMessage = "Passwords do not match"
      this.isSubmitting = false
      return
    }
    this.userService.signUpUser(this.userData).subscribe(

      (response: AuthResponseData) => {

        this.profileService.createUserProfile(response.localId, this.userData.firstName, this.userData.lastName, this.userData.email).subscribe(
          (profileResponse) => {
            console.log("Profile created successfully:", profileResponse);
          },
          (profileError) => {
            this.errorMessage = profileError.message || "Error creating user profile.";
            this.isSubmitting = false;
          }
        )

        const newCart: ShoppingCart = {
          userId: response.localId,
          userEmail: this.userData.email,
        };

        this.shoppingCartService.createShoppingCart(newCart).subscribe(
          (cartResponse) => {
            console.log("Shopping cart created:", cartResponse);
          },
          (cartError) => {
            console.error("Error creating shopping cart:", cartError);
          }
        );

        const newWishList: WishList = {
          userId: response.localId,
          userEmail: this.userData.email,
        }

        this.wishListService.createWishList(newWishList).subscribe(
          (wishlistResponse) => {
            console.log("Wishlist created:", wishlistResponse);
          },
          (wishlistError) => {
            console.error("Error creating wishlist:", wishlistError);
          }
        );

        form.reset();
      },
      (error) => {
        this.errorMessage = "Sign-up failed. Please try again.";
        console.error('Error during sign-up:', error);
        this.isSubmitting = false;
        form.reset();
      }
    );

  }

}

