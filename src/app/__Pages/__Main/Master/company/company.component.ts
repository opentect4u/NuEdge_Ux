/******************************************  Company Master (Home/Master/Company)
 *
 *    In this page There are some number of tabs are implemented
 *    Each tab consist different functionality
 *    Main Aim of this page is to create full details of Company i.e Company Profile, Company Director, Company Product Mapping etc
 *
 * ************/
import { Component, OnInit } from '@angular/core';
import companyMenu from '../../../../../assets/json/Master/company.json';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { pluck } from 'rxjs/operators';
import subTab from '../../../../../assets/json/Master/commonMenuMst.json';
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css'],
})
export class CompanyComponent implements OnInit {
 /** Holdeing sub tab menu content */
 SubTabMenu = subTab.filter(x => x.flag!='U').map(({id, title, flag}) => ({tab_name:title,img_src:'',id,flag}))
 /**** End */

  index: number | undefined = 0;

  /**** Holding menus(comming from json file located at (src/app/assets/json/Master/company.json))
   * inside tab i.e Profile,Director Details etc..*/
  TabMenu = companyMenu.map(({id, tab_name,img_src, flag}) => ({tab_name:tab_name.toUpperCase(),img_src,id,flag}));
  /**** End */
  /**** Hoding Type of Company ****/
  company_type: any = [];
  /**** End ****/

  /**** Hoding Country Details****/
  countryMst: any = [];
  /**** End  */

  /**** Hoding Company Details (Profile)
   * & sent to director details tab
   * (applicable for all type of company)*/
  cmpDtls: any = [];
  /****** End  */

  /** Holding Director details */
  directorDtls: any = [];
  /****** End  */

  /** Holding Document Details */
  documentLockerMst: any = [];
  /*******End */

  /*** Holding Product Master Data */
  productMst: any = [];
  /*** End */
  /** Login Password Locker Master */
  // loginPasswordLocker: any = [];
  /*** End */

  /**  Licesnse Details */
  // licenseDtls: any = [];
  /*** End */

  /*** Bank Details */
  bankMst: any = [];
  /**** End */

  /*** Pertnership Details */
  pertnershipMst: any = [];
  /**** End */

  /** Shared Holder Details */
  sharedHolderMst: any = [];
  /*** End */

  /******Temporary Details */
  temporaryMst: any =[];
  /** End */

  constructor(private dbIntr: DbIntrService) {}

  ngOnInit(): void {
    this.getCountryMst(); /** For Getting Country Details */
    this.getCompanyType(); /** For Getting Company Type */
    this.getCompanyDetailsMst(); /** For Getting Company Profile Details */
    this.getDirectorDtlsMst(); /** For Getting director Details */
  }

