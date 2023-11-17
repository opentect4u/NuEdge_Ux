import {DIVIDEND_PAYOUT_PROCESS, DIVIDEND_PAYOUT_REJ,
  DIVIDEND_REINV_PROCESS, DIVIDEND_REINV_REJ, NFO_PROCEES,
  NFO_REJ, NFT, PUR_PROCESS,PUR_REJ, REDEMP_PROCESS, REDEMP_REJ, SIP_PROCESS,
  SIP_REJ, STP_IN_PROCESS, STP_IN_REJ, STP_OUT_PROCESS, STP_OUT_REJ,
  SWITCH_IN_MERGER_PROCESS, SWITCH_IN_MERGER_REJ, SWITCH_IN_PROCESS, SWITCH_IN_REJ,
  SWITCH_OUT_MERGER_PROCESS, SWITCH_OUT_MERGER_REJ, SWITCH_OUT_PROCESS, SWITCH_OUT_REJ}
  from '../../../../../../../strings/transType';


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

      /*** `PURCHASE & PURCHASE REJECTION AMOUNT , COUNT` */
      this.pur_count = {
        process: trxn.filter((item: TrxnRpt) =>
        (
          PUR_PROCESS
          .indexOf(item.transaction_subtype.toLowerCase()) >=0 &&
          PUR_REJ
          .indexOf(item.transaction_subtype.toLowerCase()) == -1)).length,
        reject: trxn.filter((item: TrxnRpt) =>
        (
          PUR_REJ
          .indexOf(item.transaction_subtype.toLowerCase()) >=0 &&
          PUR_PROCESS
          .indexOf(item.transaction_subtype.toLowerCase()) == -1)).length
    };
      this.pur_amt = {
        process: this.calculateAmount(trxn.filter((item: TrxnRpt) => (
          PUR_PROCESS
          .indexOf(item.transaction_subtype.toLowerCase()) >=0 &&
          PUR_REJ
          .indexOf(item.transaction_subtype.toLowerCase()) == -1))),
        reject: this.calculateAmount(trxn.filter((item: TrxnRpt) => (
          PUR_REJ
          .indexOf(item.transaction_subtype.toLowerCase()) >=0 &&
          PUR_PROCESS
          .indexOf(item.transaction_subtype.toLowerCase()) == -1
          )))
      };
      /****** END */

      /***** `SWITCH IN & SWITCH IN REJECTION` */
      this.switch_in_count = {
          process: trxn.filter((item: TrxnRpt) =>
          (
            SWITCH_IN_PROCESS.indexOf(item.transaction_subtype) >= 0
          )
          ).length,
          reject: trxn.filter((item: TrxnRpt) => (
             SWITCH_IN_REJ.indexOf(item.transaction_subtype) >= 0
            )).length
      };
      this.switch_in_amt = {
        process: this.calculateAmount(trxn.filter((item: TrxnRpt) => (
          SWITCH_IN_PROCESS.indexOf(item.transaction_subtype) >= 0
          ))),
        reject: this.calculateAmount(trxn.filter((item: TrxnRpt) => (
          SWITCH_IN_REJ.indexOf(item.transaction_subtype) >= 0
          )))
      };
      /********END */
      /**** Redemption & Redemption Rejection */
      this.redemp_count = {
        process: trxn.filter((item: TrxnRpt) => (REDEMP_PROCESS.indexOf(item.transaction_subtype) >= 0)).length,
        reject: trxn.filter((item: TrxnRpt) =>  (REDEMP_REJ.indexOf(item.transaction_subtype) >=0)).length
      };
      this.redemp_amt = {
        process: this.calculateAmount(trxn.filter((item: TrxnRpt) => (REDEMP_PROCESS.indexOf(item.transaction_subtype) >= 0))),
        reject: this.calculateAmount(trxn.filter((item: TrxnRpt) => (REDEMP_REJ.indexOf(item.transaction_subtype) >=0)))
      };
      /***** End */

      /***** Switch Out & Switch Out Rejection */
      this.switch_out_count = {
        process: trxn.filter((item: TrxnRpt) => (
          SWITCH_OUT_PROCESS.indexOf(item.transaction_subtype) >= 0
          )).length,
        reject: trxn.filter((item: TrxnRpt) => (
          SWITCH_OUT_REJ.indexOf(item.transaction_subtype) >= 0
          )).length
      };
      this.switch_out_amt = {
        process: this.calculateAmount(trxn.filter((item: TrxnRpt) => (
          SWITCH_OUT_PROCESS.indexOf(item.transaction_subtype) >= 0
          ))),
        reject: this.calculateAmount(trxn.filter((item: TrxnRpt) => (
          SWITCH_OUT_REJ.indexOf(item.transaction_subtype) >= 0
          )))
      };
     /**** End */

  /***** Divident Reinvestmnt , Divident Reinvestmnt Rejection */
    this.divi_reinv_count = {
      process: trxn.filter((item: TrxnRpt) => (
        DIVIDEND_REINV_PROCESS.indexOf(item.transaction_subtype)>=0
        )).length,
      reject: trxn.filter((item: TrxnRpt) => (
        DIVIDEND_REINV_REJ.indexOf(item.transaction_subtype)>=0
        )).length
    };
    this.divi_reinv_amt = {
      process: this.calculateAmount(trxn.filter((item: TrxnRpt) => (
        DIVIDEND_REINV_PROCESS.indexOf(item.transaction_subtype)>=0
        ))),
      reject: this.calculateAmount(trxn.filter((item: TrxnRpt) => (
        DIVIDEND_REINV_REJ.indexOf(item.transaction_subtype)>=0
        )))
    }
    /**** End */

    /***** Divident PAYOUT , Divident PAYOUT Rejection */
    this.divi_payout_count = {
      process: trxn.filter((item: TrxnRpt) => (
        DIVIDEND_PAYOUT_PROCESS.indexOf(item.transaction_subtype)>=0
        )).length,
      reject: trxn.filter((item: TrxnRpt) => (
        DIVIDEND_PAYOUT_REJ.indexOf(item.transaction_subtype)>=0
        )).length
    };
    this.divi_payout_amt = {
      process: this.calculateAmount(trxn.filter((item: TrxnRpt) => (
        DIVIDEND_PAYOUT_PROCESS.indexOf(item.transaction_subtype)>=0
        ))),
      reject: this.calculateAmount(trxn.filter((item: TrxnRpt) => (
        DIVIDEND_PAYOUT_REJ.indexOf(item.transaction_subtype)>=0
        )))
    }
    /**** End */

    /*** Switch out & In Merger, Rejection
     *  public switch_out_merger_amt:ItrxnType;
  public switch_out_merger_count:ItrxnType;
  public switch_in_merger_amt:ItrxnType;
  public switch_in_merger_count:ItrxnType;
     *
     */
    this.switch_out_merger_count = {
      process: trxn.filter((item: TrxnRpt) => (
        SWITCH_OUT_MERGER_PROCESS.indexOf(item.transaction_subtype)>=0
        )).length,
      reject: trxn.filter((item: TrxnRpt) => (
        SWITCH_OUT_MERGER_REJ.indexOf(item.transaction_subtype)>=0
        )).length
    };
    this.switch_out_merger_amt = {
      process: this.calculateAmount(trxn.filter((item: TrxnRpt) => (
        SWITCH_OUT_MERGER_PROCESS.indexOf(item.transaction_subtype)>=0
        ))),
      reject: this.calculateAmount(trxn.filter((item: TrxnRpt) => (
        SWITCH_OUT_MERGER_REJ.indexOf(item.transaction_subtype)>=0
        )))
    }

    this.switch_in_merger_count = {
      process: trxn.filter((item: TrxnRpt) => (
        SWITCH_IN_MERGER_PROCESS.indexOf(item.transaction_subtype)>=0
        )).length,
      reject: trxn.filter((item: TrxnRpt) => (
        SWITCH_IN_MERGER_REJ.indexOf(item.transaction_subtype)>=0
        )).length
    };
    this.switch_in_merger_amt = {
      process: this.calculateAmount(trxn.filter((item: TrxnRpt) => (
        SWITCH_IN_MERGER_PROCESS.indexOf(item.transaction_subtype)>=0
        ))),
      reject: this.calculateAmount(trxn.filter((item: TrxnRpt) => (
        SWITCH_IN_MERGER_REJ.indexOf(item.transaction_subtype)>=0
        )))
    }
    /*** End */

    /******* STP IN , OUT, Rejection */
     this.stp_in_count =  {
      process: trxn.filter((item: TrxnRpt) => (
        STP_IN_PROCESS.indexOf(item.transaction_subtype)>=0
        )).length,
      reject: trxn.filter((item: TrxnRpt) => (
        STP_IN_REJ.indexOf(item.transaction_subtype)>=0
        )).length
     }

     this.stp_in_amt =  {
      process: this.calculateAmount(trxn.filter((item: TrxnRpt) => (
        STP_IN_PROCESS.indexOf(item.transaction_subtype)>=0
        ))),
      reject: this.calculateAmount(trxn.filter((item: TrxnRpt) => (
        STP_IN_REJ.indexOf(item.transaction_subtype)>=0
        )))
     }
     this.stp_out_count =  {
      process: trxn.filter((item: TrxnRpt) => (
        STP_OUT_PROCESS.indexOf(item.transaction_subtype)>=0
        )).length,
      reject: trxn.filter((item: TrxnRpt) => (
        STP_OUT_REJ.indexOf(item.transaction_subtype)>=0
        )).length
     }

     this.stp_out_amt =  {
      process: this.calculateAmount(trxn.filter((item: TrxnRpt) => (
        STP_OUT_PROCESS.indexOf(item.transaction_subtype)>=0
        ))),
      reject: this.calculateAmount(trxn.filter((item: TrxnRpt) => (
        STP_OUT_REJ.indexOf(item.transaction_subtype)>=0
        )))
     }
     /**** End */

     /*** NFO , REJECTION */
     this.nfo_count ={
      process: trxn.filter((item: TrxnRpt) => (
        NFO_PROCEES.indexOf(item.transaction_subtype)>=0
        )).length,
      reject: trxn.filter((item: TrxnRpt) => (
        NFO_REJ.indexOf(item.transaction_subtype)>=0
        )).length
    }
      this.nfo_amt ={
        process: this.calculateAmount(trxn.filter((item: TrxnRpt) => (
          NFO_PROCEES.indexOf(item.transaction_subtype)>=0
          ))),
        reject: this.calculateAmount(trxn.filter((item: TrxnRpt) => (
          NFO_REJ.indexOf(item.transaction_subtype)>=0
          )))
      }
     /**** END */

     /*****  SIP , REJECTION */
      this.sip_count = {
        process: trxn.filter((item: TrxnRpt) => (
          SIP_PROCESS.indexOf(item.transaction_subtype)>=0
          )).length,
        reject: trxn.filter((item: TrxnRpt) => (
          SIP_REJ.indexOf(item.transaction_subtype)>=0
          )).length
      };
      this.sip_amt = {
        process: this.calculateAmount(trxn.filter((item: TrxnRpt) => (
          SIP_PROCESS.indexOf(item.transaction_subtype)>=0
          ))),
        reject: this.calculateAmount(trxn.filter((item: TrxnRpt) => (
          SIP_REJ.indexOf(item.transaction_subtype)>=0
          )))
      }
     /***** END */

     /****** NFT, REJECTION */
          this.other_count = {
            process: trxn.filter((item: TrxnRpt) => (
              NFT.indexOf(item.transaction_subtype) == -1
              )).length,
            reject: trxn.filter((item: TrxnRpt) => (
              SIP_REJ.indexOf(item.transaction_subtype) == -1
              )).length
          };
          this.other_amt = {
            process: this.calculateAmount(trxn.filter((item: TrxnRpt) => (
              NFT.indexOf(item.transaction_subtype) == -1
              ))),
            reject: this.calculateAmount(trxn.filter((item: TrxnRpt) => (
              SIP_REJ.indexOf(item.transaction_subtype) == -1
              )))
          }

     /**** END */

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

