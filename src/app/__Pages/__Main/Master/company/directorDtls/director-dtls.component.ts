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
  onTabChange(ev){
     this.tabindex =ev.index;
  }
  getTabIndexdata(ev){
    this.onTabChange(ev);
    this.getPerticularDtls = ev.data;
  }
  reset(){
    this.getPerticularDtls = '';
  }
  sendModifiedDirectorToParent(ev){
    this.getDirectorDtls.emit(ev);
  }
}