  /******* Call Api For Get Company Director Details From Backend
   * &  we have used input decorator,
   * as Company Director Details is used inside various tab
   * so we call api for Company Director Details from parent component
   * & send the Company Director Details to its child component i.e  DirectorDtlsComponent, ProfileComponent
   * so the we have not repeat it*/
  getDirectorDtlsMst() {
    this.dbIntr
      .api_call(0, '/comp/director', null)
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.directorDtls = res;
      });
  }
  /**** End */

  /******* Call Api For Get Company Profile Details From Backend
   * &  we have used input decorator,
   * as Company Profile Details is used inside various tab
   * so we call api for Company Profile Details from parent component
   * & send the Company Profile Details to its child component i.e  DirectorDtlsComponent, ProfileComponent
   * so the we have not repeat it*/
  getCompanyDetailsMst() {
    this.dbIntr
      .api_call(0, '/comp/profile', null)
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.cmpDtls = res;
      });
  }
  /******* END */

  /******* Call Api For Get Country From Backend
   * &  we have used input decorator,
   * as country is used inside various tab
   * so we call api for country from parent component
   * & send the country to its child component i.e  DirectorDtlsComponent, ProfileComponent
   * so the we have not repeat it*/
  getCountryMst() {
    this.dbIntr
      .api_call(0, '/country', null)
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.countryMst = res;
      });
  }
  /******** End */

  /******* Call Api For Get Company type From Backend
   * &  we have used input decorator,
   * as company type is used inside various tab
   * so we call api for company type from parent component
   * & send the company type to its child component i.e  ProfileComponent
   * so the we have not repeat it*/
  getCompanyType() {
    this.dbIntr
      .api_call(0, '/comp/type', null)
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.company_type = res;
      });
  }
  /******** End */

  /*******
   *  Modify and add company profile details
   *  & send this to child component which will be populated in dropdown
   */
  getAddCompany(ev) {
    if (ev.id) {
      this.cmpDtls = this.cmpDtls.filter((value: any, key) => {
        if (value.id == Number(ev.id)) {
          (value.type_of_comp = ev.data.type_of_comp),
            (value.establishment_name = ev.data.establishment_name),
            (value.proprietor_name = ev.data.proprietor_name),
            (value.name = ev.data.name),
            (value.cin_no = ev.data.cin_no),
            (value.date_of_inc = ev.data.date_of_inc),
            (value.pan = ev.data.pan),
            (value.gstin = ev.data.gstin),
            (value.website = ev.data.website),
            (value.contact_no = ev.data.contact_no),
            (value.fb_url = ev.data.facebook),
            (value.linkedin = ev.data.linkedin),
            (value.twitter = ev.data.twitter),
            (value.instagram = ev.data.instagram),
            (value.email = ev.data.email),
            (value.logo = ev.data.logo),
            (value.add_1 = ev.data.add_1),
            (value.add_2 = ev.data.add_2),
            (value.country_id = ev.data.country_id),
            (value.pincode = ev.data.pincode),
            (value.state_id = ev.data.state_id),
            (value.city_id = ev.data.city_id),
            (value.dist_id = ev.data.district_id);
        }
        return true;
      });
    } else {
      this.cmpDtls.push(ev.data);
    }
    console.log(this.cmpDtls);
  }
  /****** END  */

  /*******
   *  Modify and add company Director details
   *    & send this to child component which will be populated in dropdown
   */
  getDirectorDtls(ev) {
    if (ev.id) {
      this.directorDtls = this.directorDtls.filter((value: any, key) => {
        if (value.id == Number(ev.id)) {
          (value.cm_profile_id = ev.data.cm_profile_id),
            (value.name = ev.data.name),
            (value.din_no = ev.data.din_no),
            (value.dob = ev.data.dob),
            (value.pan = ev.data.pan),
            (value.valid_from = ev.data.valid_from),
            (value.valid_to = ev.data.valid_to),
            (value.mob = ev.data.mob),
            (value.email = ev.data.email),
            (value.add_1 = ev.data.add_1),
            (value.add_2 = ev.data.add_2),
            (value.country_id = ev.data.country_id),
            (value.pincode = ev.data.pincode),
            (value.state_id = ev.data.state_id),
            (value.city_id = ev.data.city_id),
            (value.dist_id = ev.data.district_id);
        }

        return value;
      });
    } else {
      this.directorDtls.push(ev.data);
    }
  }
  /**** End */

  /*** For getting Selected Tab Index
   * & depend on this get company profile details
   * (not applicable for Pertnership firm)
   * from backend for director details only*/
  onTabChanged(ev) {
    console.log(ev);
    switch (ev.index.toString()) {
      case '5':
        this.getDocumentDtlsMst();
        break;
      case '9':
        // this.getProductMst();
        // this.getLoginPasswordLockerMst();
        break;
      case '8':
        // this.getProductMst();
        // this.getlicesnseDtls();
        break;
      // case '6':
      //   this.getbankDtls();
        break;
      case '3':
        this.getPertnershipDtls();
        break;
      case '7':
        this.getProductMst();
        break;
      case '4':
        this.getSharedMst();
        break;
      case '1':this.getTemporaryProfile();
        break;
    }
  }
  /**** End  */

  /** Call Api For Get Temporary Profile */
   getTemporaryProfile(){
    this.dbIntr.api_call(0,'/comp/tempProfile',null).pipe(pluck("data")).subscribe(res =>{
      console.log(res)
          this.temporaryMst = res;
    })
   }

  /*** End */
  /** Call API For Get Shared Holder Details Data From Backend */
  getSharedMst() {
    this.dbIntr
      .api_call(0, '/comp/sharedHolder', null)
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.sharedHolderMst = res;
      });
  }
  /**** End */

  /******* Call Api For Get Document Locker Master Data From Backend */
  getDocumentDtlsMst() {
    // this.dbIntr
    //   .api_call(0, '/comp/documentLocker', null)
    //   .pipe(pluck('data'))
    //   .subscribe((res) => {
    //     console.log(res);
    //     this.documentLockerMst = res;
    //   });
  }
  /**** End */

  /**** Call Api For Get Product Master Data From Backend */
  getProductMst() {
    this.dbIntr
      .api_call(0, '/comp/product', null)
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.productMst = res;
      });
  }
  /**End**/

  /** Call Api For Get Login Password Master Data from Backend */
  // getLoginPasswordLockerMst() {
  //   this.dbIntr
  //     .api_call(0, '/comp/loginpass', null)
  //     .pipe(pluck('data'))
  //     .subscribe((res) => {
  //       this.loginPasswordLocker = res;
  //     });
  // }
  /*** End */

  /** Call Api For Get License Master Data from Backend */
  // getlicesnseDtls() {
  //   this.dbIntr
  //     .api_call(0, '/comp/license', null)
  //     .pipe(pluck('data'))
  //     .subscribe((res) => {
  //       this.licenseDtls = res;
  //       console.log(res);
  //     });
  // }
  /**** End */

  /** Call Api For Get Bank Master Data from Backend */
  getbankDtls() {
    this.dbIntr
      .api_call(0, '/comp/bank', null)
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.bankMst = res;
      });
  }
  /**** End */

  /*** Call Api For Get Pertnership Master Data from Backend */
  getPertnershipDtls() {
    this.dbIntr
      .api_call(0, '/comp/partnership', null)
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.pertnershipMst = res;
      });
  }
  /****** End */

  /** Modify Pertner details */
  setpertnershipDtls(ev) {
    if (ev.id > 0) {
      //Modify pertner according to that Id
      this.pertnershipMst = this.pertnershipMst.filter((value, key) => {
        if (value.id == ev.data.id) {
          (value.cm_profile_id = ev.data.cm_profile_id),
            (value.name = ev.data.name),
            (value.dob = ev.data.dob),
            (value.pan = ev.data.pan),
            (value.mob = ev.data.mob),
            (value.email = ev.data.email),
            (value.percentage = ev.data.percentage),
            (value.add_1 = ev.data.add_1),
            (value.add_2 = ev.data.add_2),
            (value.country_id = ev.data.country_id),
            (value.district_id = ev.data.district_id),
            (value.state_id = ev.data.state_id);
          (value.city_id = ev.data.city_id), (value.pincode = ev.data.pincode);
        }
        return true;
      });
    } else {
      // push element into array of pertnership
      this.pertnershipMst.push(ev.data);
    }
  }
  /*** END */

  getsharedDtls(ev) {
    if (ev.id > 0) {
      this.sharedHolderMst = this.sharedHolderMst.filter((value, key) => {
        if (value.id == ev.data.id) {
          (value.add_1 = ev.data.add_1),
            (value.add_2 = ev.data.add_2),
            (value.certificate_no = ev.data.certificate_no),
            (value.city_id = ev.data.city_id),
            (value.cm_profile_id = ev.data.cm_profile_id),
            (value.cm_profile_name=ev.data.cm_profile_name),
            (value.country_id = ev.data.country_id),
            (value.date = ev.data.date),
            (value.distinctive_no_from = ev.data.distinctive_no_from),
            (value.distinctive_no_to = ev.data.distinctive_no_to),
            (value.district_id = ev.data.district_id),
            (value.dob = ev.data.dob),
            (value.email = ev.data.email),
            (value.id = ev.data.id),
            (value.mob = ev.data.mob),
            (value.name = ev.data.name),
            (value.no_of_share = ev.data.no_of_share),
            (value.nominee = ev.data.nominee),
            (value.pan = ev.data.pan),
            (value.percentage = ev.data.percentage),
            (value.pincode = ev.data.pincode),
            (value.registered_folio = ev.data.registered_folio),
            (value.state_id = ev.data.state_id),
            (value.type = ev.data.type);
            (value.remarks = ev.data.remarks);
            (value.upload_scan = ev.data.upload_scan);
            (value.transfer_from = ev.data.transfer_from);
            (value.trans_from_id = ev.data.trans_from_id);
            (value.country_name = ev.data.country_name);
            (value.state_name = ev.data.state_name);
            (value.district_name = ev.data.district_name);
            (value.city_name = ev.data.city_name);
            (value.pincode_code = ev.data.pincode_code);
            (value.type_of_comp = ev.data.type_of_comp);

        }
        return true;
      });
    } else {
      console.log(ev.data);

      this.sharedHolderMst.push(ev.data);
    }
  }

  /** After Save Temporary Profile details either push the data inside the temporary array
   * otherwise modify the item of the array */
  getTemporaryDtls(ev){
     if(ev.id){
      this.temporaryMst = this.temporaryMst.filter((value,key) =>{
           if(value.id = ev.data.id){
                  value.upload_logo = ev.data.upload_logo;
                  value.from_dt = ev.data.from_dt;
                  value.to_dt = ev.data.to_dt;
                  value.cm_profile_id = ev.data.cm_profile_id;
           }
           return true;
      })
     }
     else{
      this.temporaryMst.push(ev.data);
     }
  }
  TabDetails(ev){
    this.onTabChanged(ev);
    this.index = ev.index;
  }
}
