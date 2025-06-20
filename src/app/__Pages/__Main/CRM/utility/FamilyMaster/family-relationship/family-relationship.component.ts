import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Table } from 'primeng/table';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { client } from 'src/app/__Model/__clientMst';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import relationship from '../../../../../../../assets/json/Master/relationShip.json'
@Component({
  selector: 'app-family-relationship',
  templateUrl: './family-relationship.component.html',
  styleUrls: ['./family-relationship.component.css']
})
export class FamilyRelationshipComponent implements OnInit {
  relation = relationship
  family_head_search = new FormGroup({
        family_head_name: new FormControl('')
  });

  /*** Spinner For Search Input */
  __is__spinner_family_head:boolean = false;
  /******END */

  /***  Family Head List */
  family_head_mst:client[] = [];
  /**** End */
  /*** Family Members List */
  getFamilyMembersMst:client[] = []
  /*** End ***/

  /*** For showing / hiding list on search  */
  displayMode_forClient:string;
  /**** End */

  @ViewChild('primeTbl') primeTbl :Table;


  rel_column:column[] = FamilyRelationshipColumn.fam_rel_col;

  constructor(private dbIntr: DbIntrService,private utility:UtiliService) { }

  ngOnInit(): void {}

  ngAfterViewInit(){
    // Family Head  Search
   this.family_head_search.get('family_head_name').valueChanges.pipe(
    tap(() => {
      this.__is__spinner_family_head =  this.family_head_search.get('family_head_name').value ? true : false,
      this.family_head_mst = [];
      if(this.getFamilyMembersMst.length > 0){
        this.getFamilymemberAccordingToFamilyHead_Id()
      }
    }),
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
      this.family_head_mst = value;
      this.__is__spinner_family_head = false;
      this.searchResultVisibilityForClient('block');
    },
    complete: () => console.log(''),
    error: (err) => {this.__is__spinner_family_head = false},
  });
 //  End
  }

  /**
   * 
   * @param searchRlt - This function is used to get the selected item from the parent component
   * It resets the family_head_name form control with the selected item's client_name
   * It hides the search result for client by calling searchResultVisibilityForClient with 'none'
   */
  getSelectedItemsFromParent = (searchRlt: {
    flag: string;
    item: any;
  }) => {
      this.family_head_search.get('family_head_name').reset(searchRlt.item.client_name, { emitEvent: false });
      this.searchResultVisibilityForClient('none');
      this.getFamilymemberAccordingToFamilyHead_Id(searchRlt.item.client_id)
  }

  /**
   * 
   * @param display_mode - This function is used to set the visibility of the search result for client
   * It takes a string parameter display_mode which can be 'block' or 'none'
   * and assigns it to the displayMode_forClient variable
   * @returns void
   */
  searchResultVisibilityForClient = (display_mode:string) =>{
        this.displayMode_forClient = display_mode;
  }

  /**
   * 
   * @param id - This function is used to get the family members according to the family head ID
   * It takes an optional parameter id which is the family head ID
   * If the id is provided, it makes an API call to fetch the family members
   */
  getFamilymemberAccordingToFamilyHead_Id = (id:number | undefined = undefined) =>{
    if(id){
      this.dbIntr.api_call(0,'/clientFamilyDetail',`family_head_id=${id}&view_type=F`)
      .pipe(pluck('data'))
      .subscribe((res:client[]) =>{
       this.getFamilyMembersMst = res;
      })
   }
   else{
       this.getFamilyMembersMst = [];
   }
}

/**
 * @description This function is used to get the columns for the family relationship table
 * It uses the utility service to retrieve the columns based on the rel_column property
 * @returns {column[]} - An array of column objects
 */
  getColumns =() =>{
    return this.utility.getColumns(this.rel_column);
  }

  /**
   * @description This function is used to filter the global data in the PrimeNG table
   * It takes an event object as a parameter and retrieves the value from the target input field
   * The value is then passed to the filterGlobal method of the PrimeNG table with 'contains' as the filter match mode
   * @param $event - The event object containing the target input field value
   * @returns void
   */
  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
  }

  /**
   * @description This function updates the relationship of family members
   * It prepares the data by extracting existing members and the family head ID
   * Then it makes an API call to update the family members
   * If the update is successful, it resets the family members list and clears the family head search input
   * @returns void
   */
  UpdateRelationShip = () =>{
          try{
            const dt = {
              existing_members:JSON.stringify(this.getFamilyMembersMst),
              new_members:'[]',
              family_head_id:this.getFamilyMembersMst.filter((item) => item.relationship == 'Head')[0]?.family_id
            }
            this.dbIntr.api_call(1,'/updateFamilymembers',this.utility.convertFormData(dt))
            .subscribe((res: any) => {
                  if(res?.suc == 1){
                    this.getFamilyMembersMst = [];
                    this.family_head_search.get('family_head_name').setValue('',{emitEvent:false});
                  }
                 this.utility.showSnackbar(res.suc == 1 ? `Relationship Updated Successfull` : res.msg,res.suc)
            })
          }
          catch(err){
              console.log(err);
              this.utility.showSnackbar('Something went wrong',2)
          }

  }

}

export class FamilyRelationshipColumn {

  public static fam_rel_col:column[] = [
    {
      field:'sl_no',
      header:'SL No.',
      width:'5rem'
    },
    {
      field:'client_name',
      header:'Members',
      width:'25rem'
    },
    {
      field:'mobile',
      header:'Mobile',
      width:'10rem'
    },
    {
      field:'email',
      header:'Email',
      width:'25rem'
    },
    {
      field:'pan',
      header:'PAN',
      width:'8rem'
    },
    {
      field:'relationship',
      header:'Relation',
      width:'20rem'
    }
  ]
}
