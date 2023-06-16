import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [
  {
     path:'',
     component: MainComponent,
     data:{breadcrumb:'Create Client Code'},
     children:[
      {
        path:'home',
        loadChildren:()=> import('./home/home.module').then(m => m.HomeModule)
      },
      {
        path:'clientmaster',
        loadChildren:()=> import('./addNew/client_manage/client-manage.module').then(m => m.ClientManageModule),

      },
      {
        path: 'addnew',
        loadChildren: () =>
          import('./addNew/add-new.module').then(
            (m) => m.AddNewModule
          ),
        data: {
          parentId: 4,
          id: 42,
          breadcrumb:" Add New",
          title: 'NuEdge - Client Add New Options',
          pageTitle: '',
          has_member: 'Y',
        },
      },
      {
        path:'',
        redirectTo:'home',
        pathMatch:'full'
      }
     ]
  }]
@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MainModule { }
