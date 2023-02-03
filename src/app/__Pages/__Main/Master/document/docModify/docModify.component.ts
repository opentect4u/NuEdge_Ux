import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { client } from 'src/app/__Model/__clientMst';
import { docType } from 'src/app/__Model/__docTypeMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { fileValidators } from 'src/app/__Utility/fileValidators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-docModify',
  templateUrl: './docModify.component.html',
  styleUrls: ['./docModify.component.css']
})
export class DocModifyComponent implements OnInit {
  __chkIsDocAvailable: string = 'N';
  @ViewChild('searchResult') __searchRlt: ElementRef;
  __items: client[] = [];
  @ViewChild('scrollTobottom') __scroll: ElementRef;
  __columns: string[] = ['sl_no', 'cl_code', 'cl_name', 'edit', 'delete'];
  allowedExtensions = ['jpg', 'png', 'jpeg'];
  __documents = new MatTableDataSource<client>([]);
  __docId: number = 0;
  __noImg: string = '../../../../../../assets/images/noimg.png';
  __isvisible: boolean = false;
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
  constructor(private __route: ActivatedRoute,private __dbIntr: DbIntrService, private __utility: UtiliService) { }

  ngOnInit() {
    this.getDocumnetTypeMaster();
    this.addItem();
    this.getlatestClientDocumnets();
    if(this.__route.snapshot.queryParamMap.get('id') && this.__route.snapshot.queryParamMap.get('client_code')){
             this.populateDT({client_code:atob(this.__route.snapshot.queryParamMap.get('client_code')),client_id:atob(this.__route.snapshot.queryParamMap.get('id'))})
    }
  }

  ngAfterViewInit() {
    this.__clientForm.controls['client_code'].valueChanges.
      pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(dt => dt?.length > 1 ?
          this.__dbIntr.searchItems('/documentsearch', dt)
          : []),
      ).subscribe({
        next: (value) => {
          console.log(value);
          this.__items = value.data;
          this.searchResultVisibility('block');
        },
        complete: () => console.log('completed'),
        error: (err) => console.log(err)

      })
  }


  getItems(__client: client) {
    console.log(__client);
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

  getlatestClientDocumnets() {
    this.__dbIntr.api_call(0, '/documentsearch', null).pipe(map((x: responseDT) => x.data)).subscribe(res => {
      this.__documents = new MatTableDataSource(res);
    })
  }

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
    this.__dbIntr.api_call(1, this.__chkIsDocAvailable == 'Y' ? '/documentEdit' : '/documentAdd', fd).subscribe((res: any) => {
      console.log(res);
      this.__utility.showSnackbar(res.suc == 1 ? 'Document Uploaded Successfully' : 'Something went wrong! Please try again later', res.suc);
      this.reset();
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
  setItem(id, type_id, doc, cl_id) {
    console.log(doc);
    
    return new FormGroup({
      id: new FormControl(id),
      doc_type_id: new FormControl(type_id, [Validators.required]),
      doc_name: new FormControl(''),
      file_preview: new FormControl( doc!= null ? `${environment.clientdocUrl}` + cl_id + '/' + doc : ''),
      file: new FormControl( doc!= null ? `${environment.clientdocUrl}` + cl_id + '/' + doc : '')
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
  updateRow(){

  }
  reset() {
     this.__clientForm.reset();
     this.__clientForm.patchValue({
      client_id:0
     })
     this.__docId = 0;
     this.__docs.controls.length = 0;
     this.addItem();
     this.__isvisible =false;
     this.__chkIsDocAvailable = 'N';
  }
  searchResultVisibility(display_mode) {
    this.__searchRlt.nativeElement.style.display = display_mode;
  }
  outsideClick(__ev) {
    if (__ev) {
      this.searchResultVisibility('none');
    }
  }
  populateDT(__items){
      this.__clientForm.controls['client_code'].reset(__items.client_code, { onlySelf: true, emitEvent: false });
      this.__dbIntr.api_call(0,'/documentsearch','client_id='+__items.client_id).pipe(map((x: any) => x.data)).subscribe((res: client[]) =>{
        this.getItems(res[0]);
      })
  }
}
