import { Component, EventEmitter, Input, Output} from '@angular/core';
import menu from '../../../../../../assets/json/Master/commonMenuMst.json';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent{
  tabindex: number =0;

  /** Holdeing sub tab menu content */
  TabMenu = menu.filter(x => x.flag!='U').map(({id, title, flag}) => ({tab_name:title,img_src:'',id,flag}))
  /**** End */
  @Input() country: any = []; /** Holding Country */
  @Input() comp_type: any= []; /** Holding type of company */
  @Input() cmpDtlsMst: any = []; /** Holding Company Master Data */
  @Output() getAddCompany = new EventEmitter<any>();
  public getPerticularCmp;

  /**** Event occur whn the sub tab menu has been changed */
  onTabChange(ev){
    this.tabindex = ev.index;
  }
  /** End */

  /*** get Active tab Index of sub tab*/
  getTabIndexdata(ev){
     this.tabindex = ev.index;
     this.getPerticularCmp = ev.data;
  }
  /** End */
  setComp(ev){
   this.getAddCompany.emit(ev);
  }
  reset(){
    this.getPerticularCmp = '';
  }
}
