import { Component, Input, OnInit,} from '@angular/core';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

@Component({
  selector: 'app-document-locker',
  templateUrl: './document-locker.component.html',
  styleUrls: ['./document-locker.component.css']
})
export class DocumentLockerComponent implements OnInit {
  TabMenu;
  comp_id: number;
  tabindex:number =0;
  public documentDtls;
  @Input() set companyDtls(value){
    console.log(value);
    this.TabMenu = value.map(({id,name,establishment_name,type_of_comp}) => ({id,tab_name:type_of_comp == 4 ? establishment_name : name,img_src:''}))
  };
  // @Input() docDtls: any = [];
   docDtls: any = [];
  constructor(private dbIntr: DbIntrService){}
  ngOnInit(): void {
    this.onTabChange({index:0,tabDtls:this.TabMenu[0]});
  }
  onTabChange(ev){
    this.comp_id = ev.tabDtls.id;
    this.getDocument( ev.tabDtls.id);
  }
  getDocument(cm_profile_id){
   this.dbIntr
      .api_call(0, '/comp/documentLocker', 'cm_profile_id='+cm_profile_id)
      .pipe(pluck('data'))
      .subscribe((res) => {
        console.log(res);
        this.docDtls = res;
      });

  }
  getRowData(rowData){
    this.comp_id = rowData.cm_profile_id;
    this.documentDtls = rowData;
  }

  documentModification(ev){
    ev.forEach(res =>{
          if(this.docDtls.findIndex((x) => x.id == res.id) != -1){
                  this.docDtls = this.docDtls.filter(x =>{
                      if(x.id == res.id){
                        x.cm_profile_id = res.cm_profile_id;
                        x.doc_name = res.doc_name;
                        x.id = res.id;
                        x.doc_no = res.doc_no;
                        x.cm_profile_id = res.cm_profile_id;
                        x.cm_profile_id = res.cm_profile_id;
                        x.upload_file = res.upload_file;
                        x.valid_from = res.valid_from;
                        x.valid_to = res.valid_to;
                      }
                      return true;
                  })
          }
          else{
            this.docDtls.push(res);
          }
        })
  }
}
