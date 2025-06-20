import { Component, OnInit, ViewChild } from '@angular/core';
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
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
import { Table } from 'primeng/table';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { pipe } from 'rxjs';
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

    @ViewChild('dt') primeTble:Table;
    @ViewChild('mClientTble') mergeClientTble:Table;




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
  isMergeClientPending: boolean = false;

  displayMode_forClient: string;
  displayMode_formergeClient: string;

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

  mergeClSrch = new FormGroup(
    {
      search_client_name: new FormControl(''),
      search_client_id:new FormControl('')
    }
  )

  /*** Holding Column for Merge Client */
  merge_client_column:column[] = mergeClientClmn.column;
  /*** End */
  /** Holding Merge CLient Details */
  mergeClient:client[] = [];
  selectedMergeClient:client[] = [];
  // mergeClientForm = this.fb.group({
  //   m_client:this.fb.array([])
  // })
  selected_main:client
  display_merge_client:boolean = false;
  searchedMergeClientMst:client[] = []
  /***End */


  constructor(private dbIntr: DbIntrService,
    private __utility: UtiliService,
    private __dialog: MatDialog,
    private __Rpt:RPTService,
    private overlay: Overlay,
    private readonly fb: FormBuilder
    ) {}

  ngOnInit(): void {
    this.formvalue = this.clientFrm.value;
    this.getClientMstData();
    this.setColumns(2);
    this.getstate();
  }

  /**
   * * This function is used to change the wheel speed of the scroll in a container.
   * * It adds event listeners for mouse wheel events and adjusts the scroll position based on the speed.
   * * @param {HTMLElement} container - The container element to apply the wheel speed change.
   */
  changeWheelSpeed(container, speedY) {
    var scrollY = 0;
    var handleScrollReset = function() {
        scrollY = container.scrollTop;
    };
    var handleMouseWheel = function(e) {
        e.preventDefault();
        scrollY += speedY * e.deltaY
        if (scrollY < 0) {
            scrollY = 0;
        } else {
            var limitY = container.scrollHeight - container.clientHeight;
            if (scrollY > limitY) {
                scrollY = limitY;
            }
        }
        container.scrollTop = scrollY;
    };

    var removed = false;
    container.addEventListener('mouseup', handleScrollReset, false);
    container.addEventListener('mousedown', handleScrollReset, false);
    container.addEventListener('mousewheel', handleMouseWheel, false);

    return function() {
        if (removed) {
            return;
        }
        container.removeEventListener('mouseup', handleScrollReset, false);
        container.removeEventListener('mousedown', handleScrollReset, false);
        container.removeEventListener('mousewheel', handleMouseWheel, false);
        removed = true;
    };
}

  ngAfterViewInit() {
    const el = document.querySelector<HTMLElement>('.cdk-virtual-scroll-viewport');
    this.changeWheelSpeed(el, 0.99);
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


      /*** Search Merge Client */
      this.mergeClSrch
      .get('search_client_name')
      .valueChanges.pipe(
        tap(() => {
          this.isMergeClientPending =this.mergeClSrch.get('search_client_name').value ?  true : false;
          this.mergeClSrch.get('search_client_id').setValue('');
          this.searchedMergeClientMst = [...this.selectedMergeClient]
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
          this.searchedMergeClientMst = [...this.selectedMergeClient,...value.data];
          this.searchResultVisibilityForMergeClient('block');
          this.isMergeClientPending = false;
          this.mergeClSrch.get('search_client_id').setValue('');
        },
        complete: () => console.log(''),
        error: (err) => {
          this.isMergeClientPending = false;
        },
      });
      /**** End */

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
  searchResultVisibilityForMergeClient = (display_mode: string) => {
    this.displayMode_formergeClient = display_mode;
  };
  searchClient = () =>{
    this.formvalue = this.clientFrm.value;
    this.getClientMstData();
  }
  /* * * This function is responsible for fetching client master data based on the form values.
   * * It creates a FormData object, appends the necessary fields, and makes an API call to retrieve the data.
    * * @returns void
   * * @memberof ClientCmnRptComponent
   * * * @description
   * * This function is used to fetch client master data based on the form values.
   * * It creates a FormData object, appends the necessary fields, and makes an API call to retrieve the data.
   */
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
      .pipe(pluck("data")).subscribe((res:client[]) =>{
        try{
          this.clientMst = res;
          this.__exportClient = new MatTableDataSource(res);
        }
        catch(ex){
          console.log(ex);
          this.clientMst = [];
          this.__exportClient = new MatTableDataSource([]);
        }

    })

  };

  /**
   * * * This function is responsible for exporting client data based on the provided form data.
   * * * It removes the 'paginate' field from the form data, makes an API call to export the client data,
   * * * and updates the __exportClient variable with the response data.
   */
  tableExport = (__client : FormData) =>{
    __client.delete('paginate');
    this.dbIntr.api_call(1,'/clientExport',__client)
    .pipe(pluck("data")).subscribe((res: client[]) =>{
       this.__exportClient = new MatTableDataSource(res);

  })
  }
  /**
   * * * This function is used to get the columns for the client table.
   * * * It retrieves the columns from the __utility service based on the __columns property.
   * * * @returns {column[]} - An array of column objects for the client table.
   */
  getColumns = () =>{
    return this.__utility.getColumns(this.__columns);
  }

  /**
   * * * This function is used to filter the global search in the client table.
   * * * It retrieves the value from the event target, and applies the filter to the primeTble.
   * * * @param {$event} - The event object containing the target value for filtering.
   * * * @returns {void}
   * * @memberof ClientCmnRptComponent
   */
  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTble.filterGlobal(value,'contains')
  }

  /**
   * * * This function is used to filter the global search in the merge client table.
   * * * It retrieves the value from the event target, and applies the filter to the mergeClientTble.
   * * * @param {$event} - The event object containing the target value for filtering.
   * * * @returns {void}
   * * @memberof ClientCmnRptComponent
   */
  filterGlobal_merge = ($event) => {
    let value = $event.target.value;
    this.mergeClientTble.filterGlobal(value,'contains')
  }


