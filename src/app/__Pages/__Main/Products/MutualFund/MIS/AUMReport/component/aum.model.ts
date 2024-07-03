export interface IAumFooterModel{
    id:number | undefined;
    Investment: number | undefined;
    AUM:number | undefined;
    "IDCW Reinv":number | undefined;
    IDCW:number | undefined;
    "Abs.Return":number | undefined;
    Equity:number| undefined;
    Debt:number | undefined;
    Hybrid:number | undefined;
    "Sol Oriented":number | undefined;
    "Others":number | undefined;
}

export const AUM_API ={
    "Fund House": 'aum',
    "Scheme":'aum_scheme',
    "Client":'aum_client',
    "Family":'aum_family'
}