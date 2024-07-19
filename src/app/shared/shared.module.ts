import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BnkrplcPipe } from '../__Pipes/bnkrplc.pipe';
import { ClOutsideClickDirective } from '../__Directives/clOutsideClick.directive';
import { elipsisPipe } from '../__Pipes/elipsis.pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import {MatSortModule} from '@angular/material/sort';
import { DeletemstComponent } from './deleteMst/deleteMst.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { A11yModule } from '@angular/cdk/a11y';
import { CreateClientComponent } from './create-client/create-client.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ManualUpdateEntryForMFComponent } from './manual-update-entry-for-mf/manual-update-entry-for-mf.component';
import { MatChipsModule } from '@angular/material/chips';
import { CreateBankComponent } from './create-bank/create-bank.component';
import { MenuItemComponent } from './core/menu-item/menu-item.component';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import { NoDataComponent } from './no-data/no-data.component';
import { UploadCsvComponent } from './upload-csv/upload-csv.component';
import { DragDropDirective } from '../__Directives/DragDrop.directive';
import { MstDtlsComponent } from './mst-dtls/mst-dtls.component';
import { RelationshipPipe } from '../__Pipes/relationship.pipe';
import { DocumentsComponent } from './documents/documents.component';
import { PreviewdtlsDialogComponent } from './core/previewdtls-dialog/previewdtls-dialog.component';
import { SrchComponent } from './core/srch/srch.component';
import {MatTabsModule} from '@angular/material/tabs';
import { RptFilterComponent } from './core/Acknowledgement/rptFilter/rpt-filter.component';
import { PreviewDocumentComponent } from './core/preview-document/preview-document.component';
import {MatBadgeModule} from '@angular/material/badge';
import { BtnWithMenuComponent } from './core/btnWithMenu/btn-with-menu.component';
import { MfAckEntryComponent } from './core/Acknowledgement/MutualFundAcknowledgement/mf-ack-entry/mf-ack-entry.component';
import { MegaMenuForColumnComponent } from './core/mega-menu-for-column/mega-menu-for-column.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { modeOfPrePipe } from '../__Pipes/modeOfPremium.pipe';
import { PaginateComponent } from './core/paginate/paginate.component';
import { TdsInfoPipe } from '../__Pipes/tdsInfo.pipe';
import { FormsModule } from '@angular/forms';
import { ListItemComponent } from './core/list-item/list-item.component';
import { MailBckfilePipe } from '../__Pipes/mail-bckfile.pipe';
import { ScrollDirective } from '../__Directives/scroll.directive';
import { AMCEntryComponent } from './amcentry/amcentry.component';
import { ClientDtlsComponent } from './core/client-dtls/client-dtls.component';
@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    ReactiveFormsModule,
    FormsModule,
    OverlayModule,
    MatSortModule,
    DragDropModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatTableExporterModule,
    MatRadioModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatSelectModule,
    A11yModule,
    MatChipsModule,
    MatTooltipModule,
    MatCardModule,
    MatListModule,
    MatTabsModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatBadgeModule,
    TableModule,
    ButtonModule,
    CardModule,
    CalendarModule,
    SelectButtonModule,
  ],
  declarations: [
    MailBckfilePipe,
    modeOfPrePipe,
    BnkrplcPipe,
    TdsInfoPipe,
    RelationshipPipe,
    ScrollDirective,
    ClOutsideClickDirective,
    elipsisPipe,
    RptFilterComponent,
    DeletemstComponent,
    CreateClientComponent,
    ManualUpdateEntryForMFComponent,
    CreateBankComponent,
    MenuItemComponent,
    NoDataComponent,
    UploadCsvComponent,
    DragDropDirective,
    MstDtlsComponent,
    DocumentsComponent,
    PreviewdtlsDialogComponent,
    SrchComponent,
    PreviewDocumentComponent,
    BtnWithMenuComponent,
    MfAckEntryComponent,
    MegaMenuForColumnComponent,
    PaginateComponent,
    ListItemComponent,
    AMCEntryComponent,
    ClientDtlsComponent,
  ],
  exports:[
    MailBckfilePipe,
    modeOfPrePipe,
    BnkrplcPipe,
    TdsInfoPipe,
    RelationshipPipe,
    MatCardModule,
    ScrollDirective,
    ClOutsideClickDirective,
    elipsisPipe,
    A11yModule,
    MatDialogModule,
    MatTableModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    OverlayModule,
    MatSortModule,
    MatChipsModule,
    DragDropModule,
    FormsModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatTableExporterModule,
    MatTooltipModule,
    MatRadioModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MenuItemComponent,
    AMCEntryComponent,
    NoDataComponent,
    UploadCsvComponent,
    ClientDtlsComponent,
    RptFilterComponent,
    MstDtlsComponent,
    BtnWithMenuComponent,
    MfAckEntryComponent,
    PaginateComponent,
    SrchComponent,
    MatTabsModule,
    MatBadgeModule,
    MegaMenuForColumnComponent,
    TableModule,
    ButtonModule,
    CardModule,
    CalendarModule,
    SelectButtonModule
  ],
  providers:[DatePipe]
})
export class SharedModule { }
