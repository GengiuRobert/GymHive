import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpinnerService } from '../../services/spinner.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  imports: [NgIf],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css'
})
export class LoadingSpinnerComponent {
  public isLoading = false;
  private spinnerSub!: Subscription;

  constructor(public spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.spinnerSub = this.spinnerService.loadingSubject.subscribe(spinnerState => { this.isLoading = spinnerState; }
    );
  }

  ngOnDestroy(): void {
    this.spinnerSub.unsubscribe();
  }
}
