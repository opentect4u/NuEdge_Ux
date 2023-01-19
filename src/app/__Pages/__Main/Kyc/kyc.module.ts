import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KycComponent } from './kyc.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { KyModificationComponent } from './kyModification/kyModification.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';

const routes: Routes = [{ path: '', component: KycComponent }]

@NgModule({
  imports: [
    CommonModule,
    SearchModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule
  ],
  declarations: [KycComponent,KyModificationComponent]
})
export class KycModule {

  constructor() {
    console.log('Kyc Module Loaded');
  }
}
