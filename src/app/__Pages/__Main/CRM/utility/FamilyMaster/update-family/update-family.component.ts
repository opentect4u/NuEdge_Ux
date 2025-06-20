import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { client } from 'src/app/__Model/__clientMst';
import { FamilyClientColumn } from '../createFamily/create-family.component';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import relationship from '../../../../../../../assets/json/Master/relationShip.json'
import { Table } from 'primeng/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';

@Component({
  selector: 'app-update-family',
  templateUrl: './update-family.component.html',
  styleUrls: ['./update-family.component.css']
})
export class UpdateFamilyComponent implements OnInit {

  relation = relationship

  toggle_family_members:boolean  = false;

  @ViewChild('primeTbl') primeTbl :Table;


  constructor(private dbIntr:DbIntrService,private utility:UtiliService,
    private __dialog: MatDialog) { }

 /** Showing Loader */
 __is__spinner_family_head:boolean = false;
 __is__spinner_family_member:boolean = false;
 /**** End */

 /**** Family Head list*/
 family_head_mst:client[] =[]
 /**** End */

 getFamilyMemberMstDT:client[] = [];

 newMembersList:client[] = [];

 selectedFamily_member:client[]= []


 displayMode_forClient:string;
 displayMode_forMember:string;

 family_tbl_column:column[] = FamilyClientColumn.column.filter(item => item.isVisible.includes('M'))
  selected_family_member_column:column[] = FamilyClientColumn.family_member_clm;


 family_head_search = new FormGroup({
   family_head_name: new FormControl(''),
   family_head_pan: new FormControl(''),
   family_head_id: new FormControl(''),
   family_member_name: new FormControl(''),
   family_member_id: new FormControl(''),
   family_member_pan: new FormControl(''),
 })

 ngOnInit(): void {}

 ngAfterViewInit(){

  // Family Head  Search
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
             const arr = [item.add_line_1,item.add_line_2,
              item.add_line_3,
              item.city,item.state,item.dist,item.pincode]
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
  //  End

  /***** Family Member Search */
  this.family_head_search.get('family_member_name').valueChanges.pipe(
    tap(() => (
      this.__is__spinner_family_member =  this.family_head_search.get('family_member_name').value ? true : false,
      this.family_head_search.get('family_member_pan').setValue(''),
      this.family_head_search.get('family_member_id').setValue(''),
      this.newMembersList = []
      )),
    debounceTime(200),
    distinctUntilChanged(),
    switchMap((dt) =>
      dt?.length > 1 ? this.dbIntr.searchItems('/searchClientWithoutFamily', dt) : []
    ),
    map(
      (x: any) => x.data.filter((item:client) => item.family_count == 0)
    )
  )
  .subscribe({
    next: (value) => {
      const dt = value.map((item:client) =>{
            const arr = [item.add_line_1,item.add_line_2,
              item.add_line_3,
              item.city,item.state,item.dist,item.pincode]
            item.client_addr = arr.toString();
            return item;
      })
      this.family_head_search.patchValue({family_member_pan:'',family_member_id:''})
      this.newMembersList = dt;
      this.__is__spinner_family_member = false;
      this.searchResultVisibilityFornewMember('block');
    },
    complete: () => console.log(''),
    error: (err) => {this.__is__spinner_family_member = false},
  });
  /**** End */

 }

 /**
  *   * This function is used to get the selected item from the parent component
  * It resets the family_head_name form control with the selected item's client_name
  * It resets the family_head_pan and family_head_id form controls with the selected item's pan and client_id respectively
  * It hides the search result for client by calling searchResultVisibilityForClient with 'none'
  * @param searchRlt 
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
  * @param searchRlt - This function is used to get the selected item from the parent component
  * It resets the family_member_name form control with the selected item's client_name
  * It resets the family_member_pan and family_member_id form controls with the selected item's pan and client_id respectively
  * It hides the search result for new member by calling searchResultVisibilityFornewMember with 'none'
  */
 getSelectedMembersFromParent = (searchRlt: {
    flag: string;
    item: any;
  }) =>{
    this.family_head_search.get('family_member_name').reset(searchRlt.item.client_name, { emitEvent: false });
    this.family_head_search.get('family_member_pan').reset(searchRlt.item.pan);
    this.family_head_search.get('family_member_id').reset(searchRlt.item.client_id);
    this.searchResultVisibilityFornewMember('none');
 }

