import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {

  loginData = {
    email: "",
    password: "",
    rememberMe: false,
  }

  isSubmitting = false
  errorMessage = ""


  onSubmit(): void {
    this.isSubmitting = true
    this.errorMessage = ""
  }
}

