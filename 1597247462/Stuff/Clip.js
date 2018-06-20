Clip = function (id)
{
	this.ID = id;
	var snd = this;
	
	
	this.Gain = Sound.AC.createGain();
	this.Gain.connect(Sound.MasterGain);
	
	
	this.Loop = function (start, end)
	{
		this.Looped = true;
		this.LoopStart = start;
		this.LoopEnd = end;
		
		this.Play();
	}
	
	this.Play = function ()
	{
		this.Stop();
		
		this.BufferSource = Sound.AC.createBufferSource();
		this.BufferSource.onended = function () { snd.BufferSource = null; }
		this.BufferSource.buffer = this.Buffer;
		this.BufferSource.connect(this.Gain);
		
		this.BufferSource.loop = this.Looped || false;
		this.BufferSource.loopStart = this.LoopStart || 0;
		this.BufferSource.loopEnd = this.LoopEnd || this.Buffer.duration;
		
		this.BufferSource.start(0);
	}
	
	this.Stop = function ()
	{
		if (this.BufferSource)
		{
			this.BufferSource.disconnect();
			this.BufferSource = null;
		}
	}
	
	
	this.SetVolume = function (vol)
	{
		this.Gain.gain.value = vol;
	}
	
	
	this.Realize = function ()
	{
		SetReady(this.ID, this);
	}
	
	this.Dispose = function ()
	{
		this.Gain.disconnect();
		this.Stop();
	}
	
	
	var ajax = new XMLHttpRequest();
	ajax.responseType = 'arraybuffer';
	
	ajax.onload = function ()
	{
		Sound.AC.decodeAudioData (this.response, function (buffer) {
			
			snd.Buffer = buffer;
			SetLoaded(snd.ID, snd);
			
		});
	}
	
	ajax.onerror = function ()
	{
		console.error(snd.ID);
	}
	
	ajax.open('GET', IdToSrc(id));
	ajax.send();
}
