/*jshint strict:false, browser:true */
/*global XMLHttpRequest:true, XDomainRequest:true, printStackTrace:true */

var baseUrl, projectId;

function createCORSRequest(method, url) {
	var xhr = new XMLHttpRequest();
	if ("withCredentials" in xhr) {
		xhr.open(method, url, true);
	} else if (typeof XDomainRequest !== "undefined") {
		xhr = new XDomainRequest();
		xhr.open(method, url);
	} else {
		xhr = null;
	}
	return xhr;
}


function logConsoleError() {
	if (window.console && window.console.error) {
		console.error(arguments);
	}
}


function logError(error) {
	var xhr = createCORSRequest('POST', baseUrl + projectId);
	if (!xhr) {
		throw new Error('CORS not supported');
	}

	var params = {
		error      : error.message,
		url        : error.filename,
		lineNumber : error.lineno
	};

	//Send the proper header information along with the request
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(JSON.stringify(params));
}


// Get logging endpoint from own base url
var scripts = document.getElementsByTagName('script');
for (var i = 0, len = scripts.length; i < len; i++) {
	if (scripts[i].src.lastIndexOf('fugu.errorlogger.js') !== -1) {
		baseUrl = scripts[i].src.split('fugu.errorlogger.js')[0] + 'logging/';
		break;
	}
}

if (!baseUrl) {
	return logConsoleError('[Fugu] Could not determine logging API endpoint.');
}

// Check for project ID
if ( window._fugu ) {
	for (var i = 0, len = window._fugu.length; i < len; i++) {
		if (window._fugu[i].length === 2 && window._fugu[i][0] === 'projectId') {
			projectId = window._fugu[i][1];
		}
	}
}

if (!projectId) {
	return logConsoleError('[Fugu] No project ID defined for error logging.');
}


// Attach event handler to window obect
if (window.addEventListener) {
	window.addEventListener('error', logError, false);
} else if (window.attachEvent) {
	window.attachEvent('onerror', logError);
} else {
	logConsoleError('[Fugu] Could not attach error logger.');
}
