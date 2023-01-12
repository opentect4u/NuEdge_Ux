import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RNTComponent } from './RNT.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatDialogModule } from '@angular/material/dialog';
import { RNTmodificationComponent } from './RNTmodification/RNTmodification.component';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
const __routes: Routes = [{ path: '', component: RNTComponent }]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(__routes),
    SearchModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  declarations: [RNTComponent, RNTmodificationComponent]
})
export class RNTModule {

  constructor() {
    console.log('RNT Module Loaded');
  }
}
