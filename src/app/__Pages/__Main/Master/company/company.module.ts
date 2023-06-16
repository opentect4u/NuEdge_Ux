import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './company.component';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { DirectorDtlsComponent } from './directorDtls/director-dtls.component';
import { BankComponent } from './bank/bank.component';
import { ShareHolderComponent } from './share-holder/share-holder.component';
import { DocumentLockerComponent } from './document-locker/document-locker.component';
import { ProductMappingComponent } from './product-mapping/product-mapping.component';
import { LicenseDtlsComponent } from './license-dtls/license-dtls.component';
import { LoginPwdComponent } from './login-pwd/login-pwd.component';
import { PertnershipDtlsComponent } from './pertnership-dtls/pertnership-dtls.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreDropdownComponent } from './common/core-dropdown/core-dropdown.component';

import { InputTextModule } from 'primeng/inputtext';
import { ImageModule } from 'primeng/image';
import { TemporaryProfileComponent } from './temporary-profile/temporary-profile.component';
import { TabModule } from 'src/app/__Core/tab/tab.module';
import { ProfileRptComponent } from './profile/ProfileRpt/profile-rpt.component';
import { ProfileEntryComponent } from './profile/ProfileEntry/profile-entry.component';
import { DirectorDtlsRptComponent } from './directorDtls/directorDtlsRPT/director-dtls-rpt.component';
import { DirectorDtlsEntryComponent } from './directorDtls/directorDtlsEntry/director-dtls-entry.component';
import { PertnerDtlsEntryComponent } from './pertnership-dtls/pertnerDtlsEntry/pertner-dtls-entry.component';
import { PertnerDtlsRPTComponent } from './pertnership-dtls/pertnerDtlsRPT/pertner-dtls-rpt.component';
import { DocumentLockerDtlsRPTComponent } from './document-locker/documentlockerDtlsRPT/document-locker-dtls-rpt.component';
import { DocumebntLockerDtlsEntryComponent } from './document-locker/documentlockerDtlsEntry/documebnt-locker-dtls-entry.component';
import { ProductMappingReportComponent } from './product-mapping/product-mapping-report/product-mapping-report.component';
import { ProductMappingEntryComponent } from './product-mapping/product-mapping-entry/product-mapping-entry.component';
import { LoginPassRPTComponent } from './login-pwd/login-pass-rpt/login-pass-rpt.component';
import { LoginPassEntryComponent } from './login-pwd/login-pass-entry/login-pass-entry.component';
import { ShareHolderRPTComponent } from './share-holder/share-holder-rpt/share-holder-rpt.component';
import { ShareHolderEntryComponent } from './share-holder/share-holder-entry/share-holder-entry.component';
 const routes: Routes = [{path:'',component:CompanyComponent}]

@NgModule({
  declarations: [
    CompanyComponent,
    ProfileComponent,
    DirectorDtlsComponent,
    BankComponent,
    ShareHolderComponent,
    DocumentLockerComponent,
    ProductMappingComponent,
    LicenseDtlsComponent,
    LoginPwdComponent,
    PertnershipDtlsComponent,
    CoreDropdownComponent,
    TemporaryProfileComponent,
    ProfileRptComponent,
    ProfileEntryComponent,
    DirectorDtlsRptComponent,
    DirectorDtlsEntryComponent,
    PertnerDtlsEntryComponent,
    PertnerDtlsRPTComponent,
    DocumentLockerDtlsRPTComponent,
    DocumebntLockerDtlsEntryComponent,
    ProductMappingReportComponent,
    ProductMappingEntryComponent,
    LoginPassRPTComponent,
    LoginPassEntryComponent,
    ShareHolderRPTComponent,
    ShareHolderEntryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    InputTextModule,
    ImageModule,
    TabModule
  ]
})
export class CompanyModule { }
