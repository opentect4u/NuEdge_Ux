import { Component, OnInit, ViewChild } from '@angular/core';
import menu from '../../../../../assets/json/mailback.json';
import { UtiliService } from 'src/app/__Services/utils.service';
import { column } from 'src/app/__Model/tblClmns';
import { FormControl, FormGroup } from '@angular/forms';
import { dates } from 'src/app/__Utility/disabledt';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { Calendar } from 'primeng/calendar';
import { pluck } from 'rxjs/operators';
import { manualUpload } from 'src/app/__Model/MailBack/manualUpload';
@Component({
  selector: 'app-mailbackhome',
  templateUrl: './mailbackhome.component.html',
  styleUrls: ['./mailbackhome.component.css'],
})
export class MailbackhomeComponent implements OnInit {
  mailBackMenu = menu;

  column:column[] = MailBackUploadedColumn.column;

  mailbackuploaded_record:Partial<manualUpload>[] = [];

  merquee_mailbackUpload:Required<manualUpload>[] = [];


   /**
   *  getAccess of Prime Ng Calendar
   */
   @ViewChild('dateRng') date_range:Calendar;

    /**
   * For Holding Max Date And Min Date form Prime Ng Calendar
   */
    minDate: Date;
    maxDate:Date;

  mailbackuploaded_frm = new FormGroup({date_range:new FormControl([new Date(dates.calculateDT('W')),new Date(dates.getTodayDate())])})

  constructor(private utility: UtiliService,private dbIntr:DbIntrService) {}

  ngOnInit(): void {
    this.maxDate = dates.calculateDates('T');
  }


  getMissedMailback = () =>{
    this.dbIntr.api_call(0,'/mailbackProcessDetails',`flag=F`)
    .pipe(pluck('data'))
    .subscribe((res:Required<manualUpload>[]) =>{
      this.merquee_mailbackUpload = res;
    })
  }


  getMissedMailbackUpload = () =>{
    this.dbIntr.api_call(0,'/mailbackProcessDetails',`date=${this.date_range?.inputFieldValue}&flag=M`)
    .pipe(pluck('data'))
    .subscribe((res:manualUpload[]) =>{
        this.mailbackuploaded_record = res.map(el => {
              el.process_type =  el.process_type == 'A' ? 'Auto' : 'Manual';
              return el
         })
    })
  }

  ngAfterViewInit(){
    this.getMissedMailbackUpload();
    this.getMissedMailback();

    this.mailbackuploaded_frm.controls['date_range'].valueChanges.subscribe((res) => {
      if(res){
          const maximum_date = dates.calculatMaximumDates('R',6,new Date(res[0]));
          this.maxDate = maximum_date > new Date() ? maximum_date : new Date();

        }
        else{
          this.maxDate = dates.calculateDates('T');
        }
    })
  
  }

  getItems(items) {
    this.utility.navigate(items.url);
  }

  getColumns = () =>{
    return this.utility.getColumns(this.column);
  }

  searchMailbackuploaded =() =>{
      this.getMissedMailbackUpload();
  }
}

export class MailBackUploadedColumn{
  public static column:column[] = [
    {
      field:'rnt_name',
      header:'R&T',
      width:'3rem'
    },
    {
      field:'file_type_name',
      header:'File Type',
      width:'8rem'
    },
    {
      field:'file_name',
      header:'File Name',
      width:'10rem'
    },
    {
      field:'process_date',
      header:'Process Date'
    },
    {
      field:'process_type',
      header:'Uploaded Mode'
    },
    {
      field:'doc',
      header:'Doc'
    }
  ]
}

