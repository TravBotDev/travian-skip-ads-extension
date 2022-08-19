{
	let prefix = "TravianSkipAds: ";
	
	const params = new URLSearchParams(document.currentScript.src.split('?')[1]);
	let minPlaytime = Number(params.get('mt'));
	let videoLookupPollRate = Number(params.get('pl'));
	let videoSkipPollRate = Number(params.get('ps'));
	let debug = params.get('d') === 'true';

	let playButton = document.querySelector(".atg-gima-big-play-button-outer");
	if (playButton) {
		playButton.click()	
	} else {
		trace("Failed to find play button, ad must be started manually!");
	}
	
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
	waitFor("video", videoLookupPollRate).then(videoStarted);
	
	function videoStarted() {
		function skipCycle(poll) {
		    return new Promise(function (resolve, reject) {
		        (function skipCycleImpl(){
					var videos = document.getElementsByTagName("video");
					for (i = 0; i < videos.length; i++) {
						trace("Processing video at time " + String(Date.now()));
						let video = videos[i];
						if (video) {
							if (video.src.includes("blank.mp4")) {
								trace("Blank video, not skipping." + video.src);
							} else
							if (!isNumber(video.duration)) {
								trace("Duration is NaN");
							} else
							if (!isNumber(video.currentTime)) {
								trace("Current time is NaN");
							} else {
								if (video.currentTime < video.duration) {
									if (video.currentTime > minPlaytime) {
										video.currentTime = video.duration + 1;	
									} else {
										trace("Too soon to skip ("+video.currentTime+")");
									}
								} else {
									trace("Video already skipped! ("+video.duration+")");
								}
							}
							trace(video.currentTime);
							if (debug) console.log(video);
						} else {
							trace("Video null");
						}
					}
		            setTimeout(skipCycleImpl, poll);
		        })();
		    });
		}
		skipCycle(videoSkipPollRate);
	}
	
	function trace(msg) {
		if (debug) {
			console.log(prefix + msg);
		}
	}
	
	function isNumber(n) {
		return typeof n == 'number' && !isNaN(n) && isFinite(n);
	}
}