/**** FOR COLUMN */
export class trxnCountAmtSummaryColumn{

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
      },


      {
        field:'switch_in_merger_amt',
        header: 'Switch In Merger Amount',
        width:"15rem"
      },
      {
        field:'switch_in_merger_count',
        header: 'Switch In Merger Count',
        width:"15rem"
      },
      {
        field:'switch_out_merger_amt',
        header: 'Switch Out Merger Amount',
        width:"15rem"
      },
      {
        field:'switch_out_merger_count',
        header: 'Switch Out Merger Count',
        width:"15rem"
      },

      {
        field:'sip_amt',
        header: 'SIP Amount',
        width:"15rem"
      },
      {
        field:'sip_count',
        header: 'SIP Count',
        width:"15rem"
      },

      {
        field:'stp_in_amt',
        header: 'STP In Amount',
        width:"15rem"
      },
      {
        field:'stp_in_count',
        header: 'STP In Count',
        width:"15rem"
      },
      {
        field:'stp_out_amt',
        header: 'STP Out Amount',
        width:"15rem"
      },
      {
        field:'stp_out_count',
        header: 'STP Out Count',
        width:"15rem"
      },

      {
        field:'nfo_amt',
        header: 'NFO Amount',
        width:"15rem"
      },
      {
        field:'nfo_count',
        header: 'NFO Count',
        width:"15rem"
      },
      {
        field:'other_amt',
        header: 'NFT Amount',
        width:"15rem"
      },
      {
        field:'other_count',
        header: 'NFT Count',
        width:"15rem"
      },
    ]
}
/**** END */

