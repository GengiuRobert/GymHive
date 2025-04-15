import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/crudproducts.service';
import { Product } from '../../models/product.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, NgFor, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  products: Product[] = [];

  newProduct: Product = {
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    subCategoryId: '',
    imageUrl: ''
  };

  updateProductId: string = '';
  updatedProduct: Product = {
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    subCategoryId: '',
    imageUrl: ''
  };

  deleteProductId: string = '';


  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts(): void {
    this.productService.getAllProducts().subscribe(
      data => {
        this.products = data;
        console.log('Products loaded:', data);
      },
      error => console.error('Error loading products:', error)
    )
  }

  addProduct(): void {
    this.productService.addProduct(this.newProduct).subscribe(
      res => {
        console.log(res);
        this.getAllProducts();
        this.newProduct = { name: '', description: '', price: 0, categoryId: '',subCategoryId:'',imageUrl:'' };
      },
      error => console.error('Error adding product:', error)
    );
  }

  updateProduct(): void {
    this.productService.updateProduct(this.updateProductId, this.updatedProduct).subscribe(
      res => {
        console.log(res);
        this.getAllProducts();
        this.updateProductId = '';
        this.updatedProduct = { productId: '', name: '', description: '', price: 0, categoryId: '',subCategoryId:'',imageUrl:'' };
      },
      error => console.error('Error updating product:', error)
    );
  }

  deleteProduct(): void {
    this.productService.deleteProduct(this.deleteProductId).subscribe(
      res => {
        console.log(res);
        this.getAllProducts();
        this.deleteProductId = '';
      },
      error => console.error('Error deleting product:', error)
    );
  }

}
