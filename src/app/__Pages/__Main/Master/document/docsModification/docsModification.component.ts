import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'master-docsModification',
  templateUrl: './docsModification.component.html',
  styleUrls: ['./docsModification.component.css']
})
export class DocsModificationComponent implements OnInit {
  __noImg: string='../../../../../../assets/images/noimg.jpg';
  __isvisible: boolean = false;
  __selectFiles: any = [];
  // __docs:FormArray;
  __clMaster: any = [];
  __docTypeMaster; any = [];
  __clientForm = new FormGroup({
    client_id: new FormControl(''),
    client_code: new FormControl({ value: '', disabled: true }),
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
    this.getDocumnetTypeMaster();
  }

  ngOnInit() {
    console.log(this.data);

    if (this.data.id > 0) {
      this.__isvisible = true;
      this.__clientForm.patchValue({
        client_id: this.data.cl_id,
        client_code: this.data.items.client_code,
        pan_no: this.data.items.pan,
        mobile: this.data.items.mobile,
        client_name: this.data.items.client_name,
        email: this.data.items.email,
      })
      if(this.data.__docsDetail.length > 0){
        this.data.__docsDetail.forEach(element => {
          this.__docs.push(this.setItem(element.id, element.doc_type_id, element.doc_name));
        });
      }
      else{
         this.addItem();
      }
    }
    else {
      console.log('add');
      this.addItem();
    }
  }
  getClientMaster() {
    this.__dbIntr.api_call(0, '/client', null).pipe(map((x: any) => x.data)).subscribe(res => {
      this.__clMaster = res;
    })
  }
  getDocumnetTypeMaster() {
    this.__dbIntr.api_call(0, '/documenttype', null).pipe(map((x: any) => x.data)).subscribe(res => {
      this.__docTypeMaster = res;
    })
  }
  submit() {
    if (this.__clientForm.invalid) {
      return;
    }
    console.log(this.__clientForm.value.doc_dtls);
    console.log(this.__clientForm.value);
    const fd = new FormData();
    fd.append("client_id", this.__clientForm.value.client_id);
    for (let i = 0; i < this.__clientForm.value.doc_dtls.length; i++) {
      if(typeof(this.__clientForm.value.doc_dtls[i].file) != 'string'){
        fd.append("file[]", this.__clientForm.value.doc_dtls[i].file);
        fd.append("doc_type_id[]", this.__clientForm.value.doc_dtls[i].doc_type_id);
        fd.append("row_id[]", this.__clientForm.value.doc_dtls[i].id);
      }
    }

    this.__dbIntr.api_call(1, this.data.id > 0 ? '/documentEdit' : '/documentAdd', fd).pipe((map((x: any) => x.suc))).subscribe(res => {
      this.__utility.showSnackbar(res == 1 ? 'Document Uploaded Successfully' : 'Something went wrong', '');
      if (res == 1) {
        this.dialogRef.close(res);
      }
    })

  }
  createItem(): FormGroup {
    return new FormGroup({
      id: new FormControl(0),
      doc_type_id: new FormControl('', [Validators.required]),
      doc_name: new FormControl('', [Validators.required]),
      file_preview: new FormControl(''),
      file: new FormControl('')
    });
  }
  setItem(id, type_id, doc) {
    return new FormGroup({
      id: new FormControl(id),
      doc_type_id: new FormControl(type_id),
      doc_name: new FormControl(''),
      file_preview: new FormControl(`${environment.clientdocUrl}` + this.data.cl_id + '/' + doc),
      file: new FormControl(doc)
    });
  }

  addItem(): void {
    // this.__docs = this.__clientForm.get('doc_dtls') as FormArray;
    this.__docs.push(this.createItem());
  }
  removeDocument(__index) {
    this.__docs.removeAt(__index);
  }
  getFiles(__ev, index, __type_id) {
    console.log(__ev.target.files);
    
    if(__ev.target.files.length > 0){
      this.__docs.controls[index].get('file')?.patchValue(__ev.target.files[0]);
      const file = __ev.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.__docs.controls[index].get('file_preview')?.patchValue(reader.result);
      reader.readAsDataURL(file);  
    }
    else{
      this.__docs.controls[index].get('file_preview')?.patchValue('');
      this.__docs.controls[index].get('doc_name')?.patchValue('');
      this.__docs.controls[index].get('file')?.patchValue('');

    }
      }
  get __docs(): FormArray {
    return this.__clientForm.get("doc_dtls") as FormArray;
  }
  getSearchItem(__ev) {
    console.log(__ev);
    if (__ev.flag == 'F') {
      this.__clientForm.patchValue({
        client_code: __ev.item.client_code,
        pan_no: __ev.item.pan,
        mobile: __ev.item.mobile,
        client_name: __ev.item.client_name,
        email: __ev.item.email,
        client_id: __ev.item.id
      })
    }
    this.__isvisible = __ev.flag == 'F' ? true : false;
  }
}
