import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })

export class UserProfileService {

    private baseUrl = 'http://localhost:8080/profiles';

    constructor(private http: HttpClient) { }

    createUserProfile(userId: string, firstName: string, lastName: string): Observable<any> {
        let my_url = this.baseUrl + "/add-profile";

        let createProfileData = {
            userId: userId,
            firstName: firstName,
            lastName: lastName
        }

        console.log("profile Service" + JSON.stringify(createProfileData));

        return this.http.post(my_url, createProfileData, { responseType: 'text' });
    }

}