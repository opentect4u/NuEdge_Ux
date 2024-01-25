import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { client } from 'src/app/__Model/__clientMst';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import relationship from '../../../../../../../assets/json/Master/relationShip.json'
import { UtiliService } from 'src/app/__Services/utils.service';
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

  /**
   * Holding Family Head Details
   */
  family_head:client[] = [];

 /**
   * Holding Family Member Details
   */
    family_member:client[] = [];


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
        dt?.length > 1 ? this.__dbIntr.searchItems('/client', dt) : []
      ),
      map((x: any) => x.data)
    )
    .subscribe({
      next: (value) => {
        console.log(value)
        this.selectedFamily_header = null
        this.family_head = value.data;
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
        this.search_family_form.get('family_member_pan').setValue(''),
        this.family_member = [],
        this.selectedFamily_member = []
        )),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((dt) =>
        dt?.length > 1 ? this.__dbIntr.searchItems('/client', dt) : []
      ),
      map((x: any) => x.data)
    )
    .subscribe({
      next: (value) => {
        console.log(value)
        this.selectedFamily_member = []
        this.family_member = value.data;
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
  //  console.log(this.selectedFamily_member);
  //  console.log(Object.values(this.selectedFamily_header));
   if(this.selectedFamily_member.length == 0){
        //... show Error message
        this.utilty.showSnackbar(`Please select family head in step-1`,0);
   }
   else if(this.selectedFamily_header != null){
      //... show Error message
      this.utilty.showSnackbar(`Please select family member in step-2`,0);
   }
   else{
    //... code
   }
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
      field:'relation_ship',
      header:"Relationship With Head",
      width:'20rem',
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
      width:'12rem',
      isVisible:['M']
    },
    {
      field:"mobile",
      header:"Mobile",
      width:'15rem',
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
      width:'20rem',
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
      header:"Addres",
      width:'28rem',
      isVisible:['M']
    },
  ]

}