 /**
  * @description This function is used to search family members based on the family head's ID or PAN.
  * If either family_head_id or family_head_pan is provided, it calls the getFamilymemberAccordingToFamilyHead_Id function
  * to fetch the family members associated with the specified family head.
  * If neither is provided, it shows a snackbar message prompting the user to select a family head.
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
 * @description This function is used to search for new family members based on the family member's name, ID, or PAN. 
 */
searchnewFamilyMembers = () =>{
  console.log(this.family_head_search.value)
}

/**
 *  * @description This function is used to filter the global data in the PrimeNG table.
 * It retrieves the value from the target input field and passes it to the filterGlobal method of the PrimeNG table with 'contains' as the filter match mode.
 * This allows for global filtering of the table data based on the input value.
 * @param $event 
 */
filterGlobal = ($event) => {
  let value = $event.target.value;
  this.primeTbl.filterGlobal(value,'contains')
}

// deleteMembers = (members:client) =>{
//     console.log(members);
// }
/**
 * 
 * @returns {column[]} - An array of column objects for the family member table
 * @description This function retrieves the columns for filtering from the utility service.
 * It uses the `getColumns` method of the utility service to get the columns defined in `this.family_tbl_column`.
 * The columns are expected to be in a specific format that includes field names, headers, and visibility flags.
 */
getColumns = () =>{
  return this.utility.getColumns(this.family_tbl_column);
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
 * * @description This function is used to set the visibility of the search result for client
 * It takes a display mode as a parameter and sets the displayMode_forClient property to that value
 */
 searchResultVisibilityForClient = (display_mode: string) => {
   this.displayMode_forClient = display_mode;
 };

 /**
  * @description This function is used to set the visibility of the search result for new members
  * It takes a display mode as a parameter and sets the displayMode_forMember property to that value
  * @param display_mode - The display mode to set for the search result visibility
  * @returns void
  */
 searchResultVisibilityFornewMember = (display_mode: string) => {
  this.displayMode_forMember = display_mode;
};
/**
 * * @description This function is used to add a new family member to the selectedFamily_member array
 * It checks if the family member already exists in the array based on the client_id.
 */
deleteMembers = (members:client,index:number) =>{
            this.selectedFamily_member = this.selectedFamily_member.filter((item:client) => item.id != members.id)
}
/**
 * * @description This function is used to delete an existing family member from the getFamilyMemberMstDT array
 * It checks if there are more than two members in the array before allowing deletion.
 * If there are two or fewer members, it shows a snackbar message indicating that deletion is not allowed.
 */
deleteExistingMembers = (members:client,index:number) =>{
       if(this.getFamilyMemberMstDT.length > 2){
        const dialogConfig = new MatDialogConfig();
              dialogConfig.autoFocus = false;
              dialogConfig.role = "alertdialog";
              dialogConfig.data = {
                flag: 'A',
                id: members.id,
                title: 'Delete Family Member',
                api_name:'/familyDelete'
              };
              const dialogref = this.__dialog.open(
                DeletemstComponent,
                dialogConfig
              );
              dialogref.afterClosed().subscribe((dt) => {
                if(dt){
                  if(dt.suc == 1){
                      // this.family_head_search.reset();
                      // this.getFamilyMemberMstDT = [];
                      this.getFamilyMemberMstDT =   this.getFamilyMemberMstDT.filter((item:client)=> item.id != members.id)
                  }
                  this.utility.showSnackbar(dt.suc == 1 ? `Member deleted successfully` : dt.msg,dt.suc);
                }

              })
       }
       else{
        this.utility.showSnackbar(`Can't delete!! Must be two members in family`,2);
       }
}
/**
 * * @description This function is used to update the family members
 * It checks if there are any existing family members and if new family members are selected.
 */
UpdateFamily =() =>{
  if(this.getFamilyMemberMstDT.length == 0){
    this.utility.showSnackbar(`Please search & select family head`,2)
  }
  else if(this.selectedFamily_member.length === 0){
    this.utility.showSnackbar(`Please search & select new family members`,2)
  }
  else{
    try{
      const dt = {
        existing_members:JSON.stringify(this.getFamilyMemberMstDT),
        new_members:this.toggle_family_members ? JSON.stringify(this.selectedFamily_member) : '[]',
        family_head_id:this.getFamilyMemberMstDT.filter((item) => item.relationship == 'Head')[0]?.family_id
      }
      this.dbIntr.api_call(1,'/updateFamilymembers',this.utility.convertFormData(dt))
      .subscribe((res: any) => {
            if(res?.suc == 1){
                this.getFamilyMemberMstDT = [];
                this.selectedFamily_member = [];
                this.newMembersList = [];
                this.family_head_search.reset();
                this.toggle_family_members = false;
            }
            this.utility.showSnackbar(res.suc == 1 ? 'Family Updated Successfully' : res.msg,res.suc)
      })
    }
    catch(err){
        console.log(err);
        this.utility.showSnackbar('Something went wrong',2)
    }


  }

}


}
