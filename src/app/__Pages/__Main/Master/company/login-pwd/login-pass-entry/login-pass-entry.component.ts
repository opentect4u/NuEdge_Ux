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
  /** * * This function is used to create a FormGroup for security questions and answers.
 * * It initializes the form controls with the provided question and answer or default values.
 * * @param {any} [quesAns] - Optional parameter containing the question and answer to be used for initialization.
 * * @returns {FormGroup} - The FormGroup instance containing the security question and answer controls.
 */
  setSecQus(quesAns?: any) {
    return new FormGroup({
      sec_ques: new FormControl(quesAns ? quesAns?.sec_ques : ''),
      sec_ans: new FormControl(quesAns ? quesAns?.sec_ans : ''),
      id: new FormControl(quesAns ? quesAns?.id : 0),
    });
  }

  /** 
   * * This function is used to submit the login password form data.
   * * It collects the form data, appends it to a FormData object, and sends it to the backend API.
   * * If the submission is successful, it displays a success message and emits an event with the modified data.
   * @returns {void}
   */
  submitLoginPassword() {
    console.log(this.loginPass);
    const loginPass = new FormData();
    loginPass.append('id',this.loginPass.value.id ? this.loginPass.value.id : 0);
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
  /** 
   * * This function is used to reset the login password form data.
   * * It clears the form fields, resets the security questions array, and emits a reset event.
   * @returns {void}
   */
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

  /** This function is used to set the login password data in the form.
   * It updates the form controls with the provided data or sets default values if no data is provided.
   * @param {any} res - The login password data to be set in the form.
   * @returns {void}
   */
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
  /* * * This function is used to add a new security question and answer form group to the security questions form array.
   * * It creates a new FormGroup instance with the specified question and answer and adds it to the form array.
   * * @returns {void}
   */
  addQuesAns(){
    this.sec_ques.push(this.setSecQus());
  }
  /** * * This function is used to remove a security question and answer form group from the security questions form array.
   * * It removes the form group at the specified index from the form array.
   * * @param {number} index - The index of the security question and answer form group to be removed.
   * @returns {void}
   */
  removeQuesAns(index){
    this.sec_ques.removeAt(index);
  }

}
