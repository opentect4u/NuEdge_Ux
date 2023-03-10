import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RNTComponent } from './RNT.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
import { RntModificationComponent } from './rntModification/rntModification.component';
import { ReplacePipe } from 'src/app/__Pipes/replace.pipe';
import { RntrptComponent } from './rntRpt/rntRpt.component';
import { SharedModule } from 'src/app/shared/shared.module';
const __routes: Routes = [{ path: '', component: RNTComponent}]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(__routes),
    SearchModule,
    SharedModule
  ],
  declarations: [
    RNTComponent,
    RntModificationComponent,
    RntrptComponent,
    ReplacePipe]
})
export class RNTModule {

  constructor() {
    console.log('RNT Module Loaded');
  }
}
