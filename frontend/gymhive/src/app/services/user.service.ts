import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RegisterData } from "../models/register.model";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })

export class UserService {

    private baseUrl = 'http://localhost:8080/api/auth';

    constructor(private http: HttpClient) { }

    //methods related to authentication of a user
    signUpUser(userData: RegisterData) : Observable<any>  {

        let my_url = this.baseUrl + "/signup";

        let singUpData = {
            email: userData.email,
            password: userData.password,
            returnSecureToken: true
        }

        return this.http.post(my_url, singUpData);

    }

}