import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { debounceTime, distinctUntilChanged, map, switchMap ,skip, tap} from 'rxjs/operators';
import { client } from 'src/app/__Model/__clientMst';
// import { client } from 'src/app/__Model/__clientMst';
import { docType } from 'src/app/__Model/__docTypeMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'master-docsModification',
  templateUrl: './docsModification.component.html',
  styleUrls: ['./docsModification.component.css']
})
export class DocsModificationComponent implements OnInit {
  displayMode_forClient:string;
  __isClientPending: boolean = false;
  __chkIsDocAvailable: string = 'N';
  __isvisible:boolean =false;
  __items: client[] = [];
  __client_doc:client[] =[];
  @ViewChild('scrollTobottom') __scroll: ElementRef;
  allowedExtensions = ['pdf'];
  __noImg: string = '../../../../../../assets/images/noimg.png';
  __isVisible: boolean = false;
  __docTypeMaster: docType[];
  __clientForm = new FormGroup({
    client_id: new FormControl('', [Validators.required]),
    client_code: new FormControl({ value: '', disabled: false }),
    pan_no: new FormControl({ value: '', disabled: true }),
    mobile: new FormControl({ value: '', disabled: true }),
    client_name: new FormControl({ value: '', disabled: true }),
    email: new FormControl({ value: '', disabled: true }),
    doc_dtls: new FormArray([])
  })
  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<DocsModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog,
  ) {
    this.__utility.__isvisibleMenuIcon$.pipe(skip(1)).subscribe(res =>{
      if(this.data.id == res.id && this.data.flag == res.flag){
        this.__isVisible = res.isVisible
      }
    })
  }
  ngOnInit() {
    console.log(this.data.items?.client_doc);

    this.getDocumnetTypeMaster();
    this.addItem();
    if(this.data.id > 0){
      this.populateDT({client_code:this.data.items.client_code,client_id:this.data.items.id})
}
  }

  ngAfterViewInit(){
    this.__clientForm.controls['client_code'].valueChanges.
      pipe(
        tap(() => this.__isClientPending = true),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(dt => dt?.length > 1 ?
          this.__dbIntr.searchItems('/documentsearch', dt)
          : []),
      ).subscribe({
        next: (value: any) => {
          // console.log(value);
          this.__items = value.data;
          this.searchResultVisibility('block');
          this.__isClientPending = false;
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__isClientPending = false;
        }

      })
  }

  /**
   * * * This function is used to get the document details from the form array.
   * * * It retrieves the form array named "doc_dtls" from the __clientForm and returns it as a FormArray.
   * * * @returns FormArray - The form array containing the document details.
   * * * @memberof DocsModificationComponent
   */
  get __docs(): FormArray {
    return this.__clientForm.get("doc_dtls") as FormArray;
  }
  /**
   * * * This function is used to add a new document item to the form array.
   * * * It creates a new FormGroup for the document item and pushes it to the __docs array.
   * * * @returns void
   */
  addItem(): void {
    this.__docs.push(this.createItem());
  }
  /**
   * * * This function is used to fetch the document type master data from the server.
   * * * It makes an API call to retrieve the data and assigns it to the __docTypeMaster variable.
   * * * @returns void
   */
  getDocumnetTypeMaster() {
    this.__dbIntr.api_call(0, '/documenttype', null).pipe(map((x: responseDT) => x.data)).subscribe((res: docType[]) => {
      this.__docTypeMaster = res;
    })
  }
  /**
   * * * This function is responsible for submitting the document form data to the server.  
   * * * It checks if the form is valid, creates a FormData object, appends the form values to it,
   * * * and makes an API call to submit the data.
   * * * @returns void
   */
  minimize(){
    this.dialogRef.updateSize("30%",'55px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  /**
   * * * This function is used to maximize the dialog.
   * * * It updates the size of the dialog to 60% and toggles the visibility state.
   * * * @returns void
   * * * @memberof DocsModificationComponent
   */
  maximize(){
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }
  /**
   * * * This function is used to toggle the full screen mode of the dialog.
   * * * It updates the size of the dialog to 100% and toggles the visibility state.
   * * * @returns void
   * * * @memberof DocsModificationComponent
   */
  fullScreen(){
    this.dialogRef.updateSize("100%");
    this.__isVisible = !this.__isVisible;
  }
  /**
   * 
   * @returns FormGroup
   * * This function is used to create a new FormGroup for the document item.
   * * It initializes the form controls with default values and validators.
   */
  createItem(): FormGroup {
    return new FormGroup({
      id: new FormControl(0),
      doc_type_id: new FormControl('', [Validators.required]),
      doc_name: new FormControl('', [Validators.required, fileValidators.fileExtensionValidator(this.allowedExtensions)]),
      file_preview: new FormControl(''),
      file: new FormControl('')
    });
  }
  /**
   *  * This function is used to set the values of a document item in the form.
   *  * It creates a new FormGroup with the provided values and returns it.
   *  * @param id - The ID of the document item.  
   *  * @param type_id - The document type ID.
   * *  @param doc - The document name.
   * *  @param cl_id - The client ID.
   *  * * @returns FormGroup - The FormGroup with the provided values.
   *  *  * @memberof DocsModificationComponent
   *  *  * @description
   *  * This function is responsible for setting the values of a document item in the form.
   * @returns 
   */
  setItem(id, type_id, doc, cl_id) {
    return new FormGroup({
      id: new FormControl(id),
      doc_type_id: new FormControl(type_id, [Validators.required]),
      doc_name: new FormControl(''),
      file_preview: new FormControl( doc!= null ? `${environment.clientdocUrl}` + cl_id + '/' + doc : ''),
      file: new FormControl( doc!= null ? `${environment.clientdocUrl}` + cl_id + '/' + doc : '')
    });
  }
  /**
   * * * This function is used to set the visibility of the search results based on the display mode.
   * * * It updates the displayMode_forClient variable with the provided display mode.
   * * * @param display_mode - The display mode for the search results.
   * * * @returns void
   * * * @memberof DocsModificationComponent
   */
  searchResultVisibility(display_mode) {
    this.displayMode_forClient= display_mode;
  }

  /**
   * * * This function is used to populate the document type form with the selected client data.
   * * * It retrieves the client data from the server based on the client ID and updates
   * * the form controls with the retrieved data.
   * * * @param client - The selected client object containing client_id and client_code.
   * * * @returns void
   * * * @memberof DocsModificationComponent
   * * * @description
   * * * This function is responsible for populating the document type form with the selected client data.
   * * * It retrieves the client data from the server based on the client ID and updates the form controls with the retrieved data.
   */
  populateDT(client){
    console.log(client);

    // this.__clientForm.controls['client_code'].reset(client_code, { onlySelf: true, emitEvent: false });
    this.__dbIntr.api_call(0,'/documentsearch','client_id='+client.client_id).pipe(map((x: any) => x.data)).subscribe((res: client[]) =>{
      this.getItems(res[0]);
    })
}
/**
 * * * This function is used to get the items for the selected client.
 * * * It updates the client form with the selected client's details and populates the document details.
 * * * @param __client - The selected client object containing client details.
 * * * @returns void
 * * * @memberof DocsModificationComponent
 * * * @description
 * * This function is responsible for getting the items for the selected client.
 * * It updates the client form with the selected client's details and populates the document details.
 */
getItems(__client) {
  this.__client_doc = __client.client_doc;
  this.__clientForm.controls['client_code'].reset({value:__client.client_code,disabled:(this.data.items && this.data.items?.client_doc.length)}, { onlySelf: true, emitEvent: false });
  this.searchResultVisibility('none');
  this.__clientForm.patchValue({
    pan_no: __client.pan,
    mobile: __client.mobile,
    client_name: __client.client_name,
    email: __client.email,
    client_id: __client.id
  })
  this.__isvisible = true;

  this.__docs.controls.length = 0;
  if (__client.client_doc.length > 0) {
    __client.client_doc.forEach(element => {
      this.__docs.push(this.setItem(element.id, element.doc_type_id, element.doc_name, element.client_id));
    })
  }
  else {
    this.addItem();
  }
  this.__chkIsDocAvailable = __client.client_doc.length > 0 ? 'Y' : 'N';

}
/**
 * * * This function is responsible for submitting the document form data to the server.
 * * * It creates a FormData object, appends the client ID and document details to it,
 * * * and makes an API call to submit the data.
 * * * @returns void
 * * * @memberof DocsModificationComponent
 * * * @description
 * * This function is used to submit the document form data to the server.
 * * It creates a FormData object, appends the client ID and document details to it,
 * * and makes an API call to submit the data.
 * * * @example
 * * This function is called when the user clicks the submit button on the document form.
 * * * It collects the form data, including the client ID and document details, and sends it to the server for processing.
 * * * If the submission is successful, it displays a success message and closes the dialog.
 * * * @returns {void}
 * * * @memberof DocsModificationComponent
 * * * @description
 */
submit(){
   const __client = new FormData();
  __client.append('client_id',this.__clientForm.value.client_id);
  for (let i = 0; i < this.__clientForm.value.doc_dtls.length; i++) {
    if (typeof (this.__clientForm.value.doc_dtls[i].file) != 'string') {
      __client.append("file[]", this.__clientForm.value.doc_dtls[i].file);
      __client.append("doc_type_id[]", this.__clientForm.value.doc_dtls[i].doc_type_id);
      __client.append("row_id[]", this.__clientForm.value.doc_dtls[i].id);
    }
  }
  this.__dbIntr.api_call(1,this.__client_doc.length > 0 ? '/documentEdit' : '/documentAdd',__client).subscribe((res: any) =>{
               this.__utility.showSnackbar(res.suc == 1 ? 'Document ' + (this.__client_doc.length > 0 ? 'added' : 'updated') + ' successfully' : res.msg,res.suc);
               if(res.suc == 1){
                this.dialogRef.close();
               }
  })
}
/**
 * * * This function is used to remove a document from the form array.
 * * * It removes the document at the specified index from the form array.
 * * * @param __index - The index of the document to be removed.  
 * * * @returns void
 * * * @memberof DocsModificationComponent
 * * * @description
 * * This function is responsible for removing a document from the form array.
 * * It updates the form array by removing the document at the specified index.
 */
removeDocument(__index) {
  this.__docs.removeAt(__index);
}
/**
 * * * This function is used to get the files selected by the user.
 * * * It sets the validators for the document name field, updates its validity,
 * * * and checks if the file is valid. If valid, it sets the file preview and file value.
 * * * @param __ev - The event object containing the selected files.
 * * * @param index - The index of the document in the form array.
 * * * @param __type_id - The document type ID.
 * * * @returns void
 * * * @memberof DocsModificationComponent
 * * * @description
 * * This function is responsible for handling the file selection event.
 * * It sets the validators for the document name field, updates its validity,
 * * and checks if the file is valid. If valid, it sets the file preview and file value.
 */
getFiles(__ev, index, __type_id) {
  this.__docs.controls[index].get('doc_name').setValidators([Validators.required, fileValidators.fileSizeValidator(__ev.target.files), fileValidators.fileExtensionValidator(this.allowedExtensions)])
  this.__docs.controls[index].get('doc_name').updateValueAndValidity();

  if (this.__docs.controls[index].get('doc_name').status == 'VALID') {
    // const file = __ev.target.files[0];
    // const reader = new FileReader();
    // reader.onload = e => this.__docs.controls[index].get('file_preview')?.patchValue(reader.result);
    // reader.readAsDataURL(file);
    this.__docs.controls[index].get('file_preview')?.patchValue(this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL( __ev.target.files[0])));
    this.__docs.controls[index].get('file')?.patchValue(__ev.target.files[0]);
  }
  else {
    this.setFileValue(index)
  }
  // console.log(this.__docs);

}
/**
 * * * This function is used to set the file value for a document in the form array.
 * * * It resets the file preview and file controls for the specified document index.
 * * * @param index - The index of the document in the form array.
 * * * @returns void
 * * * @memberof DocsModificationComponent
 * * * @description
 * * This function is responsible for setting the file value for a document in the form array.
 * * It resets the file preview and file controls for the specified document index.
 */
setFileValue(index) {
  this.__docs.controls[index].get('file_preview')?.reset();
  this.__docs.controls[index].get('file')?.reset();
}
/**
 *  * * This function is used to handle the selection of items from the parent component.
 *  * * It retrieves the selected item and calls the getItems function to update the form with the selected client's details.
 *  * @param event - The event object containing the selected item.
 * *  * @returns void
 *  * @memberof DocsModificationComponent
 *  * @description
 *  * This function is responsible for handling the selection of items from the parent component.
 *  * It retrieves the selected item and calls the getItems function to update the form with the selected client's details.
 */
getSelectedItemsFromParent(event){
    this.getItems(event.item);
}
}
