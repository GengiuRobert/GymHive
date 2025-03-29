import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  featuredProducts = [
    {
      id: 1,
      name: "Premium Adjustable Dumbbell Set",
      category: "Equipment",
      price: 299.99,
      image: "assets/image_1.png",
    },
    {
      id: 2,
      name: "Performance Whey Protein",
      category: "Supplements",
      price: 59.99,
      image: "assets/image_12.png",
    },
  ]

  categories = [
    { name: "Equipment", link: "/category/equipment" },
    { name: "Supplements", link: "/category/supplements" },
    { name: "Apparel", link: "/category/apparel" },
    { name: "Nutrition", link: "/category/nutrition" },
  ]


  ngOnInit(): void {
    console.log("Simple home component initialized")
  }


}

