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
    {id:'pan',text:'PAN'},
    {id:'dob',text:'DOB As Per PAN'},
    {id:'dob_actual',text:'Actual Date Of Birth'},
    {id:'guar_pan',text:'Gurdians PAN'},
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
  /**
   *  * This function is responsible for exporting the client data to a table format.
   *  * It takes an optional column name and sort order as parameters.
   *  * If no column name is provided, it exports all columns.  
   *  * @param column_name - The name of the column to sort by (optional).
   *  * @param sort_by - The sort order (asc or desc) for the column (optional, default is 'asc').
   *  * @returns void
   */
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

  /**
   * * This function is responsible for fetching the list of states from the server.
   * * It makes an API call to the '/states' endpoint and updates the __stateMst variable with the response data.
   * * @returns void
   * * @memberof DocrptComponent
   */
  getState(){
    this.__dbIntr.api_call(0,'/states',null).pipe(pluck("data")).subscribe(res =>{
      this.__stateMst = res;
    })
  }
  /**
   *  * This function is responsible for fetching the list of districts based on the selected state.
   *  * It makes an API call to the '/districts' endpoint with the state_id as a parameter.
   *  * The response data is then assigned to the __distMst variable.
   *  * @returns void
   *  * @memberof DocrptComponent
   * @param __state_id 
   */
  getdistrict(__state_id){
    this.__dbIntr.api_call(0,'/districts','state_id='+ __state_id).pipe(pluck("data")).subscribe(res =>{
      this.__distMst = res;
    })
  }
  /**
   *  * This function is responsible for fetching the list of cities based on the selected district.
   *  * It makes an API call to the '/city' endpoint with the district_id as a parameter.
   *  * The response data is then assigned to the __cityMst variable.
   *  * @returns void
   *  * @memberof DocrptComponent 
   * @param __dist_id 
   */
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
  /**
   *  * This function is responsible for fetching paginated data based on the provided pagination object.
   *  * It constructs the URL with the pagination parameters and client form values, then makes an API call to retrieve the data.
   *  * The response data is then processed and assigned to the __paginate variable.
   *  * @returns void
   *  * @memberof DocrptComponent 
   * 
   * @param __paginate 
   */
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
  /**
   *  * This function is responsible for fetching the client master data based on the provided pagination value.
   *  * It updates the page number form control with the pagination value and calls the getClientMaster function to retrieve the data.
   *  * @returns void
   *  * @memberof DocrptComponent 
   * @param __paginate 
   */
  getval(__paginate) {
     this.__pageNumber.setValue(__paginate.toString());
    this.getClientMaster(this.__pageNumber.value);
  }
  /**
   *  * This function is responsible for fetching the client master data from the server.
   *  * It constructs the API call with the client type and pagination parameters, then makes an API call to retrieve the data.
   *  * The response data is then processed and assigned to the __selectClient variable.  
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
   *  * This function is responsible for setting the paginator for the MatTableDataSource.
   *  * It takes the response data as a parameter and updates the __selectClient variable with the new data.
   *  * @returns void
   *  * @memberof DocrptComponent 
   * @param __res 
   */
  setPaginator(__res) {
    this.__selectClient = new MatTableDataSource(__res);
  }
  /**
   * * * This function is responsible for toggling the visibility of the dialog.
   * * * It updates the panel classes and position of the dialog based on the current visibility state.
   * * * If the dialog is in full screen mode, it removes the 'mat_dialog' class and adds the 'full_screen' class.
   */
  fullScreen() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }
  /**
   *  * This function is responsible for minimizing the dialog.
   *  * It removes the 'mat_dialog' and 'full_screen' classes from the dialog panel and updates its size and position.
   *  * The dialog is positioned at the bottom right corner of the screen.
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
   * * * This function is responsible for maximizing the dialog.
   * * * It removes the 'full_screen' class and adds the 'mat_dialog' class to the dialog panel.
   * * * It also updates the position of the dialog to the top of the screen.
   * * * The visibility state is toggled to reflect the change in dialog size.
   */
  maximize() {
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.addPanelClass('mat_dialog');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }

  /**
   * * * This function is responsible for exporting the client data to a PDF file.
   * * * It uses the RPTService to download the report with the specified parameters.
   * * * The report is generated for the client data and saved as a PDF file.
   * * @returns void
   * * @memberof DocrptComponent
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
   *  * This function is responsible for fetching the document master data based on the provided column name and sort order.
   *  * It constructs a FormData object with the client form values and pagination parameters, then makes an API call to retrieve the data.
   *  * The response data is then processed and assigned to the __selectClient variable.
   * @param column_name 
   * @param sort_by 
   */
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
  /**
   * * * This function is responsible for submitting the client form data and fetching the document master data.
   * * * It calls the getDocumentMst function with the current sort order and direction.
   * * * The form values are used to filter the client data based on the specified criteria.
   * * @returns void
   * * @memberof DocrptComponent
   */
  submit() {
     this.getDocumentMst(this.__sortAscOrDsc.active,this.__sortAscOrDsc.direction);
  }
  /**
   * * * This function is responsible for refreshing the client form and resetting the sort order.
   * * * It clears the form values and sets the sort order to ascending.
   * * * The submit function is called to fetch the updated client data.
   * * @returns void
   * * @memberof DocrptComponent
   */
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
  /**
   *  * This function is responsible for populating the dialog with the selected item details.
   *  * It logs the selected item to the console and opens the dialog with the item details.
   *  * The dialog is configured with various options such as width, backdrop, and data.
   *  * @returns void
   *  * @memberof DocrptComponent
   * @param __items 
   */
  populateDT(__items) {
    console.log(__items);

    this.openDialog(__items.id, __items);
  }
  /**
   *  * This function is responsible for opening the dialog with the specified ID and items.
   *  * It creates a MatDialogConfig object with various options such as width, backdrop, and data.
   *  * The dialog is opened with the DocsModificationComponent and the provided configuration.
   *  * @returns void
   *  * @memberof DocrptComponent
   * @param id 
   * @param items 
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
  /**
   *  * This function is responsible for updating a row in the client data.
   *  * It filters the existing client data and updates the specified row with the new values.
   *  * The updated row object is passed as a parameter to the function.
   *  * @returns void
   *  * @memberof DocrptComponent
   * @param row_obj 
   */
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
  /**
   *  * This function is responsible for sorting the data based on the provided sort object.
   *  * It updates the __sortAscOrDsc variable with the sort object and calls the submit function to fetch the sorted data.
   *  * @returns void
   *  * @memberof DocrptComponent
   * @param sort 
   */
  sortData(sort){
    this.__sortAscOrDsc = sort;
    this.submit();
  }
}
