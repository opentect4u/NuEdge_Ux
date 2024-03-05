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
             const arr = [item.add_line_1,item.add_line_2,item.city,item.state,item.dist,item.pincode]
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
            const arr = [item.add_line_1,item.add_line_2,item.city,item.state,item.dist,item.pincode]
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

 getSelectedItemsFromParent = (searchRlt: {
   flag: string;
   item: any;
 }) => {
     this.family_head_search.get('family_head_name').reset(searchRlt.item.client_name, { emitEvent: false });
     this.family_head_search.get('family_head_pan').reset(searchRlt.item.pan);
     this.family_head_search.get('family_head_id').reset(searchRlt.item.client_id);
     this.searchResultVisibilityForClient('none');
 }

 getSelectedMembersFromParent = (searchRlt: {
    flag: string;
    item: any;
  }) =>{
    this.family_head_search.get('family_member_name').reset(searchRlt.item.client_name, { emitEvent: false });
    this.family_head_search.get('family_member_pan').reset(searchRlt.item.pan);
    this.family_head_search.get('family_member_id').reset(searchRlt.item.client_id);
    this.searchResultVisibilityFornewMember('none');
 }

 searchFamilyMembers = () =>{
  if(this.family_head_search.value.family_head_id || this.family_head_search.value.family_head_pan){
    this.getFamilymemberAccordingToFamilyHead_Id(this.family_head_search.value.family_head_id);
  }
  else{
    this.utility.showSnackbar(`Please Select Family Head`,2);
  }
}

searchnewFamilyMembers = () =>{
  console.log(this.family_head_search.value)
}


filterGlobal = ($event) => {
  let value = $event.target.value;
  this.primeTbl.filterGlobal(value,'contains')
}

// deleteMembers = (members:client) =>{
//     console.log(members);
// }

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
         const arr = [item.add_line_1,item.add_line_2,item.city_name,item.state_name,item.district_name,item.pincode]
         item.client_addr = arr.filter(item => {return item}).toString();
         return item;
   });
       })
    }
    else{
        this.getFamilyMemberMstDT = [];
    }
}

 searchResultVisibilityForClient = (display_mode: string) => {
   this.displayMode_forClient = display_mode;
 };

 searchResultVisibilityFornewMember = (display_mode: string) => {
  this.displayMode_forMember = display_mode;
};

deleteMembers = (members:client,index:number) =>{
            this.selectedFamily_member = this.selectedFamily_member.filter((item:client) => item.id != members.id)
}

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
