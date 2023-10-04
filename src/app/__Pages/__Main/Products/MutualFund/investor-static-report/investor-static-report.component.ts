import { Component, OnInit } from '@angular/core';
import Menu from '../../../../../../assets/json/Product/MF/homeMenus.json';


@Component({
  selector: 'app-investor-static-report',
  templateUrl: './investor-static-report.component.html',
  styleUrls: ['./investor-static-report.component.css']
})
export class InvestorStaticReportComponent implements OnInit {

  tab_menu: ITab[] = [];
  constructor() { }

  ngOnInit(): void {
    this.setTab().then((res: ITab[]) => {
      console.log(res);
    })
  }

  setTab = (): Promise<ITab[]> => {
    return new Promise((resolve, reject) => {
      resolve( Menu.filter(item => item.id == 7)[0].sub_menu
        .map((id, title, flag) => ({
          id,
          tab_name: title,
          flag,
          img_src: ''
        }))
      ),
        reject([])
    })
    
  }

}

export interface ITab {
  tab_name: string,
  id: number,
  img_src: string,
  flag: string
}
