import { Component, OnInit } from '@angular/core';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-clietCdDaasboard',
  templateUrl: './clietCdDaasboard.component.html',
  styleUrls: ['./clietCdDaasboard.component.css'],
})
export class ClietCdDaasboardComponent implements OnInit {
  // main/master/clOption
  __brdCrmbs: breadCrumb[] = [
    {
      label: 'Home',
      url: '/main',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Master',
      url: '/main/master/products',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Operations',
      url: '/main/master/mstOperations',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Client Master',
      url: '/main/master/clntMstHome',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Create Client Code',
      url: '/main/master/clOption',
      hasQueryParams: false,
      queryParams: '',
    },
  ];
  __menu = [
    {
      parent_id: 4,
      menu_name: 'Existing',
      has_submenu: 'N',
      url: '/main/master/clientmaster',
      icon: '',
      flag: 'E',
    },
    {
      parent_id: 4,
      menu_name: 'Add New',
      has_submenu: 'N',
      url: 'main/master/claddnew',
      icon: '',
      flag: 'A',
    },
    {
      parent_id: 4,
      menu_name: 'Upload CSV',
      has_submenu: 'N',
      url: 'main/master/clUploadCsv',
      icon: '',
      flag: 'U',
    },
  ];

  constructor(private __utility: UtiliService) {
    console.log(this.__menu);
  }

  ngOnInit() {
    this.__utility.getBreadCrumb(this.__brdCrmbs);
  }
  navigate(__items) {
    console.log(__items);

    switch (__items.flag) {
      case 'E':
        console.log('E');
        this.__utility.navigatewithqueryparams(__items.url, {
          queryParams: { flag: btoa(__items.flag) },
        });
        break;
      case 'A':
        this.__utility.navigate(__items.url);
        break;
      case 'U':
        this.__utility.navigatewithqueryparams(__items.url, {
          queryParams: { flag: btoa('E') },
        });
        break;
      default:
        this.__utility.showSnackbar(
          'Something went wrong !! Please try again later',
          0
        );
        break;
    }
  }
}
