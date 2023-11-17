/***
 *
 * FOR CALCULATING TOTAL AMOUNT AND TOTAL COUNT
 */
export class trxnCountSummary{
  public cat_name:string;
  public pur_amt:ItrxnType;
  public pur_count: ItrxnType;
  public redemp_amt:ItrxnType;
  public redemp_count:ItrxnType;
  public switch_in_amt:ItrxnType;
  public switch_in_count: ItrxnType;
  public switch_out_amt:ItrxnType;
  public switch_out_count:ItrxnType;
  public sip_amt:ItrxnType;
  public sip_count:ItrxnType;
  public stp_in_amt:ItrxnType;
  public stp_in_count:ItrxnType;
  public stp_out_amt:ItrxnType;
  public stp_out_count:ItrxnType;
  public swp_amt:ItrxnType;
  public swp_count:ItrxnType;
  public switch_out_merger_amt:ItrxnType;
  public switch_out_merger_count:ItrxnType;
  public switch_in_merger_amt:ItrxnType;
  public switch_in_merger_count:ItrxnType;
  public nfo_amt:ItrxnType;
  public nfo_count:ItrxnType;
  public divi_payout_amt:ItrxnType;
  public divi_payout_count:ItrxnType;
  public divi_reinv_amt:ItrxnType;
  public divi_reinv_count:ItrxnType;
  public other_amt:ItrxnType;
  public other_count:ItrxnType;

  constructor(trxn:TrxnRpt[]){
      // console.log(trxn);
      // this.cat_name = trxn ? trxn.cat_name : '';
      this.pur_count = {
          process: trxn.filter((item: TrxnRpt) => (item.transaction_subtype.toLowerCase().includes('purchase') && !item.transaction_subtype.toLowerCase().includes('purchase rejection'))).length,
          reject: trxn.filter((item: TrxnRpt) => (!item.transaction_subtype.toLowerCase().includes('purchase') && item.transaction_subtype.toLowerCase().includes('purchase rejection'))).length
      };
      this.pur_amt = {
        process: this.calculateAmount(trxn.filter((item: TrxnRpt) => (item.transaction_subtype.toLowerCase().includes('purchase') && !item.transaction_subtype.toLowerCase().includes('purchase rejection')))),
        reject: this.calculateAmount(trxn.filter((item: TrxnRpt) => (!item.transaction_subtype.toLowerCase().includes('purchase') && item.transaction_subtype.toLowerCase().includes('purchase rejection'))))
      };
      this.switch_in_count = {
          process: trxn.filter((item: TrxnRpt) => (item.transaction_subtype.toLowerCase().includes('switch in') && !item.transaction_subtype.toLowerCase().includes('switch in rejection'))).length,
          reject: trxn.filter((item: TrxnRpt) => (item.transaction_subtype.toLowerCase().includes('switch in') && item.transaction_subtype.toLowerCase().includes('switch in rejection'))).length
      };
      this.switch_in_amt = {
        process: this.calculateAmount(trxn.filter((item: TrxnRpt) => (item.transaction_subtype.toLowerCase().includes('switch in') && !item.transaction_subtype.toLowerCase().includes('switch in rejection')))),
        reject: this.calculateAmount(trxn.filter((item: TrxnRpt) => (item.transaction_subtype.toLowerCase().includes('switch in') && item.transaction_subtype.toLowerCase().includes('switch in rejection'))))
      };
      this.switch_out_count = {
        process: trxn.filter((item: TrxnRpt) => (item.transaction_subtype.toLowerCase().includes('switch out') && !item.transaction_subtype.toLowerCase().includes('switch out rejection'))).length,
        reject: trxn.filter((item: TrxnRpt) => (item.transaction_subtype.toLowerCase().includes('switch out') && item.transaction_subtype.toLowerCase().includes('switch out rejection'))).length
    };
    this.switch_out_amt = {
      process: this.calculateAmount(trxn.filter((item: TrxnRpt) => (item.transaction_subtype.toLowerCase().includes('switch out') && !item.transaction_subtype.toLowerCase().includes('switch out rejection')))),
      reject: this.calculateAmount(trxn.filter((item: TrxnRpt) => (item.transaction_subtype.toLowerCase().includes('switch out') && item.transaction_subtype.toLowerCase().includes('switch out rejection'))))
  };
    this.divi_reinv_count = {
      process: trxn.filter((item: TrxnRpt) => (item.transaction_subtype.toLowerCase().includes('dividend reinvestment') && !item.transaction_subtype.toLowerCase().includes('dividend reinvestment rejection'))).length,
      reject: trxn.filter((item: TrxnRpt) => (item.transaction_subtype.toLowerCase().includes('dividend reinvestment') && item.transaction_subtype.toLowerCase().includes('dividend reinvestment rejection'))).length
    };
    this.divi_reinv_amt = {
      process: this.calculateAmount(trxn.filter((item: TrxnRpt) => (item.transaction_subtype.toLowerCase().includes('dividend reinvestment') && !item.transaction_subtype.toLowerCase().includes('dividend reinvestment rejection')))),
      reject: this.calculateAmount(trxn.filter((item: TrxnRpt) => (item.transaction_subtype.toLowerCase().includes('dividend reinvestment') && item.transaction_subtype.toLowerCase().includes('dividend reinvestment rejection'))))
    }

  }

  calculateAmount(trxn:TrxnRpt[]){
    return trxn.map((item) => Number(item.tot_gross_amount)).reduce((accumulator, currentValue) => {
      return accumulator + currentValue
    },0);
  }
}
export interface ItrxnType{
  process:number;
  reject:number
}

export class trxnCountAmtSummary{

    public static columns = [
      {
        field:'sl_no',
        header:'Sl No',
        width:"6rem"
      },
      {
        field:'cat_name',
        header: 'Category',
        width:"6rem"
      },
      {
        field:'pur_amt',
        header: 'Purchase Amount',
        width:"15rem"
      },
      {
        field:'pur_count',
        header: 'Purchase Count',
        width:"15rem"
      },
      {
        field:'redemp_amt',
        header: 'Redemption Amount',
        width:"15rem"
      },
      {
        field:'redemp_count',
        header: 'Redemption Count',
        width:"15rem"
      },
      {
        field:'switch_in_amt',
        header: 'Switch In Amount',
        width:"15rem"
      },
      {
        field:'switch_in_count',
        header: 'Switch In Count',
        width:"15rem"
      },
      {
        field:'switch_out_amt',
        header: 'Switch Out Amount',
        width:"15rem"
      },
      {
        field:'switch_out_count',
        header: 'Switch Out Count',
        width:"15rem"
      }
    ]
}

