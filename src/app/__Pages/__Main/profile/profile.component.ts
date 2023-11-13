import { Component, OnInit } from '@angular/core';
import profile from '../../../../assets/json/profile.json';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileTab = profile;
  active_tab:string = profile[0].flag;

  profile = new FormGroup({
      manage_password:new FormGroup({
          old_password:new FormControl('',[Validators.required]),
          new_password:new FormControl('',[Validators.required]),
          conf_password:new FormControl('',[Validators.required])
      }),
      manage_account:new FormGroup({})
  })

  constructor() { }

  ngOnInit(): void {
  }
  changeTab = (tab) =>{
      this.active_tab = tab.flag;
  }
  changePassword(){
    console.log(this.profile.value.manage_password);
  }
}
