const countryProps = {
    poland: {
        article: 'poland',
        name: 'Польша',
        documentTitle: 'Необходимые документы<br> для Польской визы',
        documentLink: '#doc-pl',
        price: {
            adult: 1500,
            child: 1000,
            baby: 1000,
            insuranceAdult: 600,
            insuranceBaby: 1800,
            fees: 3400
        }
    },
    france: {
        article: 'france',
        name: 'Франция',
        documentTitle: 'Необходимые документы<br> для Французской визы',
        documentLink: '#doc-fr',
        price: {
            adult: 1500,
            child: 1000,
            baby: 1000,
            insuranceAdult: 600,
            insuranceBaby: 1800,
            fees: 5150
        }
    },
    germany: {
        article: 'germany',
        name: 'Германия',
        documentTitle: 'Необходимые документы<br> для Немецкой визы',
        documentLink: '#doc-de',
        price: {
            adult: 1500,
            child: 1000,
            baby: 1000,
            insuranceAdult: 600,
            insuranceBaby: 1800,
            fees: 3900
        }
    },
    italy: {
        article: 'italy',
        name: 'Италия',
        documentTitle: 'Необходимые документы<br> для Итальянской визы',
        documentLink: '#doc-it',
        price: {
            adult: 1500,
            child: 1000,
            baby: 1000,
            insuranceAdult: 600,
            insuranceBaby: 1800,
            fees: 5300
        }
    },
    usa: {
        article: 'usa',
        name: 'США',
        documentTitle: 'Необходимые документы<br> для визы в США',
        documentLink: '#doc-us',
        price: {
            adult:  3000,
            child: 1000,
            baby: 1000,
            insuranceAdult: 600,
            insuranceBaby: 1800,
            fees: 12000
        }
    },
    unitedKingdom: {
        article: 'unitedKingdom',
        name: 'Великобритания',
        documentTitle: 'Необходимые документы<br> для Английской визы',
        documentLink: '#doc-gb',
        price: {
            adult:  3000,
            child: 1000,
            baby: 1000,
            insuranceAdult: 600,
            insuranceBaby: 1800,
            fees: 8500
        }
    },
    china: {
        article: 'china',
        name: 'Китай',
        documentTitle: 'Необходимые документы<br> для Китайской визы',
        documentLink: '#doc-ch',
        price: {
            adult:  1500,
            child: 1000,
            baby: 1000,
            insuranceAdult: 600,
            insuranceBaby: 1800,
            fees: 5300
        }
    },
};


let country = countryProps.poland; 	            // выбранная страна
let adults = 0; 		                        // количество взрослых
let children = 0; 		                        // количество детей
let babies = 0;	                                // количество младенцев
let insuranceNeeded = true;	                    // страховка по умолчанию требуется
let filing = true;                              // подача документов по умолчанию требуется

let costs = {			                        // объект с интерактивными переменными
    base: 0,
    insurance: 0,
    filing: 0,
    fees: 0
};

insuranceCounting = () => {
    let insurancePrice = 0;
    insurancePrice += adults * country.price.insuranceAdult;
    insurancePrice += children * country.price.insuranceAdult;
    insurancePrice += babies * country.price.insuranceBaby;
    return insurancePrice
};

Object.defineProperty(costs, 'base', {
    get: () => {
        let basePrice = 0;
        basePrice += adults * country.price.adult;
        basePrice += children * country.price.child;
        basePrice += babies * country.price.baby;
        return basePrice

    },
});

Object.defineProperty(costs, 'insurance', {
    get: () => {
        if(insuranceNeeded){
            return insuranceCounting()
        } else {
            return '-';
        }
    },
});
Object.defineProperty(costs, 'filing', {
    get: () => {
        if(filing) {
            return 1000;
        } else {
            return '-';
        }
    },
});
Object.defineProperty(costs, 'fees', {
    get: () => {
        return country.price.fees
    },
});

