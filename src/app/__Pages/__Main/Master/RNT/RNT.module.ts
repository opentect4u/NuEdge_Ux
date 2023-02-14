import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RNTComponent } from './RNT.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { MatTableModule } from '@angular/material/table';
import { RntModificationComponent } from './rntModification/rntModification.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { ReplacePipe } from 'src/app/__Pipes/replace.pipe';
const __routes: Routes = [{ path: '', component: RNTComponent }]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(__routes),
    SearchModule,
    MatTableModule,
    MatDialogModule,
    ReactiveFormsModule,
    OverlayModule,
    DragDropModule,
    MatButtonToggleModule,
  ],
  declarations: [RNTComponent,RntModificationComponent,ReplacePipe]
})
export class RNTModule {

  constructor() {
    console.log('RNT Module Loaded');
  }
}
