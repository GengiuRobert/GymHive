import { Component } from '@angular/core';
import { CommonModule, Location } from "@angular/common"
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found-fallback',
  imports: [CommonModule, RouterModule],
  templateUrl: './not-found-fallback.component.html',
  styleUrl: './not-found-fallback.component.css'
})
export class NotFoundFallbackComponent {
  constructor(private location: Location) { }

  goBack(): void {
    this.location.back()
  }
}
