import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import menu from '../../../../../../assets/json/Master/commonMenuMst.json';

@Component({
  selector: 'app-director-dtls',
  templateUrl: './director-dtls.component.html',
  styleUrls: ['./director-dtls.component.css']
})
export class DirectorDtlsComponent implements OnInit {
  tabindex: number =0;
  public getPerticularDtls;
  @Input() TabMenu: any = [];
  // TabMenu = menu.filter(x => x.flag!='U').map(({id, title, flag,img}) => ({tab_name:title,img_src:('../../../../../assets/images/'+img),id,flag}))
  ngOnInit(): void {
  }
  @Input() country: any = [];
  @Input() cmpDtlsMst : any = [];
  @Input() directorMst: any= [];
  @Output() getDirectorDtls = new EventEmitter<any>();

  /** * This function is used to handle the tab change event.
 * It updates the tabindex variable with the index of the selected tab.
 * @param {any} ev - The event containing the tab change information.
 *  * @returns {void}
 */
  constructor() { }
  onTabChange(ev){
     this.tabindex =ev.index;
  }
  /** * This function is used to handle the tab change event.
 * It updates the tabindex and retrieves the details of the selected director.
 * @param {any} ev - The event containing the tab change information.
 * @returns {void}
 */
  getTabIndexdata(ev){
    this.onTabChange(ev);
    this.getPerticularDtls = ev.data;
  }
  /** * This function is used to reset the director details.
 * It clears the getPerticularDtls variable.
 * @returns {void}
 */
  reset(){
    this.getPerticularDtls = '';
  }
  /** * This function is used to send the modified director details to the parent component.
 * It emits the event with the modified director details.
 * @param {any} ev - The modified director details to be sent to the parent component.
 * @returns {void}
 */
  sendModifiedDirectorToParent(ev){
    this.getDirectorDtls.emit(ev);
  }
}
