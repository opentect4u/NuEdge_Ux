import { Overlay } from '@angular/cdk/overlay';
import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { plan } from 'src/app/__Model/plan';
import { bank } from 'src/app/__Model/__bank';
import { category } from 'src/app/__Model/__category';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { BnkModificationComponent } from '../bnkModification/bnkModification.component';

@Component({
  selector: 'bnkRpt-component',
  templateUrl: './bnkRpt.component.html',
  styleUrls: ['./bnkRpt.component.css'],
})
export class BnkrptComponent implements OnInit {
  @ViewChild('searchMicr') __searchMicr: ElementRef;
  @ViewChild('searchIfs') __searchIfs: ElementRef;
  // @ViewChild('searchbnk') __searchbnk: ElementRef;

  __bnkMst: bank[] = [];
  __ismicrspinner: boolean = false;
  __isifsspinner: boolean = false;
  __isbnkspinner: boolean = false;
  __bnkMstforIfs: bank[] = [];
  __bnkMstformicr: bank[] = [];
  __columnsForsummary: string[] = [
    'edit',
    'sl_no',
    'bank_name',
    'ifsc_code',
    'delete',
  ];
  __columnsForDetails: string[] = [
    'edit',
    'sl_no',
    'bank_name',
    'ifsc_code',
    'micr_code',
    'branch_name',
    'branch_addr',
    'delete',
  ];
  __catForm = new FormGroup({
    bank_name: new FormControl(''),
    bank_id: new FormControl(''),
    micr_code: new FormControl(''),
    ifsc: new FormControl(''),
    options: new FormControl('2'),
    branch_name: new FormControl(''),
  });
  __export = new MatTableDataSource<bank>([]);
  __pageNumber = new FormControl(10);
  __columns: string[] = [];
  __exportedClmns: string[] = ['sl_no', 'bank_name', 'ifsc_code'];
  __paginate: any = [];
  __selectPLN = new MatTableDataSource<bank>([]);
  __isVisible: boolean = false;
  constructor(
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<BnkrptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) {}

  ngOnInit() {
    this.getBankmaster();
    this.tableExport();
    this.__columns = this.__columnsForsummary;
  }

  tableExport() {
    const __catExport = new FormData();
    __catExport.append(
      'branch_name',
      this.__catForm.value.branch_name ? this.__catForm.value.branch_name : ''
    );
    __catExport.append(
      'bank_name',
      this.__catForm.value.bank_name ? this.__catForm.value.bank_name : ''
    );
    __catExport.append(
      'micr_code',
      this.__catForm.value.micr_code ? this.__catForm.value.micr_code : ''
    );
    __catExport.append(
      'ifsc',
      this.__catForm.value.ifsc ? this.__catForm.value.ifsc : ''
    );
    this.__dbIntr
      .api_call(1, '/depositbankExport', __catExport)
      .pipe(map((x: any) => x.data))
      .subscribe((res: bank[]) => {
        this.__export = new MatTableDataSource(res);
      });
  }

  private getBankmaster(__paginate: string | null = '10') {
    this.__dbIntr
      .api_call(0, '/depositbank', 'paginate=' + __paginate)
      .pipe(map((x: responseDT) => x.data))
      .subscribe((res: any) => {
        this.setPaginator(res.data);
        this.__paginate = res.links;
      });
  }

  ngAfterViewInit() {
    this.__catForm.controls['micr_code'].valueChanges
      .pipe(
        tap(() => (this.__ismicrspinner = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.__dbIntr.searchItems('/depositbank', dt) : []
        ),
        map((x: responseDT) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__bnkMstformicr = value;
          this.searchResultVisibility('block', 'M');
          this.__ismicrspinner = false;
        },
        complete: () => console.log(''),
        error: (err) => console.log(),
      });

    // this.__catForm.controls['bank_name'].valueChanges
    //   .pipe(
    //     tap(() => (this.__ismicrspinner = true)),
    //     debounceTime(200),
    //     distinctUntilChanged(),
    //     switchMap((dt) =>
    //       dt?.length > 1 ? this.__dbIntr.searchItems('/depositbank', dt) : []
    //     ),
    //     map((x: responseDT) => x.data)
    //   )
    //   .subscribe({
    //     next: (value) => {
    //       this.__bnkMst = value;
    //       this.searchResultVisibility('block', 'B');
    //       this.__isbnkspinner = false;
    //     },
    //     complete: () => console.log(''),
    //     error: (err) => console.log(),
    //   });

    this.__catForm.controls['ifsc'].valueChanges
      .pipe(
        tap(() => (this.__isifsspinner = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.__dbIntr.searchItems('/depositbank', dt) : []
        ),
        map((x: responseDT) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__bnkMstforIfs = value;
          this.searchResultVisibility('block', 'I');
          this.__isifsspinner = false;
        },
        complete: () => console.log(''),
        error: (err) => console.log(),
      });

    this.__catForm.controls['options'].valueChanges.subscribe((res) => {
      // this.__columns = res == '1' ?  this.__columnsForDetails : this.__columnsForsummary;
      if (res == '1') {
        this.__columns = this.__columnsForDetails;
        this.__exportedClmns = [
          'sl_no',
          'bank_name',
          'ifsc_code',
          'micr_code',
          'branch_name',
          'branch_addr',
        ];
      } else {
        this.__columns = this.__columnsForsummary;
        this.__exportedClmns = ['sl_no', 'bank_name', 'ifsc_code'];
      }
    });
  }

