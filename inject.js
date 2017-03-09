console.log('starting extraction')
var logCntr = document.getElementsByClassName('logs-container')[0]
var btattr = logCntr.getAttribute('backtestid')
var btid = btattr.slice(9)

function parseLogString(logString) {
    var str = logString.replace(new RegExp("u'", 'g'), "'")
    str = str.replace(new RegExp("'", 'g'), '"')
    str = str.replace(new RegExp("False", 'g'), 'false')
    str = str.replace(new RegExp("True", 'g'), 'true')
    // var output = {}
    // output.body = JSON.parse(str.slice(str.indexOf('{')))
    try { 
		return JSON.parse(str) 
    } 
    catch(e) {
		return {
			message: str
		}
    }
}

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
                        let newStor = storage.map((v) => {
                            let msg = parseLogString(v.m)
                            let ts = v.a
							return {
								timestamp: ts,
								log: msg
							}
                        })
						console.log(newStor)
					})
})