import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Table } from 'primeng/table';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { client } from 'src/app/__Model/__clientMst';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-member-srch',
  templateUrl: './member-srch.component.html',
  styleUrls: ['./member-srch.component.css']
})
export class MemberSrchComponent implements OnInit {

  @ViewChild('pTable') pTable: Table;

  membersearchFrm = new FormGroup({
    member_name: new FormControl('')
  })

  __is__spinner_member:boolean = false;

  member_mst:client[] = [];

  members_clmn:column[] = MemberColumn.membersClmn;

  getFamilyMemberMstDT:client[] = [];

  displayMode_forMembers:string;

  constructor(private dbIntr:DbIntrService,private utility:UtiliService) { }

  ngOnInit(): void {}

  ngAfterViewInit(){
    this.membersearchFrm.get('member_name').valueChanges.pipe(
      tap(() => (
        this.__is__spinner_member =  this.membersearchFrm.get('member_name').value ? true : false,
        this.member_mst = []
        )),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((dt) =>
        dt?.length > 1 ? this.dbIntr.searchItems('/searchWithClient', `${dt}&view_type=C`) : []
      ),
      map(
        (x: any) => x.data
      )
    )
    .subscribe({
      next: (value) => {
        // const dt = value.map((item:client) =>{
        //       const arr = [item.add_line_1,item.add_line_2,item.city_name,item.state_name,item.district_name,item.pincode]
        //       item.client_addr = arr.filter(item => {return item}).toString();
        //       return item;
        // })
        this.member_mst = value;
        this.__is__spinner_member = false;
        this.searchResultVisibilityForClient('block');
      },
      complete: () => console.log(''),
      error: (err) => {this.__is__spinner_member = false},
    });
  }

  /**
   * @description This function is a placeholder for searching family members.
   * It currently does not perform any action.
   * 
   * @returns {void}
   */
  searchFamilyMembers = () =>{}

  /**
   * @description This function is used to set the visibility of the search results for clients.
   * It updates the `displayMode_forMembers` property with the provided display mode.
   */
  searchResultVisibilityForClient = (display_mode:string) =>{
      this.displayMode_forMembers = display_mode;
  }

  /**
   * @description This function is used to get the selected item from the parent component.
   * It resets the `member_name` form control with the selected item's client name,
   * hides the search result for client by calling `searchResultVisibilityForClient` with 'none',
   */
  getSelectedItemsFromParent = (searchRlt: {
    flag: string;
    item: any;
  }) =>{
    console.log(searchRlt)
    this.membersearchFrm.get('member_name').reset(searchRlt.item.client_name, { emitEvent: false });
    this.searchResultVisibilityForClient('none');
    this.getFamilymemberAccordingToFamilyHead_Id(searchRlt.item.id);
  }

    /**
   *
   *  get Family Member with client Id
  **/
    getFamilymemberAccordingToFamilyHead_Id = (id:number | undefined = undefined) =>{
      if(id){
        this.dbIntr.api_call(0,'/searchWithClientMem',`id=${id}`)
        .pipe(pluck('data'))
        .subscribe((res:client[]) =>{
          console.log(res);
         this.getFamilyMemberMstDT = res.map((item:client) =>{
          const arr = [item.add_line_1,item.add_line_2,
            item.add_line_3,
            item.city_name,item.state_name,item.district_name,item.pincode]
          item.client_addr = arr.filter(item => {return item}).toString();
          return item;
    });
        })
     }
     else{
         this.getFamilyMemberMstDT = [];
     }
}
/**
 * @description This function is used to get the columns for the member table.
 * It uses the utility service to retrieve the columns defined in the MemberColumn class.
 * The columns are expected to be in a specific format that includes field names, headers, and visibility flags.
 * @returns {column[]} - An array of column objects for the member table
 */
getColumns = () =>{
  return this.utility.getColumns(this.members_clmn);
}
/**
 * @description This function is used to filter the global data in the PrimeNG table.
 * It takes the event object as a parameter and retrieves the value from the target input field.
 * The value is then passed to the filterGlobal method of the PrimeNG table with 'contains' as the filter match mode.
 */
filterGlobal = ($event) => {
  let value = $event.target.value;
  this.pTable.filterGlobal(value, 'contains');
};
}


export class MemberColumn{
  public static membersClmn:column[] = [
      {
        field:'sl_no',
        header:'Sl No.',
        width:'5rem'
      },
      {
        field:'client_name',
        header:'Members',
        width:'20rem'
      },{
        field:'relationship',
        header:'Member Position',
        width:'10rem'

      },{
        field:'pan',
        header:'PAN',
        width:'10rem'
      },{
        field:'email',
        header:'Email',
        width:'20rem'
      },{
        field:'mobile',
        header:'Mobile',
        width:'10rem'
      },{
        field:'client_addr',
        header:'Address',
        width:'25rem'
      }
  ]
}
