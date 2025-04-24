import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RegisterData } from "../models/register.model";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Router } from "@angular/router";

import { LoginData } from "../models/login.model";
import { User } from "../models/user.model";
import { AuthResponseData } from "../models/auth.model";
import { UserActivity } from "../models/user-activity.model";

@Injectable({ providedIn: 'root' })

export class UserService {

    private baseUrl = 'http://localhost:8080/api/auth';
    private activityUrl = 'http://localhost:8080/activity'
    user = new BehaviorSubject<User | null>(null);

    constructor(private http: HttpClient, private router: Router) {
        this.autoLogin();
    }

    //methods related to authentication of a user
    signUpUser(userData: RegisterData): Observable<any> {
        let my_url = this.baseUrl + "/signup";

        let signUpData = {
            email: userData.email,
            password: userData.password,
            returnSecureToken: true
        };

        return this.http.post<AuthResponseData>(my_url, signUpData).pipe(
            tap(response => {
                this.sendVerificationEmail(response.idToken).subscribe(
                    () => console.log('Verification mail sent!'),
                    err => console.error('Error sending verification email:', err)
                );
            })
        );
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

    sendVerificationEmail(idToken: string) {

        let my_url = this.baseUrl + "/verify-email";

        let sendVerificationEmailData = {
            requestType: "VERIFY_EMAIL",
            idToken: idToken
        }


        return this.http.post(my_url, sendVerificationEmailData, { responseType: 'text' });
    }

    logOutUser() {
        this.user.next(null);
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

    autoLogin() {
        if (typeof window === 'undefined' || !window.localStorage) {
            return;
        }
        const userDataStr = localStorage.getItem('userData');
        if (!userDataStr) {
            return;
        }
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(userDataStr);
        if (!userData) {
            return;
        }
        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );
        if (loadedUser.token) {
            this.user.next(loadedUser);
        }
    }

    recordActivity(userAction: UserActivity): Observable<string> {
        const my_url = this.activityUrl + '/record-activity'

        return this.http.post(my_url, userAction, { responseType: 'text' })
    }

    getAllActivities(): Observable<UserActivity[]> {
        const my_url = this.activityUrl + '/get-all-activities'

        return this.http.get<UserActivity[]>(my_url);
    }

}