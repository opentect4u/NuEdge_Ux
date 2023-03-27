import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map, pluck } from 'rxjs/operators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { rcvForm } from 'src/app/__Model/rcvFormMst';
// import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { DeletercvComponent } from './deletercv/deletercv.component';
// import { DialogDtlsComponent } from './dialogDtls/dialogDtls.component';
import { RcvFormAdditionComponent } from './rcvFormAddition/rcvFormAddition.component';
import { RcvfrmmodificationfornonfinComponent } from './rcvFormmodificationForNonFIn/rcvFrmModificationForNonFin.component';
import { RcvformmodifyfornfoComponent } from './rcvFormModifyForNFO/rcvFormModifyForNFO.component';
import { RcvformrptComponent } from './rcvFormRpt/rcvFormRpt.component';
import { RcvmodificationComponent } from './rcvModification/rcvModification.component';

@Component({
  selector: 'app-RcvFrm',
  templateUrl: './RcvFrm.component.html',
  styleUrls: ['./RcvFrm.component.css']
})
export class RcvFrmComponent implements OnInit {
  __brdCrmbs: breadCrumb[] = [{
    label:"Home",
    url:'/main',
    hasQueryParams:false,
    queryParams:''
    },
    {
      label:"Operation",
      url:'/main/operations/ophome',
      hasQueryParams:false,
      queryParams:''
    },
    {
      label:atob(this.__rtDt.snapshot.queryParamMap.get('product_id')) == '1' ? "Mutual Fund" : "others",
      url:'/main/operations/mfdashboard' + '/' + this.__rtDt.snapshot.queryParamMap.get('product_id'),
      hasQueryParams:false,
      queryParams:''
    },
    {
      label:"Form Receivable",
      url:'/main/rcvDashboard',
      hasQueryParams:true,
      queryParams:{product_id: this.__rtDt.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:atob(this.__rtDt.snapshot.queryParamMap.get('type_id')) == '1' ? 'Financial'
      :atob(this.__rtDt.snapshot.queryParamMap.get('type_id')) == '4' ? 'NFO' : 'Non Financial',
      url:'/main/rcvForm',
      hasQueryParams:true,
      queryParams:{
        product_id: this.__rtDt.snapshot.queryParamMap.get('product_id'),
        type_id:this.__rtDt.snapshot.queryParamMap.get('type_id')}
    }
]
  __paginate: any=[];
  __pageNumber = new FormControl(10);
  __menu = [
    {"parent_id": 4,"menu_name": "Manual Entry","has_submenu": "N","url": "","icon":"","id":16,"flag":"A"},
    {"parent_id": 4,"menu_name": "Reports","has_submenu": "N","url": "","icon":"","id":16,"flag":"R"},
  ];
  __columns: string[] = ['sl_no', 'temp_tin_no', 'rcv_datetime', 'bu_type','edit','delete'];
  __RcvForms = new MatTableDataSource<rcvForm>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  __trans_types: any=[]

  constructor(
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    private __rtDt: ActivatedRoute,
    private overlay: Overlay
  ) { }

  ngOnInit() {
    this.__utility.getBreadCrumb(this.__brdCrmbs);

    // console.log(this.__rtDt.snapshot.queryParamMap.get('trans_id'));
    console.log(atob(this.__rtDt.snapshot.queryParamMap.get('type_id')));

    // if(this.__rtDt.snapshot.queryParamMap.get('trans_id')){
    //   this.getRvcFormMaster();
    // }
    // else{
    //   this.getRvcFormMaster();

    // }
    // this.getTransactionTypeDtls();

  }
  // getTransactionTypeDtls(){
  //   this.__dbIntr.api_call(0,
  //     '/formreceivedshow',
  //     'product_id='+atob(this.__rtDt.snapshot.queryParamMap.get('product_id'))
  //     + '&trans_type_id='+atob(this.__rtDt.snapshot.queryParamMap.get('type_id'))).pipe(pluck("data")).subscribe(res => {
  //     console.log(res);
  //     this.__trans_types = res;

  // })
  // }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {}
    else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    }
    else {
      this.getRvcFormMaster(this.__pageNumber.value);
      this.updateDataTable();
    }
  }

  private getRvcFormMaster(__paginate: string | null = "10") {
    this.__dbIntr.api_call(0, '/formreceived', 'paginate='+__paginate +
    ('&trans_type_id='+ atob(this.__rtDt.snapshot.queryParamMap.get('type_id'))) +
    (this.__rtDt.snapshot.queryParamMap.get('trans_id') ? '&trans_id=' + atob(this.__rtDt.snapshot.queryParamMap.get('trans_id')) : '')
    ).pipe(map((x: any) => x.data)).subscribe((res: any) => {
      this.setPaginator(res.data);
      this.__paginate = res.links;
    })
  }
  private setPaginator(__res) {
    this.__RcvForms = new MatTableDataSource(__res);
    this.__RcvForms.paginator = this.paginator;
  }
  private updateDataTable() {
    this.__RcvForms._updateChangeSubscription();
  }
  private openDialog(id) {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.width = '60%';
    // dialogConfig.data = {
    //   flag:'RF',
    //   id: 0,
    //   title: 'Form Recievable',
    //   product_id:atob(this.__rtDt.snapshot.queryParamMap.get('product_id')),
    //   trans_type_id:atob(this.__rtDt.snapshot.queryParamMap.get('trans_type_id')),
    //   temp_tin_no:this.__rtDt.snapshot.queryParamMap.get('temp_tin_no') ?
    //   atob(this.__rtDt.snapshot.queryParamMap.get('temp_tin_no')) : '',
    // };
    // dialogConfig.autoFocus = false;

    // const dialogref = this.__dialog.open(RcvmodificationComponent, dialogConfig);
    // dialogref.afterClosed().subscribe(dt => {
    //   if (dt) {
    //     this.__RcvForms.data.push(dt?.data);
    //     this.updateDataTable();
    //     this.__utility.showSnackbar(dt?.suc ==  1 ? 'Form with temporary TIN number ' + dt?.data.temp_tin_id +  ' has been recieved successfully' : 'Something went wrong ! please try again later',dt?.suc)
    //   }
    // });

   var type = atob(this.__rtDt.snapshot.queryParamMap.get('type_id')) == '4'
   ? 'NFO_'
   : atob(this.__rtDt.snapshot.queryParamMap.get('type_id')) == '1'
   ? 'Financial_' : 'Non_Financial_';
    console.log(atob(this.__rtDt.snapshot.queryParamMap.get('type_id')));

   const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = '80%';
    dialogConfig.id = id > 0  ? (type + id.toString()) : type+"0";
    console.log(dialogConfig.id);
    dialogConfig.hasBackdrop = false;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    try{
      dialogConfig.data = {
      data:null,
      flag:type + 'RF',
      id: 0,
      title: 'Form Recievable' + (atob(this.__rtDt.snapshot.queryParamMap.get('type_id')) == '4' ? ' - NFO' : (atob(this.__rtDt.snapshot.queryParamMap.get('type_id')) == '1' ? ' - Financial' : ' - Non Financial')),
      product_id:atob(this.__rtDt.snapshot.queryParamMap.get('product_id')),
      trans_type_id:atob(this.__rtDt.snapshot.queryParamMap.get('type_id')),
      temp_tin_no:this.__rtDt.snapshot.queryParamMap.get('temp_tin_no') ?
      atob(this.__rtDt.snapshot.queryParamMap.get('temp_tin_no')) : '',
      right:global.randomIntFromInterval(1,60)
    };
    console.log(dialogConfig.data);
    var  dialogref;
      if(atob(this.__rtDt.snapshot.queryParamMap.get('type_id')) == '1'){
        dialogref = this.__dialog.open(RcvmodificationComponent, dialogConfig);
      }
      else if(atob(this.__rtDt.snapshot.queryParamMap.get('type_id')) == '4'){
        dialogref = this.__dialog.open(RcvformmodifyfornfoComponent, dialogConfig);
      }
      else{
        dialogref = this.__dialog.open(RcvfrmmodificationfornonfinComponent, dialogConfig);
      }
      dialogref.afterClosed().subscribe(dt => {
        if (dt) {
          console.log(dt);
           this.settransTypeCount(dt.trans_id);
        }
      });
    }
    catch(ex){
      console.log(ex);
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize("80%");
      this.__utility.getmenuIconVisible({id:Number(dialogConfig.id),isVisible:false,flag:(type + 'RF')})
    }
  }
  openRcvForm(__items){
      // this.__utility.navigatewithqueryparams('/main/rcvFormmodification',
      // {queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id'),type_id:this.__rtDt.snapshot.queryParamMap.get('type_id')}})
   switch(__items.flag){
    case 'A': this.openDialog(0);break;
    case 'R':
    this.openDialogForReports();
    break;
    default: break;

   }
  }
  getPaginate(__paginate){
    if(__paginate.url){
     this.__dbIntr.getpaginationData(__paginate.url + ('&paginate='+this.__pageNumber.value) + ('&trans_type_id='+ atob(this.__rtDt.snapshot.queryParamMap.get('type_id')))).pipe(map((x: any) => x.data)).subscribe((res: any) => {
       this.setPaginator(res.data);
       this.__paginate = res.links;
     })
    }
    }
    getval(__items_per_page){
      this.__pageNumber.setValue(__items_per_page);
    this.getRvcFormMaster(__items_per_page);

    }
    populateDT(__items){
      console.log(__items);

    // console.log(__items);
    // console.log(__items);
    //  this.__utility.navigatewithqueryparams('/main/rcvFormmodification',
    //  {queryParams:{
    //   product_id:btoa(__items.product_id),
    //   type_id:this.__rtDt.snapshot.queryParamMap.get('type_id'),
    //   temp_tin_no:btoa(__items.temp_tin_no)}})
    }
    deleteRcvForm(__element,index){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.closeOnNavigation = false;
      // dialogConfig.disableClose = true;
      // dialogConfig.hasBackdrop = false;
      dialogConfig.width =  "40%";
      dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
      dialogConfig.data ={
         temp_tin_no:__element.temp_tin_no

      }
      try{
        const dialogref = this.__dialog.open(DeletercvComponent, dialogConfig);
        dialogref.afterClosed().subscribe(dt => {
          if(dt){
            this.__RcvForms.data.splice(index,1);
            this.__RcvForms._updateChangeSubscription();
          }
        })
      }
      catch(ex){
      }
    }

    openDialogForReports(){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.closeOnNavigation = false;
      dialogConfig.disableClose = true;
      dialogConfig.hasBackdrop = false;
      dialogConfig.width = '100%';
      dialogConfig.height = '100%';
      dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
      dialogConfig.panelClass = "fullscreen-dialog"
      dialogConfig.id = "FRR_" + this.__rtDt.snapshot.queryParamMap.get('type_id'),
      dialogConfig.data = {
         trans_id:
         this.__rtDt.snapshot.queryParamMap.get('trans_id')
         ? atob(this.__rtDt.snapshot.queryParamMap.get('trans_id')) : '',
         trans_type_id:
         this.__rtDt.snapshot.queryParamMap.get('type_id')
         ? atob(this.__rtDt.snapshot.queryParamMap.get('type_id')) : '',
         product_id:
         this.__rtDt.snapshot.queryParamMap.get('product_id')
         ? atob(this.__rtDt.snapshot.queryParamMap.get('product_id')) : '',

      }
      try {
        const dialogref = this.__dialog.open(
          RcvformrptComponent,
          dialogConfig
        );
      } catch (ex) {
        const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
        dialogRef.addPanelClass('mat_dialog');
        this.__utility.getmenuIconVisible({

        });
      }

    }
    settransTypeCount(__index) {
      this.__trans_types[__index].count = this.__trans_types[__index].count + 1
    }
}
