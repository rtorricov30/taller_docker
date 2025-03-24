import { Component, OnInit, inject } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule 
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { switchMap, of } from 'rxjs';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ItemService } from '../../services/item.service';
import { Course } from '../../models/item.model';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    RouterLink,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEditMode ? 'Editar' : 'Nuevo' }} Curso</mat-card-title>
        </mat-card-header>
        
        <mat-progress-bar *ngIf="isSubmitting" mode="indeterminate"></mat-progress-bar>
        
        <form [formGroup]="courseForm" (ngSubmit)="onSubmit()">
          <mat-card-content>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre del curso</mat-label>
              <input matInput formControlName="name" placeholder="Introduzca el nombre curso">
              <mat-error *ngIf="courseForm.get('name')?.hasError('required')">
                campo requerido
              </mat-error>
            </mat-form-field>
                                                                       
          </mat-card-content>
          
          <mat-divider></mat-divider>
          
          <mat-card-actions>
            <button 
              mat-button 
              type="button" 
              routerLink="/courses">
              <mat-icon>arrow_back</mat-icon> Cancelar
            </button>
            <button 
              mat-raised-button 
              color="primary" 
              type="submit"
              [disabled]="courseForm.invalid || isSubmitting">
              <mat-icon>save</mat-icon> Guardar
            </button>
          </mat-card-actions>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    
    .row {
      display: flex;
      gap: 20px;
    }
    
    .column {
      flex: 1;
    }
    
    .slide-toggle-container {
      margin: 20px 0;
    }
    
    mat-card-actions {
      display: flex;
      justify-content: space-between;
      padding: 16px;
    }
  `]
})
export class itemForm implements OnInit {
  private fb = inject(FormBuilder);
  private courseService = inject(ItemService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  
  courseForm!: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  courseId?: number;

  ngOnInit(): void {
    this.initForm();
    
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id && id !== 'new') {
          this.isEditMode = true;
          this.courseId = +id;
          return this.courseService.getCourseById(+id);
        }
        return of(null);
      })
    ).subscribe({
      next: (course) => {
        if (course) {
          this.courseForm.patchValue(course);
        }
      },
      error: (error) => {
        console.error('Error al cargar el curso', error);
        this.showSnackBar('Error al cargar el curso', 'error');
      }
    });
  }

  initForm(): void {
    this.courseForm = this.fb.group({
      name: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const courseData: Course = this.courseForm.value;

    const request = this.isEditMode
      ? this.courseService.updateCourse({ ...courseData, id: this.courseId })
      : this.courseService.createCourse(courseData);

    request.subscribe({
      next: () => {
        this.showSnackBar(
          `Curso ${this.isEditMode ? 'actualizado' : 'creado'} correctamente`, 
          'success'
        );
        this.router.navigate(['/courses']);
      },
      error: (error) => {
        console.error('Error al guardar el curso', error);
        this.showSnackBar('Error al guardar el curso', 'error');
        this.isSubmitting = false;
      }
    });
  }

  private showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: type === 'error' ? ['error-snackbar'] : ['success-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}