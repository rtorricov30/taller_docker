import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Course, Item } from '../models/item.model';

@Injectable({
  providedIn: 'root'
})

export class ItemService {
 private env = (window as any).env;
  //private readonly apiUrl =  'http://localhost:5124/';
  private readonly apiUrl = this.env?.apiBaseUrl == '${API_BASE_URL}'?  'http://localhost:5124/': this.env?.apiBaseUrl;
  private http = inject(HttpClient);

  getCourses(): Observable<Course[]> {
    console.log(this.apiUrl);
    return this.http.get<Course[]>(this.apiUrl+'course-list');
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl+'Course-search'}/${id}`);
  }

  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(this.apiUrl+'Course', course);
  }

  updateCourse(course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl+'Course'}/${course.id}`, course);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl+'Course'}/${id}`);
  }
}
