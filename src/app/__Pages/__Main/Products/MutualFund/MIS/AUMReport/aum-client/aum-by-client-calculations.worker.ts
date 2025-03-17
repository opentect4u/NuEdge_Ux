/// <reference lib="webworker" />

// import { global } from "src/app/__Utility/globalFunc";
import * as CryptoJs from '../../../../../../../../assets/js/EnDcrypt.js';
import { AES_IV, HASH_EN_DE } from '../../../../../../../strings/localStorage_key';

addEventListener('message', ({ data }) => {
    let obj = {};
    const groupByClientPan =  groupBy(data.res.filter(el => !el.first_client_pan), 'first_client_pan');
    const groupByClientName =  groupBy(data.res.filter(el => el.first_client_pan), 'first_client_name');
    Object.keys(groupByClientPan).forEach(el =>{
      obj =  groupBy(groupByClientPan[el], 'first_client_name');
    })
  const grpObj = Object.assign({}, groupByClientName, obj);
    let dt = [];
        Object.keys(grpObj).forEach((el:any) =>{
        const inv_cost = Total__Count(grpObj[el],(x:any) => x?.total_inv_cost ? Number(x?.total_inv_cost) : 0);
        const idcw_paid = Total__Count(grpObj[el],(x:any) => x?.idcw_paid ? Number(x?.idcw_paid) : 0);
        const idcw_reinv = Total__Count(grpObj[el],(x:any) => x?.idcw_reinv ? Number(x?.idcw_reinv) : 0);
        const curr_aum = Total__Count(grpObj[el],(x:any) => x?.curr_aum ? Number(x?.curr_aum) : 0);
        const totGainLoss = Total__Count(grpObj[el],(x:any) => x?.gain_loss ? Number(x?.gain_loss) : 0);
        const tot_ret_abs = Number(inv_cost) > 0 ? ((totGainLoss / inv_cost) * 100)?.toFixed(2) : 0;
        const xirr = 0;
        dt.push({
              id:grpObj[el][0]?.id,
              client_name:el,
              pan:grpObj[el].length > 0 ? grpObj[el][0].first_client_pan : '',
              inv_cost:inv_cost,
              idcw_paid:idcw_paid,
              idcw_reinv:idcw_reinv,
              curr_aum:curr_aum,
              gain_loss:totGainLoss,
              Investment:inv_cost,
              AUM:curr_aum,
              "IDCW Reinv.":idcw_reinv,
              "IDCWP":idcw_paid,
              "Abs. Return":tot_ret_abs,
              xirr:xirr,
              ret_abs:tot_ret_abs,
              schemes:grpObj[el].map(el => {
                const encryptedTxt = EncryptText(JSON.stringify({date:data?.date,pCode:el?.product_code}));
                // const xirr_amt_arr = [...el.all_amount_arr,Number(el.curr_nav)];
                // const xirr_date_arr = [...JSON.parse(el.all_amount_arr),Number(el.curr_nav)];
                // const xirr = global.XIRR(xirr_amt_arr,xirr_date_arr,0);
                el.xirr = 0;
                return {...el,routeUrl: encryptedTxt}
              }),
              total:{
                inv_cost:inv_cost,
                idcw_paid:idcw_paid,
                idcw_reinv:idcw_paid,
                curr_aum:curr_aum,
                abs_rtn:tot_ret_abs,
                scheme_name:"TOTAL",
                xirr:0
              }
        })
  });
  // console.log(dt[0]);
  // return ;
  postMessage(dt.sort((a, b) => a.client_name.localeCompare(b.client_name)));
});

function groupBy(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key] || 'NO_PAN'] = rv[x[key]  || 'NO_PAN'] || []).push(x);
    return rv;
  }, {});
};

function EncryptText (text){
    try{
            const key = CryptoJs.PBKDF2(HASH_EN_DE, 'salt', { keySize: 256/32, iterations: 100 });
            const iv = CryptoJs.enc.Utf8.parse(AES_IV);
            const encrypted = CryptoJs.AES.encrypt(text, key, { iv: iv, mode: CryptoJs.mode.CBC });
            return encrypted.ciphertext.toString(CryptoJs.enc.Hex);
    }
    catch(err){
            console.log(err);
            return 'ERR';
    }

  }

  function Total__Count(arr, predicate: (elem, idx) => number) {
    return arr.reduce((prev, curr, idx) => prev + (predicate(curr, idx)), 0)
  }

