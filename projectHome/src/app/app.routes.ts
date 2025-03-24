import { Routes } from '@angular/router';
import { ItemListComponeznt } from './main/components/item-list/item-list.component';
import { itemForm } from './main/components/item-form/item-form.component';

export const routes: Routes = [
    { path: '', redirectTo: 'courses', pathMatch: 'full' },
    { path: 'courses', component: ItemListComponeznt },
    { path: 'courses/new', component: itemForm },
    { path: 'courses/:id', component: itemForm }, // Sin prerendering
    { path: '**', redirectTo: 'courses' }
  ];
  