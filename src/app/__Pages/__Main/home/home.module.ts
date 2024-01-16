import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { ViewComponent } from './common/view/view.component';
import { MenuTilesComponent } from './common/menuTiles/menuTiles.component';
import { ShortNumberPipe } from 'src/app/__Pipes/short-number.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
/*********** OVERLAY PANNEL MODULE *****/
import {OverlayPanelModule} from 'primeng/overlaypanel';
/************END **********************/
/******** Material ToolTip */
import {MatTooltipModule} from '@angular/material/tooltip';
import { ChartModule } from 'src/app/__Core/chart/chart.module';
/**** END*/
const routes: Routes = [
  { path: '', component: HomeComponent,data:{breadcrumb: null} }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatButtonModule,
    OverlayPanelModule,
    MatTooltipModule,
    ChartModule
  ],
  declarations: [HomeComponent,ViewComponent,MenuTilesComponent,ShortNumberPipe]
})
export class HomeModule {}
