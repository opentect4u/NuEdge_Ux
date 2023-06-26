import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { client } from 'src/app/__Model/__clientMst';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { ClModifcationComponent } from '../clModifcation/clModifcation.component';
import { clientColumns } from 'src/app/__Utility/clientColumns';
import cityType from '../../../../../../../../../../../assets/json/Master/cityType.json';
import month from '../../../../../../../../../../../assets/json/Master/month.json';
import { DocumentsComponent } from 'src/app/shared/documents/documents.component';
import itemsPerPage from '../../../../../../../../../../../assets/json/itemsPerPage.json';
import { column } from 'src/app/__Model/tblClmns';
import { sort } from 'src/app/__Model/sort';

type selectBtn ={
  label:string,
  value:string,
  icon:string
}
@Component({
  selector: 'app-clientRpt',
  templateUrl: './clientRpt.component.html',
  styleUrls: ['./clientRpt.component.css'],
})
export class ClientRptComponent implements OnInit {
  selectBtn:selectBtn[] = [{ label: 'Advance Filter', value: 'A',icon:'pi pi-filter' }, { label: 'Reset', value: 'R',icon:'pi pi-refresh' }]
  itemsPerPage:selectBtn[] = itemsPerPage;
  @ViewChild('clientCd') __clientCode: ElementRef;
  sort = new sort();

  __isClientPending: boolean = false;
  __clientMst: any=[];
  city_type = cityType;
  Month = month;
  cityOptForMultiselectDropDown = this.__utility.settingsfroMultiselectDropdown('id','name','Select City')
  distOptForMultiselectDropDown = this.__utility.settingsfroMultiselectDropdown('id','name','Select District')
   stateOptForMultiselectDropDown = this.__utility.settingsfroMultiselectDropdown('id','name','Select State')
  __sortAscOrDsc: any= {active: '',direction:'asc'};

