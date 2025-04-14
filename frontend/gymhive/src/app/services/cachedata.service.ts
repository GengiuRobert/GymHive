import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class CacheService {
    private keyPrefix = 'GymHiveCache_'

    setDataToCache<T>(cache_entry_key: string, data_to_save: T, survive_time: number): void {
        const cacheObj = {
            timestamp: Date.now(),
            survive_time,
            data_to_save
        };
        localStorage.setItem(this.keyPrefix + cache_entry_key, JSON.stringify(cacheObj));
    }

    getDataFromCache<T>(cache_entry_key: string): T | null {
        const raw = localStorage.getItem(this.keyPrefix + cache_entry_key);
        if (!raw) {
            return null;
        }
        try {
            const cacheObj = JSON.parse(raw);
            const age = Date.now() - cacheObj.timestamp;
            if (age > cacheObj.ttl) {
                localStorage.removeItem(this.keyPrefix + cache_entry_key);
                return null;
            }
            return cacheObj.data as T;
        } catch (error) {
            console.error('Error parsing cached item', error);
            return null;
        }
    }

    removeItemFromCache(cache_entry_key: string): void {
        localStorage.removeItem(this.keyPrefix + cache_entry_key);
    }
}