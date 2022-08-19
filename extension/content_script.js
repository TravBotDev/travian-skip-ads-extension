/**
 * Travian Skip Ads Extension
 * By DUDSS, 18.08.2022
 */
 
chrome.storage.local.get([
	"enabled",
	"debug",
	"minPlaytime",
	"videoLookupPollRate",
	"videoSkipPollRate"
], function(data) {
	runScript(data);
});

function runScript(data) {
	if (data.enabled) {
		let debug = data.debug;
		let prefix = "TravianSkipAds: ";
		
		if (debug) console.log(prefix+"Hooked to frame. iframe: " + String(window.top !== window.self) + " url: " + window.location.href)	
		
		if (window.top !== window.self) {
			let url = window.location.href;
			let match = true;
			let keywords = [
				"media.oadts.com",
				"delivery",
				"afv.php"
			];
			for (const k of keywords) {
				if (!url.includes(k)) {
					match = false;
					break;
				}
			}
			if (match) {
				function waitFor(selector, poll = 50) {
				    return new Promise(function (resolve, reject) {
				        (function waitForImpl(){
				            if (document.querySelector(selector) != null) {
								return resolve();
							}
				            setTimeout(waitForImpl, poll);
				        })();
				    });
				}
				waitFor(".atg-gima-big-play-button-outer").then(videoLoaded);
				
				function videoLoaded() {
					if (debug) console.log(prefix+"Video loaded, url: " + window.location.href);
					function inject() {
						var s = document.createElement('script');
						s.src = chrome.runtime.getURL('inject.js?') + new URLSearchParams({
							mt: data.minPlaytime, 
							pl: data.videoLookupPollRate,
							ps: data.videoSkipPollRate,
							d: data.debug
						});
						s.onload = function() {
						    this.remove();
						};
						(document.head || document.documentElement).appendChild(s);
					}
					inject()
				}
			} else {
				if (debug) console.log(prefix+"No match");
			}
		}
	}
}

//https://media.oadts.com/www/delivery/afv.php?zoneid=3716&vrid=MzYzNV8yMjg2N180XzJfNl8yNF8xNjYwODIzNjgy&cb=1660823682&loc=http%3A%2F%2Ftravian.com%2Fbuild.php