import { Component, OnInit } from '@angular/core';
// import menu from '../../../../../../assets/json/filehelp.json';
import { UtiliService } from 'src/app/__Services/utils.service';
import fileHelp from '../../../../../../assets/json/MailBack/file_help.json';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { pluck } from 'rxjs/operators';
import { rnt } from 'src/app/__Model/Rnt';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, IFileHelpHome {


  file_help: IFileHelpTab[] = fileHelp;
  rnt_mst_dt:rnt[] = [];
  rntTrxnType = new FormGroup({
    rnt_id: new FormControl(''),
    id: new FormControl('0'),
    trans_type: new FormControl('', [Validators.required]),
    trans_sub_type: new FormControl('', [Validators.required]),
    c_trans_type_code: new FormControl(''),
    c_k_trans_type: new FormControl(''),
    c_k_trans_sub_type: new FormControl(''),
    k_divident_flag: new FormControl(''),
  });

  constructor(private utility: UtiliService,private dbIntr:DbIntrService) {}

  ngOnInit(): void {
    console.log(this.file_help);
    this.getRnt();
  }

  changeTabDtls(ev): void {
    console.log(ev);
  }

  submitTransactionType(): void {console.log(this.rntTrxnType.value)}

  reset(): void {}

  getRnt():void {
      this.dbIntr.api_call(0,'/rnt',null)
      .pipe(pluck('data'))
      .subscribe((res: rnt[]) =>{
      //  this.rnt_mst_dt = res.map()
      })
  }
}

export interface IFileHelpHome {
  /**
   * Holding parent Tab Data
   */
  file_help: IFileHelpTab[];

  /**
   * Holding R&T Master Data Comming from backend
   */
  rnt_mst_dt:rnt[];

  /**
   * Event Fired after tab changing
   * @params ev
   */
  changeTabDtls(ev): void;

  /**
   * Event Fired after submitting form and either add or update file
   * @params ev
   */
  submitTransactionType(): void;

  /**
   * Resetting form
   */
  reset(): void;

  /**
   *  get R&T master data from backend
   */
  getRnt():void;
}

export interface IFileHelpTab {
  id: number;
  tab_name: string;
  flag: string;
  sub_menu: ISubmenu[];
}

export interface ISubmenu {
  id: number;
  tab_name: string;
  flag: string;
}
