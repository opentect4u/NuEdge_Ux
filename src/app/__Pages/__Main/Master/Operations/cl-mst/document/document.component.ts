import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { DocrptComponent } from './docRPT/docRPT.component';
import { DocsModificationComponent } from './docsModification/docsModification.component';

@Component({
  selector: 'master-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {
  __brdCrmbs: breadCrumb[] =[
    {
      label: 'Home',
      url: '/main',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Master',
      url: '/main/master/products',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Operations',
      url: '/main/master/mstOperations',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Client Master',
      url: '/main/master/clntMstHome',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Document',
      url: '/main/master/docs',
      hasQueryParams: false,
      queryParams: '',
    },
  ]
  __columns: string[] = ['sl_no', 'cl_code', 'cl_name', 'pan', 'mobile', 'edit', 'delete'];
  __documents = new MatTableDataSource<client>([]);
  __pageNumber= new FormControl(10);
  __paginate:any=[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService) { }
  ngOnInit() {
    // this.getDocumentMaster();
    // this.__utility.getBreadCrumb(this.__brdCrmbs);
  }

  /** This function is used to open the dialog for adding or modifying documents
   * @param id - The ID of the document to be modified, or 0 for a new document
   * @param items - Optional parameter containing client data to be passed to the dialog
   */
  openDialog(id: number, items: client | null = null) {
    console.log(items);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = '60%';
    dialogConfig.id = id > 0  ? id.toString() : "0";
    dialogConfig.hasBackdrop = false;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    try{
      dialogConfig.data = {
        flag:'DM',
        id: id,
        title: 'Add Documents',
        items: items,
        cl_id: id,
        __docsDetail: [],
        right:global.randomIntFromInterval(1,60)
      };

      const dialogref = this.__dialog.open(DocsModificationComponent, dialogConfig);
      dialogref.afterClosed().subscribe(dt => {
        if (dt) {
        }
      });
    }
    catch(ex){
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize("60%");
      this.__utility.getmenuIconVisible({id:Number(dialogConfig.id),isVisible:false,flag:"DM"})
    }
  }
  /** This function is used to open the dialog for adding masters
   * @param __id - The ID of the master to be modified, or 0 for a new master
   * @param __items - Optional parameter containing items to be passed to the dialog
   * @return void
   */
  addMasters(__id: number, __items) { this.openDialog(__id, __items); }
  /** This function is used to get the document master data
   * @param __paginate - Optional parameter to specify pagination, default is '10'
   * @return void
   */
  getDocumentMaster(__paginate: string | null = '10') {
    this.__dbIntr.api_call(0, '/documentsearch', "paginate="+__paginate).pipe(map((x: any) => x.data)).subscribe((res: any) => {
           this.setPaginator(res.data);
           this.__paginate = res.links
    })
  }
  /** This function is used to set the paginator for the document data
   * @param __res - The response data containing the documents to be displayed
   * @return void
   */
  private setPaginator(__res){
    this.__documents = new MatTableDataSource(__res);
    this.__documents.paginator = this.paginator;
  }
  /** This function is used to delete a document by its ID
   * @param __id - The ID of the document to be deleted
   * @return void
   * */
  openDocumentMst(__mode){
    switch(__mode){
      case 'M' :this.openDialog(0);break;
      case 'R': this.openDialogFormRPT();break;
      default: break;
    }
  }
  /** This function is used to open the dialog for document reports
   * @return void
   */
  openDialogFormRPT(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "CL";
    dialogConfig.data = {
      flag: "DMRPT"
    };

    try {
      const dialogref = this.__dialog.open(
        DocrptComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
    }

  }
  /** This function is used to delete a document by its ID
   * @param __id - The ID of the document to be deleted
   * @return void
   */
  getval(__paginate){
    this.__pageNumber.setValue(__paginate);
     this.getDocumentMaster(__paginate);
  }
  /** This function is used to get the paginated data for documents
   * @param __paginate - The pagination object containing the URL for fetching paginated data
   * @return void
   */
  getPaginate(__paginate){
  if(__paginate.url){
   this.__dbIntr.getpaginationData(__paginate.url + ('&paginate='+this.__pageNumber.value)).pipe(map((x: any) => x.data)).subscribe((res: any) => {
     this.setPaginator(res.data);
     this.__paginate = res.links;
   })
  }
  }
}
