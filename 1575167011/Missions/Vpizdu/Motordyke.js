@ = function (zone, x, y, fixed)
{
	this.Zone = zone;
	this.Faction = 'ISF';
	
	var rls = '''Motordyke.L.png''';
	var rrs = '''Motordyke.R.png''';
	var shs = '''Motordyke.S.png''';
	
	this.Target = null;
	this.Shooting = false;
	this.ShDis = this.Zone.View.W / 3;
	this.Z = +1;
	
	this.Speed = 100;
	this.RVel = fixed ? new Speedometer(this) : null;
	
	var ss = 48;
	
	this.Sprites =
	{
		L: new Sprite(rls, { N: 2, T: fixed ? Infinity : 0.05 }),
		R: new Sprite(rrs, { N: 2, T: fixed ? Infinity : 0.05 }),
		
		LU: new Sprite(shs, { W: ss, H: ss, X: ss * 0, Y: ss * 0 }),
		CU: new Sprite(shs, { W: ss, H: ss, X: ss * 1, Y: ss * 0 }),
		RU: new Sprite(shs, { W: ss, H: ss, X: ss * 2, Y: ss * 0 }),
		RC: new Sprite(shs, { W: ss, H: ss, X: ss * 2, Y: ss * 1 }),
		RD: new Sprite(shs, { W: ss, H: ss, X: ss * 2, Y: ss * 2 }),
		CD: new Sprite(shs, { W: ss, H: ss, X: ss * 1, Y: ss * 2 }),
		LD: new Sprite(shs, { W: ss, H: ss, X: ss * 0, Y: ss * 2 }),
		LC: new Sprite(shs, { W: ss, H: ss, X: ss * 0, Y: ss * 1 }),
	}
	
	this.Barrels =
	{
		LU: { X: -16, Y: -24 },
		LC: { X: -24, Y: -12 },
		LD: { X: -18, Y:  +6 },
		RU: { X: +16, Y: -24 },
		RC: { X: +24, Y: -12 },
		RD: { X: +18, Y:  +6 },
		CU: { X:  -2, Y: -24 },
		CD: { X:   0, Y: +24 },
	}
	
	this.SelectTarget = function ()
	{
		this.Target = null;
		
		var tgts = this.Zone.Things.filter (
			function (t) {
				return (
					t.Faction && (
						t.Faction == 'Petrosyan' ||
						t.Faction == 'LJR'
					) && Rect.Intersect(this.Zone.View, t)
				);
			}, this
		);
		
		if (tgts.length == 0)
		{
			this.SSprite = this.Sprites.LC;
			this.RSprite = this.Sprites.L;
			this.Barrel = this.Barrels.LC;
			
			return;
		}
		
		this.Target = tgts[~~(Math.random() * tgts.length)];
		
		var dir = new Sub(this.Target, this);
		var di8 = DirToEightDir(dir);
	
		this.SSprite = this.Sprites[di8];
		this.RSprite = this.Sprites[(di8[0] == 'R') ? 'R' : 'L'];
		this.Barrel = this.Barrels[di8];
	}
	
	this.Hit = function ()
	{
		this.Zone.Add(new '''/Common/Explosion'''(this));
		this.Gone = true;
	}
	
	this.Process = function ()
	{
		if (this.RVel) this.RVel.Measure();
		
		if (!fixed && this.R <= this.Zone.View.L)
		{
			this.Gone = true;
			return;
		}
		
		if (
			this.Shooting.Tick() && this.Target &&
			Rect.Intersect(this, this.Zone.View)
		) {
			this.Zone.Add (
				new '''/Common/Bullet''' (this, this.X + this.Barrel.X, this.Y + this.Barrel.Y)
			).FireAt(this.Target.X, this.Target.Y, 200, this.RVel);
			
			this.SelectTarget();
		}

		if (!fixed) Box.PutAtX(this, this.X -= Clock.Factor * this.Speed);
	}
	
	this.Draw = function ()
	{
		zone.Draw(this.SSprite, this.X, this.Y);
		zone.Draw(this.RSprite, this.X, this.Y);
	}
	
	Box.FromXYWH.call(this, x, y, ss, ss);
	Box.PutAtB(this, y);
	
	this.SelectTarget();
	this.Shooting = new RTimer(fixed ? 2 : 0.25, fixed ? 2 : 1);
}

@.ApproxBox = new Box.FromXYWH(0, 0, 48, 48);
