export interface PriceChangeNotification {
    type: string
    userId: string
    productId: string
    productName: string
    oldPrice: number
    newPrice: number
    imageUrl: string
    timestamp: number
    discountPercentage: number
}