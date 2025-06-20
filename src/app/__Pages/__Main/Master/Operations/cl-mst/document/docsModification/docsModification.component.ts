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

  /*   * Getter for the FormArray 'doc_dtls' in the client form.
   * This allows access to the array of document details in the form.
   * @returns {FormArray} The FormArray containing document details.
   */
  get __docs(): FormArray {
    return this.__clientForm.get("doc_dtls") as FormArray;
  }
  /** * Adds a new item to the document details FormArray.
   * This method creates a new FormGroup for a document and pushes it to the FormArray.
   */
  addItem(): void {
    this.__docs.push(this.createItem());
  }
  /** * Retrieves the document type master data from the server.
   * This method makes an API call to fetch the document type master data and stores it in the __docTypeMaster variable.
   */
  getDocumnetTypeMaster() {
    this.__dbIntr.api_call(0, '/documenttype', null).pipe(map((x: responseDT) => x.data)).subscribe((res: docType[]) => {
      this.__docTypeMaster = res;
    })
  }
  /** * Closes the dialog and updates the visibility state.
   * This method is called when the dialog is closed, and it updates the visibility state of
   * the dialog based on the provided data.
   */
  minimize(){
    this.dialogRef.updateSize("30%",'55px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  /** * Toggles the visibility of the dialog and updates its size to 60%.
   * This method is called to maximize the dialog, making it occupy 60% of the screen width.
   */
  maximize(){
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }
  /** * Toggles the visibility of the dialog and updates its size to 100%.
   * This method is called to make the dialog fullscreen, occupying the entire screen.
   */
  fullScreen(){
    this.dialogRef.updateSize("100%");
    this.__isVisible = !this.__isVisible;
  }
  /** * Creates a new FormGroup for a document item.
   * This method initializes a new FormGroup with controls for document details,
   * including id, doc_type_id, doc_name, file_preview, and file.
   * @returns {FormGroup} The newly created FormGroup for a document item.
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
  /** * Sets the values for a document item in the FormGroup.
   * This method initializes a FormGroup with specific values for id, type_id, doc, and cl_id.
   * @param {number} id - The ID of the document item.
   * @param {number} type_id - The type ID of the document.
   * @param {string} doc - The name of the document.
   * @param {number} cl_id - The client ID associated with the document.
   * @returns {FormGroup} The FormGroup with the specified values for the document item.
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
  /** * Handles the visibility of the search results based on the display mode.
   * This method updates the display mode for the client search results.
   * @param {string} display_mode - The display mode to set for the search results.
   */
  searchResultVisibility(display_mode) {
    this.displayMode_forClient= display_mode;
  }

  /** * Populates the client form with the selected client's details.
   * This method retrieves the client details based on the selected client and updates the form controls accordingly.
   * @param {client} client - The selected client object containing client details.
   */
  populateDT(client){
    console.log(client);

    // this.__clientForm.controls['client_code'].reset(client_code, { onlySelf: true, emitEvent: false });
    this.__dbIntr.api_call(0,'/documentsearch','client_id='+client.client_id).pipe(map((x: any) => x.data)).subscribe((res: client[]) =>{
      this.getItems(res[0]);
    })
}
/** * Retrieves the items for the selected client and updates the form controls.
 * This method sets the client details in the form and updates the document details based on the selected client.
 * @param {client} __client - The selected client object containing client details.
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
/** * Submits the client document form data to the server.
 * This method collects the form data, appends the necessary fields, and makes an API call to submit the document details.
 * If the submission is successful, it shows a success message and closes the dialog.
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
/** * Remove document from form array with by particular index.*/
removeDocument(__index) {
  this.__docs.removeAt(__index);
}
/** * Handles the file input change event and updates the form controls with the selected file.
 * This method validates the file size and extension, updates the file preview, and sets the file control value.
 * @param {Event} __ev - The file input change event containing the selected file.
 * @param {number} index - The index of the document in the form array.
 * @param {number} __type_id - The type ID of the document.
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
/** * Resets the file preview and file controls for a specific document index.
 * This method is used to clear the file input and reset the form controls for a specific document.
 * @param {number} index - The index of the document in the form array.
 */
setFileValue(index) {
  this.__docs.controls[index].get('file_preview')?.reset();
  this.__docs.controls[index].get('file')?.reset();
}
/** * Handles the selection of a client from the parent component.
 * This method retrieves the selected client items and updates the form controls with the selected client's details.
 * @param {any} event - The event object containing the selected client item.
 */
getSelectedItemsFromParent(event){
    this.getItems(event.item);
}
}
