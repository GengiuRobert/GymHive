import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, NgForm } from "@angular/forms"
import { RouterModule,Router } from "@angular/router"

import { UserService } from "../../services/user.service"

import { LoginData } from "../../models/login.model"
import { AuthResponseData } from "../../models/auth.model"


@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {

  constructor(private userService: UserService, private router:Router) { }

  userData: LoginData = {
    email: "",
    password: "",
    rememberMe: false,
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

    this.userService.logInUser(this.userData).subscribe(
      (logInResponse: AuthResponseData) => {
        console.log("Log In successfully:", logInResponse);
        this.router.navigate(['home']);
        form.reset();
      },
      (error) => {
        this.errorMessage = "Log-in failed. Please try again.";
        console.error('Error during log-in:', error);
        this.isSubmitting = false;
        form.reset();
      }
    );

  }

}

