import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualUpdateComponent } from './manual-update.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ManualUpdateComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadChildren: () =>
          import('./Home/home.module').then((m) => m.HomeModule),
      },
      {
        path:'financial',
        loadChildren:()=>
        import('./Financial/financial.module').then(m => m.FinancialModule)
      },
      {
        path:'nfo',
        loadChildren:()=>
        import('./NFO/nfo.module').then(m => m.NfoModule)
      },
      {
        path:'nonfinancial',
        loadChildren:()=>import('./NonFinancial/nonfinancial.module').then(m => m.NonfinancialModule)
      }
    ],
  },
];

@NgModule({
  declarations: [ManualUpdateComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ManualUpdateModule {}
