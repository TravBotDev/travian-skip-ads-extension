chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.local.set({
		"enabled": true,
		"debug": false,
		"minPlaytime": 0.4,
		"videoLookupPollRate": 50,
		"videoSkipPollRate": 300
	});
	chrome.action.setBadgeText({text: ' '});
	chrome.action.setBadgeBackgroundColor({color: '#23C552'});
	chrome.action.setTitle({title:"Disable ad skip"});
});

chrome.action.onClicked.addListener((tab) => {
	chrome.storage.local.get("enabled", function(data) {
		chrome.storage.local.set({enabled: !data.enabled});
		chrome.storage.local.get("enabled", function(data2) {
			if (data2.enabled) {
				//chrome.action.setBadgeText({text: '✅'});
				chrome.action.setBadgeText({text: ' '});
				chrome.action.setBadgeBackgroundColor({color: '#23C552'});
				chrome.action.setTitle({title:"Disable ad skip"});
			} else {
				//chrome.action.setBadgeText({text: '❌'});
				chrome.action.setBadgeText({text: ' '});
				chrome.action.setBadgeBackgroundColor({color: '#F84F31'});
				chrome.action.setTitle({title:"Enable ad skip"});
			}
		});
	});
});