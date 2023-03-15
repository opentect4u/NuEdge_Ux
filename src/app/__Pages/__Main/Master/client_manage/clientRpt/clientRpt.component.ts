import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, pluck } from 'rxjs/operators';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { ClModifcationComponent } from '../clModifcation/clModifcation.component';
import { clientColumns } from 'src/app/__Utility/clientColumns';
@Component({
  selector: 'app-clientRpt',
  templateUrl: './clientRpt.component.html',
  styleUrls: ['./clientRpt.component.css'],
})
export class ClientRptComponent implements OnInit {
  __sortAscOrDsc: any= {active: '',direction:'asc'};
  toppings = new FormControl();
  toppingList: any =[];
  __isVisible: boolean = true;
  __paginate: any = [];
  __pageNumber = new FormControl(10);
  __selectClient = new MatTableDataSource<client>([]);
  __export = new MatTableDataSource<client>([]);
  __stateMst: any=[];
  __distMst: any=[];
  __cityMst: any=[];
  __exportedClmns: string[] = [];
  __columns: string[] = [];
  __clientForm = new FormGroup({
    pan: new FormControl(''),
    name: new FormControl(''),
    dob: new FormControl(''),
    mobile: new FormControl(''),
    state: new FormControl(''),
    dist: new FormControl(''),
    city: new FormControl(''),
    options: new FormControl('2'),
    advanceFlt: new FormControl(''),
  });
  constructor(
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<ClientRptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) {}

  ngOnInit() {
    this.setColumns('2');
    this.getClientRPTMst();
    this.getState();
  }

   setColumns(res){
    const __columnToRemove =  ['edit','delete'];
    const columns = this.data.client_type == 'P' ?
    clientColumns.PAN_HOLDER_CLIENT :
    (this.data.client_type == 'N' ? clientColumns.NON_PAN_HOLDER_CLIENT
    : (this.data.client_type == 'E'
    ? clientColumns.EXISTING_CLIENT : clientColumns.MINOR_CLIENT));

    this.__columns = res == '2'
    ?  (this.data.client_type == 'E' ? clientColumns.INITIAL_COLUMNS.filter((x: any) => x!= 'client_code')
    : ((this.data.client_type == 'N' || this.data.client_type == 'M')
    ? clientColumns.INITIAL_COLUMNS.filter((x: any) => x!= 'pan')
    : clientColumns.INITIAL_COLUMNS))
    : columns;

    this.toppingList = clientColumns.COLUMN_SELECTOR.filter((x: any) => columns.includes(x.id));
    this.toppings.setValue(this.__columns);
    this.__exportedClmns = this.__columns.filter((x: any) => !__columnToRemove.includes(x));
   }

  getState(){
    this.__dbIntr.api_call(0,'/states',null).pipe(pluck("data")).subscribe(res =>{
      this.__stateMst = res;
    })
  }
  getdistrict(__state_id){
    this.__dbIntr.api_call(0,'/districts','state_id='+ __state_id).pipe(pluck("data")).subscribe(res =>{
      this.__distMst = res;
    })
  }
  getcity(__dist_id){
    this.__dbIntr.api_call(0,'/city','district_id='+ __dist_id).pipe(pluck("data")).subscribe(res =>{
      this.__cityMst = res;
    })
  }

  tableExport(column_name: string | null ='', sort_by:string | null | '' = 'asc') {
    const __client = new FormData();
    __client.append('pan', this.__clientForm.value.pan);
    __client.append('client_name', this.__clientForm.value.name);
    __client.append('dob', this.__clientForm.value.dob);
    __client.append('mobile', this.__clientForm.value.mobile);
    __client.append('state', this.__clientForm.value.state);
    __client.append('dist', this.__clientForm.value.dist);
    __client.append('city', this.__clientForm.value.city);
    // __client.append('pincode', this.__clientForm.value.pincode);
    __client.append('column_name',column_name);
    __client.append('sort_by',sort_by ? sort_by : 'asc');
    __client.append('client_type',this.data.client_type);

    this.__dbIntr
      .api_call(1, '/clientExport', __client)
      .pipe(map((x: any) => x.data))
      .subscribe((res: client[]) => {
        console.log(res);
        this.__export = new MatTableDataSource(res);
      });
  }

