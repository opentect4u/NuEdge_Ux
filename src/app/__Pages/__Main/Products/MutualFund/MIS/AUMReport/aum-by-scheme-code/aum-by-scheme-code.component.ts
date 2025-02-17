// TESTING PARAMETER : 766236a45bd0c8bde262be013d611026d734893bec6ddbfacf56bdc6f8c9286ddec62b88c2e73ffcd55ac299041b80f5
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';
import { IAumFooterModel } from '../component/aum.model';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { pluck } from 'rxjs/operators';
import { global } from 'src/app/__Utility/globalFunc';

@Component({
  selector: 'app-aum-by-scheme-code',
  templateUrl: './aum-by-scheme-code.component.html',
  styleUrls: ['./aum-by-scheme-code.component.css']
})
export class AumBySchemeCodeComponent implements OnInit {
  params = null;

  column: column[] = AumBySchemeCodeColumn.column;

  md_aum_by_scheme_code:any = [];

  date: string = '';

  aum_tiles:Partial<IAumFooterModel> = null;

  aum_type:string = null



  /*** Table Footer Details */
  footerDT:Partial<IAumFooterModel> = null;
  /*** End */
  constructor(private routeData: ActivatedRoute, 
    private utility: UtiliService, 
    private router: Router,
    private dbIntr:DbIntrService
  ) {console.log(this.aum_tiles)}


  ngOnInit(): void { 
    this.routeData.params.subscribe(res => {
      try {
        this.params = JSON.parse(this.utility.DcryptText(res?.pCode_date_arnNo));
        console.log(this.params)
        if (this.params) {
          this.date = this.params?.date;
          this.fetchAumBySchemeCode(this.params);
        }
      }
      catch (err) {
        this.router.navigate(["*"])
      }
    })
  }
  fetchAumBySchemeCode = (routeParams) =>{
    const payLoad = {
          nav_date:routeParams?.date,
          product_code:routeParams?.pCode
    }
    var formdata = new FormData();
    for(let key in payLoad){
        formdata.append(key,payLoad[key])
    }
    console.log(formdata)
    this.dbIntr.api_call(1,`/clients/aumScheme`,formdata)
    .pipe(pluck('data'))
    .subscribe((res:any) =>{
        this.footerDT = null;
        this.md_aum_by_scheme_code = res.map(el =>{
            el.client_name = `${el.client_name} ${el.client_pan ? ' ['+el.client_pan+']' : ''}`;
            return el;
        })
        this.aum_type = this.md_aum_by_scheme_code.length > 0 ? this.md_aum_by_scheme_code[0].scheme_name : '';
        this.createParentFooter(this.md_aum_by_scheme_code)
    })
  }
  createParentFooter = (value) =>{
       const tot_gain_loss = global.Total__Count(value,(x:any) => x?.gain_loss ? Number(x?.gain_loss) : 0);
       const tot_idcwp = global.Total__Count(value,(x:any) => x?.idcwp ? Number(x?.idcwp) : 0);
       const tot_idcw_reinv = global.Total__Count(value,(x:any) => x?.idcw_reinv ? Number(x?.idcw_reinv) : 0);
       const tot_curr_aum = global.Total__Count(value,(x:any) => x?.aum ? Number(x?.aum) : 0);
       const tot_inv_cost = global.Total__Count(value,(x:any) => x?.inv_cost ? Number(x?.inv_cost) : 0);
       const tot_ret_abs = ((tot_gain_loss / tot_inv_cost) * 100);
       this.footerDT = {
        // Client:"GRAND TOTAL",
        // Folio:"",
        Investment:tot_inv_cost,
        IDCW:tot_idcwp,
        "IDCW Reinv":tot_idcw_reinv,
        AUM:tot_curr_aum,
        "Abs. Return":tot_ret_abs.toFixed(2),
       }
       setTimeout(() => {
        Object.keys(this.footerDT).forEach(el =>{
          const getElement = document.getElementById(el);
          getElement.style.border = this.generateBorderColor();
          getElement.style.borderRadius = "3px";
          getElement.style.padding = "3px";
        })
      }, 500);
 
   }

   generateBorderColor = () => {
    try{
      let r, g, b;

      // Ensure the color is not white or black by generating values between 1 and 254
      r = Math.floor(Math.random() * 151) + 50; // Range: 50-200
      g = Math.floor(Math.random() * 151) + 50; // Range: 50-200
      b = Math.floor(Math.random() * 151) + 50; // Range: 50-200
  
      // Return the color in RGB format
      return `1px solid rgb(${r}, ${g}, ${b})`;
    }
    catch(err){
      console.log(err);
      return '1px solid #dbdbdb'
    }
  }
}


export class AumBySchemeCodeColumn {
  public static column: column[] = [
    {
      field: 'client_name',
      header: 'Client',
      width: '32rem'
    },
    {
      field: 'folio_no',
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
      header: 'IDCW',
      width: ''
    },
    {
      field: 'idcw_reinv',
      header: 'IDCW Reinv',
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