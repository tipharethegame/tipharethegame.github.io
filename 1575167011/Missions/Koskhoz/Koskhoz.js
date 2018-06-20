@ = function ()
{
	'''/Common/Zone'''.call(this, 'Bykonur');
	this.Guide = new '''/Common/Guide''' ('''Guide.png''');
	
	let b = 1008;
	
	this.Wraps = [
		new '''/Common/Zone'''.Wrap(this, 0, 600, 3200, Infinity, { FixY: 2880 }),
		new '''/Common/Zone'''.Wrap(this, 3360, 0, 3360+320, 240, { FixX: 3360+320/2, FixY: 0+240/2 }),
	];
	
	this.Launch = function () {
		
		this.Rocket.VY = 0;
		this.Rocket.Accel = 30;
		
		this.FocusOffset = { X: 0, Y: 0 };
		
		this.Rocket.Process = function (zone) {
			this.VY -= Clock.Factor * this.Accel;
			Box.PutAtY(this, this.Y + this.VY * Clock.Factor);
			zone.FocusOffset.X += Randge(-1, +1);
		};
		
		this.Player.Gone = true;
		this.Win("Docking", { WinMusic: false, Wait: 3 });
		'''Launch.ogg'''.Play();
	};
	
	this.AddAll([
		
		new '''/Common/Zone'''.Plane(this, '''Back.png''', { Z: -Infinity }),
		new '''/Common/Decal'''(1888, 944, '''TubeF.png''', { Z: +10 }),
		
		new '''/Objects/Dropship/''' (this, 64, b - 160),
		this.Player = new '''/Objects/Tiphareth/''' ( this,
			Config.Get('INSX', 100), Config.Get('INSY', b - 96)
		),
		
		new '''Vatnik''' (this, 600, b),
		
		new '''/Common/Spawner''' (this, 724, 968, '''Vodka''', 2, { OnScreen: true }),
		new '''/Common/Spawner''' (this, 752, b, '''Vatnik''', 4, { Limit: 5 }),
		
		new '''Swine''' (this, 1120, b),
		
		new '''/Common/Spawner''' (this, 1368, b - 40, '''Vodka''', 2, { OnScreen: true }),
		new '''/Common/Spawner''' (this, 1440, b, '''Vatnik''', 4, { Limit: 5 }),
		new '''/Common/Spawner''' (this, 1516, b - 40, '''Vodka''', 2, { OnScreen: true }),
		
		new '''Swine''' (this, 1760, b),
		new '''Swine''' (this, 2080, b),
		
		new '''/Common/Spawner''' (this, 2328, b - 40, '''Vodka''', 2, { OnScreen: true }),
		new '''/Common/Spawner''' (this, 2400, b, '''Vatnik''', 4, { Limit: 5 }),
		new '''/Common/Spawner''' (this, 2478, b - 40, '''Vodka''', 2, { OnScreen: true }),
		
		new '''Swine''' (this, 2720, b),
		new '''Swine''' (this, 3040, b),
		
		new '''Pop''' (this, 3720, 3720+88, 936),
		new '''Pop''' (this, 3376, 3376+288, 880),
		new '''Pop''' (this, 3376, 3376+72, 720),
		new '''Pop''' (this, 3592, 3592+72, 720),
		new '''Pop''' (this, 3440, 3440+160, 640),
		new '''Pop''' (this, 3376, 3376+72, 520),
		new '''Pop''' (this, 3376, 3376+144, 312),
		new '''Pop''' (this, 3520, 3520+144, 312),
		
		this.Rocket = new '''/Common/Decal''' (3464, 0, '''Rocket.png''', { Z: -10 }),
		new '''/Common/Decal''' (3464, 0, '''Pad.png''', { Z: -1 }),
		
		new '''/Common/Trigger''' ( this,
			3512, 184, 3512+16, 184+32, this.Launch,
			new Sprite('''Door.png''')
		),
		
	]);
	
	(this.Music = '''Insurrection.ogg''').Loop(60 + 45.8);
}
