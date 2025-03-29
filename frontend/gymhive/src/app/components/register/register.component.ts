import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
  registerData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  }

  isSubmitting = false
  errorMessage = ""

  constructor() { }

  onSubmit(): void {
    this.isSubmitting = true
    this.errorMessage = ""

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = "Passwords do not match"
      this.isSubmitting = false
      return
    }

  }
}

