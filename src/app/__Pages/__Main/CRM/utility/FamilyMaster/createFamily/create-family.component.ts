import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { client } from 'src/app/__Model/__clientMst';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import relationship from '../../../../../../../assets/json/Master/relationShip.json'
import { UtiliService } from 'src/app/__Services/utils.service';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-create-family',
  templateUrl: './create-family.component.html',
  styleUrls: ['./create-family.component.css']
})
export class CreateFamilyComponent implements OnInit {

  relation = relationship
  search_by:ISearchBy[] = [
    {value:"N",name:"Name",icon:'person'},
    {value:"E",name:"Email",icon:'mail'},
    {value:"P",name:"PAN No.",icon:'badge'},
    {value:"M",name:"Mobile No.",icon:'phone_android'},
    {value:"A",name:"Address",icon:'language'}
  ]

  /**
   * For Family table Column
   */
  family_tbl_column:column[] = FamilyClientColumn.column.filter(item => item.isVisible.includes('H'))
  family_member_tbl_column:column[] = FamilyClientColumn.column.filter(item => item.isVisible.includes('M'))

  /**** Family Members Column */
   selected_family_member_column:column[] = FamilyClientColumn.family_member_clm;
   confirm_selected_family_members = [];
  /***** END */

  @ViewChild('pTble') primeTable:Table;


  /**
   * Holding Family Head Details
   */
  family_head = [];

 /**
   * Holding Family Member Details
   */
    family_member:client[] = [];

    /** For Dialog Visibility */
    visible:boolean = false;
    /*** End */

  /**
   *
   */
  selectedFamily_header:client
  selectedFamily_member:client[]= []


  __is__spinner_family_head:boolean = false;
  __is__spinner_family_member:boolean = false;

  searched_family_head:client[] = [];

  displayMode_forfamily_head:string;

  /**
   * Search Form
   */
  search_family_form = new FormGroup({
      family_head_search_by: new FormControl('Name'),
      family_head_name: new FormControl(''),
      family_head_pan: new FormControl(''),
      family_member_search_by: new FormControl('Name'),
      family_member_name: new FormControl(''),
      family_member_pan: new FormControl(''),
  })

    constructor(private __dbIntr: DbIntrService,private utilty:UtiliService) { }

  ngOnInit(): void {}

  ngAfterViewInit(){
    this.search_family_form.get('family_head_name').valueChanges.pipe(
      tap(() => (
        this.__is__spinner_family_head =  this.search_family_form.get('family_head_name').value ? true : false,
        this.search_family_form.get('family_head_pan').setValue(''),
        this.family_head = [],
        this.selectedFamily_header = null
        )),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((dt) =>
        dt?.length > 1 ? this.__dbIntr.searchItems('/searchClientWithoutFamily', dt) : []
      ),
      map(
        (x: any) => x.data.filter((item:client) => item.family_count == 0)
      )
    )
    .subscribe({
      next: (value) => {
        console.log(value)
        const dt = value.map((item:client) =>{
              const arr = [item.add_line_1,item.add_line_2,item.city_name,item.state_name,item.district_name,item.pincode]
              item.client_addr = arr.filter(item => {return item}).toString();
              return item;
        })
        this.selectedFamily_header = null
        this.family_head = dt;
        // this.searchResultVisibilityForClient('block');
        this.search_family_form.patchValue({
            family_head_pan:''
        })
        this.__is__spinner_family_head = false;
      },
      complete: () => console.log(''),
      error: (err) => console.log(),
    });




    this.search_family_form.get('family_member_name').valueChanges.pipe(
      tap(() => (
        this.__is__spinner_family_member =  this.search_family_form.get('family_member_name').value ? true : false,
        this.search_family_form.get('family_member_pan').setValue('')
        // this.family_member = []
        // this.selectedFamily_member = []
        )),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((dt) =>
        dt?.length > 1 ? this.__dbIntr.searchItems('/searchClientWithoutFamily', `${dt}`) : []
      ),
      map((x: any) => x.data.filter((item:client) => item.family_count == 0))
    )
    .subscribe({
      next: (value) => {
        console.log(value)
        const dt = value.map((item:client) =>{
          const arr = [item.add_line_1,item.add_line_2,item.city_name,item.state_name,item.district_name,item.pincode]
          item.client_addr = arr.filter(item => {return item}).toString();
          return item;
        })
        // this.selectedFamily_member = this.selectedFamily_member;
        this.family_member = [...this.selectedFamily_member,...dt];
        // this.searchResultVisibilityForClient('block');
        this.search_family_form.patchValue({
            family_member_pan:''
        })
        this.__is__spinner_family_member = false;
      },
      complete: () => console.log(''),
      error: (err) => console.log(),
    });
  }

