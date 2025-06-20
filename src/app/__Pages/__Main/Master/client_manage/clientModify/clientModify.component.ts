import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { map, pluck } from 'rxjs/operators';
import { client } from 'src/app/__Model/__clientMst';
import { docType } from 'src/app/__Model/__docTypeMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-clientModify',
  templateUrl: './clientModify.component.html',
  styleUrls: ['./clientModify.component.css']
})
export class ClientModifyComponent implements OnInit {
  _clId: number = 0;
  __district: any = [];
  __city: any = [];
  __docTypeMaster: docType[];
  __noImg: string = '../../../../../../assets/images/noimg.png';
  @ViewChild('scrollTobottom') __scroll: ElementRef
  allowedExtensions = ['jpg', 'png', 'jpeg'];
  __maxDt = dates.disabeldDates();
  __stateMaster: any = [];
  __cl_type = atob(this.__route.snapshot.queryParamMap.get('flag'));
  __clientForm = new FormGroup({
    client_name: new FormControl('', [Validators.required]),
    dob: new FormControl('', this.__cl_type == 'E' ? [] : [Validators.required]),
    pan: new FormControl('', [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'), Validators.minLength(10), Validators.maxLength(10)]
    ),
    mobile: new FormControl('',
      this.__cl_type == 'E' ? [] : [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]
    ),
    sec_mobile: new FormControl('', this.__cl_type == 'E' ? [] : [Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]),
    email: new FormControl('', this.__cl_type == 'E' ? [] : [Validators.email]),
    sec_email: new FormControl('', this.__cl_type == 'E' ? [] : [Validators.email]),
    add_line_1: new FormControl('', this.__cl_type == 'E' ? [] : [Validators.required]),
    add_line_2: new FormControl(''),
    city: new FormControl('', this.__cl_type == 'E' ? [] : [Validators.required]),
    dist: new FormControl('', this.__cl_type == 'E' ? [] : [Validators.required]),
    state: new FormControl('', this.__cl_type == 'E' ? [] : [Validators.required]),
    pincode: new FormControl('', this.__cl_type == 'E' ? [] : [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
    id: new FormControl(0),
    gurdians_pan: new FormControl('', this.__cl_type == 'E' ? [] : [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}'), Validators.minLength(10), Validators.maxLength(10)]),
    gurdians_name: new FormControl('', this.__cl_type == 'E' ? [] : [Validators.required]),
    relations: new FormControl('', this.__cl_type == 'E' ? [] : [Validators.required]),
    doc_dtls: new FormArray([])
  })


  __columns: string[] = ['sl_no', 'client_name', 'edit', 'delete'];
  __selectClient = new MatTableDataSource<client>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public __route: ActivatedRoute,
    private __router: Router,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService) {
    if (this.__cl_type == 'E' && Number(atob(this.__route.snapshot.queryParamMap.get('id'))) > 0) { }
    else { this.setfrmCtrlValidatior(); }
    this.previewlatestClientEntry();
    this.getStateMaster();
    this.getDocumnetTypeMaster();

  }
  getParticularClient(_id) {
    this.__dbIntr.api_call(0, '/client', 'id=' + _id).pipe(pluck("data")).subscribe(res => {
      this.populateDT(res[0]);
    })
  }

  ngOnInit() {
    if (this.__route.snapshot.queryParamMap.get('id') == null) {
      this.addItem();
    }
    else {
      this.getParticularClient(Number(atob(this.__route.snapshot.queryParamMap.get('id'))));
    }

  }
  /**
   *  @description This function is used to prevent non-numeric input in the form fields
   *  It uses the `dates.numberOnly` utility function to restrict input to numeric values only.
   *  This is typically used in form controls where only numbers are expected, such as phone numbers or pincode fields.
   *  @param __ev - The event object that contains information about the input event.
   *  It is passed to the `dates.numberOnly` function to handle the input validation.
   * @param __ev 
   */
  preventNonumeric(__ev) {
    dates.numberOnly(__ev)
  }

  ngAfterViewInit() {
    /** Trigger on Change on State */
    this.__clientForm.get('state').valueChanges.subscribe(res => {
      if (this.__cl_type == 'E' && this._clId == 0) {
        //Nothing to deal with
      }
      else {
        this.getDistrict(res);
      }
    })
    /**End */
    /** Trigger on Change on District */
    this.__clientForm.get('dist').valueChanges.subscribe(res => {
      if (this.__cl_type == 'E' && this._clId == 0) {
        //Nothing to deal with
      }
      else {
        this.getCity(res);
      }
    })
    /**End */

  }
  /**
   *  @description This function is used to get the list of districts based on the selected state.
   *  It makes an API call to fetch the districts and updates the `__district` property with the response data.
   *  This function is typically used to populate a dropdown or select input with districts based on the selected state.
   * @param __state_id 
   */
  getDistrict(__state_id) {
    this.__dbIntr.api_call(0, '/districts', 'state_id=' + __state_id).pipe(map((x: responseDT) => x.data)).subscribe(res => {
      this.__district = res;
    })
  }
  /**
   * 
   * @param __district_id - This function is used to get the list of cities based on the selected district.
   * It makes an API call to fetch the cities and updates the `__city` property with the response data.
   * This function is typically used to populate a dropdown or select input with cities based on the selected district.
   */
  getCity(__district_id) {
    this.__dbIntr.api_call(0, '/city', 'district_id=' + __district_id).pipe(map((x: responseDT) => x.data)).subscribe(res => {
      this.__city = res;
    })
  }
  /**
   * 
   * @returns This function is used to submit the client modification form.
   */
  submit() {
    console.log(this.__clientForm.value);

    if (this.__clientForm.invalid) {
      this.__utility.showSnackbar('Submition failed due to some error', 0);
      return;
    }
    const __client = new FormData();
    __client.append("client_name", this.__clientForm.value.client_name);
    __client.append("dob", this.__clientForm.value.dob);
    __client.append("pan", this.__clientForm.value.pan);
    __client.append("mobile", this.__clientForm.value.mobile);
    __client.append("sec_mobile", this.__clientForm.value.sec_mobile);
    __client.append("email", this.__clientForm.value.email);
    __client.append("sec_email", this.__clientForm.value.sec_email);
    __client.append("add_line_1", this.__clientForm.value.add_line_1);
    __client.append("add_line_2", this.__clientForm.value.add_line_2);
    __client.append("city", this.__clientForm.value.city);
    __client.append("dist", this.__clientForm.value.dist);
    __client.append("state", this.__clientForm.value.state);
    __client.append("pincode", this.__clientForm.value.pincode);
    __client.append("guardians_pan", this.__clientForm.value.gurdians_pan ? this.__clientForm.value.gurdians_pan : '');
    __client.append("guardians_name", this.__clientForm.value.gurdians_name ? this.__clientForm.value.gurdians_name : '');
    __client.append("relation", this.__clientForm.value.relations ? this.__clientForm.value.relations : '');
    __client.append("id", this.__clientForm.value.id);
    __client.append("client_type", this.__cl_type);

    for (let i = 0; i < this.__clientForm.value.doc_dtls.length; i++) {
      if (typeof (this.__clientForm.value.doc_dtls[i].file) != 'string') {
        __client.append("file[]", this.__clientForm.value.doc_dtls[i].file);
        __client.append("doc_type_id[]", this.__clientForm.value.doc_dtls[i].doc_type_id);
        __client.append("row_id[]", this.__clientForm.value.doc_dtls[i].id);
      }
    }
    this.__dbIntr.api_call(1, '/clientAddEdit', __client).subscribe((res: any) => {
      if (res.suc == 1) {
        if (this._clId > 0) {
          if (this.__cl_type == 'E') {
            const index = this.__selectClient.data.indexOf(res.data.id);
            this.__selectClient.data.splice(index, 1);
            this.__selectClient._updateChangeSubscription();
          }
          else {

          }
        }
        else {
          this.__selectClient.data.unshift(res.data);
          this.__selectClient._updateChangeSubscription();
        }
        this.__utility.showSnackbar(res.suc == 1 ? (this._clId > 0 ? 'Client updated successfully' : 'Client added successfully') : 'Something went wrong! please try again later', res.suc);
        this.reset();
      }
    })
  }
  /**
   * @description This function is used to fetch the list of states from the server.
   * It makes an API call to the '/states' endpoint and updates the `__stateMaster` property with the response data.
   * This function is typically called during component initialization to populate a dropdown or select input with states.
   */
  getStateMaster() {
    this.__dbIntr.api_call(0, '/states', null).pipe(map((x: responseDT) => x.data)).subscribe(res => {
      this.__stateMaster = res;
    })
  }
  /**
   *  @description This function is used to populate the client form with the provided client data.
   *  It clears the existing document controls, sets the client ID and type, and updates the form controls with the client data.
   *  If the client type is 'E', it sets the form validators accordingly.
   *  This function is typically called when editing an existing client or when initializing a new client form.
   * @param __items 
   */
  populateDT(__items: client) {
    this.__docs.controls.length = 0;
    this.setRNT(__items);
    this._clId = __items.id;
    this.__cl_type = __items.client_type;
    if (this.__cl_type == 'E') {
      this.setfrmCtrlValidatior();
    }
  }
  /**
   * 
   * @param __items - This function is used to set the client form with the provided client data.
   * It updates the form controls with the client details such as name, date of birth, PAN, mobile numbers, email addresses, address lines, city, district, state, pincode, guardian's PAN and name, and relation.
   * It also populates the document details if available.
   * This function is typically called when editing an existing client or when initializing a new client form with pre-filled data.
   */
  setRNT(__items: client) {
    console.log(__items);
    this.__clientForm.patchValue({
      client_name: __items.client_name ? __items.client_name : '',
      dob: __items.dob ? __items.dob : '',
      pan: __items.pan ? __items.pan : '',
      mobile: __items.mobile ? __items.mobile : '',
      sec_mobile: __items.sec_mobile ? __items.sec_mobile : '',
      email: __items.email ? __items.email : '',
      sec_email: __items.sec_email ? __items.sec_email : '',
      add_line_1: __items.add_line_1 ? __items.add_line_1 : '',
      add_line_2: __items.add_line_2 ? __items.add_line_2 : '',
      city: __items.city ? __items.city : '',
      dist: __items.dist ? __items.dist : '',
      state: __items.state ? __items.state : '',
      pincode: __items.pincode ? __items.pincode : '',
      id: __items.id ? __items.id : '',
      gurdians_pan: __items.gurdians_pan ? __items.gurdians_pan : '',
      gurdians_name: __items.gurdians_name ? __items.gurdians_name : '',
      relations: __items.relation ? __items.relation : '',
    })

    if (__items.client_doc.length > 0) {
      __items.client_doc.forEach(element => {
        this.__docs.push(this.setItem(element.id, element.doc_type_id, element.doc_name, element.client_id));
      })
    }
    else {
      this.addItem();
    }
  }

  /**
   * @description This function is used to preview the latest client entry based on the query parameter 'flag'.
   * It makes an API call to fetch the client data and populates the client master table with the response.
   * If the 'flag' query parameter is not present, it does nothing.
   * This function is typically called when the component is initialized to display the latest client entries.
   */
  previewlatestClientEntry() {
    if (this.__route.snapshot.queryParamMap.get('flag') != null) {
      this.__dbIntr.api_call(0, '/client', 'client_type=' + atob(this.__route.snapshot.queryParamMap.get('flag'))).pipe((map((x: any) => x.data))).subscribe((res: client[]) => {
        this.poulateClientMst(res);
      })
    }

  }
  /**
   * 
   * @param Client - This function is used to populate the client master table with the provided client data.
   */
  poulateClientMst(Client: client[]) {
    this.__selectClient = new MatTableDataSource(Client);
    console.log(this.__selectClient);

    this.__selectClient._updateChangeSubscription();
    this.__selectClient.paginator = this.paginator;
  }
  /**
   * @description This function is used to delete a client entry from the client master table.
   * It takes the client ID as a parameter, filters the client data to remove the entry
   */
  reset() {
    this.__clientForm.reset();
    this.__clientForm.patchValue({
      id: 0
    });
    this._clId = 0;
    if (this.__cl_type == 'E') {
      this.removeValidators(["email", "add_line_1", "dist", "state", "city", "dob", "mobile"]);
    }
  }
  private updateRow(row_obj: client) {
    this.__selectClient.data = this.__selectClient.data.filter((value: client, key) => {
      if (value.id == row_obj.id) {
      }
      return true;
    });
  }
  /**
   * @description This function is used to set the form control validators based on the client type.
   * It checks the client type and applies the appropriate validators to the form controls.
   * For example, if the client type is 'M', it removes the PAN validator, and if it is 'N', it removes multiple validators.
   * This function is typically called when initializing or updating the client form to ensure that the correct validation rules are applied.
   */
  setfrmCtrlValidatior() {
    switch (this.__cl_type) {
      case 'M': this.removeValidators(['pan']); break;
      case 'N': this.removeValidators(['pan', 'gurdians_pan', 'gurdians_name', 'relations']); break;
      case 'P': this.removeValidators(['gurdians_pan', 'gurdians_name', 'relations']); break;
      case 'E': if (this._clId > 0) {
        this.setValidators(
          [
            {
              name: "email",
              validators: [Validators.required, Validators.email]
            },
            {
              name: "add_line_1",
              validators: [Validators.required]
            },
            {
              name: "dist",
              validators: [Validators.required]
            }
            ,
            {
              name: "state",
              validators: [Validators.required]
            }
            ,
            {
              name: "city",
              validators: [Validators.required]
            }
            ,
            {
              name: "dob",
              validators: [Validators.required]
            },
            {
              name: "mobile",
              validators: [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]
            }
          ]);
      }
        break;
      default: break;
    }
  }
  /**
   * 
   * @param __frmCtrl - This function is used to set validators for the specified form controls in the client form.
   * It iterates over the provided form control names and applies the specified validators to each control.
   * After setting the validators, it updates the value and validity of each control.
   * This function is typically called when initializing or updating the client form to ensure that the correct validation rules are applied.
   */
  setValidators(__frmCtrl) {
    __frmCtrl.forEach(element => {
      console.log(element);

      this.__clientForm.get(element.name).setValidators(element.validators);
      this.__clientForm.get(element.name).updateValueAndValidity();
    });
    console.log(this.__clientForm.status);

  }
  /**
   * 
   * @param __frmCtrl - This function is used to remove validators from the specified form controls in the client form.
   * It iterates over the provided form control names and clears the validators for each control.
   * After removing the validators, it updates the value and validity of each control.
   * This function is typically called when resetting or modifying the client form to remove unnecessary validation rules.
   */
  removeValidators(__frmCtrl) {
    __frmCtrl.forEach(element => {
      this.__clientForm.get(element).clearValidators();
      this.__clientForm.get(element).updateValueAndValidity();
    });
  }
  /**
   * @description This function is used to add a new item (document) to the client form.
   * It pushes a new FormGroup item to the `doc_dtls` FormArray in the client form.
   * If there is more than one document, it scrolls to the bottom of the document list smoothly after a short delay.
   * This function is typically called when the user wants to add a new document entry in the client form.
   */
  addItem(): void {
    this.__docs.push(this.createItem());
    if (this.__docs.length > 1) {
      setTimeout(() => {
        this.__scroll.nativeElement.scroll({
          top: this.__scroll.nativeElement.scrollHeight,
          left: 0,
          behaviour: 'smooth'
        });
      }, 50);
    }
  }
  /**
   * 
   * @returns This function is used to create a new FormGroup item for the document details in the client form.
   * It initializes the FormGroup with default values for the document ID, document type ID, document name, file preview, and file.
   * This function is typically called when adding a new document entry in the client form.
   * The `doc_name` control has a file extension validator applied to ensure that only allowed file types are accepted.
   */
  createItem(): FormGroup {
    return new FormGroup({
      id: new FormControl(0),
      doc_type_id: new FormControl('', []),
      doc_name: new FormControl('', [fileValidators.fileExtensionValidator(this.allowedExtensions)]),
      file_preview: new FormControl(''),
      file: new FormControl('')
    });
  }
  /**
   * 
   * @param __index - This function is used to remove a document from the client form.
   * It takes the index of the document to be removed as a parameter and removes the corresponding FormGroup item from the `doc_dtls` FormArray.
   * This function is typically called when the user wants to delete a document entry in the client form.
   */
  removeDocument(__index) {
    this.__docs.removeAt(__index);
  }
  /**
   * @description This getter function is used to access the `doc_dtls` FormArray from the client form.
   * It allows easy access to the array of document details in the client form.
   * This function is typically used to manipulate or retrieve document details in the client form.
   * @returns The `doc_dtls` FormArray from the client form.
   */
  get __docs(): FormArray {
    return this.__clientForm.get("doc_dtls") as FormArray;
  }
  /**
   * 
   * @param id - This function is used to set a specific item (document) in the client form.
   * @param type_id 
   * @param doc 
   * @param cl_id 
   * @returns 
   */
  setItem(id, type_id, doc, cl_id) {
    return new FormGroup({
      id: new FormControl(id),
      doc_type_id: new FormControl(type_id, [Validators.required]),
      doc_name: new FormControl(''),
      file_preview: new FormControl(`${environment.clientdocUrl}` + cl_id + '/' + doc),
      file: new FormControl(`${environment.clientdocUrl}` + cl_id + '/' + doc)
    });
  }
  /**
   * @description This function is used to handle file selection for a specific document in the client form.
   * It sets validators for the document name control based on the selected file, including file size
   */
  getFiles(__ev, index, __type_id) {
    this.__docs.controls[index].get('doc_name').setValidators([Validators.required, fileValidators.fileSizeValidator(__ev.target.files), fileValidators.fileExtensionValidator(this.allowedExtensions)])
    this.__docs.controls[index].get('doc_name').updateValueAndValidity();
    if (this.__docs.controls[index].get('doc_name').status == 'VALID') {
      const file = __ev.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.__docs.controls[index].get('file_preview')?.patchValue(reader.result);
      reader.readAsDataURL(file);
      this.__docs.controls[index].get('file')?.patchValue(__ev.target.files[0]);
    }
    else {
      this.setFileValue(index)
    }
  }
  /**
   * @description This function is used to reset the file value for a specific document in the client form.
   * It clears the file preview and file controls for the specified document index.
   * This function is typically called when the user wants to remove or reset the file selection for a document.
   * @param index - The index of the document in the `doc_dtls` FormArray to be reset.
   */
  setFileValue(index) {
    this.__docs.controls[index].get('file_preview')?.reset();
    this.__docs.controls[index].get('file')?.reset();
  }
  /**
   * @description This function is used to fetch the document type master data from the server.
   * It makes an API call to the '/documenttype' endpoint and updates the `__docTypeMaster` property with the response data.
   * This function is typically called during component initialization to populate a dropdown or select input with document types.
   */
  getDocumnetTypeMaster() {
    this.__dbIntr.api_call(0, '/documenttype', null).pipe(map((x: responseDT) => x.data)).subscribe((res: docType[]) => {
      this.__docTypeMaster = res;
    })
  }
  /**
   * @description This function is used to check if a PAN number already exists in the database.
   * It makes an API call to the '/client' endpoint with the provided PAN number as a query parameter.
   * If the response contains any data, it shows a snackbar message indicating that the PAN number already exists.
   * This function is typically called when the user enters a PAN number in the form to validate its uniqueness.
   * @param _pan - The event object containing the target value (PAN number) to be checked.
   */
  checkPanExistornot(_pan){
    if(_pan.target.value != ''){
      this.__dbIntr.api_call(0,'/client','pan='+_pan.target.value).subscribe((res: responseDT) =>{
        if(res.data.length > 0){this.__utility.showSnackbar('Pan Number already exist! please try with another one',0);}
      })  
    }
  }
}
