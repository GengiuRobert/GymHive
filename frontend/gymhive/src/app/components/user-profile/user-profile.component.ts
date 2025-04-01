import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"

import { UserService } from "../../services/user.service"

@Component({
  selector: "app-user-profile",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  activeTab = "profile"

  user = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: {
      street: "123 Fitness Street",
      city: "Gymville",
      state: "CA",
      zipCode: "90210",
      country: "United States",
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
  editedUser: any
  isSaving = false
  successMessage = ""

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.editedUser = JSON.parse(JSON.stringify(this.user))
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab
  }

  startEditing(): void {
    this.isEditing = true
    this.editedUser = JSON.parse(JSON.stringify(this.user))
  }

  cancelEditing(): void {
    this.isEditing = false
  }

  saveProfile(): void {
    this.isSaving = true
  }

  removeFromWishlist(id: number): void {
    this.wishlist = this.wishlist.filter((item) => item.id !== id)
  }

  onLogOut(){
    this.userService.logOutUser();
  }


}

