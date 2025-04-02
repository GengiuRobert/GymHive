import { Injectable } from "@angular/core"
import { CategoryItem } from "../components/category-display/category-display.component"

@Injectable({
    providedIn: "root",
})
export class CategoryService {
    private categories: CategoryItem[] = [
        {
            name: "Equipment",
            link: "/category/equipment",
            subcategories: ["Weights", "Machines", "Accessories", "Benches", "Racks", "Home Gym"],
            featured: [
                {
                    title: "New Arrivals",
                    image: "assets/image_1.png",
                    link: "/category/equipment/new",
                },
                {
                    title: "Best Sellers",
                    image: "assets/image_1.png",
                    link: "/category/equipment/best-sellers",
                },
            ],
            popularProducts: [
                {
                    name: "Adjustable Dumbbell Set",
                    image: "assets/image_1.png",
                    price: 299.99,
                    link: "/product/adjustable-dumbbell-set",
                },
                {
                    name: "Olympic Barbell",
                    image: "assets/image_1.png",
                    price: 199.99,
                    link: "/product/olympic-barbell",
                },
            ],
        },
        {
            name: "Supplements",
            link: "/category/supplements",
            subcategories: ["Protein", "Pre-workout", "Vitamins", "Creatine", "Weight Gainers", "BCAAs"],
            featured: [
                {
                    title: "New Formulas",
                    image: "assets/image_1.png",
                    link: "/category/supplements/new",
                },
                {
                    title: "Top Rated",
                    image: "assets/image_1.png",
                    link: "/category/supplements/top-rated",
                },
            ],
            popularProducts: [
                {
                    name: "Whey Protein Isolate",
                    image: "assets/image_1.png",
                    price: 59.99,
                    link: "/product/whey-protein-isolate",
                },
                {
                    name: "Pre-Workout Energy",
                    image: "assets/image_1.png",
                    price: 39.99,
                    link: "/product/pre-workout-energy",
                },
            ],
        },
        {
            name: "Apparel",
            link: "/category/apparel",
            subcategories: ["Men", "Women", "Accessories", "Footwear", "Compression", "Outerwear"],
            featured: [
                {
                    title: "New Collection",
                    image: "assets/image_1.png",
                    link: "/category/apparel/new",
                },
                {
                    title: "Workout Essentials",
                    image: "assets/image_1.png",
                    link: "/category/apparel/essentials",
                },
            ],
            popularProducts: [
                {
                    name: "Performance T-Shirt",
                    image: "assets/image_1.png",
                    price: 34.99,
                    link: "/product/performance-tshirt",
                },
                {
                    name: "Compression Leggings",
                    image: "assets/image_1.png",
                    price: 49.99,
                    link: "/product/compression-leggings",
                },
            ],
        },
        {
            name: "Nutrition",
            link: "/category/nutrition",
            subcategories: ["Meal Plans", "Snacks", "Drinks", "Healthy Foods", "Recipes", "Diet Plans"],
            featured: [
                {
                    title: "Meal Prep",
                    image: "assets/image_1.png",
                    link: "/category/nutrition/meal-prep",
                },
                {
                    title: "Healthy Snacks",
                    image: "assets/image_1.png",
                    link: "/category/nutrition/snacks",
                },
            ],
            popularProducts: [
                {
                    name: "Protein Bars (12 Pack)",
                    image: "assets/image_1.png",
                    price: 24.99,
                    link: "/product/protein-bars",
                },
                {
                    name: "BCAA Energy Drink",
                    image: "assets/image_1.png",
                    price: 29.99,
                    link: "/product/bcaa-energy-drink",
                },
            ],
        },
    ]

    constructor() { }

    getCategories(): CategoryItem[] {
        return this.categories
    }

    getCategoryByType(type: string): CategoryItem | undefined {
        return this.categories.find(
            (cat) => cat.name.toLowerCase() === type.toLowerCase() || cat.link.includes(`/${type.toLowerCase()}`),
        )
    }
}

