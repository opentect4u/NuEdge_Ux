import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-delete-family',
  templateUrl: './delete-family.component.html',
  styleUrls: ['./delete-family.component.css']
})
export class DeleteFamilyComponent implements OnInit {

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
              const arr = [item.add_line_1,item.add_line_2,item.city,item.state,item.dist,item.pincode]
              item.client_addr = arr.toString();
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
          const arr = [item.add_line_1,item.add_line_2,item.city,item.state,item.dist,item.pincode]
          item.client_addr = arr.toString();
          return item;
    });
        })
     }
     else{
         this.getFamilyMemberMstDT = [];
     }
}

  searchResultVisibilityForClient = (display_mode: string) => {
    // console.log(display_mode);
    this.displayMode_forClient = display_mode;
  };



  searchFamilyMembers = () =>{
    if(this.family_head_search.value.family_head_id || this.family_head_search.value.family_head_pan){
      this.getFamilymemberAccordingToFamilyHead_Id(this.family_head_search.value.family_head_id);
    }
    else{
      this.utility.showSnackbar(`Please Select Family Head`,2);
    }
  }

  deleteFamily = () =>{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.role = "alertdialog";
    dialogConfig.data = {
      flag: 'A',
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
