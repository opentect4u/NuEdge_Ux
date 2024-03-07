import { Component, OnInit } from '@angular/core';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import {
  ICmnRptDef,
  cityType,
  clType,
  common,
  filterType,
  getcity,
  getdistrict,
  getstate,
  month,
} from './index';
import { client } from 'src/app/__Model/__clientMst';
import clientType from '../../../../../../../assets/json/Master/clientType.json';
import { FormControl, FormGroup } from '@angular/forms';
// import { pluck } from 'rxjs/operators';
import MonthDT from '../../../../../../../assets/json/Master/month.json';
import filterDT from '../../../../../../../assets/json/filterOption.json';
import cityDT from '../../../../../../../assets/json/Master/cityType.json';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  pluck,
  switchMap,
  tap,
} from 'rxjs/operators';
import { UtiliService } from 'src/app/__Services/utils.service';
import { sort } from 'src/app/__Model/sort';
import { global } from 'src/app/__Utility/globalFunc';
import { clientColumns } from 'src/app/__Utility/clientColumns';
import { column } from 'src/app/__Model/tblClmns';
import { DocumentsComponent } from 'src/app/shared/documents/documents.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { RPTService } from 'src/app/__Services/RPT.service';
import { Overlay } from '@angular/cdk/overlay';
import { ClModifcationComponent } from '../client/addNew/client_manage/home/clModifcation/clModifcation.component';
@Component({
  selector: 'app-client-cmn-rpt',
  templateUrl: './client-cmn-rpt.component.html',
  styleUrls: ['./client-cmn-rpt.component.css'],
})
export class ClientCmnRptComponent implements OnInit, ICmnRptDef {

  formvalue;
  isOpenMegaMenu:boolean = false;
  cityOptForMultiselectDropDown = this.__utility.settingsfroMultiselectDropdown(
    'id',
    'name',
    'Select City'
  );
  distOptForMultiselectDropDown = this.__utility.settingsfroMultiselectDropdown(
    'id',
    'name',
    'Select District'
  );
  stateOptForMultiselectDropDown =
    this.__utility.settingsfroMultiselectDropdown(
      'id',
      'name',
      'Select State',
      1
    );
 __pageNumber = new FormControl('10');
 sort = new sort();
 __paginate:any=[];
  citytype: cityType[] = cityDT;
  stateMst: common[] = [];
  distMst: common[] = [];
  cityMst: common[] = [];
  __columns: column[] = [];
  clientMst: client[] = [];
  searchedClientMst:client[]=[];
  ClmnList: column[]=[];
  __exportedClmns: string[] = [];
  SelectedClms:string[] = [];
  clientTypeMst: clType[] = clientType;
  filterType: filterType[] = filterDT;
  isClientPending: boolean = false;
  displayMode_forClient: string;
  dob_doa_month: month[] = MonthDT;
  __exportClient = new MatTableDataSource<client>([]);
  clientFrm = new FormGroup({
    client_type:new FormControl('E'),
    btn_type: new FormControl('R'),
    options: new FormControl('2'),
    client_name: new FormControl(''),
    client_id: new FormControl(''),
    dob_as_per_month: new FormControl(''),
    doa_as_per_month: new FormControl(''),
    state_id: new FormControl([], { updateOn: 'blur' }),
    dist_id: new FormControl([], { updateOn: 'blur' }),
    city_id: new FormControl([]),
    pincode: new FormControl(''),
    city_type_id: new FormControl([]),
  });
  constructor(private dbIntr: DbIntrService,
    private __utility: UtiliService,
    private __dialog: MatDialog,
    private __Rpt:RPTService,
    private overlay: Overlay,
    ) {}

  ngOnInit(): void {
    this.formvalue = this.clientFrm.value;
    this.getClientMstData();
    this.setColumns(2);
    this.getstate();
  }

