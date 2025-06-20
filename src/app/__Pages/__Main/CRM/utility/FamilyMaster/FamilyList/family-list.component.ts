import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { map, pluck, tap } from 'rxjs/operators';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-family-list',
  templateUrl: './family-list.component.html',
  styleUrls: ['./family-list.component.css'],
})
export class FamilyListComponent implements OnInit {
  @ViewChild('pTable') pTable: Table;

  constructor(private __dbIntr: DbIntrService, private utility: UtiliService) {}

  parent_column: column[] = FamilyListClm.column;

  sub_column: column[] = FamilyListClm.sub_column;

  dataSource: IFamilyList[] = [];

  ngOnInit(): void {
    this.getFamilyList();
  }

  /**
   * @description This function is used to fetch the family list from the server.
   * It makes an API call to '/clientFamilyDetailSearch' and processes the response data.
   * The response data is then transformed to format the address fields and set the dataSource.
   * It uses RxJS operators like pluck, tap, and subscribe to handle the asynchronous data flow.
   */
  getFamilyList = () => {
    this.__dbIntr
      .api_call(0, '/clientFamilyDetailSearch', null)
      .pipe(
        pluck('data'),
        tap((item: IFamilyList[]) => {
          return item.map((item: IFamilyList) => {
            const arr = [
              item.add_line_1,
              item.add_line_2,
              item.add_line_3,
              item.city_name,
              item.state_name,
              item.district_name,
              item.pincode,
            ];
            item.add_line_1 = arr.filter(item => {return item}).toString();
            return item;
          });
        })
      )
      .subscribe((res: IFamilyList[]) => {
        this.dataSource = res.map((item: IFamilyList) => ({
          ...item,
          family_member: [],
        }));
      });
  };

  /**
   * 
   * @param ev - The event object containing the original event and the data of the family list item
   * @description This function is triggered when a row in the family list is expanded.
   * It fetches the family members of the selected family head and updates the dataSource accordingly.
   * It uses RxJS operators to handle the API call and update the family_member array of the corresponding family head.
   */
  onRowExpand = (
    ev: Required<{ originalEvent: PointerEvent; data: IFamilyList }>
  ) => {
    // console.log(ev);
    try {
    const index = this.dataSource.map((item) => item.id).indexOf(ev.data.id);
    this.dataSource[index].family_member.length = 0;
    this.__dbIntr
      .api_call(0, '/clientFamilyDetail', 'family_head_id=' + ev.data.client_id)
      .pipe(
        pluck('data'),
        tap((items: IFamilyList[]) => {
          return items.map((item: IFamilyList) => {
            const arr = [
              item.add_line_1,
              item.add_line_2,
              item.add_line_3,
              item.city_name,
              item.state_name,
              item.district_name,
              item.pincode,
            ];
            item.add_line_1 = arr.filter(item => {return item}).toString();
            return item;
          });
        })
      )
      .subscribe((res: IFamilyList[]) => {
          this.dataSource[index].family_member = res;
      });
    } catch (ex) {
      console.log(ex);
    }
  };
  /**
   * 
   * @param $event - The event object containing the target input field value
   * @description This function is used to filter the global data in the PrimeNG table.
   * It retrieves the value from the target input field and passes it to the filterGlobal method of the PrimeNG table with 'contains' as the filter match mode.
   * This allows for global filtering of the table data based on the input value.
   */
  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.pTable.filterGlobal(value, 'contains');
  };
  /**
   *  * @description This function retrieves the columns for the family list table.
   * It uses the utility service to get the columns defined in the FamilyListClm class.
   * The columns are expected to be in a specific format that includes field names, headers, and visibility flags.
   * @returns {column[]} - An array of column objects for the family list table
   */
  getColumns = () => {
    return this.utility.getColumns(this.parent_column);
  };
}
export interface IFamilyList {
  id: number;
  client_id: number;
  family_id: number;
  relationship: string;
  client_name: string;
  client_code: string;
  pan: string;
  mobile: number;
  email: string;
  add_line_1: string;
  add_line_2: string;
  add_line_3: string;
  city_name: string;
  district_name: string;
  state_name: string;
  type_name: string;
  pincode: number;
  family_member: IFamilyList[];
}

export class FamilyListClm {
  public static column: column[] = [
    {
      field: 'sl_no',
      header: 'Sl No.',
      width: '5rem',
    },
    {
      field: 'client_name',
      header: 'Family Head',
      width: '18rem',
    },
    {
      field: 'client_code',
      header: 'Code',
      width: '7rem',
    },
    {
      field: 'pan',
      header: 'PAN',
      width: '7rem',
    },
    {
      field: 'mobile',
      header: 'Mobile',
      width: '7rem',
    },
    {
      field: 'email',
      header: 'Email',
      width: '15rem',
    },
    {
      field: 'add_line_1',
      header: 'Address',
      width: '23rem',
    },
    {
      field: 'login_status',
      header: 'Login Status',
      width: '10rem',
    },
  ];

  public static sub_column: column[] = [
    {
      field: 'sl_no',
      header: 'Sl No.',
      width: '5rem',
    },
    {
      field: 'client_name',
      header: 'Family Member',
      width: '18rem',
    },
    {
      field: 'client_code',
      header: 'Member Code',
      width: '7rem',
    },
    {
      field: 'pan',
      header: 'PAN',
      width: '7rem',
    },
    {
      field: 'mobile',
      header: 'Mobile',
      width: '7rem',
    },
    {
      field: 'email',
      header: 'Email',
      width: '15rem',
    },
    {
      field: 'add_line_1',
      header: 'Address',
      width: '23rem',
    },
    {
      field: 'login_status',
      header: 'Login Status',
      width: '10rem',
    },
  ];
}
