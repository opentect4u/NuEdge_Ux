import { Component, OnDestroy, OnInit } from '@angular/core';
import { pluck } from 'rxjs/operators';
import { rnt } from 'src/app/__Model/Rnt';
import { amc } from 'src/app/__Model/amc';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import itemsPerPage from '../../../../../../assets/json/itemsPerPage.json';
import { Overlay } from '@angular/cdk/overlay';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { PreviewDocumentComponent } from 'src/app/shared/core/preview-document/preview-document.component';
import { DomSanitizer } from '@angular/platform-browser';
import KycMst from '../../../../../../assets/json/kyc.json';
import withoutKycMst from '../../../../../../assets/json/withoutKyc.json';
type selectBtn ={
  label:string,
  value:string,
  icon:string
}
@Component({
  selector: 'app-cmn-report-for-mf',
  templateUrl: './cmn-report-for-mf.component.html',
  styleUrls: ['./cmn-report-for-mf.component.css']
})
export class CmnReportForMFComponent implements OnInit,OnDestroy {
  headerTitle: string;
  tabIndex:number = 0;
  __pageNumber = '10';
  itemsPerPage:selectBtn[] = itemsPerPage;
   trnsType: any = []; /** Holding Transaction Type i.e FINANCIAL,NON FINANCIAL,NFO */
   trnsMst: any= []; /** Holding Transaction i.e PIP,SIP,SWITCH .depends upon transaction Type */
   trnsTypeId:number;/*** Holding selected transaction Type tab, for hide /show the particular div */
   transaction:any;/*** Holding selected transactiontab */
   amcMst: amc[] = []; /**Holding AMC Master Data */
   rntMst:rnt[] = [] /*** Holding R&T Master Data */
   MstDt: any = [];/*** Holdng Financial Master Data */
   nonfinMst: any = []; /*** Holding NON Financial Master Data */
   settingsforDropdown_foramc = this.utility.settingsfroMultiselectDropdown('id','amc_name','Search AMC',1);
   settingsforDropdown_forscheme = this.utility.settingsfroMultiselectDropdown('id','scheme_name','Search Scheme',1);
   settingsforDropdown_forbrnch = this.utility.settingsfroMultiselectDropdown('id','brn_name','Search Branch',1);
   settingsforBuTypeDropdown = this.utility.settingsfroMultiselectDropdown('id','bu_type','Search Business Type',1);
  settingsforRMDropdown = this.utility.settingsfroMultiselectDropdown('id','rm_name','Search Relationship Manager',1);
  settingsforSubBrkDropdown = this.utility.settingsfroMultiselectDropdown('id','sub_brk_cd','Search Sub Broker',1);
  settingsforEuinDropdown = this.utility.settingsfroMultiselectDropdown('id','emp_name','Search Employee',1);
   selectBtn:selectBtn[] = [{ label: 'Advance Filter', value: 'A',icon:'pi pi-filter' }, { label: 'Reset', value: 'R',icon:'pi pi-refresh' }]

   constructor(
    private dbIntr:DbIntrService,
    private utility: UtiliService,
    private overlay: Overlay,
    private sanitizer: DomSanitizer,
    private __dialog: MatDialog
    ) { }
  ngOnInit(): void {
    this.getTransactionType();/*** Get Transaction Type from backend */
    this.getRntMst(); /****Get R&T Master Data from backend  */
    this.getAMCMst(); /****Get AMC Master Data From Backend */
  }

  /** Function to call api for getting AMC Master Data */
  getAMCMst(){
    this.dbIntr.api_call(0,'/amc',null).pipe(pluck("data")).subscribe((res: amc[]) =>{
     this.amcMst = res;
    })
  }
  /** End */
  /****Get R&T Master Data from backend  */
  getRntMst(){
     this.dbIntr.api_call(0,'/rnt',null).pipe(pluck("data")).subscribe((res:  rnt[]) =>{
        this.rntMst = res;
    })
  }
  /*** End */


  /*** event occur whenever the main tab has been changed*/
  TabDetails(ev){
    this.transaction = ''
    this.trnsMst.length = 0;
    this.getTransactionAgainstParticularTransactionType(ev.tabDtls?.product_id,ev.tabDtls?.id);
    this.trnsTypeId = ev.tabDtls?.id;
  }
  /** End */

