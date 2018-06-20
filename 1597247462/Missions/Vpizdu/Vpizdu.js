@ = function ()
{
	'''/Common/Zone'''.call(this, 'Vpizdu');
	
	this.Guide = new '''/Common/Guide''' ('''Vpizdu.Guide.png''');
	this.Wind = { X: +30, Y: -30 };
	
	this.CustomGameOverText = "F A C T S\n\nL O G I C";
	
	this.Wraps = [
		new '''/Common/Zone'''.Wrap (this, 1920, 240, 1920+320, 240+1568, { FixX: 2080 }),
		new '''/Common/Zone'''.Wrap (this, 1920, 0, 1920+320, 240, { FixX: 2080, FixY: 120 }),
	];
	
	this.StartBoss = function ()
	{
		this.RemoveAll(this.PreBossStuff);
		
		this.Music.Stop();
		this.Music = '''/Common/Boss.ogg''';
		this.Music.Loop(1.5);
		
		this.Megalobster = this.Add(new '''Megalobster''' (this, 2080, 232));
		
		this.LobsL = this.Add(new '''/Common/OffScrSpawner''' (this, '''Lobster''', { T: 3, Min: 240-8, Max: 240-8, Edge: 'L' }));
		this.LobsR = this.Add(new '''/Common/OffScrSpawner''' (this, '''Lobster''', { T: 3, Min: 240-8, Max: 240-8, Edge: 'R' }));
		
		this.Player.OnDeath = function () { this.Zone.Megalobster.Deactivate(); }
	}
	
	this.Lifts = [
		new '''Lift''' (this, 1944, 1808, 2020, 320),
		new '''Lift''' (this, 2016, 1808, 2020, 320),
		new '''Lift''' (this, 2088, 1808, 2020, 320),
		new '''Lift''' (this, 2160, 1808, 2020, 320),
	];
	
	this.B2 = new '''/Common/Zone'''.Plane (this,
		'''Vpizdu.B2.png''',
		{ Z: -22, MX: 0.25, OX: 800, MY: 1 }
	);
	
	this.PreBossStuff = [
		
		new '''/Objects/Dropship/''' (this, 64, 1860),
		
		new @.BackLobster(this.B2, 1280, 1924 - 16),
		
		new '''/Common/Spawner''' (this, null, null, @.Shockwave, 8, { MinT: 2, MaxT: 15 }),
		
		new '''/Common/Decal''' (224, 1840, '''WinFire.png''', { N: 2, T: 0.1 }),
		new '''/Common/Decal''' (448, 1896, '''WinFire.png''', { N: 2, T: 0.1 }),
		
		new '''/Common/Decal''' (1336, 1896, '''BrokenScreen.png''', { N: 3, T: 0.05, Vertical: true }),
		new '''/Common/Decal''' (1640, 1896, '''WashYourPenis.png''', { N: 4, T: 0.25 }),
		
		new '''/Common/Smoke''' (this, 72, 1896, 24, 32, -1),
		new '''/Common/Smoke''' (this, 224, 1840, 24, 32, -1, 0.1),
		new '''/Common/Smoke''' (this, 448, 1896, 24, 32, -1, 0.1),
		new '''/Common/Smoke''' (this, 488, 1896, 24, 32, -1),
		new '''/Common/Smoke''' (this, 352, 1952, 24, 32, -1),
		new '''/Common/Smoke''' (this, 8, 2024, 48, 16, 0, 2),
		new '''/Common/Smoke''' (this, 760, 2024, 48, 16, 0, 2),
		new '''/Common/Smoke''' (this, 336, 1880, 16, 16, -1),
		
		new '''/Common/OffScrSpawner''' (this, '''Lobster''', { T: 2, Min: 2032, Max: 2032, Edge: 'L' }),
		new '''/Common/OffScrSpawner''' (this, '''Motordyke''', { T: 2, Min: 2034, Max: 2034, Edge: 'R' }),
		
		new '''AsexBomb''' (this, 1460, 1880),
		new '''AsexBomb''' (this, 1608, 1928),
		new '''AsexBomb''' (this, 1760, 1808),
		
		new '''/Common/Zone'''.Plane(this, '''Vpizdu.B1.png''', { Z: -11, MX: 0.5, OX: 400, MY: 1 }),
		new '''/Common/Zone'''.Plane(this, '''Vpizdu.Front.png''', { Z: +666 }),
	];
	
	this.AddAll([
		
		this.Player = new '''/Objects/Tiphareth/''' ( this,
			Config.Get('INSX', 128), Config.Get('INSY', 1960)
		),
		
		this.B2,
		
		new '''/Common/Zone'''.Plane(this, '''Vpizdu.Back.png''', { Z: -2 }),
		new '''/Common/Trigger''' (this, 1920, 0, 1920+320, 240, this.StartBoss),
	]);
	
	this.AddAll(this.PreBossStuff);
	this.AddAll(this.Lifts);
	
	this.Music = '''Vpizdu.ogg''';
	this.Music.Loop(8.574);
}


@.Shockwave = function (zone)
{
	'''Thunder.ogg'''.Play();
	
	var stren = this.RemStren = 10;
	var time = this.RemTime = 1;
	
	this.Process = function ()
	{
		zone.Player.Focus.X += Randge(-this.RemStren, +this.RemStren);
		zone.Player.Focus.Y += Randge(-this.RemStren, +this.RemStren);
		
		this.RemTime -= Clock.Factor;
		if (this.RemTime <= 0) { this.Gone = true; return; }
		this.RemStren -= stren * Clock.Factor / time;
	}
}


@.BackLobster = function (plane, x, y)
{
	this.Parent = plane;
	this.Zone = this.Parent.Zone;
	
	this.MainSprite = new Sprite('''BackLobster.png''', { N: 2, T: 0.5 });
	this.EyeSprite = new Sprite('''BLEye.png''');
	this.SmokeSprite = new Sprite('''BackSmoke.png''', { N: 3, T: 0.75, Vertical: true });
	
	this.Lazors = [
		{ X0: -4, Y0: -26 },
		{ X0: +4, Y0: -26 }
	];
	
	this.X = x;
	this.Y = y;
	
	this.Z = this.Parent.Z;
	
	this.LazOn = false;
	this.LazTimer = new RTimer(0, 2);
	this.LazBlink = true;
	this.LazColor = { R: 0xFF, G: 0x80, B: 0x80, A: 0xFF };
	
	this.Process = function ()
	{
		if (this.LazTimer.Tick() && (this.LazOn = !this.LazOn))
		{
			for (var li in this.Lazors)
			{
				var l = this.Lazors[li];
				
				l.X1 = l.X0 + Randge(-128, +128);
				l.Y1 = l.Y0 + 128;
			}
		}
	}
	
	this.Draw = function (zone)
	{
		var x = this.Parent.X2S(this.X);
		var y = this.Parent.Y2S(this.Y);
		
		this.MainSprite.Draw(x, y);
		
		if (this.LazOn && (this.LazBlink =! this.LazBlink))
		{
			for (var li in this.Lazors)
			{
				var l = this.Lazors[li];
				
				this.EyeSprite.Draw(x + l.X0, y + l.Y0);
				
				Raster.BresenLine ( Screen,
					{ X: x + l.X0, Y: y + l.Y0 },
					{ X: x + l.X1, Y: y + l.Y1 },
					Raster.RepShr, this.LazColor
				);
			}
		}
		
		this.SmokeSprite.Draw(x, y + this.SmokeSprite.H / 2 - 12);
	}
}
