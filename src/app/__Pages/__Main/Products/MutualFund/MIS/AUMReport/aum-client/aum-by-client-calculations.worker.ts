/// <reference lib="webworker" />

// import { global } from "src/app/__Utility/globalFunc";
import moment from 'moment';
import * as CryptoJs from '../../../../../../../../assets/js/EnDcrypt.js';
import { AES_IV, HASH_EN_DE } from '../../../../../../../strings/localStorage_key';

addEventListener('message', ({ data }) => {
    let obj = {};
    const groupByClientPan =  groupBy(data.res.filter(el => !el.first_client_pan), 'first_client_pan');
    const groupByClientName =  groupBy(data.res.filter(el => el.first_client_pan), 'first_client_name');
    // const grpObj = groupBy(data.res.filter(el => el.first_client_pan), 'first_client_name');
    Object.keys(groupByClientPan).forEach(el =>{
      console.log(el)
      obj =  groupBy(groupByClientPan[el], 'first_client_name');
    })
  const grpObj = Object.assign({}, groupByClientName, obj);
    let dt = [];
    Object.keys(grpObj).forEach((el:any) =>{
    
    // console.log(grpObj[el]);
    let  all_amount_arr = [...(grpObj[el].map(el => JSON.parse(el.all_amount_arr)))];
    let  all_date_arr = [...grpObj[el].map(el => JSON.parse(el.all_date_arr))];
    // console.log(all_amount_arr.reduce((acc, val) => acc.concat(val), []));
    console.log(`********${el.first_client_name}***************`);
    console.log(all_date_arr);
    console.log(all_amount_arr);
    console.log('***********END***********')

    // let xirr_amt_arr = [...all_amount_arr,]

    const inv_cost = Total__Count(grpObj[el],(x:any) => x?.total_inv_cost ? Number(x?.total_inv_cost) : 0);
    const idcw_paid = Total__Count(grpObj[el],(x:any) => x?.idcw_paid ? Number(x?.idcw_paid) : 0);
    const idcw_reinv = Total__Count(grpObj[el],(x:any) => x?.idcw_reinv ? Number(x?.idcw_reinv) : 0);
    const curr_aum = Total__Count(grpObj[el],(x:any) => x?.curr_aum ? Number(x?.curr_aum) : 0);
    const totGainLoss = Total__Count(grpObj[el],(x:any) => x?.gain_loss ? Number(x?.gain_loss) : 0);
    const tot_ret_abs = Number(inv_cost) > 0 ? ((totGainLoss / inv_cost) * 100)?.toFixed(2) : 0;
    const xirr_amt_arr = [...all_amount_arr.reduce((acc, val) => acc.concat(val), []),Number(curr_aum.toFixed(2))];
    const xirr_date_arr = [...all_date_arr.reduce((acc, val) => acc.concat(val), []),data.date];
    // const xirr = XIRR(xirr_amt_arr,xirr_date_arr,0);
    // dt.push({
    //       id:grpObj[el][0]?.id,
    //       client_name:el,
    //       pan:grpObj[el].length > 0 ? grpObj[el][0].first_client_pan : '',
    //       inv_cost:inv_cost,
    //       idcw_paid:idcw_paid,
    //       idcw_reinv:idcw_reinv,
    //       curr_aum:curr_aum,
    //       gain_loss:totGainLoss,
    //       Investment:inv_cost,
    //       AUM:curr_aum,
    //       "IDCW Reinv.":idcw_reinv,
    //       "IDCWP":idcw_paid,
    //       "Abs. Return":tot_ret_abs,
    //       xirr:xirr,
    //       ret_abs:tot_ret_abs,
    //       schemes:grpObj[el].map(el => {
    //         const encryptedTxt = EncryptText(JSON.stringify({date:data?.date,pCode:el?.product_code}));
    //         const xirr_amt_arr = [...JSON.parse(el.all_amount_arr),Number(el.curr_nav)];
    //         const xirr_date_arr = [...JSON.parse(el.all_date_arr),Number(el.curr_nav)];
    //         const xirr = XIRR(xirr_amt_arr,xirr_date_arr,0);
    //         el.xirr = xirr;
    //         return {...el,routeUrl: encryptedTxt}
    //       }),
    //       total:{
    //         inv_cost:inv_cost,
    //         idcw_paid:idcw_paid,
    //         idcw_reinv:idcw_paid,
    //         curr_aum:curr_aum,
    //         abs_rtn:tot_ret_abs,
    //         scheme_name:"TOTAL",
    //         xirr:0
    //       }
    // }) 
  
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
      xirr_amt_arr:xirr_amt_arr,
      xirr_date_arr:xirr_date_arr,
      xirr:'Calculating...',
      ret_abs:tot_ret_abs,
      schemes:grpObj[el],
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

function XIRR(values, dates, guess) {
    var irrResult = function(values, dates, rate) {
      var r = rate + 1;
      var result = values[0];
      values.forEach((el,i) =>{
        if(i>0){
         result += values[i] / Math.pow(r, moment(dates[i]).diff(moment(dates[0]), 'days') / 365);
       }
      })
      return result;
    }

    // Calculates the first derivation
    var irrResultDeriv = function(values, dates, rate) {
      var r = rate + 1;
      var result = 0;
      values.forEach((el,i) =>{
        if(i>0){
        var frac = moment(dates[i]).diff(moment(dates[0]), 'days') / 365;
        result -= frac * values[i] / Math.pow(r, frac + 1);
      }
      })
      return result;
    }

    var guess = (typeof guess === 'undefined') ? 0.1 : guess;
    var resultRate = guess;
    var epsMax = 1e-10;
    var iterMax = 20;
    var newRate, epsRate, resultValue;
    var iteration = 0;
    var contLoop = true;
    do {
      resultValue = irrResult(values, dates, resultRate);
      newRate = resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
      epsRate = Math.abs(newRate - resultRate);
      resultRate = newRate;
      contLoop = (epsRate > epsMax) && (Math.abs(resultValue) > epsMax);
    } while(contLoop && (++iteration < iterMax));
    if(contLoop)return 0;
    return resultRate;
  }