  ngAfterViewInit() {
    this.clientFrm
      .get('client_name')
      .valueChanges.pipe(
        tap(() => {this.isClientPending = true;
          this.clientFrm.get('client_id').setValue('');
        }),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.dbIntr.searchItems('/client', dt + '&client_type='+this.clientFrm.value.client_type) : []
        ),
        map((x: any) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.searchedClientMst = value.data;
          this.searchResultVisibilityForClient('block');
          this.isClientPending = false;
          this.clientFrm.get('client_id').setValue('');
        },
        complete: () => console.log(''),
        error: (err) => {
          this.isClientPending = false;
        },
      });

    this.clientFrm.controls['options'].valueChanges.subscribe((res) => {
     this.setColumns(res);
    });

    this.clientFrm.controls['state_id'].valueChanges.subscribe((res) => {
      this.getdistrict(res);
    });
    this.clientFrm.controls['dist_id'].valueChanges.subscribe((res) => {
      this.getcity(res);
    });
  }
  searchResultVisibilityForClient = (display_mode: string) => {
    this.displayMode_forClient = display_mode;
  };
  searchClient = () =>{
    this.formvalue = this.clientFrm.value;
    this.getClientMstData();
  }
  getClientMstData = () => {
    const __client = new FormData();
    __client.append('anniversary_date_month',this.formvalue.doa_as_per_month ? this.formvalue.doa_as_per_month : '');
    __client.append('birth_date_month', this.formvalue.dob_as_per_month ? this.formvalue.dob_as_per_month : '');
    __client.append('client_code', this.formvalue.client_id ? this.formvalue.client_id : '');
    if(this.formvalue.btn_type == 'A'){
    __client.append('state', this.getStringifyDT(this.formvalue.state_id));
    __client.append('dist', this.getStringifyDT(this.formvalue.dist_id));
    __client.append('city', this.getStringifyDT(this.formvalue.city_id));
    __client.append('city_type', this.formvalue.city_type_id ? this.formvalue.city_type_id : '');
    __client.append('pincode', this.formvalue.pincode ? this.formvalue.pincode : '');
   }
    __client.append('paginate', this.__pageNumber.value);
    __client.append('field', (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete'  ? this.sort.field : '') : ''));
    __client.append('order', (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete'? this.sort.order : '') : ''));
    __client.append('client_type',this.formvalue.client_type);
       this.dbIntr.api_call(1,'/clientDetailSearch',__client)
      .pipe(pluck("data")).subscribe((res: any) =>{
         this.clientMst = res.data;
         this.__paginate = res.links;
         this.tableExport(__client);
    })
  };

  tableExport = (__client : FormData) =>{
    __client.delete('paginate');
    this.dbIntr.api_call(1,'/clientExport',__client)
    .pipe(pluck("data")).subscribe((res: client[]) =>{
       this.__exportClient = new MatTableDataSource(res);
       console.log(this.__exportClient.data);

  })

  }

  TabDetails = (tabDtls) => {
    this.clientFrm.get('client_type').setValue(tabDtls.tabDtls.type);
    this.sort = new sort();
    this.reset();
    this.setColumns(this.clientFrm.value.options);
  };
  onItemClick = (ev) => {
    console.log(ev);
    if(ev.option.value == 'A'){
    }
    else{
      this.reset();
    }
  };
  reset = () =>{
    this.clientFrm.patchValue({
      dob_as_per_month:'',
      doa_as_per_month:'',
      pincode:'',
      client_id:'',
    })
    this.clientFrm.get('state_id').reset([],{emitEvent:true});
    this.clientFrm.get('client_name').setValue('',{emitEvent:false});
    this.sort = new sort();
    this.__pageNumber.setValue('10');
    if(this.clientFrm.value.client_type != 'MC' && this.clientFrm.value.client_type != 'PHWC'){
      this.searchClient();
    }
    else{
      this.clientMst = [];
    }
  }

  getSelectedItemsFromParent = (items) => {
    this.getItems(items.item, items.flag);
  };

  getItems = (items: client, flag: string) => {
    this.clientFrm
      .get('client_name')
      .reset(items.client_name, { emitEvent: false });
    this.clientFrm.patchValue({ client_id: items.id });
    this.searchResultVisibilityForClient('none');
  };

  getstate: getstate = () => {
    this.dbIntr
      .api_call(0, '/states', null)
      .pipe(pluck('data'))
      .subscribe((res: common[]) => {
        res.forEach((el: common) => {
          this.stateMst.push(el);
        });
      });
  };

  getdistrict: getdistrict = (arr_state_id: common[]) => {
    if (arr_state_id.length > 0) {
      this.dbIntr
        .api_call(0, '/districts', this.getStringifyDT(arr_state_id))
        .pipe(pluck('data'))
        .subscribe((res: common[]) => {
          this.distMst = res;
        });
    } else {
      this.distMst.length = 0;
      this.clientFrm.controls['dist_id'].reset([], { emitEvent: true });
    }
  };

  getcity: getcity = (arr_dist_id: common[]) => {
    if (arr_dist_id.length > 0) {
      this.dbIntr
        .api_call(0, '/city', this.getStringifyDT(arr_dist_id))
        .pipe(pluck('data'))
        .subscribe((res: common[]) => {
          this.cityMst = res;
        });
    } else {
      this.cityMst.length = 0;
      this.clientFrm.controls['city_id'].reset([], { emitEvent: true });
    }
  };

  getStringifyDT = (arr: common[]): string => {
    return JSON.stringify(arr.map((item) => item.id));
  };

  setColumns = (res) => {
    // const __columnToRemove =  ['edit','delete','upload_details','client_type'];
    // const columns = this.clientFrm.value.client_type == 'M' ?
    // clientColumns.Minor_Client.filter(item => !['edit','delete'].includes(item.field))
    // : (this.clientFrm.value.client_type == 'E' ? clientColumns.Existing_Client.filter(item => !['edit','delete'].includes(item.field))
    // :(this.clientFrm.value.client_type == 'N'
    //   ? clientColumns.pan_holder_client.filter(x => !['edit','delete','pan'].includes(x.field))
    //   :  clientColumns.pan_holder_client.filter(item => !['edit','delete'].includes(item.field))));
    //  if(res == 2){
    //   this.__columns =this.clientFrm.value.client_type == 'M' ?
    //   clientColumns.initial_column_for_minor.filter(item => !['edit','delete'].includes(item.field))
    //   : (this.clientFrm.value.client_type == 'E'
    //   ? clientColumns.Existing_Client.filter(item => !['edit','delete'].includes(item.field))
    //   :(this.clientFrm.value.client_type == 'N'
    //   ? clientColumns.initial_column_for_pan.filter(x => !['edit','delete','pan'].includes(x.field))
    //   : clientColumns.initial_column_for_pan.filter(x => !['edit','delete'].includes(x.field))));
    //  }
    //  else{
    //   this.__columns =columns;
    //  }
    // this.ClmnList = clientColumns.column_selector.filter((x: any) => columns.map((item) => {return item['field']}).includes(x.field));
    // this.__exportedClmns = this.__columns.map((item) => {return item['field']}).filter((x: any) => !__columnToRemove.includes(x));
    // this.SelectedClms = this.__columns.map(x => x.field);

    const __columnToRemove =  ['upload_details','client_type'];
    const columns = this.clientFrm.value.client_type == 'M' ?
    clientColumns.Minor_Client
    : (this.clientFrm.value.client_type == 'E' ? clientColumns.Existing_Client
    :(this.clientFrm.value.client_type == 'N'
      ? clientColumns.pan_holder_client.filter(x => !['pan'].includes(x.field))
      :  clientColumns.pan_holder_client));
     if(res == 2){
      this.__columns =this.clientFrm.value.client_type == 'M' ?
      clientColumns.initial_column_for_minor
      : (this.clientFrm.value.client_type == 'E'
      ? clientColumns.Existing_Client
      :(this.clientFrm.value.client_type == 'N'
      ? clientColumns.initial_column_for_pan.filter(x => !['pan'].includes(x.field))
      : clientColumns.initial_column_for_pan));
     }
     else{
      this.__columns =columns;
     }
    this.ClmnList = clientColumns.column_selector.filter((x: any) => columns.map((item) => {return item['field']}).includes(x.field));
    this.__exportedClmns = this.__columns.map((item) => {return item['field']}).filter((x: any) => !['edit','delete','upload_details','client_type'].includes(x));
    this.SelectedClms = this.__columns.map(x => x.field);

  }

  exportPdf = () => {
    // this.__Rpt.downloadReport(
    //   '#client',
    //   {
    //     title: 'Client Report - '+ new Date().toLocaleDateString(),
    //   },
    //   'Client',
    //   'l',
    //   this.clientFrm.value.options == 1 ? [] : [3000,792],
    //   this.__exportedClmns.length
    // );
    this.__Rpt.downloadReport(
      '#client',
      {
        title: (this.clientFrm.get('client_type').value == 'M' ? 'Minor ' : (this.clientFrm.get('client_type').value == 'E' ? 'Existing '
        : (this.clientFrm.get('client_type').value == 'P' ? 'PAN Holder ' : 'Non PAN Holder ')))
        + 'Report - '+ new Date().toLocaleDateString(),
      },
      (this.clientFrm.get('client_type').value == 'M' ? 'Minor' : (this.clientFrm.get('client_type').value == 'E' ? 'Existing '
        : (this.clientFrm.get('client_type').value == 'P' ? 'PAN Holder ' : 'Non PAN Holder '))),
        this.clientFrm.get('client_type').value == 'E' ? 'portrait' : 'landscape',
      this.clientFrm.value.options == 2 ? [] : [1200,792],
      this.__exportedClmns.length
    );
  }
  PreviewDocs = (client) => {
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
  onSelectItem = (item) =>{
   this.__pageNumber.setValue(item);
   this.getClientMstData();

  }
  getPaginate = (paginate) =>{
    if (paginate.url) {
      this.dbIntr
        .getpaginationData(
          paginate.url + ('&paginate=' + this.__pageNumber.value)
          + ('&anniversary_date=' +  (this.formvalue?.anniversary_date ? this.formvalue?.anniversary_date : ''))
          + ('&client_code=' +  (this.formvalue?.client_id ? this.formvalue?.client_id : ''))
          + ('&dob=' +  (this.formvalue?.dob ? this.formvalue?.dob : ''))
          + ('&client_type=' + (this.formvalue?.client_type  ? this.formvalue?.client_type : ''))
          + ('&order=' + (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete' ? this.sort.order : '') : '1')) +
          ('&field=' + (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete' ? this.sort.field : '') : ''))
          + ( this.formvalue?.btn_type == 'A' ?
            ('&city_type=' +  (this.formvalue?.city_type_id ? this.formvalue?.city_type_id : ''))
          + ('&pincode=' +   (this.formvalue?.pincode ? this.formvalue?.pincode : ''))
          + ('&state=' +  this.getStringifyDT(this.formvalue?.state_id))
          + ('&dist=' +  this.getStringifyDT(this.formvalue?.dist_id))
          + ('&city=' +  this.getStringifyDT(this.formvalue?.city_id))
          : '')
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.clientMst = res.data;
          this.__paginate = res.links;
        });
    }
  }
  customSort = (sort) =>{
    if(sort.sortField!='edit' && sort.sortField!='delete'){
    this.sort.field = sort.sortField;
    this.sort.order = sort.sortOrder;
    if(sort.sortField){
      this.getClientMstData();
      }
    }
  }
  getSelectedColumns = (columns)  =>{
    // const clm =  ['edit','delete','upload_details','client_type'];
    // this.__columns = columns.map(({ field, header }) => ({field, header}))
    // this.__exportedClmns =  columns.map(item => {return item['field']}).filter(x => !clm.includes(x));

    const clm =  ['edit','delete','upload_details','client_type'];
    this.__columns = columns.map(({ field, header }) => ({field, header}))
    this.__exportedClmns =  columns.map(item => {return item['field']}).filter(x => !clm.includes(x));
  }

  EditClient = (__client:client) =>{
    this.openDialog(__client, __client.id, __client.client_type);
  }

  removeArray(id:number){
    console.log(id);

    // this.clientMst.splice(this.clientMst.findIndex((x: client) => x.id == id),1);
    this.clientMst = this.clientMst.filter((x: client) => x.id != id);
    console.log(this.clientMst);

    // this.__exportClient.data.splice(this.__exportClient.data.findIndex((x: client) => x.id == id),1);
    this.__exportClient.data = this.__exportClient.data.filter((x: client) => x.id != id);
    this.__exportClient._updateChangeSubscription();
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
              // this.clientMst.splice(this.clientMst.findIndex((x: client) => x.id == dt.id),1);
              // this.__exportClient.data.splice(this.__exportClient.data.findIndex((x: client) => x.id == dt.id),1);
              // this.__exportClient._updateChangeSubscription();
              this.removeArray(dt.id);
            }
            else {
              if(dt.cl_type == dt.data.client_type){
                this.updateRow(dt.data);
              }
              else{
                this.removeArray(dt.id);
              }
            }
          } else {
            this.clientMst.unshift(dt.data);
            this.__exportClient.data.unshift(dt.data);
            this.__exportClient._updateChangeSubscription();
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
      this.clientMst = this.clientMst.filter((value: client, key) => {
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
      this.__exportClient.data = this.__exportClient.data.filter((value: client, key) => {
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
}
