let color,
	bordercol = '';
const loadDataChart = async function (cryptocurrency, days, token) {
	let ArrayXValues = [];
	let ArrayYValues = [];

	const urlHighMaxDaily = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${cryptocurrency}&tsym=EUR&limit=${days}`;
	const response = await fetch(urlHighMaxDaily, {
		headers: head,
	});

	const data = await response.json();

	for (let dataItem of data.Data.Data) {
		let unixTime = dataItem.time;
		let high = dataItem.high;

		dateObj = new Date(unixTime * 1000);

		dayNumber = dateObj.getDate();
		nameDay = days[dateObj.getDay()];
		nameMonth = months[dateObj.getMonth()];

		let stringTime = dayNumber + '/' + dateObj.getMonth();

		ArrayXValues.push(stringTime);
		ArrayYValues.push(high);
	}

	showChart(ArrayXValues, ArrayYValues, token);
};

const showChart = function (xValues, yValues, token) {
	var max =
		yValues.reduce(function (a, b) {
			return Math.max(a, b);
		}) * 1.05;
	var min =
		yValues.reduce(function (a, b) {
			return Math.min(a, b);
		}) * 1.1;

	var json = `{"jsonarray": [`;
	let i = 0;

	for (let value of xValues) {
		json += `{"Date": "${xValues[i]}",
                  "Value": "${yValues[i]}"},`;
		i++;
	}

	var cuttedjson = json.substring(0, json.length - 1);

	cuttedjson += ']}';

	var jsonData = JSON.parse(cuttedjson);

	var labels = jsonData.jsonarray.map(function (e) {
		return e.Date;
	});
	var data = jsonData.jsonarray.map(function (e) {
		return e.Value;
	});

	let pointOnly = [];
	for (const point of data) {
		pointOnly.push(null);
	}

	pointOnly.shift();
	pointOnly.push(data[data.length - 1]);

	let red = 'rgba(230, 11, 11, 0.7)';
	let green = 'rgba(68, 252, 58, 0.7)';

	let borderred = '#BA463F';
	let bordergreen = '#4A7461';

	if (token == '-') {
		color = red;
		bordercol = borderred;
	} else {
		color = green;
		bordercol = bordergreen;
	}

	var ctx = document.getElementById('myChart').getContext('2d');
	var gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
	gradientFill.addColorStop(0, color);
	gradientFill.addColorStop(1, 'transparent');

	var lineChart = new Chart(document.getElementById('myChart'), {
		animationEnabled: false,
		type: 'line',
		data: {
			labels: labels,
			datasets: [
				{
					data: data,
					borderColor: bordercol,
					backgroundColor: gradientFill,
					pointRadius: 0,
				},
				{
					data: pointOnly,
					borderColor: bordercol,
					borderWidth: 8,
					pointHitRadius: 5,
					backgroundColor: bordercol,
				},
			],
		},
		options: {
			legend: {
				display: false,
			},
			title: {
				display: false,
				text: 'World population per region (in millions)',
			},

			scales: {
				xAxes: [
					{
						gridLines: {
							color: 'rgba(0, 0, 0, 0)',
						},
						ticks: {
							fontColor: '#FFF',
						},
					},
				],
				yAxes: [
					{
						gridLines: {
							color: 'rgba(0, 0, 0, 0)',
						},
						ticks: {
							fontColor: '#FFF',
						},
					},
				],
			},
		},
	});
};
