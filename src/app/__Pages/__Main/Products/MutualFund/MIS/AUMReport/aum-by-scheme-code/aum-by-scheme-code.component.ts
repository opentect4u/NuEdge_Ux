import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';
import { IAumFooterModel } from '../component/aum.model';

@Component({
  selector: 'app-aum-by-scheme-code',
  templateUrl: './aum-by-scheme-code.component.html',
  styleUrls: ['./aum-by-scheme-code.component.css']
})
export class AumBySchemeCodeComponent implements OnInit {
  params = null;

  column: column[] = AumBySchemeCodeColumn.column;

  md_aum_by_scheme_code = [];

  date: string = '';

  aum_tiles:Partial<IAumFooterModel> = null;

  /*** Table Footer Details */
  footerDT = null;
  /*** End */
  constructor(private routeData: ActivatedRoute, private utility: UtiliService, private router: Router) {
    console.log(this.aum_tiles)
    routeData.params.subscribe(res => {
      try {
        this.params = JSON.parse(this.utility.DcryptText(res?.pCode_date_arnNo));
        if (this.params) {
          this.date = this.params?.date;
        }
      }
      catch (err) {
        this.router.navigate(["*"])
      }
    })
  }

  ngOnInit(): void { }
}


export class AumBySchemeCodeColumn {
  public static column: column[] = [
    {
      field: 'client_name',
      header: 'Client',
      width: '32rem'
    },
    {
      field: 'folio_number',
      header: 'Folio',
      width: ''
    },
    {
      field: 'inv_cost',
      header: 'Investment',
      width: ''
    },
    {
      field: 'idcwp',
      header: 'IDCWP',
      width: ''
    },
    {
      field: 'idcw_reinv',
      header: 'IDCW Reinv.',
      width: ''
    },
    {
      field: 'aum',
      header: 'AUM',
      width: ''
    },
    {
      field: 'ret_abs',
      header: 'Abs. Return',
      width: ''
    }
  ]
}