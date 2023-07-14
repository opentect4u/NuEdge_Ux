import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { pluck } from 'rxjs/operators';
import { rnt } from 'src/app/__Model/Rnt';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import fileMenu from '../../../../../assets/json/file.json';
import fileTypeMenu from '../../../../../assets/json/fileType.json';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-manual-upload',
  templateUrl: './manual-upload.component.html',
  styleUrls: ['./manual-upload.component.css']
})
export class ManualUploadComponent implements OnInit {

  manualUpldFrm = new FormGroup({
      file_type_id: new FormControl('',[Validators.required]),
      file_id:new FormControl('',[Validators.required]),
      upload_file: new FormControl('',[Validators.required]),
      rnt_id: new FormControl('',[Validators.required]),
      file:new FormControl('')
  })
  constructor(private dbIntr:DbIntrService,private utility:UtiliService) { }

  TabMenu:any=[];

  /**
   * Holding file dropdown value comming from json file (/assets/json/file.json)
   */
  fileMst:{id:number,name:string,parent_id:number}[];

  /**
   * Holding file type dropdown value comming from json file (/assets/json/fileType.json)
   */
  fileTypeMst:{id:number,name:string}[] = fileTypeMenu;

  tabindex:number =0;

  ngOnInit(): void {
    this.getrntMst();
  }
  /**
   * Getting R&T details from backend API and sent this to the tab section
   */
  getrntMst = () =>{
      this.dbIntr.api_call(0,'/rnt',null).pipe(pluck("data")).subscribe((res:rnt[]) =>{
        this.TabMenu = res.sort((a, b) => a.id - b.id).filter(item =>( item.id==2 || item.id == 1))
        .map(({id, rnt_name}) => ({tab_name:rnt_name,img_src:'',id}))

        console.log(this.TabMenu);


      })
  }

  /**
   * Event fired after tab change and set the selected tab id inside the form
   */
  onTabChange = (ev) =>{
    console.log(ev);

    this.manualUpldFrm.get('rnt_id').setValue(ev.tabDtls.id);
    this.fileMst =fileMenu.filter(item => item.parent_id == ev.tabDtls.id);

  }

  /**
   * set event.target.files insideanother fortmcontrol after browse
   */
  getFile(ev){
    this.manualUpldFrm.get('upload_file').setValue(ev.target.files[0]);
  }
   /**
   * Submit data on server
   */
  uploadFile(){
    this.dbIntr.api_call(1,'/mailbackProcess',
    this.utility.convertFormData(this.manualUpldFrm.value)
    ).subscribe(res =>{
      console.log(res);
    })

  }
}
