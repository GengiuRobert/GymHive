import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, RouterModule } from "@angular/router"
import { CategorySidebarComponent } from "../category-sidebar/category-sidebar.component"

@Component({
  selector: "app-category-display",
  standalone: true,
  imports: [CommonModule, RouterModule, CategorySidebarComponent],
  templateUrl: "./category-display.component.html",
  styleUrls: ["./category-display.component.css"],
})
export class CategoryDisplayComponent {
  categoryType = ""
  subcategory: string | null = null
  featured: string | null = null
  categoryTitle = ""
  featuredTitle = ""

  dummyProducts = [
    {
      id: 1,
      name: "Premium Dumbbell Set",
      price: 129.99,
      image: "assets/image_1.png",
    },
    {
      id: 2,
      name: "Protein Powder",
      price: 49.99,
      image: "assets/image_12.png",
    },
    {
      id: 3,
      name: "Adjustable Bench",
      price: 179.99,
      image: "assets/image_1.png",
    },
    {
      id: 4,
      name: "Resistance Bands",
      price: 29.99,
      image: "assets/image_12.png",
    },
    {
      id: 5,
      name: "Kettlebell Set",
      price: 89.99,
      image: "assets/image_1.png",
    },
    {
      id: 6,
      name: "Yoga Mat",
      price: 24.99,
      image: "assets/image_12.png",
    },
  ]

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.subcategory = params.get("subcategory")
    })

    this.route.data.subscribe((data) => {
      this.categoryType = data["categoryType"] || ""
      this.featured = data["featured"] || null

      this.setCategoryTitle()
    })
  }

  private setCategoryTitle(): void {
    const formattedCategoryType = this.categoryType.charAt(0).toUpperCase() + this.categoryType.slice(1)

    if (this.subcategory) {
      const formattedSubcategory = this.subcategory.charAt(0).toUpperCase() + this.subcategory.slice(1)
      this.categoryTitle = `${formattedSubcategory} ${formattedCategoryType}`
    } else if (this.featured) {
      switch (this.featured) {
        case "new":
          this.featuredTitle = "New Arrivals"
          this.categoryTitle = `New ${formattedCategoryType}`
          break
        case "best-sellers":
          this.featuredTitle = "Best Sellers"
          this.categoryTitle = `Best Selling ${formattedCategoryType}`
          break
        case "top-rated":
          this.featuredTitle = "Top Rated Products"
          this.categoryTitle = `Top Rated ${formattedCategoryType}`
          break
        case "essentials":
          this.featuredTitle = "Workout Essentials"
          this.categoryTitle = `${formattedCategoryType} Essentials`
          break
        case "meal-prep":
          this.featuredTitle = "Meal Prep Solutions"
          this.categoryTitle = `Meal Prep ${formattedCategoryType}`
          break
        case "snacks":
          this.featuredTitle = "Healthy Snacks"
          this.categoryTitle = `Healthy ${formattedCategoryType} Snacks`
          break
        default:
          this.categoryTitle = formattedCategoryType
      }
    } else {
      this.categoryTitle = formattedCategoryType
    }
  }
}

