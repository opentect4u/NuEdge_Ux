import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './common/header/header.component';
import { MenuDropdownDirective } from 'src/app/__Directives/menuDropdown.directive';
import { ListComponent } from './common/list/list.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrmbsComponent } from './common/brdCrmbs/breadCrmbs.component';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SidebarModule } from 'primeng/sidebar';
import { AuthGuard } from 'src/app/__Gaurd/canActivate/auth.guard';
// import { SignInGuard } from 'src/app/__Gaurd/canActivate/sign-in.guard';
const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate:[AuthGuard],
    canActivateChild:[AuthGuard],
    data:{breadcrumb:'Home'},
    children: [
      {
        path: 'home',
        loadChildren: () => import('../__Main/home/home.module').then(m => m.HomeModule),
        data: { id: 3, title: "NuEdge - Home", pageTitle: "", has_menubar: 'Y' }
      },
      {
        path:'mailback',
        loadChildren:()=> import('./MailBack/mailback.module').then(m => m.MailbackModule),
        data: { id: 14, title: "NuEdge - MailBack", pageTitle: "", has_menubar: 'Y'}
      },
      {
        path:'master',
        loadChildren:()=> import('./Master/MainMst.module').then(m => m.MainMstModule),
        data:{id:4,title:"NuEdge - Master",pageTitle:"",has_menubar:"Y"}
      },
      {
        path:'operations',
        loadChildren:()=> import('./Operations/MainOp.module').then(m => m.MainOpModule),
        data:{id:5,title: "NuEdge - Operation Dashboard", pageTitle: "Operation Dashboard" }
      } ,
      {
         path:'product',
         loadChildren:()=> import('../__Main/Products/product.module').then(m => m.ProductModule),
         data:{id:10,title:"NuEdge - Product", pageTitle:"Product"}
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },

    ]
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    ScrollTopModule,
    SidebarModule
  ],
  declarations: [
    MainComponent,
    HeaderComponent,
    ListComponent,
    BreadcrmbsComponent,
    MenuDropdownDirective
  ],
})
export class MainModule {
  constructor() {
    console.log('Main Module Loaded');
  }
}
