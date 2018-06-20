Sound = {
	AC: new (
		window.AudioContext || window.webkitAudioContext
	)
};

Sound.MasterGain = Sound.AC.createGain();
Sound.MasterGain.connect(Sound.AC.destination);
Sound.MasterGain.gain.value = Config.Get('VOLUME', 0.25);