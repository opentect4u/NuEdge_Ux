import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

@Component({
  selector: 'app-RcvFrm',
  templateUrl: './RcvFrm.component.html',
  styleUrls: ['./RcvFrm.component.css']
})
export class RcvFrmComponent implements OnInit {
  __productMaster: any = [];
  __empMaster: any = [];
  __formTypeMaster: any=[];

  __rcvForm = new FormGroup({
    product_id: new FormControl('', [Validators.required]),
    application_no: new FormControl(''),
    form_type_id: new FormControl('', [Validators.required]),
    pan_no: new FormControl('', [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}')]),
    mobile: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    euin_from: new FormControl('',[Validators.required]),
    id:new FormControl('')
  });
  constructor(private dbIntr: DbIntrService) { }

  ngOnInit() {
  this.getProductMaster();
  this.getEmployeeMaster();
  }
  ngAfterViewInit(){
    this.__rcvForm.controls["product_id"].valueChanges.subscribe(res =>{
      this.getformTypeByProductId(res);
    })
  }
  recieveForm() {
    if (this.__rcvForm.invalid) {
      return;
    }
    this.dbIntr.api_call(1,'/formreceivedAdd',this.__rcvForm.value).pipe(map((x: any) => x.suc)).subscribe(res =>{
      console.log(res);
      if(res == 1){
        //Saved Success-fully
        this.__rcvForm.reset();
      }
    })
  }
  getSearchItem(__ev) {
      console.log(__ev);
  }

  getProductMaster() {
    this.dbIntr.api_call(0, '/product', null).pipe(map((x: any) => x.data)).subscribe(res => {
      this.__productMaster = res;
    })
  }
  getEmployeeMaster(){
    this.dbIntr.api_call(0, '/employee', null).pipe(map((x: any) => x.data)).subscribe(res => {
      this.__empMaster = res;
    })
  }

  getformTypeByProductId(product_id){
  this.dbIntr.api_call(0,'/formtypeUsingPro','product_id='+product_id).pipe(map((x:any) => x.data)).subscribe(res =>{
     console.log(res);
    this.__formTypeMaster = res;
  })

  }
}
