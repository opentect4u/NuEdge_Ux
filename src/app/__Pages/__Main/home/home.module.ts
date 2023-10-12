import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { ViewComponent } from './common/view/view.component';
import { MenuTilesComponent } from './common/menuTiles/menuTiles.component';

const routes: Routes = [
  { path: '', component: HomeComponent,data:{breadcrumb: null} }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomeComponent,ViewComponent,MenuTilesComponent]
})
export class HomeModule {}
