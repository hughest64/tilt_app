/**
 * brewing and fermentation related calculations
 */

// rounding in JS is annoying
const jsCantRound = (num, places) => Math.round(num * Math.pow(10, places)) / Math.pow(10, places);

export const calcAbv = (OG, FG) => {
    const abv = jsCantRound((76.08*(OG-FG)/(1.775-OG))*(FG/0.794), 2);
    
    return !isNaN(abv) ? `${abv.toFixed(2)}%`: '-';    
};

export const calcAppAttenuation = (OG ,FG) => {
    const AA =  jsCantRound((OG - FG) / (OG - 1) * 100, 2 );

    return !isNaN(AA) ? `${AA.toFixed(2)}%` : '-';
};

// conversion formulas are from https://www.vinolab.hr/calculator/gravity-density-sugar-conversions-en19
// sg to brix = 143.254 * sg**3 - 648.670 * sg**2 + 1125.805 * sg - 620.389
export const sgToBrix = (sg) => {
    const brix = jsCantRound(143.254 * Math.pow(sg, 3) - 648.670 * Math.pow(sg, 2) + 1125.805 * sg - 620.389, 1);

    return !isNaN(brix) && brix > 0 ? brix : '';
};

// brix to sg = 0.00000005785037196 * brix**3 + 0.00001261831344 * brix**2 + 0.003873042366 * brix + 0.9999994636
// current specific gravity from brix when alcohol is present
// https://www.vinolab.hr/calculator/monitor-ferment-from-refractometer-readings-en28
//cg = 1.001843 - 0.002318474 *ib - 0.000007775 *ib2 - 0.000000034 * ib3 + 0.00574 *cb + 0.00003344 * cb2 + 0.000000086 *cb3
export const brixToSg = (brix, ibrix, has_alcohol) => {
    let sg;
    if (!has_alcohol) {
        sg = jsCantRound(
            0.00000005785037196 * Math.pow(brix, 3) + 0.00001261831344
            * Math.pow(brix, 2) + 0.003873042366 * brix + 0.9999994636, 3
        ).toFixed(3);
    } else {
        sg = jsCantRound(
            1.001843 - 0.002318474 * ibrix - 0.000007775 * Math.pow(ibrix, 2) - 0.000000034 * Math.pow(ibrix, 3)
            + 0.00574 * brix + 0.00003344 * Math.pow(brix, 2) + 0.000000086 * Math.pow(brix, 3), 3
        ).toFixed(3);
    }

    return !isNaN(sg) && ibrix !== '' ? sg : '';
};
