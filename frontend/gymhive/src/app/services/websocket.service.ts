import { Injectable } from "@angular/core";
import { Client, Message, StompConfig } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from "rxjs";
import SockJS from 'sockjs-client';

import { UserService } from "./user.service";

import { PriceChangeNotification } from "../models/pricechange-notification.model";

@Injectable({ providedIn: 'root' })
export class WebSocketService {

    private client: Client;
    private notificationSubject = new BehaviorSubject<PriceChangeNotification | null>(null);
    private connected = false;
    private userId: string | null = null;
    private processedNotifications = new Set<string>()

    constructor(private userService: UserService) {
        const stompConfig: StompConfig = {
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            debug: (msg: string) => {
                console.log('[STOMP]', msg);
            },
            reconnectDelay: 5000
        };

        this.client = new Client(stompConfig);
        this.client.onConnect = (frame) => this.onConnected(frame);
        this.client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Details: ' + frame.body);
        };

        this.userService.user.subscribe(user => {
            if (user && user.id) {
                this.userId = user.id;
                this.connect();
            } else {
                this.userId = null;
                this.disconnect();
            }
        });
    }

    public connect() {
        if (!this.connected && !this.client.active) {
            this.client.activate();
        }
    }

    public disconnect() {
        if (this.client.active) {
            this.client.deactivate();
            this.connected = false;
        }
    }

    private onConnected(frame: any) {

        this.connected = true;
        console.log('Connected to WebSocket');

        this.client.subscribe('/topic/notifications', (msg: Message) => {
            try {
                const notification = JSON.parse(msg.body) as PriceChangeNotification;

                // const notificationKey = `${notification.type}_${notification.productId}_${notification.timestamp}`

                // if (!this.processedNotifications.has(notificationKey)) {
                //     this.processedNotifications.add(notificationKey)
                //     this.notificationSubject.next(notification)
                // }

                //incearca asta sa vezi daca e ok, ii dai uncomment, pe aia de jos o lasi cu comment 
                //this.notificationSubject.next(notification);
            } catch (e) {
                console.error('Error parsing notification:', e);
            }
        });

        if (this.userId) {
            this.client.subscribe(`/topic/user/${this.userId}/notifications`, (msg: Message) => {
                try {
                    const notification = JSON.parse(msg.body) as PriceChangeNotification;

                    // const notificationKey = `${notification.type}_${notification.productId}_${notification.timestamp}`

                    // if (!this.processedNotifications.has(notificationKey)) {
                    //     this.processedNotifications.add(notificationKey)
                    //     this.notificationSubject.next(notification)
                    // }

                    this.notificationSubject.next(notification);
                } catch (e) {
                    console.error('Error parsing user notification:', e);
                }
            });

            // Inform the server that this user is subscribing
            this.client.publish({
                destination: `/app/user/${this.userId}/subscribe`,
                body: JSON.stringify({ userId: this.userId })
            });
        }
    }

    public get notifications$(): Observable<PriceChangeNotification | null> {
        return this.notificationSubject.asObservable();
    }

    public sendMessage(msg: string) {
        if (this.connected) {
            this.client.publish({
                destination: '/app/sendMessage',
                body: msg
            });
        } else {
            console.warn('Cannot send message: WebSocket not connected');
        }
    }

}