  /*** Get Transaction Type from backend */
  getTransactionType(){
    this.dbIntr.api_call(0,'/transctiontype','product_id=1').pipe(pluck("data")).subscribe((res: any) =>{
      this.trnsType = res.map(({id,product_id,trns_type}) =>
        ({id,tab_name:trns_type,product_id,img_src:''}));
    })
  }
  /** End */

  /** Function for get transaction against transaction type */
  getTransactionAgainstParticularTransactionType(product_id,trans_type_id){
    this.dbIntr
      .api_call(
        0,
        '/transction',
        'product_id=' +
         product_id +
          '&trans_type_id=' +
          trans_type_id
      )
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.trnsMst = res.map(({id,trns_name}) => ({
          id,
          tab_name:trns_name,
          img_src:id == 1 ? '../../../../../assets/images/pip.png'
          : (id == 2 ? '../../../../../assets/images/sip.png'
          : '../../../../../assets/images/switch.png')}));
      });
  }
  /*** End */

  /****event occur whenever the sub tab has been changed */
  SubTabDetails(ev){
    console.log(ev);
     this.headerTitle =ev.tabDtls?.tab_name;
    this.transaction = ev.tabDtls ? ev.tabDtls?.id : '';
    console.log(this.transaction);

  }
  /*** End */
  getMstDt(ev){
    const seen = new Set();
    const kyc = KycMst.concat(withoutKycMst).filter(el => {
      const duplicate = seen.has(el.id);
      seen.add(el.id);
      return !duplicate;
    })
    
    this.dbIntr.api_call(1,'/mfTraxDetailSearch',ev).pipe(pluck("data")).subscribe((res: any) =>{
      this.MstDt = {
        ...res,
        data:res.data.filter(el =>{
          if(el?.ack_status != 'R'){
            const newNominee = JSON.parse(el?.new_nominee);
            const mergeFolio = el.merge_folio ? JSON.parse(el.merge_folio) : [];
            el.source_folio = mergeFolio && mergeFolio.length > 0 ? mergeFolio.join(", ") : ''
            el.new_nominee_name = newNominee && newNominee.length > 0 ? newNominee[0]?.nominee_name : '';
            el.percentage = newNominee && newNominee.length > 0 ? newNominee[0]?.percentage : '';
            const first_kyc = kyc.filter(ele => ele.id == el.first_kyc);
            el.first_kyc = first_kyc.length > 0 ? first_kyc[0]?.value : '';
            const second_kyc = kyc.filter(ele => ele.id == el.second_kyc);
            el.second_kyc = second_kyc.length > 0 ? second_kyc[0]?.value : '';
            const third_kyc = kyc.filter(ele => ele.id == el.third_kyc);
            el.third_kyc = third_kyc.length > 0 ? third_kyc[0]?.value : '';
            el.manual_trans_status = el.manual_trans_status ? (el.manual_trans_status == 'P' ? 'Process' : el.manual_trans_status == 'R' ? "Rejected" : 'Pending') : '';
            return el;
          }
          return false;
         
      })
       }
      //  console.log(this.MstDt)
    })
  }

  /** For Document View  */
   DocumentView(element){
    console.log(element)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.width = '80%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      title: 'Uploaded Scan Copy',
      data: element,
      copy_url:`${(this.trnsTypeId == 2 ?  environment.kyc_formUrl : environment.app_formUrl) + (this.trnsTypeId == 2 ? element?.scaned_form : element.app_form_scan)}`,
      src:this.sanitizer.bypassSecurityTrustResourceUrl(`${(this.trnsTypeId == 2 ?  environment.kyc_formUrl : environment.app_formUrl) +(this.trnsTypeId == 2 ? element?.scaned_form : element.app_form_scan)}`)
    };
    const dialogref = this.__dialog.open(PreviewDocumentComponent, dialogConfig);
   }
  /*** End */
  viewAckDocument(element){
      console.log(element);
      const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.width = '80%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      title: 'Uploaded Acknowledgement Copy',
      data: element,
      copy_url:`${environment.ack_formUrl + element.ack_copy_scan}`,
      src:this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.ack_formUrl + element.ack_copy_scan}`)
    };
    const dialogref = this.__dialog.open(PreviewDocumentComponent, dialogConfig);
  }
  ngOnDestroy(){
    let controller = new AbortController();
    controller.abort();
  }

}
