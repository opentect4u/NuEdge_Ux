import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { client } from 'src/app/__Model/__clientMst';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { FamilyClientColumn } from '../createFamily/create-family.component';
import { column } from 'src/app/__Model/tblClmns';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-delete-family',
  templateUrl: './delete-family.component.html',
  styleUrls: ['./delete-family.component.css']
})
export class DeleteFamilyComponent implements OnInit {

  @ViewChild('primeTbl') primeTbl :Table;

  constructor(private dbIntr:DbIntrService,private utility:UtiliService,
    private __dialog: MatDialog,
    private overlay: Overlay,
    ) { }

  /** Showing Loader */
  __is__spinner_family_head:boolean = true;
  /**** End */

  /**** Family Head list*/
  family_head_mst:client[] =[]
  /**** End */

  getFamilyMemberMstDT:client[] = [];

  displayMode_forClient:string;

  family_tbl_column:column[] = FamilyClientColumn.column.filter(item => item.isVisible.includes('M'))


  family_head_search = new FormGroup({
    family_head_name: new FormControl(''),
    family_head_pan: new FormControl(''),
    family_head_id: new FormControl('')
  })

  ngOnInit(): void {}

  ngAfterViewInit(){
    this.family_head_search.get('family_head_name').valueChanges.pipe(
      tap(() => (
        this.__is__spinner_family_head =  this.family_head_search.get('family_head_name').value ? true : false,
        this.family_head_search.get('family_head_pan').setValue(''),
        this.family_head_search.get('family_head_id').setValue(''),

        this.family_head_mst = []
        )),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((dt) =>
        dt?.length > 1 ? this.dbIntr.searchItems('/searchWithClient', dt) : []
      ),
      map(
        (x: any) => x.data
      )
    )
    .subscribe({
      next: (value) => {
        const dt = value.map((item:client) =>{
              const arr = [item.add_line_1,item.add_line_2,item.add_line_3,item.city_name,item.state_name,item.district_name,item.pincode]
              item.client_addr = arr.filter(item => {return item}).toString();
              return item;
        })
        this.family_head_search.patchValue({family_head_pan:'',family_head_id:''})
        this.family_head_mst = dt;
        this.__is__spinner_family_head = false;
        this.searchResultVisibilityForClient('block');
      },
      complete: () => console.log(''),
      error: (err) => {this.__is__spinner_family_head = false},
    });
  }

  /**
   * @description This function is used to get the selected item from the parent component
   * It resets the form controls of family_head_search with the selected item's values
   * and hides the search result for client by setting display mode to 'none'
   * @param searchRlt - An object containing the flag and item selected from the parent component
   * @returns void
   */
  getSelectedItemsFromParent = (searchRlt: {
    flag: string;
    item: any;
  }) => {
      this.family_head_search.get('family_head_name').reset(searchRlt.item.client_name, { emitEvent: false });
      this.family_head_search.get('family_head_pan').reset(searchRlt.item.pan);
      this.family_head_search.get('family_head_id').reset(searchRlt.item.client_id);
      this.searchResultVisibilityForClient('none');
  }


  /**
   *
   *  get Family Member with client Id
  **/
    getFamilymemberAccordingToFamilyHead_Id = (id:number | undefined = undefined) =>{
      if(id){
        this.dbIntr.api_call(0,'/clientFamilyDetail',`family_head_id=${id}&view_type=F`)
        .pipe(pluck('data'))
        .subscribe((res:client[]) =>{
          console.log(res);
         this.getFamilyMemberMstDT = res.map((item:client) =>{
          const arr = [item.add_line_1,item.add_line_2,item.add_line_3,item.city_name,item.state_name,item.district_name,item.pincode]
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
 * @description This function is used to set the visibility of the search result for client
 * It takes a display mode as a parameter and sets the displayMode_forClient property to that value
 * @param display_mode - The display mode to set for the search result visibility
 * @returns void
 */
  searchResultVisibilityForClient = (display_mode: string) => {
    // console.log(display_mode);
    this.displayMode_forClient = display_mode;
  };

  /**
   * @description This function is used to filter the global data in the PrimeNG table
   * It takes the event object as a parameter and retrieves the value from the target input field
   * The value is then passed to the filterGlobal method of the PrimeNG table with 'contains' as the filter match mode
   * @param $event - The event object containing the target input field value
   * @returns void
   */
  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
  }

  /**
   * @description This function retrieves the columns for filtering from the utility service
   * It uses the `getColumns` method of the utility service to get the columns defined in `this.family_tbl_column`.
   * The columns are expected to be in a specific format that includes field names, headers, and visibility flags.
   * @returns {column[]} - An array of column objects for filtering
   */
  getColumns = () =>{
    return this.utility.getColumns(this.family_tbl_column);
  }

  /**
   * @description This function is used to search for family members based on the family head ID or PAN
   * It checks if either the family head ID or PAN is provided in the form controls
   * If valid, it calls the `getFamilymemberAccordingToFamilyHead_Id` function to fetch family members
   * Otherwise, it shows a snackbar message prompting the user to select a family head
   * @returns void
   */
  searchFamilyMembers = () =>{
    if(this.family_head_search.value.family_head_id || this.family_head_search.value.family_head_pan){
      this.getFamilymemberAccordingToFamilyHead_Id(this.family_head_search.value.family_head_id);
    }
    else{
      this.utility.showSnackbar(`Please Select Family Head`,2);
    }
  }

  /**
   * @description This function is used to delete a family member
   * It opens a confirmation dialog using the MatDialog service
   * The dialog is configured with the necessary data such as flag, ID, title, and API name
   * After the dialog is closed, it checks if the deletion was successful and resets the family head search form
   * @returns void
   */
  deleteFamily = () =>{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.role = "alertdialog";
    dialogConfig.data = {
      flag: 'F',
      id: this.family_head_search.get('family_head_id').value,
      title: 'Delete Family',
      api_name:'/familyDelete'
    };
    const dialogref = this.__dialog.open(
      DeletemstComponent,
      dialogConfig
    );
    dialogref.afterClosed().subscribe((dt) => {
      if(dt){
        if(dt.suc == 1){
            this.family_head_search.reset();
            this.getFamilyMemberMstDT = [];
        }
      }

    })
  }

}
