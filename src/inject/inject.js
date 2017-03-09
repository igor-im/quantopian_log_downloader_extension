console.log('hello from me')
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	debugger
	console.log('message recieved')
	if(request.getLogs) {
		console.log('starting extraction')
		var logCntr = document.getElementsByClassName('logs-container')[0]
		var btattr = logCntr.getAttribute('backtestid')
		var btid = bt.slice(9)
		
		function reqListener () {
			firstObj = JSON.parse(this.responseText)
			iterations = Math.ciel(obj.data.max_avail / 500)
			max = obj.data.max_avail
		}

		var oReq = new XMLHttpRequest();
		oReq.addEventListener("load", reqListener);
		oReq.open("GET", "https://www.quantopian.com/backtests/log_entries?backtest_id=" + btid + "&start=0&end=499");
		oReq.send();

		new Promise((resolve, reject) => {
				var oReq = new XMLHttpRequest();
				oReq.addEventListener("load", (v) => {
					resolve(JSON.parse(v.target.response).data)
				});
				oReq.open("GET", "https://www.quantopian.com/backtests/log_entries?backtest_id=" + btid + "&start=0&end=499");
				oReq.send();
			}).then((v) => {
				console.log(v)
				let iterations = Math.ceil(v.max_avail / 500)
				let firstObj = v.logs
				let max = v.max_avail
				var promises = []
				for(var i = 1; i < iterations; i++) {
					promises.push(new Promise((resolve, reject) => {
						var oReq = new XMLHttpRequest();
						oReq.addEventListener("load", (v) => {
							resolve(JSON.parse(v.target.response).data.logs)
						});
						oReq.open("GET", "https://www.quantopian.com/backtests/log_entries?backtest_id=" + btid + "&start=" + i * 500 + "&end=" + ((i * 500 + 499) < max ? (i * 500 + 499) : max));
						oReq.send();
					}))
				}
				Promise.all(promises).then(values => { 
									storage = [].concat.apply([], values);
									storage = firstObj.concat(storage)
									console.log(storage)
								})
			})

		
	}
});