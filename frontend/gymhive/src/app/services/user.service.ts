import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RegisterData } from "../models/register.model";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Router } from "@angular/router";

import { LoginData } from "../models/login.model";
import { User } from "../models/user.model";
import { AuthResponseData } from "../models/auth.model";

@Injectable({ providedIn: 'root' })

export class UserService {

    private baseUrl = 'http://localhost:8080/api/auth';
    user = new BehaviorSubject<User | null>(null);

    constructor(private http: HttpClient,private router:Router) { }

    //methods related to authentication of a user
    signUpUser(userData: RegisterData): Observable<any> {

        let my_url = this.baseUrl + "/signup";

        let singUpData = {
            email: userData.email,
            password: userData.password,
            returnSecureToken: true
        }

        return this.http.post<AuthResponseData>(my_url, singUpData);

    }

    logInUser(userData: LoginData): Observable<any> {

        let my_url = this.baseUrl + "/login";

        let logInData = {
            email: userData.email,
            password: userData.password,
            returnSecureToken: true
        }

        return this.http.post<AuthResponseData>(my_url, logInData).pipe(
            tap(response => {
                this.handleAuthentication(
                    response.email,
                    response.localId,
                    response.idToken,
                    +response.expiresIn
                );
            })
        );

    }

    logOutUser() {
        this.user.next(null);
        console.log('User logged out!');
        this.router.navigate(['/login']);
    }

    getId() {
        return this.user.getValue()?.id;
    }

    private handleAuthentication(
        email: string,
        userId: string,
        token: string,
        expiresIn: number
    ) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
        localStorage.setItem('userData', JSON.stringify(user)); // store user in local storage
    }

}