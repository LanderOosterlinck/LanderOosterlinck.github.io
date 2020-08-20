// ----------------------------------- VARS  ----------------------------------- //
let domSelect,
	domPercentage,
	domUpdated,
	domLow,
	domHigh,
	domButtons,
	domDesc = '',
	domLogo = '';

let selectedValue = 'BTC';

let dayscount = 7;

let token = '';

let valueYesterday,
	valueNow,
	percentage,
	volume = 0;

var days = ['Zon', 'Maa', 'Din', 'Woe', 'Don', 'Vrij', 'Zat'];
var months = [
	'Jan',
	'Feb',
	'Maa',
	'Apr',
	'Mei',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

const head = {
	authorization:
		'Apikey 1814a8f2aa30cde382ca2f7157dce2d42310aeeefdf0e6ffb6edf2d8878a3d11',
};

const getDOM = function () {
	domSelect = document.querySelector('.js-select');
	domPercentage = document.querySelector('.js-percentage');
	domUpdated = document.querySelector('.js-updated');
	domLow = document.querySelector('.js-low');
	domHigh = document.querySelector('.js-high');
	domButtons = document.querySelectorAll('.js-button');
	domLogo = document.querySelector('.js-logo');
	domDesc = document.querySelector('.js-omschrijving');
};

const enableListeners = function () {
	domSelect.addEventListener('change', function () {
		selectedValue = this.value;
		showData(selectedValue);

		if (selectedValue == 'BTC') {
			domLogo.src = 'img/bitcoin-logo.png';
			domDesc.innerHTML =
				'Bitcoin (afkorting BTC) is een cryptovaluta en een globaal betaalmiddel (als systeem wordt Bitcoin met een hoofdletter geschreven, als munteenheid vaak met een kleine letter). Het is de eerste gedecentraliseerde digitale munt die werkt zonder centrale bank of centrale beheerder.';
		}

		if (selectedValue == 'ETC') {
			domLogo.src = 'img/ethereum-classic.png';
			domDesc.innerHTML =
				'Ethereum Classic(afkorting ETC) is een open source, blockchain-gebaseerd distributie computing platform met smart contract (scripting) functionaliteit. Het ondersteunt een aangepaste versie van Nakamoto consensus via transactie-gebaseerd staat overgangen uitgevoerd op een publieke Ethereum Virtual Machine (EVM).';
		}

		if (selectedValue == 'ETH') {
			domLogo.src = 'img/ethereum-logo.png';
			domDesc.innerHTML =
				'Ethereum(afkorting ETH) is een opensourceplatform en miningnetwerk voor diverse cryptovaluta waaronder de ether. Dit decentraal netwerk is gebaseerd op het blockchain-concept.';
		}
	});

	for (let button of domButtons) {
		button.classList.remove('is-selected');
		button.addEventListener('click', function () {
			buttons = document.getElementsByClassName('c-link-cta');
			for (let clink of buttons) {
				clink.classList.remove('is-selected');
			}

			dayscount = button.getAttribute('data-value');
			loadDataChart(selectedValue, dayscount, token);
			button.childNodes[1].classList.add('is-selected');
		});
	}
};

const init = function () {
	getDOM();
	enableListeners();
	showData('BTC');
	domLogo.src = 'https://btcdirect.eu/media/1108/download/Bitcoin.png?v=1';
};

const showData = function (cryptocurrency, dayscount = '7') {
	loadPrices(cryptocurrency);
	loadDataUpdated(cryptocurrency);
	loadPricesHighLow(cryptocurrency);
};

const showPrices = function () {
	token = '';
	percentage = (1 - valueYesterday / valueNow) * 100;
	countUp(valueYesterday, valueNow, 'js-price');

	if (percentage < 0) {
		token = '-';
		domPercentage.setAttribute('style', 'color: var(--global-color-rood)');
	} else {
		token = '+';
		domPercentage.setAttribute('style', 'color: var(--global-color-groen)');
	}

	let test = 0.2;

	domPercentage.innerHTML =
		token + ' ' + Math.abs(percentage.toFixed(2)) + ' %';

	loadDataChart(selectedValue, dayscount, token);
};

const showLastUpdated = function (data, cryptocurrency) {
	let unixTime = data.RAW[cryptocurrency].EUR.LASTUPDATE;

	dateObj = new Date(unixTime * 1000);

	dayNumber = dateObj.getDate();
	nameDay = days[dateObj.getDay()];
	nameMonth = months[dateObj.getMonth()];
	hours = dateObj.getHours();
	min = dateObj.getMinutes();
	sec = dateObj.getSeconds();

	let stringUpdated =
		nameDay +
		' ' +
		dayNumber +
		' ' +
		nameMonth +
		' ' +
		hours +
		':' +
		min +
		':' +
		sec;

	domUpdated.innerHTML = stringUpdated;
};

const showRangeDaily = function (min, max) {
	domHigh.innerHTML = max.replace(',', ' ');
	domLow.innerHTML = min.replace(',', ' ');
};

const loadPrices = function (cryptocurrency) {
	const urlHighMaxDaily = `https://min-api.cryptocompare.com/data/price?fsym=${cryptocurrency}&tsyms=EUR`;

	fetch(urlHighMaxDaily, {
		headers: head,
	})
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			valueNow = data.EUR;
			loadHighLowPrices(cryptocurrency);
		});
};

const loadHighLowPrices = function (cryptocurrency) {
	const urlHighMaxDaily = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${cryptocurrency}&tsym=EUR&limit=10`;

	fetch(urlHighMaxDaily, {
		headers: head,
	})
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			valueYesterday = data.Data.Data[9].open;
			showPrices();
		});
};

const loadDataUpdated = function (cryptocurrency) {
	const urlHighMaxDaily = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrency}&tsyms=EUR`;

	fetch(urlHighMaxDaily, {
		headers: head,
	})
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			showLastUpdated(data, cryptocurrency);
		});
};

const loadPricesHighLow = async function (cryptocurrency) {
	const urlHighMaxDaily = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrency}&tsyms=EUR`;

	fetch(urlHighMaxDaily, {
		headers: head,
	})
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			showRangeDaily(
				data.DISPLAY[cryptocurrency].EUR.LOW24HOUR,
				data.DISPLAY[cryptocurrency].EUR.HIGH24HOUR
			);
		});
};

document.addEventListener('DOMContentLoaded', init);
