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
  /** * * This function is used to handle the tab change event.
 * * It updates the comp_id with the selected tab's id and retrieves the document details for that company profile.
 * * @param {any} ev - The event containing the tab change information.
 * * * @returns {void}
 * */
  onTabChange(ev){
    this.comp_id = ev.tabDtls.id;
    this.getDocument( ev.tabDtls.id);
  }
  /** * This function is used to retrieve the document details for a specific company profile.
 * * It makes an API call to fetch the document details based on the provided company profile ID.
 * * @param {number} cm_profile_id - The ID of the company profile for which the document details are to be retrieved.
 * * @returns {void}
 */
  getDocument(cm_profile_id){
   this.dbIntr
      .api_call(0, '/comp/documentLocker', 'cm_profile_id='+cm_profile_id)
      .pipe(pluck('data'))
      .subscribe((res) => {
        console.log(res);
        this.docDtls = res;
      });

  }
  /** * This function is used to retrieve the row data for a specific company profile.
 * * It updates the comp_id and documentDtls properties with the provided row data.
 * * @param {any} rowData - The row data containing the company profile information.
 * * @returns {void}
 */
  getRowData(rowData){
    this.comp_id = rowData.cm_profile_id;
    this.documentDtls = rowData;
  }

  /** * This function is used to handle the document modification event.
 * * It updates the document details based on the provided event data.
 * * If the document already exists, it updates the existing entry; otherwise, it adds a new entry.
 * * @param {any} ev - The event containing the modified document details.
 * * @returns {void}
 */
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
