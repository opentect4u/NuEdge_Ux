import { Component, Input, OnInit } from '@angular/core';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

@Component({
  selector: 'app-login-pwd',
  templateUrl: './login-pwd.component.html',
  styleUrls: ['./login-pwd.component.css'],
})
export class LoginPwdComponent implements OnInit {
  constructor(private dbIntr:DbIntrService){}
  tabindex: number = 0;
  companyTabMenu: any = [];
  cmp_profile_id: number;
  public particularLoginPasswordDetails;
  @Input() subTab = [];
  /** Product Master Dtls */
  // @Input() product: any = [];
  product: any = [];
  /*** End */

    /** Login Password Master Dtls */
   // @Input() loginPasswordLockerMst: any =[];
    loginPasswordLockerMst: any =[];
   /** End */
  @Input() set cmpDtlsMst(value){
    this.companyTabMenu = value.map(({id,name,establishment_name,type_of_comp}) => ({id,tab_name:type_of_comp == 4 ? establishment_name : name,img_src:''}))
  }
  ngOnInit(): void {
    this.setCompanyProfileId(this.companyTabMenu[0].id);
  }
  onTabChange(ev){
    this.tabindex = ev.index;
  }
  /** * This function is used to set the company profile ID and fetch the product master data and login password locker master data.
 * @param {number} cm_profile_id - The ID of the company profile to be set.
 * @returns {void}
 */
  setCompanyProfileId(cm_profile_id){
   this.cmp_profile_id = cm_profile_id;
   console.log(this.cmp_profile_id);

   this.getProductMst(cm_profile_id);
   this.getLoginPasswordLockerMst(cm_profile_id)
  }

  /**** Call Api For Get Product Master Data From Backend */
  getProductMst(cm_profile_id) {
    this.dbIntr
      .api_call(0, '/comp/product', 'cm_profile_id='+ cm_profile_id)
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.product = res;
      });
  }
  /**End**/

  /** This function is used to set the form data for a specific login password entry.
 * @param {any} ev - The event containing the data for the login password entry.
 * @returns {void}
 */
  setFormDt(ev){
    this.onTabChange(ev);
    this.particularLoginPasswordDetails =ev.data;
  }
  /** This function is used to reset the form data for the login password entry.
 * @param {any} ev - The event containing the data to reset the form.
 * @returns {void}
 */
  reset(ev){
     this.particularLoginPasswordDetails = ev;
  }
  /** This function is used to modify the login password master data.
 * @param {any} ev - The event containing the modified login password data.
 * @returns {void}
 */
  ModifyLoginPasswordMst(ev){
    if(ev.id == 0){
        this.loginPasswordLockerMst.push(ev.data);
    }
    else{
      this.loginPasswordLockerMst = this.loginPasswordLockerMst.filter((value,key) =>{
        if (value.id == Number(ev.id)) {
            value.id = ev.data.id,
            value.login_id = ev.data.login_id,
            value.login_pass = ev.data.login_pass,
            value.login_url = ev.data.login_url,
            value.sec_qus_ans = ev.data.sec_qus_ans,
            value.product_id = ev.data.product_id,
            value.cm_profile_id = ev.data.cm_profile_id,
            value.product_name = ev.data.product_name
        }
        return true;
      })
    }
  }
  /** This function is called when the company tab is changed.
 * It updates the company profile ID based on the selected tab and fetches the login password master data.
 * @param {any} ev - The event containing the tab change information.
 * @returns {void}
 */
  onCompanyTabChange(ev){
    this.setCompanyProfileId(ev?.tabDtls?.id)
  }
  /** Call Api For Get Login Password Master Data from Backend */
  getLoginPasswordLockerMst(cm_profile_id) {
    this.dbIntr
      .api_call(0, '/comp/loginpass', 'cm_profile_id='+ cm_profile_id)
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.loginPasswordLockerMst = res;
      });
  }
  /*** End */
}
