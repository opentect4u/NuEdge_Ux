import { client } from 'src/app/__Model/__clientMst';
import { column } from 'src/app/__Model/tblClmns';

type getClientMstData = () => void; // function for getting client master data
type getClientTypeMst = () => void; // function for getting client type which are shown in tab
type getItems = (items: client, flag: string) => void; //function for set selected items on input field after search and select
type getstate = () => void; //function for getting state master
type getdistrict = (state_id:common[]) => void; //function for getting dtsrict master against state
type getcity = (dist_id:common[]) => void; //function for getting city master against dtsrict


export class clType {
  id: number; /*** Unique Indentifier*/
  type: string; /*** Short Code of type e.g: Minor => M, Existing => E, Pan Holder => P ,Non Pan Holder => N */
  tab_name: string; /**** Type of client   e.g: Minor , Existing , Pan Holder ,Non Pan Holder*/
  img_src: string;
}

export class filterType {
  label: string;
  value: string;
  icon: string;
}

export class common{
  id:number;
  name:string;
}

export class month{
  id:number;
  month:string;
}

export class cityType{
   id:string;
   city_type:string;
}

export interface ICmnRptDef {
  /**
   * getting Client Master Data
   */
  clientMst: client[];

  /**
   * showing loader spinner while search
   */
  isClientPending: boolean;

  /**
   * for showing or hiding the searchable dropdown
   */
  displayMode_forClient: string;

  /**
   * getting Client Master Data
   */
  clientTypeMst: clType[];

  /**
   * getting Filter Type e.g advance or reset
   */
  filterType: filterType[];

  /**
   * getting city type
   */
  citytype:cityType[]

  /**
   * getting state Master
   */
   stateMst:common[];

  /**
  * getting district Master
  */
   distMst:common[];

  /**
  * getting city Master
  */
   cityMst:common[];

  /**
   * DOB / DOA AS PER MONTH DROPDOWN DATA
   */
  dob_doa_month:month[];

   /**
   * Holding columns as per client type and options
   */
  __columns: column[];

 /**
   * Holding all columns
   */
  ClmnList: column[];

   /**
   * Holding all columns for exported table
   */
  __exportedClmns: string[]


  /**
   * Function declaration for getting Client Master Data
   */
  getClientMstData: getClientMstData;

  /**
   * Function declaration for set selected items on input field after search and select
   */
  getItems: getItems;

 /**
  * Function declaration for get state from backend API
  */
  getstate:getstate;


 /**
  * Function declaration for get state from backend API
  */
 getdistrict:getdistrict;

  /**
  * Function declaration for get city from backend API
  */
  getcity:getcity;

}

/**
  * Common Function declaration for Stringify array
  */
export function getStringifyDT(arr:common[]):string
