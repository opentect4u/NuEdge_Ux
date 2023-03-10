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
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { DocsModificationComponent } from '../docsModification/docsModification.component';
@Component({
selector: 'docRPT-component',
templateUrl: './docRPT.component.html',
styleUrls: ['./docRPT.component.css']
})
export class DocrptComponent implements OnInit {
  __sortAscOrDsc: any = {active:'',direction:'asc'};
  toppings = new FormControl();
  toppingList: any = [{id: "edit",text:"Edit"},
  {id:'sl_no',text:'Sl No'},
    {id:'cl_code',text:'Client Code'},
    {id:'cl_name',text:'Client Name'},
    {id:'pan',text:'Pan'},
    {id:'dob',text:'Date Of Birth'},
    {id:'dob_actual',text:'Actual Date Of Birth'},
    {id:'guar_pan',text:'Gurdians Pan'},
    {id:'guar_name',text:'Gurdians Name'},
    {id:'relation',text:'Relation'},
    {id:'mobile',text:'Mobile'},
    {id:'alt_mobile',text:'Alternative Mobile'},
    {id:'email',text:'Email'},
    {id:'alt_email',text:'Alternative Email'},
    {id:'addr_1',text:'Addres-1'},
    {id:'addr_2',text:'Addres-2'},
    {id:'state',text:'State'},
    {id:'dist',text:'District'},
    {id:'city',text:'City'},
    {id:'pincode',text:'Picode'},
  {id: "delete",text:"Delete"}];
  __isVisible: boolean = true;
  __paginate: any = [];
  __pageNumber = new FormControl(10);
  __selectClient = new MatTableDataSource<client>([]);
  __export = new MatTableDataSource<client>([]);
  __exportedClmns: string[] = [
    'sl_no',
    'cl_code',
    'cl_name',
    'pan',
    'dob',
    'dob_actual',
  ];
  __columns: string[] = [];

  __columnsForsummary: string[] = [
    'edit',
    'sl_no',
    'cl_code',
    'cl_name',
    'pan',
    'dob',
    'dob_actual',
    'delete',
  ];
  __columnsForDetails: string[] = [
    'edit',
    'sl_no',
    'cl_code',
    'cl_name',
    'pan',
    'dob',
    'dob_actual',
    'guar_pan',
    'guar_name',
    'relation',
    'mobile',
    'alt_mobile',
    'email',
    'alt_email',
    'addr_1',
    'addr_2',
    'state',
    'dist',
    'city',
    'pincode',
    'delete',
  ];
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
    public dialogRef: MatDialogRef<DocrptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) {}
  __stateMst: any=[];
  __distMst: any=[];
  __cityMst: any=[];
  ngOnInit() {
    // this.getClientMaster();
    this.__columns = this.__columnsForsummary;
    this.toppings.setValue(this.__columns);
    // this.tableExport();
    this.getDocumentMst();
  }
  tableExport(column_name:string | null = '',sort_by: string | null| ''='asc') {
    const __client = new FormData();
    __client.append('pan', this.__clientForm.value.pan);
    __client.append('client_name', this.__clientForm.value.name);
    __client.append('dob', this.__clientForm.value.dob);
    __client.append('mobile', this.__clientForm.value.mobile);
    __client.append('state', this.__clientForm.value.state);
    __client.append('dist', this.__clientForm.value.dist);
    __client.append('city', this.__clientForm.value.city);
    // __client.append('pincode', this.__clientForm.value.pincode);
    __client.append('column_name', column_name);
    __client.append('sort_by', sort_by);
    this.__dbIntr
      .api_call(1, '/clientExport', __client)
      .pipe(map((x: any) => x.data))
      .subscribe((res: client[]) => {
        this.__export = new MatTableDataSource(res);
      });
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

  ngAfterViewInit() {
    this.__clientForm.controls['options'].valueChanges.subscribe((res) => {
      if (res == '1') {
        this.__columns = this.__columnsForDetails;
        this.toppings.setValue(this.__columns);
        this.__exportedClmns = [
          'sl_no',
          'cl_code',
          'cl_name',
          'pan',
          'dob',
          'dob_actual',
          'guar_pan',
          'guar_name',
          'relation',
          'mobile',
          'alt_mobile',
          'email',
          'alt_email',
          'addr_1',
          'addr_2',
          'state',
          'dist',
          'city',
          'pincode',
        ];
      } else {
        this.__columns = this.__columnsForsummary;
        this.toppings.setValue(this.__columns);
        this.__exportedClmns = [
          'sl_no',
          'cl_code',
          'cl_name',
          'dob',
          'dob_actual',
          'email',
        ];
      }
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
          + ('&pincode=' +  this.__clientForm.value.pincode)
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
    this.getClientMaster(this.__pageNumber.value);
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

  getDocumentMst(column_name:string | null = '',sort_by:string | null | ''= 'asc'){
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
    __client.append('column_name', column_name);
    __client.append('sort_by', sort_by);

    this.__dbIntr.api_call(1,'/clientDetailSearch',__client).pipe(pluck("data")).subscribe((res: any) =>{
      this.setPaginator(res.data);
      this.__paginate = res.links;
      this.tableExport(column_name,sort_by);
    })
  }
  submit() {
     this.getDocumentMst(this.__sortAscOrDsc.active,this.__sortAscOrDsc.direction);
  }
  refreshOrAdvanceFlt() {
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
    console.log(__items);

    this.openDialog(__items.id, __items);
  }
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
        title: items.client_doc.length > 0 ? 'Update Documents' : 'Add Documents',
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
}
