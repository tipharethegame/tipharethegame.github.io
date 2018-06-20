@ = function ()
{
	'''/Common/Zone'''.call(this, 'Vperde');
	
	
	this.Guide = new '''/Common/Guide''' ('''Vperde.Guide.png''');
	
	var v = this;
	
	this.SamplesCount = 5;
	this.SamplesCollected = 0;
	
	this.Wind = { X: -25, Y: 0 };
	
	this.CollectSample = function ()
	{
		this.SamplesCollected++;
		
		this.Add (
			new '''/Common/Overhead''' ( this, '''Sample.png''',
				this.SamplesCollected + "/" + this.SamplesCount
			)
		);
		
		'''/Common/Got.ogg'''.Play();
		
		if (this.SamplesCount <= this.SamplesCollected)
		{
			this.SummonBoss();
		}
	}
	
	this.AddAll([
		
		this.Player = new '''/Objects/Tiphareth/''' ( this,
			Config.Get('INSX', 128+264), Config.Get('INSY', 128)
		),
		
		new '''/Common/Zone'''.Plane(this, '''Vperde.Train.png''', { Z: -5 }),
		
		new '''/Common/Randscape''' (this, '''Vperde.Close.png''', [ 160, 320, 480, 640 ], -1024, -98, 200),
		new '''/Common/Randscape''' (this, '''Vperde.Zabory.png''', [ 96, 232, 304, 368, 440, 504, 536 ], -512, -99, 80, 200),
		new '''/Common/Randscape''' (this, '''Vperde.Korovniki.png''', [ 320, 640, 960, 1280 ], -128, -100, 56, 104),
		new '''/Common/Randscape''' (this, '''Vperde.Horizon.png''', [ 112, 248, 384, 520, 640 ], -16, -Infinity),
		
		new '''/Objects/Dropship/''' (this, 180+264, 64, { Velocity: { X: +24, Y: +8 }, DirX: +1 }),
		
		new '''Hozmat''' (this, 528+264, 232),
		new '''Hozmat''' (this, 1440+264, 233),
		
		new '''Hozmat''' (this, 2144+264, 144),
		new '''Hozmat''' (this, 2216+264, 232),
		new '''Hozmat''' (this, 2288+264, 144),
		new '''Hozmat''' (this, 2360+264, 232),
		new '''Hozmat''' (this, 2432+264, 144),
		
		new '''Bloop''' (this, 784+264, 128),
		new '''Bloop''' (this, 1432+264, 128),
		new '''Bloop''' (this, 1968+264, 128),
		new '''Bloop''' (this, 2896+264, 128),
		new '''Bloop''' (this, 3120+264, 128),
	]);
	
	
	'''Doors'''.Put(this, 168+264, 168);
	'''Doors'''.Put(this, 480+264, 168, true);
	'''Doors'''.Put(this, 1664+264, 168);
	'''Doors'''.Put(this, 2592+264, 168);
	'''Doors'''.Put(this, 3352+264, 168);
	
	
	this.BaseRender = this.Render;
	this.Render = function ()
	{
		for (var ti in this.Things)
		{
			var t = this.Things[ti];
			
			if (t.T >= this.Guide.Raster.H)
			{
				if (t.Fall) t.Fall();
				t.Gone = true;
			}
		}
		
		this.BaseRender();
	}
	
	
	this.Music = '''Vperde.ogg''';
	this.Music.Loop(13.295);
	
	this.SummonBoss = function ()
	{
		this.Music.Stop();
		this.Music = '''Vperde.Boss.ogg''';
		this.Music.Loop(2.65);
		
		this.Add(this.BDim = new '''/Common/Zone'''.Dimmer(1, 0.25, 4, -10));
		
		this.Boss = new '''Bronepoezd''' (this.Player);
		this.Add(this.Boss);
	}
	
	
	this.Complete = function ()
	{
		this.BDim.Gone = true;
		this.Add(new '''/Common/Zone'''.Dimmer(0.25, 1, 1, -10));
		
		Delay (
			this, 2,
			function () {
				this.Add(
					new '''/Objects/Dropship/''' (
						this, this.Player.X - 256, -128,
						{ Evac: { X: this.Player.X, Y: 64 }, DirX: +1 }
					)
				)
			}
		);
		
		this.Win('/Missions/Vpizdu/Briefing');
	}
	
	if (Config.Get('BOSS', false)) this.SummonBoss(); /////
}
