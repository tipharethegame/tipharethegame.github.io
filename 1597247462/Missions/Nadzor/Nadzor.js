@ = function ()
{
	'''/Common/Zone'''.call(this, 'Nadzor');
	this.Guide = new '''/Common/Guide''' ('''Guide.png''');
	
	this.Wraps = [
		new '''/Common/Zone'''.Wrap(this, 0, 0, Infinity, 240, { FixY: 120 }),
		new '''/Common/Zone'''.Wrap(this, 0, 536, Infinity, 664, { FixY: 600 }),
		new '''/Common/Zone'''.Wrap(this, 880, 968, 880+304, 968+464, { FixX: 1032, FixY: 1320 }),
	];
	
	var upperThings = [
		
		this.Gate = new '''/Common/Obstacle''' (this, 696, 101, new Sprite('''Gate.png'''), 8),
		this.Vent = new '''/Common/Obstacle''' (this, 1880, 184, new Sprite('''Vent.png'''), 16),
		
		new '''Verhuhai''' (this, 750, 48),
		new '''Verhuhai''' (this, 934, 48),
		new '''Verhuhai''' (this, 1394, 48),
		new '''Verhuhai''' (this, 1854, 48),
		new '''Verhuhai''' (this, 1946, 48),
		
		new @.Zap(this, 1032, 212),
		new @.Zap(this, 1124, 212),
		new @.Zap(this, 1216, 212),
		new @.Zap(this, 1492, 212),
		new @.Zap(this, 1584, 212),
		new @.Zap(this, 1676, 212),
		
	];
	
	this.Vent.T += 8;
	this.Vent.H -= 8;
	
	var undergroundThings = [
		
		new '''/Common/Obstacle''' (this, 1660, 548, new Sprite('''Server.png''', { N: 2 }), 5),
		new '''/Common/Obstacle''' (this, 1404, 548, new Sprite('''Server.png''', { N: 2 }), 5),
		new '''/Common/Obstacle''' (this, 1148, 548, new Sprite('''Server.png''', { N: 2 }), 5),
		
		new '''Turret''' (this, 1736, 568),
		new '''Turret''' (this, 1480, 568),
		new '''Turret''' (this, 1480, 632),
		new '''Turret''' (this, 1224, 568),
		new '''Turret''' (this, 1224, 600),
		new '''Turret''' (this, 1224, 632),
		new '''Turret''' (this, 1000, 568),
		new '''Turret''' (this, 1000, 600),
		new '''Turret''' (this, 1000, 632),
		new '''Turret''' (this, 1032, 568),
		new '''Turret''' (this, 1032, 600),
		new '''Turret''' (this, 1032, 632),
		new '''Turret''' (this, 1064, 568),
		new '''Turret''' (this, 1064, 600),
		new '''Turret''' (this, 1064, 632),
		
	];
	
	var bossThings = [
		
		this.Mizulina = new '''Mizulina''' (this, 1032, 1280),
		
		new '''SkrepoCannon''' (this, 936, 1248),
		new '''SkrepoCannon''' (this, 936, 1352),
		new '''SkrepoCannon''' (this, 936 - 16, 1352 + 32 + 8),
		new '''SkrepoCannon''' (this, 1128, 1248),
		new '''SkrepoCannon''' (this, 1128, 1352),
		new '''SkrepoCannon''' (this, 1128 + 16, 1352 + 32 + 8),
		
	];
	
	this.Mizulina.OnDeath = function ()
	{
		for (var i in this.Zone.Things)
		{
			if (this.Zone.Things[i].Faction == "Them")
			{
				if (this.Zone.Things[i].BlowUp) this.Zone.Things[i].BlowUp();
			}
		}
		
		this.Zone.Win('/Missions/Vperde/Briefing');
	};
	
	var kazakSpawners = [
		new '''/Common/Spawner''' (this, 1164, 176, '''Kazak''', 1, 0, 0),
		new '''/Common/Spawner''' (this, 1624, 176, '''Kazak''', 1, 0, 0)
	];
	
	this.OnJumpDown = function ()
	{
		for (var i in upperThings) upperThings[i].Gone = true;
		for (var i in kazakSpawners) kazakSpawners[i].Gone = true;
		
		this.AddAll(undergroundThings);
	};
	
	this.OnEnterBoss = function ()
	{
		this.Music.Stop();
		(this.Music = '''/Common/Boss.ogg''').Loop(1.5);
		for (var i in undergroundThings) undergroundThings[i].Gone = true;
		this.AddAll(bossThings);
	};
	
	this.AddAll([
		
		new '''/Common/Zone'''.Plane(this, '''Sky.png''', { Z: -4, MX: 0, MY: 0 }),
		new '''/Common/Zone'''.Plane(this, '''Far.png''', { Z: -3, MX: 1/2, MY: 0 }),
		new '''/Common/Zone'''.Plane(this, '''Back.png''', { Z: -2 }),
		new '''/Common/Zone'''.Plane(this, '''Front.png''', { Z: +3 }),
		
		new '''/Objects/Dropship/''' (this, 64, 64),
		
		this.Player = new '''/Objects/Tiphareth/''' ( this,
			Config.Get('INSX', 128), Config.Get('INSY', 128)
		),
		
		new '''/Common/Trigger''' (this, 0, 240, 2048, 2048, this.OnJumpDown),
		new '''/Common/Trigger''' (this, 872, 960, 1192, 1440, this.OnEnterBoss),
	]);
	
	this.Gate.OnDestruction = function ()
	{
		this.Zone.AddAll(kazakSpawners);
		'''Alarm.ogg'''.Play();
	};
	
	this.Player.OnDeath = function ()
	{
		'''Alarm.ogg'''.Stop();
	};
	
	this.AddAll(upperThings);
	
	(this.Music = '''Nadzor.ogg''').Loop(2);
}


@.Zap = function (zone, x, y)
{
	this.Zone = zone;
	
	this.Faction = 'Them';
	
	this.Sprite = new Sprite ('''Zap.png''', { N: 2, T: 0.025, Vertical: true } );
	
	Box.FromLTWH.call(this, x, y, this.Sprite.W, this.Sprite.H);
	
	this.Damage = 1;
	
	this.OffTime = 1;
	this.OnTime = 1;
	this.Timer = 0;
	this.On = false;
	
	this.Process = function ()
	{
		this.Timer += Clock.Factor;
		if (!Rect.Intersect(this, this.Zone.View)) return;
		
		if (this.On == false && this.Timer > this.OffTime)
		{
			this.On = true;
			this.Timer = 0;
		}
		else if (this.On == true && this.Timer > this.OnTime)
		{
			this.On = false;
			this.Timer = 0;
		}
		
		if (this.On)
		{
			for (var ti in this.Zone.Things)
			{
				var t = this.Zone.Things[ti];
				
				if (!t.Hit || t.Dead) continue;
				if (t.Faction == this.Faction) continue;
				if (Rect.Intersect(this, t)) t.Hit(this.Damage, 0, 0);
			}
		}
	}
	
	this.Draw = function ()
	{
		if (!this.On) return;
		this.Zone.Draw(this.Sprite, this.X, this.Y);
	}
}
