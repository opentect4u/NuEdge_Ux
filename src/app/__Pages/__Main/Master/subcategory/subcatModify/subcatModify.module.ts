import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubcatModifyComponent } from './subcatModify.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
const routes: Routes = [{path:'',component:SubcatModifyComponent}]

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
  declarations: [SubcatModifyComponent]
})
export class SubcatModifyModule { }
