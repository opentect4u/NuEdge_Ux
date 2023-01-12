import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

@Component({
  selector: 'master-docsModification',
  templateUrl: './docsModification.component.html',
  styleUrls: ['./docsModification.component.css']
})
export class DocsModificationComponent implements OnInit {
  __selectFiles: any=[];
  // __docs:FormArray;
  __clMaster: any=[];
  __docTypeMaster; any=[];
  __clientForm = new FormGroup({
    client_code: new FormControl(this.data?.cl_code),
    doc_dtls:new FormArray([])
  })
  constructor(
    public dialogRef: MatDialogRef<DocsModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog,
  ) { 
    this.__clientForm.disable();
    this.getClientMaster();
    this.getDocumnetTypeMaster();

    
  }

  ngOnInit() {
    if(this.data.__docsDetail.length > 0){    
      this.data.__docsDetail.forEach(element => {
            this.__docs.push(this.setItem(element.id,element.doc_type_id,element.doc_name));
            this.__selectFiles.push({id:element.id,doc_type_id:element.doc_type_id,doc_name:element.doc_name})
      });
    }
    else{
      console.log('add');
      this.addItem();
      }
  }
  getClientMaster(){
   this.__dbIntr.api_call(0,'/client',null).pipe(map((x: any) => x.data)).subscribe(res => {
    this.__clMaster = res;
   })
  }
  getDocumnetTypeMaster(){
    this.__dbIntr.api_call(0,'/documenttype',null).pipe(map((x: any) => x.data)).subscribe(res =>{
         this.__docTypeMaster = res;
    })
  }
  submit(){
    if(this.__clientForm.invalid){
      return ;
    }
    console.log(this.__clientForm.value);
    const fd = new FormData();
    fd.append("client_id",this.data?.cl_id);
    for(let i = 0; i < this.__selectFiles.length; i++) { 
      console.log(this.__selectFiles[i]);
      fd.append("file[]",this.__selectFiles[i].files);
      fd.append("doc_type_id[]",this.__selectFiles[i].type_id)
    }
   this.__dbIntr.api_call(1,'/documentAddEdit',fd).subscribe(res =>{
      console.log(res);
   })

  }
  createItem(): FormGroup {
    return new FormGroup({
      id: new FormControl(0),
      doc_type_id: new FormControl('',[Validators.required]),
      doc_name: new FormControl('',[Validators.required]),
      fileSource: new FormControl('')
    });
  }
  setItem(id,type_id,doc){
    return new FormGroup({
          id: new FormControl(id),
          doc_type_id: new FormControl(type_id,[Validators.required]),
          doc_name: new FormControl('',[Validators.required]),
          fileSource: new FormControl()
        });
  }
  
  addItem(): void {
    // this.__docs = this.__clientForm.get('doc_dtls') as FormArray;
    this.__docs.push(this.createItem());
  }
  removeDocument(__index){
    console.log(this.__selectFiles);
    this.__docs.removeAt(__index);
    this.__selectFiles.removeAt(__index);
    console.log(this.__selectFiles);
  }
  getFiles(__ev,index,__type_id){
      this.__selectFiles.push({files: __ev.target.files[0],type_id:__type_id});
      console.log(this.__selectFiles);
      
  }
  get __docs() : FormArray {
    return this.__clientForm.get("doc_dtls") as FormArray;
  }
}