  ClmnList: column[] =[];
  selectedClmns:string[] =[];
  __isVisible: boolean = true;
  __paginate: any = [];
  __pageNumber = new FormControl(10);
  __selectClient = new MatTableDataSource<client>([]);
  __export = new MatTableDataSource<client>([]);
  __stateMst: any=[];
  __distMst: any=[];
  __cityMst: any=[];
  __exportedClmns: string[] = [];
  __columns: column[] = [];
  __clientForm = new FormGroup({
    dob: new FormControl(''),
    state: new FormControl([],{updateOn:'blur'}),
    dist: new FormControl([]),
    city: new FormControl([]),
    options: new FormControl('2'),
    advanceFlt: new FormControl(''),
    pincode: new FormControl(''),
    city_type: new FormControl(''),
    client_code: new FormControl(''),
    anniversary_date: new FormControl(''),
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
    this.setColumns(2);
    // this.getClientRPTMst();
    this.getState();

  }

   setColumns(res){
    const __columnToRemove =  ['edit','delete','upload_details','client_type'];
    const columns = this.data.client_type == 'M' ?
    clientColumns.Minor_Client
    : (this.data.client_type == 'E' ? clientColumns.Existing_Client
    :(this.data.client_type == 'N'
      ? clientColumns.pan_holder_client.filter(x => !['pan'].includes(x.field))
      :  clientColumns.pan_holder_client));
     if(res == 2){
      this.__columns =this.data.client_type == 'M' ?
      clientColumns.initial_column_for_minor
      : (this.data.client_type == 'E'
      ? clientColumns.Existing_Client
      :(this.data.client_type == 'N'
      ? clientColumns.initial_column_for_pan.filter(x => !['pan'].includes(x.field))
      : clientColumns.initial_column_for_pan));
     }
     else{
      this.__columns =columns;
     }
    this.ClmnList = clientColumns.column_selector.filter((x: any) => columns.map((item) => {return item['field']}).includes(x.field));
    this.__exportedClmns = this.__columns.map((item) => {return item['field']}).filter((x: any) => !__columnToRemove.includes(x));
  }

  getState(){
    this.__dbIntr.api_call(0,'/states',null).pipe(pluck("data")).subscribe(res =>{
      this.__stateMst = res;
    })
  }
  getdistrict(__state_id){
    this.__dbIntr.api_call(0,'/districts','state_id_array='+ JSON.stringify(__state_id)).pipe(pluck("data")).subscribe(res =>{
      this.__distMst = res;
    })
  }
  getcity(__dist_id){
    this.__dbIntr.api_call(0,'/city','district_id_array='+ JSON.stringify(__dist_id)).pipe(pluck("data")).subscribe(res =>{
      this.__cityMst = res;
    })
  }

  tableExport(__client: FormData) {
    __client.delete('paginate');
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

  this.__clientForm.controls['client_code'].valueChanges
      .pipe(
        tap(() => (this.__isClientPending = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.__dbIntr.searchItems('/client', dt) : []
        ),
        map((x: any) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__clientMst = value.data;
          this.searchResultVisibilityForClient('block');
          this.__isClientPending = false;
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__isClientPending = false;
        },
      });
  }
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url + ('&paginate=' + this.__pageNumber.value)
          + ('&anniversary_date=' +  this.__clientForm.value.anniversary_date)
          + ('&client_code=' +  this.__clientForm.value.client_code)
          + ('&dob=' +  this.__clientForm.value.dob)
          + ('&state=' +  JSON.stringify(this.__clientForm.value.state))
          + ('&dist=' +  JSON.stringify(this.__clientForm.value.dist))
          + ('&city=' +  JSON.stringify(this.__clientForm.value.city))
          + ('&client_type=' +this.data.client_type)
          + ('&field=' + (global.getActualVal(this.sort.field) ? this.sort.field : ''))
          + ('&order=' + (global.getActualVal(this.sort.order) ? this.sort.order : '1'))
          + ('&city_type=' +  this.__clientForm.value.city_type)
          + ('&pincode=' +   this.__clientForm.value.pincode)
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res.data);
          this.__paginate = res.links;
        });
    }
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

  getClientRPTMst(){
      const __client = new FormData();
      __client.append('anniversary_date_month',this.__clientForm.value.anniversary_date);
      __client.append('birth_date_month', this.__clientForm.value.dob);
      __client.append('client_code', this.__clientForm.value.client_code);
      __client.append('state', JSON.stringify(this.__clientForm.value.state));
      __client.append('dist', JSON.stringify(this.__clientForm.value.dist));
      __client.append('city', JSON.stringify(this.__clientForm.value.city));
      __client.append('city_type', this.__clientForm.value.city_type);
      __client.append('pincode', this.__clientForm.value.pincode);
      __client.append('paginate', this.__pageNumber.value);
      __client.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
      __client.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
      __client.append('client_type',this.data.client_type);
      this.__dbIntr.api_call(1,'/clientDetailSearch',__client).pipe(pluck("data")).subscribe((res: any) =>{
        this.setPaginator(res.data);
        this.__paginate = res.links;
        this.tableExport(__client);
      })
  }

  submit() {
     this.getClientRPTMst()
  }
  refreshOrAdvanceFlt() {
    this.__clientForm.patchValue({
      pan: '',
      name: '',
      dob: '',
      mobile: '',
      state: [],
      dist: [],
      city: [],
      options: '2',
      advanceFlt: '',
    })
    this.__pageNumber.setValue(10);
    this.sort = new sort();
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
    dialogConfig.id = (__clid > 0 ? __clid.toString() : '0') + '_' + __clType;
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
    console.log(row_obj);

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
        value.proprietor_name = row_obj.proprietor_name;
        value.date_of_incorporation = row_obj.date_of_incorporation;
        value.karta_name = row_obj.karta_name;
        value.inc_date = row_obj.inc_date;
        value.pertner_dtls = row_obj.pertner_dtls;
        value.identification_number = row_obj.identification_number;
        value.country = row_obj.country;
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
        value.anniversary_date = row_obj.anniversary_date,
        value.dob_actual = row_obj.dob_actual,
        value.proprietor_name = row_obj.proprietor_name;
        value.date_of_incorporation = row_obj.date_of_incorporation;
        value.karta_name = row_obj.karta_name;
        value.inc_date = row_obj.inc_date;
        value.pertner_dtls = row_obj.pertner_dtls;
        value.identification_number = row_obj.identification_number;
        value.country = row_obj.country;
      })
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
  getItems(client,mode){
    this.__clientForm.controls['client_code'].reset(
      client.client_name,
      { emitEvent: false }
    );
    this.searchResultVisibilityForClient('none');
  }
  outsideClickforClient(__ev) {
    if (__ev) {
      this.searchResultVisibilityForClient('none');
    }
  }
  searchResultVisibilityForClient(display_mode) {
    this.__clientCode.nativeElement.style.display = display_mode;
  }
  PreviewDocs(client){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.role = "dialog";
    dialogConfig.width = client.client_doc.length > 0 ? '60%' : '50%';

    dialogConfig.data = {
      data:client.client_doc,
      flag:'C',
      title:'Uploaded Documents',
      no_data_found_msg:"Sorry!! No Documents uploaded yet!!"
    }
    const dialogref = this.__dialog.open(
      DocumentsComponent,
      dialogConfig
    );
  }
  onItemClick(ev){
   console.log(ev);
   if(ev.option.value == 'A'){

   }
   else{
    this.refreshOrAdvanceFlt();
   }
  }
  onselectItem(__itemsPerPage) {
    this.__pageNumber.setValue(__itemsPerPage.option.value);
    this.submit();
  }
  customSort(ev){
    this.sort.field = ev.sortField;
    this.sort.order = ev.sortOrder;
    this.submit();
  }
}
