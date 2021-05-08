// functions for calculationg ABV and percentage of apparent attenutation

export const calcAbv = (OG, FG) => {
    const abv = roundTwoPlaces((76.08*(OG-FG)/(1.775-OG))*(FG/0.794));
    
    return !isNaN(abv) ? `${abv.toFixed(2)}%`: '-';    
};

export const calcAppAttenuation = (OG ,FG) => {
    const AA =  roundTwoPlaces((OG - FG) / (OG - 1) * 100 );

    return !isNaN(AA) ? `${AA.toFixed(2)}%` : '-';
};

// rounding in JS is annoying
const roundTwoPlaces = num => Math.round(num * 100) / 100;