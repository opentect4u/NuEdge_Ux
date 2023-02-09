import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { rcvForm } from 'src/app/__Model/rcvFormMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { DeletercvComponent } from './deletercv/deletercv.component';
import { DialogDtlsComponent } from './dialogDtls/dialogDtls.component';
import { RcvFormAdditionComponent } from './rcvFormAddition/rcvFormAddition.component';

@Component({
  selector: 'app-RcvFrm',
  templateUrl: './RcvFrm.component.html',
  styleUrls: ['./RcvFrm.component.css']
})
export class RcvFrmComponent implements OnInit {
  __paginate: any=[];
  __pageNumber = new FormControl(10);
  __menu = [{"parent_id": 4,"menu_name": "Add New","has_submenu": "N","url": "","icon":"","id":16,"flag":"A"}];
  __columns: string[] = ['sl_no', 'temp_tin_no', 'rcv_datetime', 'bu_type','edit','delete'];
  __RcvForms = new MatTableDataSource<rcvForm>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    private __rtDt: ActivatedRoute,
    private overlay: Overlay
  ) { }

  ngOnInit() {
    console.log(this.__rtDt.snapshot.queryParamMap.get('trans_id'));
    console.log(this.__rtDt.snapshot.queryParamMap.get('type_id'));

    if(this.__rtDt.snapshot.queryParamMap.get('trans_id')){
      this.getRvcFormMaster();
    }
    else{
      this.getRvcFormMaster();

    }
    
  }
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
  private openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '60%';
    dialogConfig.data = {
      id: 0,
      title: 'Form Recievable'
    };
    dialogConfig.autoFocus = false;
    const dialogref = this.__dialog.open(RcvFormAdditionComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if (dt) {
        this.__RcvForms.data.push(dt?.data);
        this.updateDataTable();
        this.__utility.showSnackbar(dt?.suc ==  1 ? 'Form with temporary TIN number ' + dt?.data.temp_tin_id +  ' has been recieved successfully' : 'Something went wrong ! please try again later',dt?.suc)
      }
    });
  }
  openRcvForm(){
      this.__utility.navigatewithqueryparams('/main/rcvFormmodification',
      {queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id'),type_id:this.__rtDt.snapshot.queryParamMap.get('type_id')}})

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
      
    console.log(__items);
    console.log(__items);
     this.__utility.navigatewithqueryparams('/main/rcvFormmodification',
     {queryParams:{
      product_id:btoa(__items.product_id),
      type_id:this.__rtDt.snapshot.queryParamMap.get('type_id'),
      temp_tin_no:btoa(__items.temp_tin_no)}})
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
}
