import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EmailOrderRequest } from '../models/email-request.model';

@Injectable({ providedIn: 'root' })
export class EmailService {

    private baseUrl = 'http://localhost:8080/api';

    constructor(private http: HttpClient) { }

    sendOrderEmail(payload: EmailOrderRequest): Observable<any> {
        return this.http.post(`${this.baseUrl}/email`, payload);
    }

    createOrder(payload: EmailOrderRequest): Observable<string> {
        return this.http.post(`${this.baseUrl}/email/add-order`, payload, { responseType: 'text' });
    }

    getOrdersByUserId(userId: string): Observable<EmailOrderRequest[]> {
        return this.http.get<EmailOrderRequest[]>(`${this.baseUrl}/email/get-orders-by-user-id/${userId}`)
    }

    getOrderByUserIdAndOrderId(userId: string, firestoreID: string): Observable<EmailOrderRequest> {
        return this.http.get<EmailOrderRequest>(`${this.baseUrl}/email/get-specific-order-by-order-id/${userId}/${firestoreID}`)
    }
}
