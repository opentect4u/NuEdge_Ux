import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NfoComponent } from './nfo.component';
import { RouterModule, Routes } from '@angular/router';
import { NforptComponent } from './Dialog/NfoRPT/nfoRpt.component';
import { NfomodificationComponent } from './Dialog/nfoModification/nfoModification.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabModule } from 'src/app/__Core/tab/tab.module';

const routes: Routes = [{ path: '', component: NfoComponent }];

@NgModule({
  declarations: [NfoComponent, NforptComponent, NfomodificationComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule,TabModule],
})
export class NfoModule {}
