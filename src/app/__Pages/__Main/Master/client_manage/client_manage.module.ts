import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client_manageComponent } from './client_manage.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

const routes: Routes = [{path:'',component:Client_manageComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule
  ],
  declarations: [Client_manageComponent]
})
export class Client_manageModule {
  constructor() {
    console.log("Client_manageModule Loaded");
  }
 }