document.getElementById('adultsNum').value = 0;
document.getElementById('childrenNum').value = 0;
document.getElementById('babiesNum').value = 0;

document.getElementById('vzr-on').checked = false;
document.getElementById('doc-submit').checked = true;



document.getElementById('poland').innerHTML = document.getElementById('poland').innerHTML + countryProps.poland.name;
document.getElementById('france').innerHTML = document.getElementById('france').innerHTML + countryProps.france.name;
document.getElementById('germany').innerHTML = document.getElementById('germany').innerHTML + countryProps.germany.name;
document.getElementById('italy').innerHTML = document.getElementById('italy').innerHTML + countryProps.italy.name;
document.getElementById('usa').innerHTML = document.getElementById('usa').innerHTML + countryProps.usa.name;
document.getElementById('unitedKingdom').innerHTML = document.getElementById('unitedKingdom').innerHTML + countryProps.unitedKingdom.name;
document.getElementById('china').innerHTML = document.getElementById('china').innerHTML + countryProps.china.name;


const countryChoice = (element) => {
    document.getElementById(country.article).setAttribute('class', 'btn');
    document.getElementById(element).setAttribute('class', 'btn active');
    country = countryProps[element];
    document.getElementById('headText').innerHTML = country.name;
    document.getElementById('modalDocsList').setAttribute('data-target', country.documentLink);
    document.getElementById('modalDocsList').innerHTML = country.documentTitle;
    if (country.article === 'france' || country.article === 'italy' || country.article === 'germany') {
        document.getElementById('filingDiv').setAttribute('class', "col-12 mt-4");
        document.getElementById('filingPriceDiv').removeAttribute('class');
        filing = document.getElementById('doc-submit').valueOf().checked
    } else {
        document.getElementById('filingDiv').setAttribute('class', "col-12 mt-4 off");
        document.getElementById('filingPriceDiv').setAttribute('class', "off");
        filing = false
    }
    sum();
};

const numChange = (num, type) => {
    switch (type){
        case 'adults':
            adults = num;
            break;
        case 'children':
            children = num;
            babiesHandler();
            childrenCountUpdateOnBabiesCount(babies);
            break;
        case 'babies':
            babies = num;
            childrenCountUpdateOnBabiesCount(num);
            break;
    }
    sum()
};

const toggle = (variable) => {
    switch (variable) {
        case 'insuranceNeeded':
            insuranceNeeded = !insuranceNeeded;
            break;
        case 'filing':
            filing = !filing;
            break;
    }
    sum()
};

const sum = () => {
    document.getElementById('basePrice').innerHTML = `${costs.base} руб.`;
    document.getElementById('insurancePrice').innerHTML = typeof(costs.insurance) !== 'number' ? costs.insurance : `${costs.insurance} руб.`;
    document.getElementById('filingPrice').innerHTML = typeof(costs.filing) !== 'number' ? costs.filing : `${costs.filing} руб.`;
    document.getElementById('feesPrice').innerHTML = `${costs.fees * (parseInt(adults) + parseInt(children) + parseInt(babies))} руб.`;
    document.getElementById('amount').innerHTML = `${
        costs.base + 
        (typeof(costs.insurance) !== 'number' ? 0 : costs.insurance) + 
        (typeof(costs.filing) !== 'number' ? 0 : costs.filing) +
        costs.fees * (parseInt(adults) + parseInt(children) + parseInt(babies))
    } руб.`;
};

const babiesHandler = () => {
    document.getElementById('babiesCountDiv').setAttribute('class', children < 1 ? "col-6 col-lg-3 off" : "col-6 col-lg-3");
};

const childrenCountUpdateOnBabiesCount = (num) => {
    let childrenNumber = document.getElementById('childrenNum').valueOf().value;
    if (num > childrenNumber) {
        babies = childrenNumber;
        document.getElementById('babiesNum').valueOf().value = childrenNumber;
    }
    children = childrenNumber - num > 0     ? childrenNumber - num : 0;
};

countryChoice('poland')
babiesHandler();
sum();


