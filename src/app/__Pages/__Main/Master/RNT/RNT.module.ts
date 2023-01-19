import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RNTComponent } from './RNT.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatDialogModule } from '@angular/material/dialog';
import { RNTmodificationComponent } from './RNTmodification/RNTmodification.component';
import { MatTableModule } from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
const __routes: Routes = [{ path: '', component: RNTComponent }]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(__routes),
    SearchModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule
  ],
  declarations: [RNTComponent, RNTmodificationComponent]
})
export class RNTModule {

  constructor() {
    console.log('RNT Module Loaded');
  }
}
