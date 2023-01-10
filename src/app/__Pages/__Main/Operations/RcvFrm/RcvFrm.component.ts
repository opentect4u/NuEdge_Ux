import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-RcvFrm',
  templateUrl: './RcvFrm.component.html',
  styleUrls: ['./RcvFrm.component.css']
})
export class RcvFrmComponent implements OnInit {
  __rcvForm = new FormGroup({
       product_type:new FormControl('',[Validators.required]),
       application_no:new FormControl(''),
       form_type:new FormControl('',[Validators.required]),
       pan_no:new FormControl('',[Validators.required,Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}')]),
       mobile_no:new FormControl('',[Validators.required,Validators.minLength(10),Validators.maxLength(10)]),
       email:new FormControl('',[Validators.required,Validators.email]),
  }); 
  constructor() { }

  ngOnInit() {
  }
  recieveForm(){
    if(this.__rcvForm.invalid){
      return;
    }
    console.log(this.__rcvForm.value);
    
  }
}