  private setPaginator(__res) {
    this.__selectPLN = new MatTableDataSource(__res);
    // this.__selectPLN.paginator = this.paginator;
  }
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url + ('&paginate=' + this.__pageNumber.value)
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res.data);
          this.__paginate = res.links;
        });
    }
  }
  getval(__paginate) {
    this.__pageNumber.setValue(__paginate.toString());
    this.getBankmaster(this.__pageNumber.value);
  }

  populateDT(__items: bank) {
    // this.__utility.navigatewithqueryparams('/main/master/catModify',{queryParams:{id:btoa(__items.id.toString())}})
    this.openDialog(__items, __items.id);
  }
  showCorrospondingAMC(__items) {
    this.__utility.navigatewithqueryparams(
      'main/master/productwisemenu/subcategory',
      {
        queryParams: { id: btoa(__items.id.toString()) },
      }
    );
  }
  openDialog(__category: bank | null = null, __catId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'B',
      id: __catId,
      items: __category,
      title: __catId == 0 ? 'Add Bank' : 'Update Bank',
      product_id: this.data.product_id,
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = __catId > 0 ? __catId.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        BnkModificationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt?.id > 0) {
            this.updateRow(dt.data);
          } else {
            this.__selectPLN.data.unshift(dt.data);
            this.__selectPLN._updateChangeSubscription();
          }
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'B',
      });
    }
  }
  private updateRow(row_obj: bank) {
    this.__selectPLN.data = this.__selectPLN.data.filter((value: bank, key) => {
      if (value.id == row_obj.id) {
        value.bank_name = row_obj.bank_name;
        (value.branch_addr = row_obj.branch_addr),
          (value.branch_name = row_obj.branch_name),
          (value.ifs_code = row_obj.ifs_code),
          (value.micr_code = row_obj.micr_code);
      }
      return true;
    });
    this.__export.data = this.__export.data.filter((value: bank, key) => {
      if (value.id == row_obj.id) {
        value.bank_name = row_obj.bank_name;
        (value.branch_addr = row_obj.branch_addr),
          (value.branch_name = row_obj.branch_name),
          (value.ifs_code = row_obj.ifs_code),
          (value.micr_code = row_obj.micr_code);
      }
      return true;
    });
  }
  fullScreen() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }
  minimize() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.updateSize('40%', '55px');
    this.dialogRef.updatePosition({
      bottom: '0px',
      right: this.data.right + 'px',
    });
  }
  maximize() {
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.addPanelClass('mat_dialog');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }

  exportPdf() {
    this.__Rpt.downloadReport(
      '#bnk',
      {
        title: 'Bank ',
      },
      'Bank'
    );
  }
  submit() {
    const __amcSearch = new FormData();
    // __amcSearch.append(
    //   'bank_id',
    //   this.__catForm.value.bank_id ? this.__catForm.value.bank_id : ''
    // );
       __amcSearch.append(
      'bank_name',
      this.__catForm.value.bank_name ? this.__catForm.value.bank_name : ''
    );
    __amcSearch.append(
      'micr_code',
      this.__catForm.value.micr_code ? this.__catForm.value.micr_code : ''
    );
    __amcSearch.append(
      'ifsc',
      this.__catForm.value.ifsc ? this.__catForm.value.ifsc : ''
    );
    __amcSearch.append('branch_name', this.__catForm.value.branch_name);

    this.__dbIntr
      .api_call(1, '/depositbankDetailSearch', __amcSearch)
      .pipe(map((x: any) => x.data))
      .subscribe((res) => {
        this.__paginate = res.links;
        this.setPaginator(res.data);
        this.showColumns();
        this.tableExport();
      });
  }

  showColumns() {}
  outsideClick(__ev, __mode) {
    if (__ev) {
      this.searchResultVisibility('none', __mode);
    }
  }
  searchResultVisibility(display_mode, __mode) {
    switch (__mode) {
      case 'M':
        this.__searchMicr.nativeElement.style.display = display_mode;
        break;
      case 'I':
        this.__searchIfs.nativeElement.style.display = display_mode;
        break;
      case 'B':
        // this.__searchbnk.nativeElement.style.display = display_mode;
        break;
      default:
        break;
    }
  }
  getItems(__amc, __type) {
    console.log(__type);

    switch (__type) {
      case 'M':
        this.__catForm.controls['micr_code'].reset(__amc.micr_code, {
          onlySelf: true,
          emitEvent: false,
        });
        this.searchResultVisibility('none', 'M');
        break;
      case 'I':
        this.__catForm.controls['ifsc'].reset(__amc.ifs_code, {
          onlySelf: true,
          emitEvent: false,
        });
        this.searchResultVisibility('none', 'I');
        break;
        case 'B':
          this.__catForm.controls['bank_id'].reset(__amc.id);
          this.__catForm.controls['bank_name'].reset(__amc.bank_name, {
            onlySelf: true,
            emitEvent: false,
          });
          this.searchResultVisibility('none', 'B');
          break;
      default:
        break;
    }
  }
}
