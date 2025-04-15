import { Injectable } from "@angular/core"
import { BehaviorSubject, Observable, of } from "rxjs"
import { map } from "rxjs/operators"

import { Product } from "../models/product.model"
import { SearchResult } from "../models/search-result.model"

import { ProductService } from "./crudproducts.service"

@Injectable({
    providedIn: "root",
})
export class SearchService {

    private searchResultsSubject = new BehaviorSubject<SearchResult[]>([])
    public searchResults$ = this.searchResultsSubject.asObservable()

    private selectedProductSubject = new BehaviorSubject<Product | null>(null)
    public selectedProduct$ = this.selectedProductSubject.asObservable()

    private isSearchingSubject = new BehaviorSubject<boolean>(false)
    public isSearching$ = this.isSearchingSubject.asObservable()

    constructor(private productService: ProductService) { }

    search(query: string): Observable<SearchResult[]> {
        if (!query || query.trim().length < 2) {
            this.searchResultsSubject.next([])
            return of([])
        }

        this.isSearchingSubject.next(true)

        return this.productService.getAllProducts().pipe(
            map((products) => {
                const results = this.findMatches(products, query)
                this.searchResultsSubject.next(results)
                this.isSearchingSubject.next(false)
                return results
            }),
        )
    }

    private findMatches(products: Product[], query: string): SearchResult[] {
        const normalizedQuery = query.toLowerCase().trim()
        const queryTerms = normalizedQuery.split(/\s+/)

        const results = products.map((product) => {

            const normalizedName = product.name.toLowerCase()
            const normalizedDescription = product.description?.toLowerCase() || ""

            let relevanceScore = 0

            // Exact match in name (highest relevance)
            if (normalizedName === normalizedQuery) {
                relevanceScore += 100
            }

            // Name starts with query
            if (normalizedName.startsWith(normalizedQuery)) {
                relevanceScore += 50
            }

            // Name contains query
            if (normalizedName.includes(normalizedQuery)) {
                relevanceScore += 30
            }

            // Check for individual terms in name and description
            queryTerms.forEach((term) => {
                if (normalizedName.includes(term)) {
                    relevanceScore += 10
                }

                if (normalizedDescription.includes(term)) {
                    relevanceScore += 5
                }
            })

            return { product, relevanceScore }
        })

        return results
            .filter((result) => result.relevanceScore > 0)
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, 5) // Limit to top 5 results
    }

    selectProduct(product: Product): void {
        this.selectedProductSubject.next(product)
    }

    clearResults(): void {
        this.searchResultsSubject.next([])
    }
}
