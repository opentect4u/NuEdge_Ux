import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
@Component({
  selector: 'login-pass-entry',
  templateUrl: './login-pass-entry.component.html',
  styleUrls: ['./login-pass-entry.component.css']
})
export class LoginPassEntryComponent implements OnInit {
  @Input() product: any = [];
  @Output() modifyArray = new EventEmitter();
  @Input() set setParticularFormDt(value){
    if(value){
      this.cmp_profile_id = value;
      this.setloginpassworddatainform(value);
    }
  }
  @Output() setreset = new EventEmitter();
  loginPass = new FormGroup({
    id: new FormControl(0),
    product_id: new FormControl('', [Validators.required]),
    login_url: new FormControl('', [Validators.required]),
    login_id: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    sec_ques: new FormArray([]),
    cm_profile_id: new FormControl('')
  });
  @Input() cmp_profile_id:number;
  constructor(private dbIntr: DbIntrService,private utility: UtiliService) {}

  ngOnInit(): void {
    this.addQuesAns();
  }
  get sec_ques(): FormArray {
    return this.loginPass.get('sec_ques') as FormArray;
  }
  setSecQus(quesAns?: any) {
    return new FormGroup({
      sec_ques: new FormControl(quesAns ? quesAns?.sec_ques : ''),
      sec_ans: new FormControl(quesAns ? quesAns?.sec_ans : ''),
      id: new FormControl(quesAns ? quesAns?.id : 0),
    });
  }

  submitLoginPassword() {
    console.log(this.loginPass);
    const loginPass = new FormData();
    loginPass.append('id',this.loginPass.value.id);
    loginPass.append('product_id',this.loginPass.value.product_id);
    loginPass.append('login_url',this.loginPass.value.login_url);
    loginPass.append('login_id',this.loginPass.value.login_id);
    loginPass.append('login_pass',this.loginPass.value.password);
    loginPass.append('sec_qus_ans',JSON.stringify(this.sec_ques.value));
    loginPass.append('cm_profile_id',global.getActualVal(this.loginPass.value.cm_profile_id));
    this.dbIntr.api_call(1,'/comp/loginpassAddEdit',loginPass).subscribe((res: any) =>{
      this.utility.showSnackbar(res.suc == 1 ? 'Login & Password saved successfully': '',res.suc);
      this.modifyArray.emit({data:res.data,id:this.loginPass.value.id})
      this.reset();
    })
  }
  reset() {
    this.loginPass.patchValue({
      product_id:'',
      login_url:'',
      login_id:'',
      password:'',
      id:0,
    },{emitEvent: false});
    this.sec_ques.clear()
    this.addQuesAns();
    this.setreset.emit('');
  }

  setloginpassworddatainform(res){
    console.log(res);

    this.loginPass.patchValue({
      product_id:res ? res.product_id : '',
      login_url:res ? res.login_url : '',
      login_id:res ? res.login_id : '',
      password:res ? res.login_pass : '',
      id:res ? res.id : 0,
      cm_profile_id:res ? res.cm_profile_id : ''
    });
    if(JSON.parse(res.sec_qus_ans).length > 0){
      this.sec_ques.clear();
      JSON.parse(res.sec_qus_ans).forEach(x=>{this.sec_ques.push(this.setSecQus(x));})
    }
    else{

    }
  }
  addQuesAns(){
    this.sec_ques.push(this.setSecQus());
  }
  removeQuesAns(index){
    this.sec_ques.removeAt(index);
  }

}