  ngAfterViewInit() {
    this.__clientForm.controls['options'].valueChanges.subscribe((res) => {
      this.setColumns(res);
    });
    this.toppings.valueChanges.subscribe(res =>{
      const clm = ['edit','delete']
      this.__columns = res;
      this.__exportedClmns = res.filter(item => !clm.includes(item))
    })
    this.__clientForm.controls['state'].valueChanges.subscribe(res =>{
        if(res){
          this.getdistrict(res)
        }
        else{
          this.__distMst.length = 0;
          // this.__clientForm.controls['dist'].setValue('');
        }
    })
    this.__clientForm.controls['dist'].valueChanges.subscribe(res =>{
      if(res){
        this.getcity(res)
      }
      else{
        this.__cityMst.length = 0;
        // this.__clientForm.controls['city'].setValue('');
      }
  })
  }
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url + ('&paginate=' + this.__pageNumber.value)
          + ('&pan=' +  this.__clientForm.value.pan)
          + ('&client_name=' +  this.__clientForm.value.name)
          + ('&dob=' +  this.__clientForm.value.dob)
          + ('&mobile=' +  this.__clientForm.value.mobile)
          + ('&state=' +  this.__clientForm.value.state)
          + ('&dist=' +  this.__clientForm.value.dist)
          + ('&city=' +  this.__clientForm.value.city)
          // + ('&pincode=' +  this.__clientForm.value.pincode)
          + ('&column_name=' +  this.__sortAscOrDsc.active)
          + ('&sort_by=' +  this.__sortAscOrDsc.direction)
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res.data);
          this.__paginate = res.links;
        });
    }
  }
  getval(__paginate) {
    this.__pageNumber.setValue(__paginate.toString());
    this.submit();
  }
  getClientMaster(__paginate: string | null = '10') {
    this.__dbIntr
      .api_call(
        0,
        '/client',
        'client_type=' + this.data.client_type + '&paginate=' + __paginate
      )
      .pipe(map((x: responseDT) => x.data))
      .subscribe((res: any) => {
        console.log(res);

        this.setPaginator(res.data);
        this.__paginate = res.links;
      });
  }
  setPaginator(__res) {
    this.__selectClient = new MatTableDataSource(__res);
  }
  fullScreen() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }
  minimize() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.updateSize('40%', '55px');
    this.dialogRef.updatePosition({
      bottom: '0px',
      right: this.data.right + 'px',
    });
  }
  maximize() {
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.addPanelClass('mat_dialog');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }

  exportPdf() {
    this.__Rpt.downloadReport(
      '#client',
      {
        title: 'Client',
      },
      'Client'
    );
  }


  getClientRPTMst(column_name: string | null ='', sort_by:string | null | '' = 'asc'){
      const __client = new FormData();
      __client.append('pan', this.__clientForm.value.pan);
      __client.append('client_name', this.__clientForm.value.name);
      __client.append('dob', this.__clientForm.value.dob);
      __client.append('mobile', this.__clientForm.value.mobile);
      __client.append('state', this.__clientForm.value.state);
      __client.append('dist', this.__clientForm.value.dist);
      __client.append('city', this.__clientForm.value.city);
      // __client.append('pincode', this.__clientForm.value.pincode);
      __client.append('paginate', this.__pageNumber.value);
      __client.append('column_name',column_name);
      __client.append('sort_by', sort_by ? sort_by : 'asc');
      __client.append('client_type',this.data.client_type);
      this.__dbIntr.api_call(1,'/clientDetailSearch',__client).pipe(pluck("data")).subscribe((res: any) =>{
        this.setPaginator(res.data);
        this.__paginate = res.links;
        this.tableExport(column_name,sort_by);
      })
  }

  submit() {
     this.getClientRPTMst(this.__sortAscOrDsc.active,this.__sortAscOrDsc.direction)
  }
  refreshOrAdvanceFlt() {
    // this.getClientMaster();
    this.__clientForm.patchValue({
      pan: '',
      name: '',
      dob: '',
      mobile: '',
      state: '',
      dist: '',
      city: '',
      options: '2',
      advanceFlt: '',
    })
    this.__sortAscOrDsc = {active:'',direction:'asc'};
    this.submit();
  }
  populateDT(__items) {
    this.openDialog(__items, __items.id, __items.client_type);
  }
  openDialog(__clDtls: client, __clid: number, __clType: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '60%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'CL',
      id: __clid,
      items: __clDtls,
      title:
        (__clid == 0 ? 'Add ' : 'Update ') +
        (__clType == 'M'
          ? 'Minor'
          : __clType == 'P'
          ? 'PAN Holder'
          : __clType == 'N'
          ? 'Non Pan Holder'
          : 'Existing'),
      right: global.randomIntFromInterval(1, 60),
      cl_type: __clType,
    };
    dialogConfig.id = __clid > 0 ? __clid.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        ClModifcationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt?.id > 0) {
            if (dt.cl_type == 'E') {
              this.__selectClient.data.splice(
                this.__selectClient.data.findIndex(
                  (x: client) => x.id == dt.id
                ),
                1
              );
              this.__export.data.splice(
                this.__export.data.findIndex((x: client) => x.id == dt.id),
                1
              );
              this.__selectClient._updateChangeSubscription();
              this.__export._updateChangeSubscription();
            } else {
              this.updateRow(dt.data);
            }
          } else {
            this.__selectClient.data.unshift(dt.data);
            this.__selectClient._updateChangeSubscription();
            this.__export.data.unshift(dt.data);
            this.__export._updateChangeSubscription();
          }
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('60%');
      console.log(ex);
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'CL',
      });
    }
  }
  updateRow(row_obj){
      this.__selectClient.data = this.__selectClient.data.filter((value: client, key) => {
        value.client_name = row_obj.client_name
        value.client_code = row_obj.client_code
        value.dob = row_obj.dob;
        value.pan = row_obj.pan
        value.mobile = row_obj.mobile
        value.sec_mobile = row_obj.sec_mobile
        value.email = row_obj.email
        value.sec_email = row_obj.sec_email
        value.add_line_1 = row_obj.add_line_1
        value.add_line_2 = row_obj.add_line_2
        value.city = row_obj.city
        value.dist = row_obj.dist
        value.state = row_obj.state
        value.pincode = row_obj.pincode
        value.id = row_obj.id
        value.created_by = row_obj.created_by
        value.created_at = row_obj.created_at
        value.updated_by = row_obj.updated_by
        value.updated_at = row_obj.updated_at
        value.gurdians_name = row_obj.gurdians_name
        value.gurdians_pan = row_obj.gurdians_pan
        value.relation = row_obj.relation
        value.client_doc = row_obj.client_doc
        value.client_type = row_obj.client_type
        value.anniversary_date = row_obj.anniversary_date
        value.dob_actual = row_obj.dob_actual
      });
      this.__export.data = this.__export.data.filter((value: client, key) => {
        value.client_name = row_obj.client_name
        value.client_code = row_obj.client_code
        value.dob = row_obj.dob;
        value.pan = row_obj.pan
        value.mobile = row_obj.mobile
        value.sec_mobile = row_obj.sec_mobile
        value.email = row_obj.email
        value.sec_email = row_obj.sec_email
        value.add_line_1 = row_obj.add_line_1
        value.add_line_2 = row_obj.add_line_2
        value.city = row_obj.city
        value.dist = row_obj.dist
        value.state = row_obj.state
        value.pincode = row_obj.pincode
        value.id = row_obj.id
        value.created_by = row_obj.created_by
        value.created_at = row_obj.created_at
        value.updated_by = row_obj.updated_by
        value.updated_at = row_obj.updated_at
        value.gurdians_name = row_obj.gurdians_name
        value.gurdians_pan = row_obj.gurdians_pan
        value.relation = row_obj.relation
        value.client_doc = row_obj.client_doc
        value.client_type = row_obj.client_type,
        value.anniversary_date = row_obj.anniversary_date
        value.dob_actual = row_obj.dob_actual
      })
  }
  sortData(sort){
    this.__sortAscOrDsc = sort;
    this.submit();
  }
  deleteClient(__el,index){
    console.log(__el.id);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.role = "alertdialog";
    dialogConfig.data = {
      flag: 'CL',
      id: __el.id,
      title: 'Delete '  + __el.client_name,
      api_name:'/clientDelete'
    };
    const dialogref = this.__dialog.open(
      DeletemstComponent,
      dialogConfig
    );
    dialogref.afterClosed().subscribe((dt) => {
      if(dt){
        if(dt.suc == 1){
          this.__selectClient.data.splice(index,1);
          this.__selectClient._updateChangeSubscription();
          this.__export.data.splice(this.__export.data.findIndex((x: any) => x.id == __el.id),1);
          this.__export._updateChangeSubscription();
        }
      }

    })
  }
}
