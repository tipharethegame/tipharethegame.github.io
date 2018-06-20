@ = function ()
{
	'''/Common/Zone'''.call(this, 'Chort');
	this.Guide = new '''/Common/Guide''' ('''Guide.png''');
	
	
	let l0t = 240 * 0;
	let l1t = 240 * 1;
	let l2t = 240 * 2;
	let l3t = 240 * 3;
	let lbt = 240 * 5;
	let lbb = 240 * 6;
	let lsl = 320 * 0;
	let shl = 320 * 4;
	let shr = 320 * 5;
	
	
	this.Wraps = [
		new '''/Common/Zone'''.Wrap(this, lsl, l0t, shl, l1t, { Bound: true }),
		new '''/Common/Zone'''.Wrap(this, shl, l0t, shr, l1t, { Bound: true }),
		new '''/Common/Zone'''.Wrap(this, lsl, l1t, shl, l2t, { Bound: true }),
		new '''/Common/Zone'''.Wrap(this, lsl, l2t, shl, l3t, { Bound: true }),
		new '''/Common/Zone'''.Wrap(this, lsl, l3t, shl, lbt, { Bound: true }),
		new '''/Common/Zone'''.Wrap(this, lsl, lbt, shr, lbb, { Bound: true }),
	];
	
	
	this.MakeTrips = function (pairs)
	{
		trips = []; pairs.forEach ( function (p) {
			trips.push(new @.TR(this, new @.TE(p[0]), new @.TE(p[1])));
		}, this ); return trips;
	}
	
	
	this.Lvl0Trips = this.MakeTrips ([
		[ { X:  620, Y: 196 }, { X:  667, Y: 227, Z: +1 } ],
		[ { X:  659, Y: 196 }, { X:  612, Y: 227, Z: +1 } ],
		[ { X:  355, Y: 196 }, { X:  355, Y: 227, Z: +1 } ],
		[ { X:  429, Y: 196 }, { X:  429, Y: 227, Z: +1 } ],
		[ { X:  503, Y: 196 }, { X:  503, Y: 227, Z: +1 } ],
		[ { X:  777, Y: 196 }, { X:  777, Y: 227, Z: +1 } ],
		[ { X:  857, Y: 196 }, { X:  857, Y: 227, Z: +1 } ],
		[ { X:  927, Y: 196 }, { X:  927, Y: 227, Z: +1 } ],
		[ { X:  987, Y: 196 }, { X:  987, Y: 227, Z: +1 } ],
		[ { X: 1037, Y: 196 }, { X: 1037, Y: 227, Z: +1 } ],
	]);
	
	this.Lvl0 = JArs([
		
		this.Lvl0Trips,
		
		[
			new '''/Common/Obstacle''' (
				this, 624, 208, new Sprite('''SmallCover.png'''), 3
			),
			
			this.BigCover = new '''/Common/Obstacle''' (
				this, 1296, 208, new Sprite('''BigCover.png'''), 666
			),
			
			new @.TP (this, 1248, 144, this.Lvl0Trips),
		]
	]);
	
	
	this.Lvl1MovnTrips = this.MakeTrips ([
		[	{ Path: [ { X: 611, Y: 337 }, { X:  188, Y: 337 } ], T: 3.5 },
			{ Path: [ { X: 611, Y: 382 }, { X:  188, Y: 382 } ], T: 3.5 } ],
		[	{ Path: [ { X: 668, Y: 337 }, { X: 1091, Y: 337 } ], T: 3.5 },
			{ Path: [ { X: 668, Y: 382 }, { X: 1091, Y: 382 } ], T: 3.5 } ]
	]);
	
	this.Lvl1To2LTrips = this.MakeTrips([ [{X: 145,Y:396},{X: 174,Y:396}] ]);
	this.Lvl1To2RTrips = this.MakeTrips([ [{X:1105,Y:396},{X:1134,Y:396}] ]);
	
	this.Lvl1 = JArs([
		
		this.Lvl1MovnTrips,
		this.Lvl1To2LTrips,
		this.Lvl1To2RTrips,
		
		[
			new @.TP (this,  312, 264, this.Lvl1To2RTrips),
			new @.TP (this,  952, 264, this.Lvl1To2LTrips),
		]
		
	]);
	
	
	this.Lvl2UpperTrips = this.MakeTrips ([
		
		[	{ Path: [{X:337,Y:511},{X:504-32,Y:511},{X:623,Y:511}], T: 0.5 },
			{ Path: [{X:337,Y:511},{X:504+32,Y:511},{X:623,Y:511}], T: 0.5 } ],
		[	{ Path: [{X:944,Y:511},{X:776+32,Y:511},{X:656,Y:511}], T: 0.5 },
			{ Path: [{X:944,Y:511},{X:776-32,Y:511},{X:656,Y:511}], T: 0.5 } ],
		
		[ { Path: [{X:337,Y:527},{X:623,Y:527}], T: 4 }, { X: 623, Y: 527 } ],
		[ { Path: [{X:944,Y:527},{X:656,Y:527}], T: 4 }, { X: 656, Y: 527 } ]
		
	]);
	
	this.Lvl2SwingTrip = this.MakeTrips ([[
		{ Path: [ {X:332,Y:657}, {X:947,Y:657} ], T: 6 },
		{ Path: [ {X:332,Y:702}, {X:947,Y:702} ], T: 6 }
	]]);

	this.Lvl2ExitLTrip = this.MakeTrips([[{X:316,Y:657},{X:316,Y:702}]]);
	this.Lvl2ExitRTrip = this.MakeTrips([[{X:963,Y:657},{X:963,Y:702}]]);
	
	this.Lvl2 = JArs([
		
		this.Lvl2UpperTrips,
		this.Lvl2SwingTrip,
		this.Lvl2ExitLTrip,
		this.Lvl2ExitRTrip,
		
		[
			new @.TP (this,  432, 592, this.Lvl2ExitRTrip),
			new @.TP (this,  832, 592, this.Lvl2ExitLTrip),
			
			new '''Cage''' (this,   72, 552), new '''Cage''' (this,  136, 552),
			new '''Cage''' (this,  200, 552), new '''Cage''' (this,   72, 600),
			new '''Cage''' (this,  136, 600), new '''Cage''' (this,  200, 600),
			new '''Cage''' (this,   72, 648), new '''Cage''' (this,  136, 648),
			new '''Cage''' (this,  200, 648), new '''Cage''' (this, 1032, 552),
			new '''Cage''' (this, 1096, 552), new '''Cage''' (this, 1160, 552),
			new '''Cage''' (this, 1032, 600), new '''Cage''' (this, 1096, 600),
			new '''Cage''' (this, 1160, 600), new '''Cage''' (this, 1032, 648),
			new '''Cage''' (this, 1096, 648), new '''Cage''' (this, 1160, 648),
		]
		
	]);
	
	
	this.Lvl3TopPlugs = [
		new '''Plug''' (this, 544, 736, 32, 48),
		new '''Plug''' (this, 544, 816, 32, 48),
		new '''Plug''' (this, 576, 864, 48, 32),
		new '''Plug''' (this, 656, 864, 48, 32),
		new '''Plug''' (this, 704, 736, 32, 48),
		new '''Plug''' (this, 704, 816, 32, 48),
	];
	
	this.Lvl23 = JArs([
		
		this.Lvl2,
		this.Lvl3TopPlugs
		
	]);
	
	this.Lvl3 = [
		
		new '''Grid''' (this, 40, 760, 80, 16, 6, 16),
		
		new '''Cage''' (this,   56,  744),
		new '''Cage''' (this,  136,  904),
		new '''Cage''' (this,  376,  824),
		new '''Cage''' (this,  296,  984),
		new '''Cage''' (this,   56, 1144),
		new '''Cage''' (this,  936,  744),
		new '''Cage''' (this, 1096,  824),
		new '''Cage''' (this,  856,  904),
		new '''Cage''' (this, 1176,  984),
		new '''Cage''' (this,  776, 1064),
		new '''Cage''' (this,   56,  824),
		new '''Cage''' (this,  216,  824),
		new '''Cage''' (this,  296,  744),
		new '''Cage''' (this,   56,  984),
		new '''Cage''' (this,  456, 1064),
		new '''Cage''' (this,  616,  984),
		new '''Cage''' (this,  776,  824),
		new '''Cage''' (this, 1016,  744),
		new '''Cage''' (this, 1176,  824),
		new '''Cage''' (this, 1016,  984),
		new '''Cage''' (this, 1096, 1144),
		
		new '''Plug''' (this,  144,  816, 32, 48),
		new '''Plug''' (this,  384, 1056, 32, 48),
		new '''Plug''' (this,  144, 1136, 32, 48),
		new '''Plug''' (this,  304, 1136, 32, 48),
		new '''Plug''' (this,  544, 1056, 32, 48),
		new '''Plug''' (this,  704,  976, 32, 48),
		new '''Plug''' (this,  864, 1136, 32, 48),
		new '''Plug''' (this, 1104,  896, 32, 48),
		new '''Plug''' (this, 1184, 1056, 32, 48),
		new '''Plug''' (this,  944,  816, 32, 48),
		new '''Plug''' (this,   16,  864, 48, 32),
		new '''Plug''' (this,   96,  864, 48, 32),
		new '''Plug''' (this,  256,  864, 48, 32),
		new '''Plug''' (this,  336,  944, 48, 32),
		new '''Plug''' (this,  176, 1024, 48, 32),
		new '''Plug''' (this,  416, 1024, 48, 32),
		new '''Plug''' (this,  256, 1104, 48, 32),
		new '''Plug''' (this,  336, 1104, 48, 32),
		new '''Plug''' (this,  576, 1104, 48, 32),
		new '''Plug''' (this,  656, 1104, 48, 32),
		new '''Plug''' (this,  736,  944, 48, 32),
		new '''Plug''' (this,  816, 1024, 48, 32),
		new '''Plug''' (this,  976, 1024, 48, 32),
		new '''Plug''' (this,  896, 1104, 48, 32),
		new '''Plug''' (this, 1056, 1104, 48, 32),
		new '''Plug''' (this, 1136, 1104, 48, 32),
		new '''Plug''' (this,  896,  864, 48, 32),
		new '''Plug''' (this,  976,  864, 48, 32),
		new '''Plug''' (this, 1056,  944, 48, 32),
		new '''Plug''' (this, 1136,  864, 48, 32),
		new '''Plug''' (this,  224,  736, 32, 48),
		new '''Plug''' (this,  304,  896, 32, 48),
		new '''Plug''' (this,  464,  816, 32, 48),
		new '''Plug''' (this, 1104,  736, 32, 48),
		new '''Plug''' (this,   96,  944, 48, 32),
		new '''Plug''' (this,   96, 1104, 48, 32),
		new '''Plug''' (this,  256,  784, 48, 32),
		new '''Plug''' (this,  336,  864, 48, 32),
		new '''Plug''' (this,  416,  784, 48, 32),
		new '''Plug''' (this,  496,  944, 48, 32),
		new '''Plug''' (this,  816,  864, 48, 32),
		new '''Plug''' (this,  976,  784, 48, 32),
		new '''Plug''' (this, 1136, 1024, 48, 32),
		new '''Plug''' (this, 1216,  944, 48, 32),
	];
	
	
	this.LvlB = [
		
		new '''Cage''' (this, 552, 1384),
		
		this.Lift = new '''Lift''' ( this,
			new Rect.FromLTRB(1296, 240, 1584, lbb), 240, lbb - 96, lbb
		)
	];
	
	
	this.GoLvl1 = function () { this.RemoveAll(this.Lvl0); this.AddAll(this.Lvl1); }
	this.GoLvl2 = function () { this.RemoveAll(this.Lvl1); this.AddAll(this.Lvl23); }
	this.GoLvl3 = function () { this.RemoveAll(this.Lvl2); this.AddAll(this.Lvl3); }
	this.GoLvlB = function () { this.RemoveAll(this.Lvl3); this.AddAll(this.LvlB); }
	
	
	this.Cats = [];
	this.CatCutoff = lbt;
	
	this.OnLiftEnter = function ()
	{
		this.Cats.forEach( function (cat) {
			if (cat.Y < this.CatCutoff) this.Remove(cat);
		}, this );
	}
	
	
	this.AddAll([
		
		this.Player = new '''/Objects/Tiphareth/''' ( this,
			Config.Get('INSX', 32), Config.Get('INSY', 200)
		),
		
		new '''/Common/Zone'''.Plane (this, '''Sky.png''', { Z: -Infinity, MX: 0, MY: 0 }),
		new '''/Common/Zone'''.Plane (this, '''Back.png''', { Z: -2 }),
		
		new '''/Common/Trigger''' (this, 0, l1t, +Infinity, +Infinity, this.GoLvl1),
		new '''/Common/Trigger''' (this, 0, l2t, +Infinity, +Infinity, this.GoLvl2),
		new '''/Common/Trigger''' (this, 0, l3t, +Infinity, +Infinity, this.GoLvl3),
		new '''/Common/Trigger''' (this, 0, lbt, +Infinity, +Infinity, this.GoLvlB),
		
		new '''/Common/Trigger''' ( this,
			this.Lift.Shaft.L, this.Lift.Shaft.T,
			this.Lift.Shaft.R, this.Lift.Shaft.R,
			this.OnLiftEnter
		)
		
	]);
	
	
	this.AddAll(this.Lvl0);
	
	
	this.StartBoss = function ()
	{
		this.Music.Stop();
		(this.Music = '''/Common/Boss.ogg''').Loop(1.5);
		
		let kkc = new '''Kuklachort''' (this.Lift);
		kkc.OnDeath = function () { this.Zone.Finish(); }
		this.Add(kkc);
		
		this.Wraps = null;
		this.WrapOverride = new '''/Common/Zone'''.Wrap ( this, 0,0,0,0, { FixX: 1440 } );
	}
	
	this.Lift.OnNoRet = function ()
	{
		this.Zone.BigCover.Gone = true;
		this.Zone.StartBoss();
	}
	
	this.Trip = function ()
	{
		if (this.Failed) return;
		if (Config.Get('GODMODE', false)) return;
		
		this.FinalMusic = '''Alert.ogg''';
		this.FinalMusic.Loop();
		
		this.GameOver();
	}
	
	this.Finish = function ()
	{
		let saved = 0;
		
		this.Things.forEach ( function (t) {
			
			if (t.Faction == 'Kuklachort' && t.BlowUp) t.BlowUp();
			
			if (
				t.Faction == this.Player.Faction && t != this.Player &&
				Rect.Intersect(t, this.Lift.ShaftAbove)
			) saved++;
			
		}, this );
		
		this.Add (
			new '''/Common/Overhead''' ( this, '''CatIcon.png''',
				saved + "/" + this.Cats.length,
			10 )
		);
		
		this.Win('/Missions/Koskhoz/Briefing');
	}
	
	for (let i = 0; i < Config.Get('CATS', 0); i++)
	{
		this.Add(new '''Katze'''(this, this.Player.X, this.Player.Y, 0));
	}
	
	this.Music = '''Catland.ogg''';
	this.Music.Loop(15);
}


@.TE = '''TripEmitter''';
@.TP = '''TripPower''';
@.TR = '''TripRay''';
