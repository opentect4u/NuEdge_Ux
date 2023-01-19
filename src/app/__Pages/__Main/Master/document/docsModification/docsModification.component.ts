import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
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
  @ViewChild('scrollTobottom') __scroll: ElementRef;
  allowedExtensions = ['jpg', 'png', 'jpeg'];
  __noImg: string = '../../../../../../assets/images/noimg.png';
  __isvisible: boolean = false;
  __docTypeMaster: docType[];
  __clientForm = new FormGroup({
    client_id: new FormControl('', [Validators.required]),
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
    if (this.data.id > 0) {
      this.__isvisible = true;
      this.setClientForm(this.data.items.client_code, this.data.items.pan, this.data.items.mobile, this.data.items.client_name, this.data.items.email, this.data.cl_id)
      if (this.data.__docsDetail.length > 0) {
        this.data.__docsDetail.forEach(element => {
          this.__docs.push(this.setItem(element.id, element.doc_type_id, element.doc_name));
        });
      }
      else {
        this.addItem();
      }
    }
    else {
      this.addItem();
    }
  }
  // getClientMaster() {
  //   this.__dbIntr.api_call(0, '/client', null).pipe(map((x: responseDT) => x.data)).subscribe((res: client[]) => {
  //     this.__clMaster = res;
  //   })
  // }
  getDocumnetTypeMaster() {
    this.__dbIntr.api_call(0, '/documenttype', null).pipe(map((x: responseDT) => x.data)).subscribe((res: docType[]) => {
      this.__docTypeMaster = res;
    })
  }
  submit() {
    if (this.__clientForm.invalid) {
      this.__utility.showSnackbar(this.__clientForm.get('client_id').value == '' ? 'Error !! No client selected' : 'Submition failed due to some error', 0);
      return;
    }
    const fd = new FormData();
    fd.append("client_id", this.__clientForm.value.client_id);
    for (let i = 0; i < this.__clientForm.value.doc_dtls.length; i++) {
      if (typeof (this.__clientForm.value.doc_dtls[i].file) != 'string') {
        fd.append("file[]", this.__clientForm.value.doc_dtls[i].file);
        fd.append("doc_type_id[]", this.__clientForm.value.doc_dtls[i].doc_type_id);
        fd.append("row_id[]", this.__clientForm.value.doc_dtls[i].id);
      }
    }
    this.__dbIntr.api_call(1, this.data.id > 0 ? '/documentEdit' : '/documentAdd', fd).pipe((map((x: responseDT) => x.suc))).subscribe((res: number) => {
      if (res == 1) {
        this.dialogRef.close(res);
      }
      this.__utility.showSnackbar(res == 1 ? 'Document Uploaded Successfully' : 'Something went wrong! Please try again later', res);
    })

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
  setItem(id, type_id, doc) {
    return new FormGroup({
      id: new FormControl(id),
      doc_type_id: new FormControl(type_id, [Validators.required]),
      doc_name: new FormControl(''),
      file_preview: new FormControl(`${environment.clientdocUrl}` + this.data.cl_id + '/' + doc),
      file: new FormControl(`${environment.clientdocUrl}` + this.data.cl_id + '/' + doc)
    });
  }

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
    console.log(this.__docs);

  }
  get __docs(): FormArray {
    return this.__clientForm.get("doc_dtls") as FormArray;
  }
  getSearchItem(__ev) {
    if (__ev.flag == 'F') {
      this.setClientForm(__ev.item.client_code, __ev.item.pan, __ev.item.mobile, __ev.item.client_name, __ev.item.email, __ev.item.id)
    }
    this.__isvisible = __ev.flag == 'F' ? true : false;
  }
  setFileValue(index) {
    this.__docs.controls[index].get('file_preview')?.reset();
    this.__docs.controls[index].get('file')?.reset();
  }
  setClientForm(cl_code, pan_no, mobile, cl_name, email, id) {
    this.__clientForm.patchValue({
      client_code: cl_code,
      pan_no: pan_no,
      mobile: mobile,
      client_name: cl_name,
      email: email,
      client_id: id
    })

  }

}
