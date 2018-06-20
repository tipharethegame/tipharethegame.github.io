Synth = function (type)
{
	if (!(type in Synth.Types)) throw 'Synth has no "' + type + '"';
	
	this.Gain = Sound.AC.createGain();
	this.Gain.gain.value = 0;
	this.Gain.connect(Sound.MasterGain);
	
	Synth.Types[type].call(this);
}


StandardOsc = function (type)
{
	this.Gen = Sound.AC.createOscillator();
	this.Gen.type = type;
	this.Gen.connect(this.Gain);
}


Synth.Types =
{
	Square: function () { StandardOsc.call(this, 'square') },
	Sawtooth: function () { StandardOsc.call(this, 'sawtooth') },
	
	Noise: function ()
	{
		var blen = Sound.AC.sampleRate * 1;
		var buffer = Sound.AC.createBuffer(1, blen, Sound.AC.sampleRate);
		var data = buffer.getChannelData(0);
		for (var i = 0; i < blen; i++) data[i] = Math.random() * 2 - 1;
		
		this.Gen = Sound.AC.createBufferSource();
		this.Gen.buffer = buffer;
		this.Gen.loop = true;
		
		this.Gen.connect(this.Gain);
	}
}


Synth.prototype.SetVolume = function (vol)
{
	this.Gain.gain.setValueAtTime(vol, 0);
}

Synth.prototype.SetFrequency = function (frq)
{
	if (!this.Gen.frequency) return;
	
	this.Gen.frequency.setValueAtTime(frq, 0);
}

Synth.prototype.Start = function ()
{
	this.Gen.start(0);
}

Synth.prototype.Stop = function ()
{
	this.Gen.stop(0);
}

Synth.prototype.Destroy = function ()
{
	this.Gen.stop(0);
}
