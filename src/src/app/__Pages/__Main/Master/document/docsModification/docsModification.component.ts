import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, map, switchMap ,skip} from 'rxjs/operators';
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
  __chkIsDocAvailable: string = 'N';
  __isvisible:boolean =false;
  @ViewChild('searchResult') __searchRlt: ElementRef;
  __items: client[] = [];
  @ViewChild('scrollTobottom') __scroll: ElementRef;
  allowedExtensions = ['jpg', 'png', 'jpeg'];
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
    // console.log(this.data.id);
    
    this.getDocumnetTypeMaster();
    this.addItem();
    if(this.data.id > 0){
      this.populateDT({client_code:this.data.items.client_code,client_id:this.data.items.client_id})
}
  }
   
  ngAfterViewInit(){
    this.__clientForm.controls['client_code'].valueChanges.
      pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(dt => dt?.length > 1 ?
          this.__dbIntr.searchItems('/documentsearch', dt)
          : []),
      ).subscribe({
        next: (value) => {
          // console.log(value);
          this.__items = value.data;
          this.searchResultVisibility('block');
        },
        complete: () => console.log(''),
        error: (err) => console.log()

      })
  }

  get __docs(): FormArray {
    return this.__clientForm.get("doc_dtls") as FormArray;
  }
  addItem(): void {
    this.__docs.push(this.createItem());
  }
  getDocumnetTypeMaster() {
    this.__dbIntr.api_call(0, '/documenttype', null).pipe(map((x: responseDT) => x.data)).subscribe((res: docType[]) => {
      this.__docTypeMaster = res;
    })
  }
  minimize(){
    this.dialogRef.updateSize("30%",'55px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  maximize(){
    this.dialogRef.updateSize("60%");
    this.__isVisible = !this.__isVisible;
  }
  fullScreen(){
    this.dialogRef.updateSize("100%");
    this.__isVisible = !this.__isVisible;
  }
  createItem(): FormGroup {
    return new FormGroup({
      id: new FormControl(0),
      doc_type_id: new FormControl('', [Validators.required]),
      doc_name: new FormControl('', [Validators.required, fileValidators.fileExtensionValidator(this.allowedExtensions)]),
      file_preview: new FormControl(''),
      file: new FormControl('')
    });
  }
  setItem(id, type_id, doc, cl_id) {
    return new FormGroup({
      id: new FormControl(id),
      doc_type_id: new FormControl(type_id, [Validators.required]),
      doc_name: new FormControl(''),
      file_preview: new FormControl( doc!= null ? `${environment.clientdocUrl}` + cl_id + '/' + doc : ''),
      file: new FormControl( doc!= null ? `${environment.clientdocUrl}` + cl_id + '/' + doc : '')
    });  
  }
  searchResultVisibility(display_mode) {
    this.__searchRlt.nativeElement.style.display = display_mode;
  }
  outsideClick(__ev) {
    if (__ev) {
      this.searchResultVisibility('none');
    }
  }
  populateDT(client){
    // console.log(client);
    
    // this.__clientForm.controls['client_code'].reset(client_code, { onlySelf: true, emitEvent: false });
    this.__dbIntr.api_call(0,'/documentsearch','client_id='+client.client_id).pipe(map((x: any) => x.data)).subscribe((res: client[]) =>{
      this.getItems(res[0]);
    })
}
getItems(__client) {
  // console.log(__client);
  this.__clientForm.controls['client_code'].reset(__client.client_code, { onlySelf: true, emitEvent: false });
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
submit(){

}
removeDocument(__index) {
  this.__docs.removeAt(__index);
}
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
  // console.log(this.__docs);

}
setFileValue(index) {
  this.__docs.controls[index].get('file_preview')?.reset();
  this.__docs.controls[index].get('file')?.reset();
}
}
