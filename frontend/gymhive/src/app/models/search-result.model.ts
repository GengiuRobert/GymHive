import { Product } from "./product.model"

export interface SearchResult {
    product: Product
    relevanceScore: number
}