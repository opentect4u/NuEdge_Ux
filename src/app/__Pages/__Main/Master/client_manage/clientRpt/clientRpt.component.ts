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
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { ClModifcationComponent } from '../clModifcation/clModifcation.component';
import { clientColumns } from 'src/app/__Utility/clientColumns';
import cityType from '../../../../../../assets/json/Master/cityType.json';
import month from '../../../../../../assets/json/Master/month.json';
import { DocumentsComponent } from 'src/app/shared/documents/documents.component';
@Component({
  selector: 'app-clientRpt',
  templateUrl: './clientRpt.component.html',
  styleUrls: ['./clientRpt.component.css'],
})
export class ClientRptComponent implements OnInit {
  @ViewChild('clientCd') __clientCode: ElementRef;

  __isClientPending: boolean = false;
  __clientMst: any=[];
  city_type = cityType;
  Month = month;
  cityOptForMultiselectDropDown = this.__utility.settingsfroMultiselectDropdown('id','name','Select City')
  distOptForMultiselectDropDown = this.__utility.settingsfroMultiselectDropdown('id','name','Select District')
   stateOptForMultiselectDropDown = this.__utility.settingsfroMultiselectDropdown('id','name','Select State')
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
    this.setColumns('2');
    this.getClientRPTMst();
    this.getState();

  }

  /**
   * 
   * @param res - This parameter is used to set the columns based on the selected option.
   * It filters the columns based on the client type and selected option.
   */
   setColumns(res){
    const __columnToRemove =  ['edit','delete','upload_details','client_type'];

    /** For Getting  All Columns of particular client Type*/
    const columns = this.data.client_type == 'M' ?
    clientColumns.MINOR_CLIENT.filter(x => !['client_type'].includes(x)) :
    (this.data.client_type == 'N' ? clientColumns.NON_PAN_HOLDER_CLIENT.filter(x => !['client_type'].includes(x))
    : (this.data.client_type == 'E'
    ? clientColumns.EXISTING_CLIENT : clientColumns.PAN_HOLDER_CLIENT.filter(x => !['client_type'].includes(x))));


    /** check whether the selected option is summary (2) or detail (1) */
    this.__columns = res == '2'
    ?  (this.data.client_type == 'E' ? clientColumns.INITIAL_COLUMNS.filter((x: any) => x!= 'client_code')
    : (this.data.client_type == 'N' ? clientColumns.INITIAL_COLUMNS_FOR_NON_PAN
    : (this.data.client_type == 'P' ?  clientColumns.INITIAL_COLUMNS_FOR_PAN : clientColumns.INITIAL_COLUMNS_FOR_MINOR))
    ) : columns;

    this.toppingList = clientColumns.COLUMN_SELECTOR.filter((x: any) => columns.includes(x.id));
    this.toppings.setValue(this.__columns);
    this.__exportedClmns = this.__columns.filter((x: any) => !__columnToRemove.includes(x));
   }

   /**
    * @description This function is used to get the state master data from the API.
    * It makes an API call to fetch the state data and assigns it to the __stateMst variable.
    * The pluck operator is used to extract the "data" property from the response.
    */
  getState(){
    this.__dbIntr.api_call(0,'/states',null).pipe(pluck("data")).subscribe(res =>{
      this.__stateMst = res;
    })
  }
  /**
   *  @description This function is used to get the district master data based on the selected state ID.
   * It makes an API call to fetch the district data and assigns it to the __distMst variable.
   * The pluck operator is used to extract the "data" property from the response.
   * 
   * @function getdistrict  
   * @param {number[]} __state_id - An array of state IDs for which the districts are to be fetched.
   * @returns {void} 
   */
  getdistrict(__state_id){
    this.__dbIntr.api_call(0,'/districts','state_id_array='+ JSON.stringify(__state_id)).pipe(pluck("data")).subscribe(res =>{
      this.__distMst = res;
    })
  }
  /**
   * 
   * @param __dist_id - An array of district IDs for which the cities are to be fetched.
   * @description This function is used to get the city master data based on the selected district IDs.
   * It makes an API call to fetch the city data and assigns it to the __cityMst variable.
   * The pluck operator is used to extract the "data" property from the response.
   */
  getcity(__dist_id){
    this.__dbIntr.api_call(0,'/city','district_id_array='+ JSON.stringify(__dist_id)).pipe(pluck("data")).subscribe(res =>{
      this.__cityMst = res;
    })
  }

  /**
   * 
   * @param column_name - The name of the column to be exported.
   * @param sort_by - The sorting order for the export, either 'asc' or 'desc'.
   * @description This function is used to export the client data based on the specified column name and sorting order.
   */
  tableExport(column_name: string | null ='', sort_by:string | null | '' = 'asc') {
    const __client = new FormData();
    __client.append('anniversary_date', this.__clientForm.value.anniversary_date);
    __client.append('client_code', this.__clientForm.value.client_code);
    __client.append('dob', this.__clientForm.value.dob);
    __client.append('state', JSON.stringify(this.__clientForm.value.state));
    __client.append('dist', JSON.stringify(this.__clientForm.value.dist));
    __client.append('city', JSON.stringify(this.__clientForm.value.city));
    __client.append('city_type', this.__clientForm.value.city_type);
    __client.append('pincode', this.__clientForm.value.pincode);
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
      const clm = ['edit','delete','upload_details']
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
  /**
   * 
   * @param __paginate - This parameter is used to get the pagination data from the API.
   * It contains the URL for pagination and other parameters like anniversary date, client code, date of birth, mobile number, email, state, district, city, client type, column name, sorting order, city type, and pincode.
   * 
   * @description This function is used to get the paginated data from the API based on the provided pagination URL and parameters.
   */
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url + ('&paginate=' + this.__pageNumber.value)
          + ('&anniversary_date=' +  this.__clientForm.value.anniversary_date)
          + ('&client_code=' +  this.__clientForm.value.client_code)
          + ('&dob=' +  this.__clientForm.value.dob)
          + ('&mobile=' +  this.__clientForm.value.mobile)
          + ('&email=' +  this.__clientForm.value.mobile)
          + ('&state=' +  JSON.stringify(this.__clientForm.value.state))
          + ('&dist=' +  JSON.stringify(this.__clientForm.value.dist))
          + ('&city=' +  JSON.stringify(this.__clientForm.value.city))
           + ('&client_type=' +this.data.client_type)
          + ('&column_name=' +  this.__sortAscOrDsc.active)
          + ('&sort_by=' +  this.__sortAscOrDsc.direction)
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
  /**
   * 
   * @param __paginate - This parameter is used to get the pagination data from the API.
   * It contains the URL for pagination and other parameters like anniversary date, client code, date of birth, mobile number, email, state, district, city, client type, column name, sorting order, city type, and pincode.
   * 
   * @description This function is used to get the paginated data from the API based on the provided pagination URL and parameters.
   */
  getval(__paginate) {
     this.__pageNumber.setValue(__paginate.toString());
    this.submit();
  }
  /**
   *  * @description This function is used to get the client master data from the API.
   * It makes an API call to fetch the client data based on the client type and pagination.
   * The data is then processed and displayed in a table format.
   * @param __paginate 
   */
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
  /**
   * 
   * @param __res - This parameter is used to set the paginator for the client data.
   * It takes the response data from the API and assigns it to the __selectClient variable, which is a MatTableDataSource.
   * This allows the client data to be displayed in a table format with pagination.
   * 
   * @description This function is used to set the paginator for the client data.
   */
  setPaginator(__res) {
    this.__selectClient = new MatTableDataSource(__res);
  }
  /**
   * @description This function is used to search for a client based on the provided client code.
   * It filters the client data based on the client code and updates the visibility of the search result.
   */
  fullScreen() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }
  /**
   * @description This function is used to search for a client based on the provided client code.
   * It filters the client data based on the client code and updates the visibility of the search result.
   * @param __clientCd - The client code to search for.
   */
  minimize() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.updateSize('40%', '55px');
    this.dialogRef.updatePosition({
      bottom: '0px',
      right: this.data.right + 'px',
    });
  }
  /**
   * @description This function is used to toggle the visibility of the dialog.
   * It removes the 'mat_dialog' panel class and adds the 'full_screen' panel class to the dialog reference.
   * It also updates the position of the dialog reference to the top of the screen.
   * The visibility state is toggled using the __isVisible variable.
   */
  maximize() {
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.addPanelClass('mat_dialog');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }

  /**
   * @description This function is used to search for a client based on the provided client code.
   * It filters the client data based on the client code and updates the visibility of the search result.
   * @param __clientCd - The client code to search for.
   */
  exportPdf() {
    this.__Rpt.downloadReport(
      '#client',
      {
        title: 'Client',
      },
      'Client'
    );
  }


  /**
   * 
   * @param column_name - The name of the column to be sorted.
   * @param sort_by - The sorting order for the column, either 'asc' or 'desc'.
   * @description This function is used to get the client report master data based on the provided column name and sorting order.
   * It makes an API call to fetch the client data and updates the paginator and export data accordingly.
   */
  getClientRPTMst(column_name: string | null ='', sort_by:string | null | '' = 'asc'){
      const __client = new FormData();
      __client.append('anniversary_date',this.__clientForm.value.anniversary_date);
      __client.append('client_code', this.__clientForm.value.client_code);
      __client.append('dob', this.__clientForm.value.dob);
      __client.append('state', JSON.stringify(this.__clientForm.value.state));
      __client.append('dist', JSON.stringify(this.__clientForm.value.dist));
      __client.append('city', JSON.stringify(this.__clientForm.value.city));
      __client.append('city_type', this.__clientForm.value.city_type);
      __client.append('pincode', this.__clientForm.value.pincode);

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

  /**
   * @description This function is used to search for a client based on the provided client code.
   * It filters the client data based on the client code and updates the visibility of the search result.
   * It also resets the form values and sorting order.
   */
  submit() {
     this.getClientRPTMst(this.__sortAscOrDsc.active,this.__sortAscOrDsc.direction)
  }
  /**
   * @description This function is used to refresh or advance the client filter.
   * It resets the form values to their initial state, including clearing the client code, name, date of birth, mobile number, state, district, city, and options.
   * It also sets the sorting order to ascending and submits the form to fetch the updated client data.
   */
  refreshOrAdvanceFlt() {
    // this.getClientMaster();
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
    this.__sortAscOrDsc = {active:'',direction:'asc'};
    this.submit();
  }
  /**
   * 
   * @param __items - This parameter is used to populate the client details in the dialog.
   * It contains the client details such as id, client_type, and other relevant information.
   * 
   * @description This function is used to open a dialog for populating the client details.
   * It calls the openDialog function with the provided client details and sets the dialog configuration.
   */
  populateDT(__items) {
    this.openDialog(__items, __items.id, __items.client_type);
  }
  /**
   * 
   * @param __clDtls - This parameter is used to pass the client details to the dialog.
   * It contains the client details such as id, client_type, and other relevant information.
   * @param __clid 
   * @param __clType 
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
  /**
   * 
   * @param row_obj - This parameter is used to update the row data in the client table.
   * It contains the updated client details such as client name, code, date of birth, PAN, mobile, email, address, and other relevant information.
   */
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
  /**
   * 
   * @param sort - This parameter is used to sort the client data based on the specified column and order (ascending or descending).
   * It contains the column name and sorting order.
   * 
   * @description This function is used to sort the client data based on the specified column and order.
   * It updates the sorting order and submits the form to fetch the sorted client data.
   */
  sortData(sort){
    this.__sortAscOrDsc = sort;
    this.submit();
  }
  /**
   * 
   * @param __el - This parameter is used to delete a client from the client list.
   * It contains the client details such as id and client name.
   * @param index 
   */
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
  /**
   * 
   * @param client - This parameter is used to get the items for the selected client.
   * @param mode - This parameter is used to specify the mode of operation, such as 'edit' or 'view'.
   * 
   * @description This function is used to get the items for the selected client.
   * It resets the client code form control and hides the search result visibility for the client.
   */
  getItems(client,mode){
    this.__clientForm.controls['client_code'].reset(
      client.client_name,
      { emitEvent: false }
    );
    this.searchResultVisibilityForClient('none');
  }
  /**
   * 
   * @param __ev - This parameter is used to handle the outside click event for the client search result.
   * It hides the search result visibility for the client when an outside click occurs.
   * 
   * @description This function is used to handle the outside click event for the client search result.
   * It hides the search result visibility for the client when an outside click occurs.
   */
  outsideClickforClient(__ev) {
    if (__ev) {
      this.searchResultVisibilityForClient('none');
    }
  }
  /**
   * 
   * @param display_mode - This parameter is used to set the display mode for the client code element.
   * It determines whether the client code element should be displayed or hidden.
   * 
   * @description This function is used to set the display mode for the client code element.
   * It updates the style display property of the client code element based on the provided display mode.
   */
  searchResultVisibilityForClient(display_mode) {
    this.__clientCode.nativeElement.style.display = display_mode;
  }
  /**
   *  * @description This function is used to preview the documents uploaded by the client.
   * It opens a dialog to display the uploaded documents.
   * 
   * @function PreviewDocs
   * @param client - This parameter is used to preview the documents uploaded by the client.
   */
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
}
