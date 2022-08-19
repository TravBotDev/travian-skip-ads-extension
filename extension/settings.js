function save_options() {
	var enabled = document.getElementById('enabled').checked;
	var debug = document.getElementById('debug').checked;
	var minPlaytime = document.getElementById('minPlaytime').value;
	var videoLookupPollRate = document.getElementById('videoLookupPollRate').value;
	var videoSkipPollRate = document.getElementById('videoSkipPollRate').value;
	
	chrome.storage.local.set({
		enabled: enabled,
		debug: debug,
		minPlaytime: minPlaytime,
		videoLookupPollRate: videoLookupPollRate,
		videoSkipPollRate: videoSkipPollRate
	}, function() {
		if (enabled) {
			chrome.action.setBadgeText({text: ' '});
			chrome.action.setBadgeBackgroundColor({color: '#23C552'});
			chrome.action.setTitle({title:"Disable ad skip"});
		} else {
			chrome.action.setBadgeText({text: ' '});
			chrome.action.setBadgeBackgroundColor({color: '#F84F31'});
			chrome.action.setTitle({title:"Enable ad skip"});
		}
		var status = document.getElementById('status');
		status.textContent = 'Saved';
		setTimeout(function() {
			status.textContent = '';
		}, 1200);
	});
}

function restore_options() {
	chrome.storage.local.get([
		"enabled",
		"debug",
		"minPlaytime",
		"videoLookupPollRate",
		"videoSkipPollRate"
	], function(data) {
		document.getElementById('enabled').checked = data.enabled;
		document.getElementById('debug').checked = data.debug;
		document.getElementById('minPlaytime').value = data.minPlaytime;
		document.getElementById('videoLookupPollRate').value = data.videoLookupPollRate;
		document.getElementById('videoSkipPollRate').value = data.videoSkipPollRate;
	});
}

function reset_options() {
	chrome.storage.local.set({
		"debug": false,
		"minPlaytime": 0.4,
		"videoLookupPollRate": 50,
		"videoSkipPollRate": 300
	});
	restore_options();
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('reset').addEventListener('click', reset_options);