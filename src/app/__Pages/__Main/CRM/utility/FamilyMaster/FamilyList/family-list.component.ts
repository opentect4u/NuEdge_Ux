import { Component, OnInit } from '@angular/core';
import { pluck } from 'rxjs/operators';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

@Component({
  selector: 'app-family-list',
  templateUrl: './family-list.component.html',
  styleUrls: ['./family-list.component.css']
})
export class FamilyListComponent implements OnInit {

  constructor(private __dbIntr:DbIntrService) { }

  parent_column:column[] = FamilyListClm.column;

  sub_column:column[] = FamilyListClm.sub_column;

  dataSource:IFamilyList[] = [];

  ngOnInit(): void {this.getFamilyList();}

  getFamilyList = () =>{
      this.__dbIntr.api_call(0,'/familyList',null)
      .pipe(pluck('data'))
      .subscribe((res:IFamilyList[]) =>{
          console.log(res);
      })
  }

}
export interface IFamilyList{
  id:number;
  family_head:string;
  family_head_code:number;
  pan:string;
  mobile:number;
  email:string;
  address:string;
  login_status:string;
  family_member:IFamilymember[]
}

export interface IFamilymember{
      id:number;
      family_member:string;
      family_member_code:number;
      pan:string;
      mobile:number;
      email:string;
      address:string;
      login_status:string;
}

export class FamilyListClm{
  public static column:column[] = [
    {
      field:"sl_no",
      header:'Sl No.'
    },
    {
      field:"family_heads",
      header:'Family Heads'
    },
    {
      field:"family_head_code",
      header:'Family Head Code'
    },
    {
      field:"pan",
      header:'PAN'
    },
    {
      field:"mobile",
      header:'Mobile'
    },
    {
      field:"email",
      header:'Email'
    },
    {
      field:"address",
      header:'Address'
    },
    {
      field:"login_status",
      header:'Login Status'
    },
  ];

  public static sub_column:column[] = [
    {
      field:"sl_no",
      header:'Sl No.'
    },
    {
      field:"family_member",
      header:'Family Member'
    },
    {
      field:"family_member_code",
      header:'Family Member Code'
    },
    {
      field:"pan",
      header:'PAN'
    },
    {
      field:"mobile",
      header:'Mobile'
    },
    {
      field:"email",
      header:'Email'
    },
    {
      field:"address",
      header:'Address'
    },
    {
      field:"login_status",
      header:'Login Status'
    }
  ]
}
