import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { UserProfile } from "../models/profile.model";

@Injectable({ providedIn: 'root' })

export class UserProfileService {

    private baseUrl = 'http://localhost:8080/profiles';

    constructor(private http: HttpClient) { }

    createUserProfile(userId: string, firstName: string, lastName: string, email: string): Observable<any> {
        let my_url = this.baseUrl + "/add-profile";

        let createProfileData = {
            userId: userId,
            firstName: firstName,
            lastName: lastName,
            userEmail: email
        }

        return this.http.post(my_url, createProfileData, { responseType: 'text' });
    }

    getUserProfile(userId: string | undefined): Observable<any> {
        let my_url = this.baseUrl + "/get-profile-by-id/" + userId;

        return this.http.get(my_url);
    }

    updateUserProfile(userId: string | undefined, updatedUser: UserProfile): Observable<any>{
        let my_url = this.baseUrl + "/update-profile-by-id/" + userId;

        return this.http.put(my_url,updatedUser);
    }


}