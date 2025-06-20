import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { pipe } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { client } from 'src/app/__Model/__clientMst';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-non-family-list',
  templateUrl: './non-family-list.component.html',
  styleUrls: ['./non-family-list.component.css'],
})
export class NonFamilyListComponent implements OnInit {

  constructor(private dbIntr: DbIntrService,private utility:UtiliService) {}

  @ViewChild('primeTbl') primeTbl :Table;

  /** Column holder */
  nonFamilyClmn: column[] = NonFamilyListClm.non_family_clm;
  /*** End */

  /*** Holding Non Family  */
  non_family_mst_dt: client[] = [];
  /**  End ****************/

  ngOnInit(): void {
    this.fetchNonFamilyMasterData();
  }

  /**
   * @description This function is used to fetch the non-family master data from the server.
   * It makes an API call to '/nonFamilylist' and processes the response data.
   * The response data is then assigned to the non_family_mst_dt property.
   * It uses RxJS operators like pluck and subscribe to handle the asynchronous data flow.
   */
  fetchNonFamilyMasterData = () => {
    this.dbIntr
      .api_call(0, '/nonFamilylist', null)
      .pipe(pluck('data'))
      .subscribe((res: client[]) => {
        this.non_family_mst_dt = res;
      });
  };

  /**
   * 
   * @returns This function returns the columns for the non-family list table.
   * It uses the utility service to get the columns defined in the nonFamilyClmn property.
   * The columns are used to display the non-family master data in a table format.
   */
  getColumns = () =>{
    return this.utility.getColumns(this.nonFamilyClmn);
  }

  /**
   * 
   * @param $event This function is used to filter the global search input in the non-family list table.
   * It takes an event object as a parameter, retrieves the value from the input field,
   * and applies the filter to the primeTbl component.
   * The filter is applied using the 'contains' match mode.
   */
  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
  }
}

export class NonFamilyListClm {
  public static non_family_clm: column[] = [
    {
      field: 'sl_no',
      header: 'Sl No',
      width:'5rem'
    },
    {
      field: 'client_name',
      header: 'Client',
      width:'28rem'
    },
    {
      field: 'mobile',
      header: 'Mobile',
      width:'12rem'
    },
    {
      field: 'pan',
      header: 'PAN',
      width:'12rem'
    },
    {
      field: 'email',
      header: 'Email',
      width:'20rem'
    },
    {
      field: 'login_status',
      header: 'Login Status',
      width:'10rem'
    },
  ];
}
