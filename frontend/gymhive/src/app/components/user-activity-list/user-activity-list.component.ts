import { Component, OnInit, ViewChild } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatTableModule, MatTableDataSource } from "@angular/material/table"
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator"
import { MatSort, MatSortModule } from "@angular/material/sort"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatChipsModule } from "@angular/material/chips"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { UserService } from "../../services/user.service"
import { UserActivity } from "../../models/user-activity.model"

@Component({
  selector: "app-user-activity-list",
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
  ],
  templateUrl: "./user-activity-list.component.html",
  styleUrls: ["./user-activity-list.component.css"],
})

export class UserActivityListComponent implements OnInit {
  displayedColumns: string[] = ["timestamp", "userEmail", "action"]
  dataSource = new MatTableDataSource<UserActivity>([])
  isLoading = true

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.loadUserActivities()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  loadUserActivities(): void {
    this.isLoading = true
    this.userService.getAllActivities().subscribe({
      next: (activities) => {
        this.dataSource.data = activities
        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading user activities", error)
        this.snackBar.open("Error loading user activities", "Close", { duration: 3000 })
        this.isLoading = false
      },
    })
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

}
