import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, Validators, type FormGroup } from "@angular/forms"
import { Subscription } from "rxjs"

import { UserProfile } from "../../models/profile.model"

@Component({
  selector: 'app-shipping-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './shipping-form.component.html',
  styleUrl: './shipping-form.component.css'
})
export class ShippingFormComponent implements OnInit, OnDestroy {
  @Input() formGroup!: FormGroup
  @Input() userProfile: UserProfile | null = null
  @Output() formSubmit = new EventEmitter<any>()
  @Output() autofillProfile = new EventEmitter<void>()
  @Output() countryChange = new EventEmitter<string>()

  selectedCountry = "Romania"
  private countrySubscription: Subscription | null = null

  countries = ["Romania", "United States"]

  // US States
  usStates = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ]
  roStates = [
    "Alba",
    "Arad",
    "Argeș",
    "Bacău",
    "Bihor",
    "Bistrița-Năsăud",
    "Botoșani",
    "Brăila",
    "Brașov",
    "București",
    "Buzău",
    "Călărași",
    "Caraș-Severin",
    "Cluj",
    "Constanța",
    "Covasna",
    "Dâmbovița",
    "Dolj",
    "Galați",
    "Giurgiu",
    "Gorj",
    "Harghita",
    "Hunedoara",
    "Ialomița",
    "Iași",
    "Ilfov",
    "Maramureș",
    "Mehedinți",
    "Mureș",
    "Neamț",
    "Olt",
    "Prahova",
    "Sălaj",
    "Satu Mare",
    "Sibiu",
    "Suceava",
    "Teleorman",
    "Timiș",
    "Tulcea",
    "Vâlcea",
    "Vaslui",
    "Vrancea",
  ]

  ngOnInit(): void {
    this.countrySubscription = this.formGroup.get("country")?.valueChanges.subscribe((country) => {
      this.selectedCountry = country
      this.updateValidators()
      this.countryChange.emit(country)
    }) || null

    this.selectedCountry = this.formGroup.get("country")?.value || "Romania"
    this.updateValidators()
  }

  ngOnDestroy(): void {
    if (this.countrySubscription) {
      this.countrySubscription.unsubscribe()
    }
  }

  updateValidators(): void {
    const zipControl = this.formGroup.get("zipCode")
    const phoneControl = this.formGroup.get("phone")
    const stateControl = this.formGroup.get("state")

    if (zipControl && phoneControl && stateControl) {
      zipControl.clearValidators()
      phoneControl.clearValidators()

      if (this.selectedCountry === "Romania") {
        zipControl.setValidators([
          Validators.required,
          Validators.pattern(/^[0-9]{6}$/),
        ])
        phoneControl.setValidators([
          Validators.required,
          Validators.pattern(/^07[0-9]{8}$/),
        ])
      } else {
        zipControl.setValidators([
          Validators.required,
          Validators.pattern(/^\d{5}(-\d{4})?$/),
        ])
        phoneControl.setValidators([
          Validators.required,
          Validators.pattern(/^\d{10}$/),
        ])
      }

      stateControl.setValue("")

      zipControl.updateValueAndValidity()
      phoneControl.updateValueAndValidity()
    }
  }

  get hasProfileData(): boolean {
    return !!this.userProfile
  }

  useProfileData(): void {
    this.autofillProfile.emit()
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.formSubmit.emit(this.formGroup.value)
    } else {
      this.markFormGroupTouched(this.formGroup)
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched()
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup)
      }
    })
  }
}