/*  * * * This function is used to handle the tab details for the client report.
 * * * It resets the client form, sets the client type based on the tab details, and retrieves the merge client data if applicable.
  * * * @param {any} tabDtls - The details of the tab to be handled.
  * * * @returns {void}
  * * @memberof ClientCmnRptComponent
  * * * @description
  * * * This function is responsible for handling the tab details for the client report.
  * * * It resets the client form, sets the client type based on the tab details, and retrieves the merge client data if applicable.
  */
  TabDetails = (tabDtls) => {
    try{
      this.mergeClient = [];
      this.clientFrm.get('client_type').setValue(tabDtls.tabDtls.type);
      if(tabDtls.tabDtls.type === 'MC'){
        this.getMergeClient();
      }
      else{
        this.sort = new sort();
        this.reset();
        this.setColumns(this.clientFrm.value.options);
      }
    }
    catch(ex){
        console.log(ex);
    }
  };

  /** * * * This function is used to get the merge client data from the server.
   * * * It makes an API call to the '/mergeClient' endpoint and processes the response data.
   * * * @returns {void}
   * * @memberof ClientCmnRptComponent
   * * * @description
   * * This function is responsible for fetching the merge client data from the server.
   * * It makes an API call to the '/mergeClient' endpoint and processes the response data.
   */
  getMergeClient = () =>{
    this.dbIntr.api_call(0,'/mergeClient',null)
    .pipe(pluck('data'))
    .subscribe((res:client[]) =>{
      console.log(res);
        this.mergeClient = res.map((item:client) =>{
          const arr = [item.add_line_1,item.add_line_2,item.add_line_3,item.city_name,item.state_name,item.district_name,item.pincode]
          item.client_addr = arr.filter(item => {return item}).toString();
          return item;
    })
    })
  }

  // getDetails = (index:number,clientDtls) =>{
  //     console.log(index);
  //     console.log(clientDtls);
  //     this.m_client.controls.forEach((el,i) =>{
  //       el.get('is_checked').setValue(index == i);
  //     })
  // }

  /* * * * This function is used to handle the item click event in the client report.
   * * * It checks the value of the clicked item and performs actions based on the value.
   * * * If the value is 'A', it does nothing; otherwise, it resets the client form.
   * * * @param {any} ev - The event object containing the clicked item.
   * * * @returns {void}
   * * @memberof ClientCmnRptComponent
   * * * @description
   * * This function is responsible for handling the item click event in the client report.
   * * It checks the value of the clicked item and performs actions based on the value.
   * * If the value is 'A', it does nothing; otherwise, it resets the client form.
   * */
  onItemClick = (ev) => {
    console.log(ev);
    if(ev.option.value == 'A'){
    }
    else{
      this.reset();
    }
  };
  /* * * * This function is used to open the client modification dialog.
   * * * It creates a dialog configuration object, sets the data for the dialog, and opens the dialog.
   * * * @param {client} item - The client item to be modified.
   * * * @returns {void}
   * * @memberof ClientCmnRptComponent
   * * * @description
   * * This function is responsible for opening the client modification dialog.
   * * It creates a dialog configuration object, sets the data for the dialog, and opens the dialog.
   * */
  reset = () =>{
    this.clientMst = [];
    this.__exportClient = new MatTableDataSource([]);
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

  /** * This function is used to open the client modification dialog.
   * * It creates a dialog configuration object, sets the data for the dialog, and opens the dialog.
   * * @param {client} item - The client item to be modified.
   * * @returns {void}
   * * @memberof ClientCmnRptComponent
   * * @description
   * * This function is responsible for opening the client modification dialog.
   * * It creates a dialog configuration object, sets the data for the dialog, and opens the dialog.
   * */
  getSelectedItemsFromParent = (items) => {
    this.getItems(items.item, items.flag);
  };
// * * * This function is used to handle the selected items from the parent component for merging clients.
// * * It resets the search_client_name field in the mergeClSrch form group and sets the search_client_id field with the selected item's id.
// * * It also calls the searchResultVisibilityForMergeClient function to hide the search result.
  getSelectedItemsFromParentForMergeClient = (items) =>{
      console.log(items)
      this.mergeClSrch
      .get('search_client_name')
      .reset(items.item.client_name, { emitEvent: false });
    this.mergeClSrch.patchValue({ search_client_id: items.item.id });
      this.searchResultVisibilityForMergeClient('none');
  }

  /** * This function is used to handle the selected items from the parent component.
   * * It resets the client_name field in the clientFrm form group and sets the client_id field with the selected item's id.
   * * It also calls the searchResultVisibilityForClient function to hide the search result.
   * * @param {client} items - The selected client item.
   * * @param {string} flag - The flag indicating the type of item selected.
   * * @returns {void}
   * * @memberof ClientCmnRptComponent
   * * @description
   * * This function is responsible for handling the selected items from the parent component.
   * * It resets the client_name field in the clientFrm form group and sets the client_id field with the selected item's id.
   * * It also calls the searchResultVisibilityForClient function to hide the search result.
   */
  getItems = (items: client, flag: string) => {
    this.clientFrm
      .get('client_name')
      .reset(items.client_name, { emitEvent: false });
    this.clientFrm.patchValue({ client_id: items.id });
    this.searchResultVisibilityForClient('none');
  };

  /**
   * * * This function is used to open the client modification dialog.
   * * * It creates a dialog configuration object, sets the data for the dialog, and opens the dialog.
   * * * @param {client} item - The client item to be modified.
   * * * @returns {void}
   */
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

  /** * This function is used to get the districts based on the selected states.
   * * It checks if the array of state IDs is not empty, makes an API call to fetch the districts,
   * * and updates the distMst array with the response data.
   * * @param {common[]} arr_state_id - The array of state IDs.
   * * @returns {void}
   * * @memberof ClientCmnRptComponent
   * * @description
   * * This function is responsible for fetching the districts based on the selected states.
   * * It checks if the array of state IDs is not empty, makes an API call to fetch the districts,
   * * and updates the distMst array with the response data.
   */
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

  /** * This function is used to get the cities based on the selected districts.
   * * It checks if the array of district IDs is not empty, makes an API call to fetch the cities,
   * * and updates the cityMst array with the response data.
   * * @param {common[]} arr_dist_id - The array of district IDs.
   * * @returns {void}
   * * @memberof ClientCmnRptComponent
   * * @description
   * * This function is responsible for fetching the cities based on the selected districts.
   * * * It checks if the array of district IDs is not empty, makes an API call to fetch the cities,
   * * * and updates the cityMst array with the response data.
   * */
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

  /** * This function is used to convert an array of common objects into a string representation of their IDs.
   * * It maps the array to extract the 'id' property of each object and then converts it to a JSON string.
   * * @param {common[]} arr - The array of common objects.
   * * @returns {string} - The JSON string representation of the IDs.
   * * @memberof ClientCmnRptComponent
   * * @description
   * * This function is responsible for converting an array of common objects into a string representation of their IDs.
   * * It maps the array to extract the 'id' property of each object and then converts it to a JSON string.
   */
  getStringifyDT = (arr: common[]): string => {
    return JSON.stringify(arr.map((item) => item.id));
  };

  /** * This function is used to set the columns for the client report based on the selected client type.
   * * It filters the columns based on the client type and updates the ClmnList, __exportedClmns, and SelectedClms properties.
   * * @param {number} res - The response value indicating the type of client.
   * * * @returns {void}
   * * @memberof ClientCmnRptComponent
   * * @description
   * * This function is responsible for setting the columns for the client report based on the selected client type.
   * * It filters the columns based on the client type and updates the ClmnList, __exportedClmns, and SelectedClms properties.
   */
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

    // this.primeTble.reset();
    // this.primeTble.columns = [];
    try{
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
     console.log(this.__columns);
    this.ClmnList = clientColumns.column_selector.filter((x: any) => columns.map((item) => {return item['field']}).includes(x.field));
    this.__exportedClmns = this.__columns.map((item) => {return item['field']}).filter((x: any) => !['edit','delete','upload_details','client_type'].includes(x));
    this.SelectedClms = this.__columns.map(x => x.field);
    }
    catch(ex){
      console.log(ex);
    }
  }

  /** * This function is used to open the client modification dialog.
   * * It creates a dialog configuration object, sets the data for the dialog, and opens the dialog.
   * * @param {client} item - The client item to be modified. 
   * * @param {number} id - The ID of the client to be modified.
   * * @param {string} client_type - The type of the client to be modified.
   * * * @returns {void}
   * * @memberof ClientCmnRptComponent
   * * @description
   * * This function is responsible for opening the client modification dialog. 
   * * It creates a dialog configuration object, sets the data for the dialog, and opens the dialog.
   */
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
  /** * This function is used to open the documents dialog for a client.
   * * It creates a dialog configuration object, sets the data for the dialog, and opens the dialog.
   * * @param {client} client - The client for which the documents dialog is to be opened.
   * * @returns {void}
   * * @memberof ClientCmnRptComponent
   * * @description
   * * This function is responsible for opening the documents dialog for a client.
   * * It creates a dialog configuration object, sets the data for the dialog, and opens the dialog.
   */
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
  /** * This function is used to handle the selection of an item in the pagination component.
   * * It sets the value of the __pageNumber form control to the selected item and  
   * * calls the getClientMstData function to fetch the client master data.
   * * @param {any} item - The selected item from the pagination component.
   * * * @returns {void}
   * * @memberof ClientCmnRptComponent
   * * @description
   * * This function is responsible for handling the selection of an item in the pagination component.
   * * It sets the value of the __pageNumber form control to the selected item and
   * * calls the getClientMstData function to fetch the client master data.
   */
  onSelectItem = (item) =>{
   this.__pageNumber.setValue(item);
   this.getClientMstData();

  }
  /** * This function is used to get the pagination data for the client master.
   * * It checks if the paginate object has a URL, appends the necessary parameters to the URL,
   * * and makes an API call to fetch the pagination data.
   * * @param {any} paginate - The pagination object containing the URL.
   * * * @returns {void}
   * * @memberof ClientCmnRptComponent
   * * @description
   * * This function is responsible for fetching the pagination data for the client master.
   * * It checks if the paginate object has a URL, appends the necessary parameters to the URL,
   * * and makes an API call to fetch the pagination data.
   */
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
  /** * This function is used to handle the custom sorting of the client master data.
   * * It checks if the sort field is not 'edit' or 'delete', updates the sort object with the sort field and order,
   * * and calls the getClientMstData function to fetch the sorted client master data.
   * * @param {any} sort - The sort object containing the sort field and order.
   * * @returns {void}
   * * @memberof ClientCmnRptComponent
   * * @description
   * * This function is responsible for handling the custom sorting of the client master data.
   * * * It checks if the sort field is not 'edit' or 'delete', updates the sort object with the sort field and order,
   * * * and calls the getClientMstData function to fetch the sorted client master data.
   * */
  customSort = (sort) =>{
    if(sort.sortField!='edit' && sort.sortField!='delete'){
    this.sort.field = sort.sortField;
    this.sort.order = sort.sortOrder;
    if(sort.sortField){
      this.getClientMstData();
      }
    }
  }
  /** * This function is used to get the selected columns from the provided columns array.
   * * It filters out the columns that are not needed for export and updates the __columns and __exportedClmns properties.
   * * @param {any[]} columns - The array of columns to be processed.
   * * @returns {void}
   * * @memberof ClientCmnRptComponent
   * * @description
   * * This function is responsible for getting the selected columns from the provided columns array.
   * * It filters out the columns that are not needed for export and updates the __columns and __exportedClmns properties.
   */
  getSelectedColumns = (columns)  =>{
    // const clm =  ['edit','delete','upload_details','client_type'];
    // this.__columns = columns.map(({ field, header }) => ({field, header}))
    // this.__exportedClmns =  columns.map(item => {return item['field']}).filter(x => !clm.includes(x));
    try{
      const clm =  ['edit','delete','upload_details','client_type'];
      this.__columns = columns.map(({ field, header }) => ({field, header}))
      this.__exportedClmns =  columns.map(item => {return item['field']}).filter(x => !clm.includes(x));
    }
    catch(ex){
        console.log(ex);
    }

  }

  /** * This function is used to edit a client.
   * * It opens the client modification dialog with the provided client details, client ID, and client type.
   * * @param {client} __client - The client object to be edited.
   * * @returns {void}  
   * * @memberof ClientCmnRptComponent
   * * @description
   * * This function is responsible for editing a client.
   * * It opens the client modification dialog with the provided client details, client ID, and client type.
   */
  EditClient = (__client:client) =>{
    this.openDialog(__client, __client.id, __client.client_type);
  }

  /** * This function is used to delete a client.
   * * It opens a confirmation dialog with the client details and calls the delete API if confirmed.
   * * @param {client} __client - The client object to be deleted.
   * * @returns {void}
   * * @memberof ClientCmnRptComponent
   * * @description
   * * This function is responsible for deleting a client.
   * * It opens a confirmation dialog with the client details and calls the delete API if confirmed.
   */
  deleteClient = (__client:client) =>{
      console.log(__client);
      const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.role = "alertdialog";
    dialogConfig.data = {
      flag: 'CL',
      id: __client.id,
      title: 'Delete '  + __client.client_name,
      api_name:'/clientDelete'
    };
    const dialogref = this.__dialog.open(
      DeletemstComponent,
      dialogConfig
    );
    dialogref.afterClosed().subscribe((dt) => {
      if(dt){
        if(dt.suc == 1){
          this.clientMst = this.clientMst.filter((el:client) => el.id != __client.id);
          this.__exportClient = new MatTableDataSource(this.clientMst);
        }
      }

    })
  }

  /** * This function is used to remove a client from the client master and export client data.
   * * It filters out the client with the specified ID from both the client master and export client data.
   * * @param {number} id - The ID of the client to be removed.
   * * @returns {void}
   * * @memberof ClientCmnRptComponent
   * * @description
   * * This function is responsible for removing a client from the client master and export client data.
   * * It filters out the client with the specified ID from both the client master and export client data.
   */
  removeArray(id:number){
    console.log(id);

    // this.clientMst.splice(this.clientMst.findIndex((x: client) => x.id == id),1);
    this.clientMst = this.clientMst.filter((x: client) => x.id != id);
    console.log(this.clientMst);

    // this.__exportClient.data.splice(this.__exportClient.data.findIndex((x: client) => x.id == id),1);
    this.__exportClient.data = this.__exportClient.data.filter((x: client) => x.id != id);
    this.__exportClient._updateChangeSubscription();
  }

  /** * This function is used to open the client modification dialog.
   * * It creates a dialog configuration object, sets the data for the dialog, and opens the dialog.
   * * @param {client} __clDtls - The client details to be modified.
   * * @param {number} __clid - The ID of the client to be modified.
   * * @param {string} __clType - The type of the client to be modified.
   * * * @returns {void}
   * * @memberof ClientCmnRptComponent
   * * @description
   * * This function is responsible for opening the client modification dialog.
   * * It creates a dialog configuration object, sets the data for the dialog, and opens the dialog.
   */
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
            console.log(`Previous Client Type: ${dt?.cl_type}`)
            console.log(`Current Client Type: ${dt?.data.client_type}`)

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
  /** * This function is used to update a row in the client master and export client data.
   * * It filters the client master and export client data to find the row with the specified ID,
   * * and updates the row with the new values from the provided row object.
   * * @param {client} row_obj - The row object containing the updated values.
   * * @returns {void}
   * * @memberof ClientCmnRptComponent
   * * @description
   * * This function is responsible for updating a row in the client master and export client data.
   * * * It filters the client master and export client data to find the row with the specified ID,
   * * * and updates the row with the new values from the provided row object.
   */
  updateRow(row_obj){
      this.clientMst = this.clientMst.filter((value: client, key) => {
        if(value.id === row_obj.id){
        value.client_name = row_obj.client_name
        value.client_code = row_obj.client_code
        value.dob = row_obj.dob;
        value.pan = row_obj.pan
        value.mobile = row_obj.mobile
        value.sec_mobile = row_obj.sec_mobile
        value.email = row_obj.email
        value.sec_email = row_obj.sec_email
        value.add_line_1 = row_obj.add_line_1
        value.add_line_3 = row_obj.add_line_3
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
      }
      return true;
      });
      this.__exportClient.data = this.__exportClient.data.filter((value: client, key) => {
        if(value.id === row_obj.id){
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
        value.add_line_3 = row_obj.add_line_3
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
        }
        return true;
      })
  }
  /** * This function is used to get the columns for the merge client report.
   * * It uses the utility service to get the columns based on the merge_client_column property.
   * * @returns {column[]} - The array of columns for the merge client report.
   * * @memberof ClientCmnRptComponent
   * * @description
   * * This function is responsible for fetching the columns for the merge client report.
   * * It uses the utility service to get the columns based on the merge_client_column property.
   */
  getcolumns = () =>{
    return this.__utility.getColumns(this.merge_client_column);
  }

  /** * This function is used to search for clients to merge.
   * * It resets the search_client_name field in the mergeClSrch form group and
   * * sets the search_client_id field with the selected item's id.
   * * It also calls the searchClientToMerge function to perform the search.
   * * @returns {void}
   * * @memberof ClientCmnRptComponent
   * * @description
   * * This function is responsible for searching for clients to merge.
   * * It resets the search_client_name field in the mergeClSrch form group and
   * * sets the search_client_id field with the selected item's id.
   * * It also calls the searchClientToMerge function to perform the search.
   * */
  searchClientToMerge = () =>{

  }

  /** * This function is used to merge the selected client with the main client.
   * * It logs the selected main client and the selected merge client to the console.
   * * @returns {void}
   * * @memberof ClientCmnRptComponent
   * * @description
   * * This function is responsible for merging the selected client with the main client.
   * * It logs the selected main client and the selected merge client to the console.
   */
  mergeClientWithMain = () =>{
      console.log(this.selected_main)
      console.log(this.selectedMergeClient)
  }


}

export class mergeClientClmn{
  static column:column[] = [
    {
      field:'sl_no',
      header:'Sl No.',
      width:'7rem'
    },
    {
      field:'client_name',
      header:'Client',
      width:'20rem'
    },
    {
      field:'client_code',
      header:'Code',
      width:'10rem'
    },
    {
      field:'pan',
      header:'PAN',
      width:'10rem'
    },
    {
      field:'email',
      header:'Email',
      width:'30rem'
    },
    {
      field:'client_addr',
      header:'Address',
      width:'50rem'
    }
  ]
}
