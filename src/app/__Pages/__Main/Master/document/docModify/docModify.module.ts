import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocModifyComponent } from './docModify.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ClOutsideClickDirective } from 'src/app/__Directives/clOutsideClick.directive';

const routes: Routes = [{path:'',component:DocModifyComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule
  ],
  declarations: [DocModifyComponent,ClOutsideClickDirective]
})
export class DocModifyModule { }
