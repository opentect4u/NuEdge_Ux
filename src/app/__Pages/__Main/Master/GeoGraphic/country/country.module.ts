import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryComponent } from './country.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: '',
  component: CountryComponent,
  data:{breadcrumb:'Country'},
  children:[
    {
      path:'home',
      loadChildren:()=> import('./home/country-home.module').then(home => home.CountryHomeModule)
    },
    {
      path:'uploadcountry',
      loadChildren:()=> import('./UploadCsv/upload-csv.module').then(uploadCSV => uploadCSV.UploadCsvModule),
      data:{breadcrumb:'Upload Country'},
    },
    {
      path:'',
      redirectTo:'home',
      pathMatch:'full'
    }
  ]
}];

@NgModule({
  declarations: [CountryComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class CountryModule {}