  // getMenuItem = (item:ISearchBy) =>{
  //     this.search_family_form.get('family_head_search_by').setValue(item.name)
  // }

  // getItems = (item) =>{
  //     console.log(item)
  // }

  // searchResultVisibilityForClient = (display_mode:string) =>{
  //     this.displayMode_forfamily_head = display_mode
  // }
  changeRelation = (event,client:client,index:number) =>{
      console.log(client);
      console.log(index);
      console.log(event.target.value);
  }


  createFamily = () =>{
    this.confirm_selected_family_members = [];
   if(this.selectedFamily_header == null){
      this.utilty.showSnackbar(`Please select family head in step-1`,0);
      return;
   }
   else if(this.selectedFamily_member.length == 0){
    this.utilty.showSnackbar(`Please select family member in step-2`,0);
    return;
   }
    this.confirm_selected_family_members = [...[this.selectedFamily_header],...this.selectedFamily_member]
    this.visible = true;
  }


  confirmaddFamilyMembers = () =>{
    const dt = Object.assign({},
      {
        family_head_id:this.selectedFamily_header?.id,
        family_members:JSON.stringify(
          this.selectedFamily_member.filter(item => item.id != this.selectedFamily_header?.id).map((item) => ({id:item.id,relationship:item.relationship}))
        )
      })
    this.__dbIntr.api_call(1,'/clientFamilyAddEdit',this.utilty.convertFormData(dt))
    .pipe(pluck('suc'))
    .subscribe(res =>{
      if(res == 1){
        this.selectedFamily_header = null;
        this.selectedFamily_member = [];
        this.family_head = [];
        this.family_member = [];
        this.search_family_form.get('family_head_name').setValue('',{emitEvent:false})
        this.search_family_form.get('family_member_name').setValue('',{emitEvent:false})
        this.search_family_form.get('family_head_pan').setValue('',{emitEvent:false})
        this.search_family_form.get('family_member_pan').setValue('',{emitEvent:false})
        this.visible = !this.visible;
      }
      this.utilty.showSnackbar(res == 1 ? 'Success!! Family created successfully' : 'Error!! Something went wrong',res)
    })
  }


  checkSelected = (family_head) =>{
    // console.log(family_head);
    // console.log(this.selectedFamily_header);
  }

  deleteMembers = (members:client,index:number) =>{
    this.selectedFamily_member = this.selectedFamily_member.filter((item:client) => item.id != members.id)
  }
}

export interface ISearchBy{
  value:string,name:string,icon:string
}

export class FamilyClientColumn{

  public static column:column[] = [
    {
      field:'client_name',
      header:"Name",
      width:'23rem',
      isVisible:['H']
    },
    {
      field:'client_name',
      header:"Family Members",
      width:'23rem',
      isVisible:['M']
    },
    {
      field:'relationship',
      header:"Relation",
      width:'10rem',
      isVisible:['M']
    },
    {
      field:'client_code',
      header:"Client ID",
      width:'10rem',
      isVisible:['H','M']
    },
    {
      field:"pan",
      header:"PAN",
      width:'15rem',
      isVisible:['H']
    },
    {
      field:"pan",
      header:"PAN",
      width:'9rem',
      isVisible:['M']
    },
    {
      field:"mobile",
      header:"Mobile",
      width:'9rem',
      isVisible:['H','M']
    },
    {
      field:"email",
      header:"Email",
      width:'30rem',
      isVisible:['H']
    },
    {
      field:"email",
      header:"Email",
      width:'25rem',
      isVisible:['M']
    },
    {
      field:"client_addr",
      header:"Addres",
      width:'36rem',
      isVisible:['H']
    },
    {
      field:"client_addr",
      header:"Address",
      width:'36rem',
      isVisible:['M']
    },
  ]

  public static family_member_clm:column[] = [
    {
      field:'sl_no',
      header:"Sl No.",
    },
    {
      field:'client_name',
      header:"Members",
    },
    {
      field:'relationship',
      header:"Relation",
    },
    {
      field:'client_code',
      header:"Client ID",
    },
    {
      field:'pan',
      header:"PAN",
    },
  ]

}
