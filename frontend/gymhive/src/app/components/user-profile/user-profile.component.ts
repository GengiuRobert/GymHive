import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"

import { UserService } from "../../services/user.service"
import { UserProfileService } from "../../services/profile.service"

import { UserProfile } from "../../models/profile.model"
import { response } from "express"

@Component({
  selector: "app-user-profile",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  activeTab = "profile"

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

  editedUser: any

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

  wishlist = [
    {
      id: 1,
      name: "Smart Fitness Watch",
      price: 199.99,
      image: "https://via.placeholder.com/150?text=Fitness+Watch",
    },
    {
      id: 2,
      name: "Yoga Mat Premium",
      price: 59.99,
      image: "https://via.placeholder.com/150?text=Yoga+Mat",
    },
  ]

  isEditing = false
  isSaving = false
  successMessage = ""
  userId: string | undefined = ""

  constructor(private userService: UserService, private profileService: UserProfileService) { }

  ngOnInit(): void {
    this.userService.user.subscribe(user => {
      this.userId = this.userService.getId();
    })

    this.profileService.getUserProfile(this.userId).subscribe(
      (response) => {
        console.log("profile component" + JSON.stringify(response));
        this.user = response;
      }
    )

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

  removeFromWishlist(id: number): void {
    this.wishlist = this.wishlist.filter((item) => item.id !== id)
  }

  onLogOut() {
    this.userService.logOutUser();
  }


}

