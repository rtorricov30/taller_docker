import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule ,AsyncPipe, DatePipe, CurrencyPipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ItemService } from '../../services/item.service';
import { Course } from '../../models/item.model';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [ 
    CommonModule,
    NgIf, 
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Cursos</mat-card-title>
        </mat-card-header>
        <mat-card-content>
        <mat-card-actions>
          <button 
            mat-raised-button 
            color="primary" 
            [routerLink]="['/courses/new']">
            <mat-icon>add</mat-icon> Nuevo Curso
          </button>
        </mat-card-actions>
          <div *ngIf="dataSource; else loading">
            <div class="table-container">
            <table mat-table [dataSource]="dataSource" matSort>
      <!-- ID Column -->
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
        <td mat-cell *matCellDef="let item">{{ item.id }}</td>
      </ng-container>

      <!-- Name Column -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
        <td mat-cell *matCellDef="let item">{{ item.name }}</td>
      </ng-container>

      <!-- Date Created Column -->
      <ng-container matColumnDef="dateCreated">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Fecha de Creación</th>
        <td mat-cell *matCellDef="let item">{{ item.dateCreated ? (item.dateCreated | date:'dd/MM/yyyy') : 'Sin fecha' }}</td>

      </ng-container>
           <!-- Acciones Column -->
           <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef class="center-align">Acciones</th>
                  <td mat-cell *matCellDef="let course" class="center-align actions-cell">
                    <button 
                      mat-icon-button 
                      color="primary" 
                      [routerLink]="['/courses', course.id]"
                      matTooltip="Editar">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button 
                      mat-icon-button 
                      color="warn" 
                      (click)="deleteCourse(course.id!)"
                      matTooltip="Eliminar">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>

              <mat-paginator 
                [pageSizeOptions]="[5, 10, 25]"
                showFirstLastButtons
                aria-label="Seleccionar página de cursos">
              </mat-paginator>
            </div>
          </div>

          <ng-template #loading>
            <div class="loading-container">
              <mat-spinner diameter="40"></mat-spinner>
            </div>
          </ng-template>
        </mat-card-content>

      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .table-container {
      position: relative;
      min-height: 200px;
      overflow: auto;
    }
    
    table {
      width: 100%;
    }
    
    .right-align {
      text-align: right;
    }
    
    .center-align {
      text-align: center;
    }
    
    .actions-cell {
      white-space: nowrap;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }
  `]
})
export class ItemListComponeznt implements OnInit {
  private courseService = inject(ItemService);
  private dialog = inject(MatDialog);
  
  displayedColumns: string[] = [ 'id', 'name', 'dateCreated','actions'];
  
  dataSource: MatTableDataSource<Course> | null = null;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.dataSource = new MatTableDataSource(courses);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => console.error('Error al cargar los cursos', error)
    });
  }

  deleteCourse(id: number): void {
    if (confirm('¿Estás seguro de eliminar este curso?')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => this.loadCourses(),
        error: (error) => console.error('Error al eliminar el curso', error)
      });
    }
  }
}