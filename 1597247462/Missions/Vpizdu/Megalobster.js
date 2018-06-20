@ = function (zone, x, tgtb)
{
	this.Zone = zone;
	this.BaseSprite = new Sprite('''Megalobster.png''');
	this.Z = -5;
	
	Box.FromXYWH.call(this, x, tgtb, this.BaseSprite.W, this.BaseSprite.H);
	Box.PutAtT(this, tgtb);
	
	this.LazBlink = true;
	
	this.ShoopColor = { R: 0xFF, G: 0x00, B: 0x00, A: 0xFF };
	this.WhoopColor = { R: 0xFF, G: 0xFF, B: 0xFF, A: 0xFF };
	
	this.EL = new @.Lazor(this, -44, -24);
	this.ER = new @.Lazor(this, +44, -24);
	
	this.Lazors = [ this.EL, this.ER ];
	
	this.Cockpit = new '''/Common/WeakPoint''' (zone, this.X, this.Y, {
		Owner: this, Z: this.Z + 0.1, Health: 44,
		Sprite: new Sprite('''Cockpit.png'''), RX: 0, RY: -3,
		OnDeath: function () { this.Owner.Die(); }
	});
	
	this.Zone.Add(this.Cockpit);
	this.Zone.Add(this.EL);
	this.Zone.Add(this.ER);
	
	this.Die = function ()
	{
		this.Zone.Things.forEach ( function (t) {
			if (t.Faction == 'Petrosyan') t.Gone = true;
		});
		
		this.Zone.LobsL.Gone = true;
		this.Zone.LobsR.Gone = true;
		
		'''Targeting.ogg'''.Stop();
		
		this.EL.Gone = true;
		this.ER.Gone = true;
		
		this.Zone.Add(new '''/Common/Explosion'''(this, 16, 0.1));
		this.Zone.Music.Stop();
		
		this.Process = this.ProcessOutro;
	}
	
	this.Process =
	this.ProcessIntro = function ()
	{
		Box.PutAtB(this, this.B - Clock.Factor * 200);
		Box.PutAtX(this, Math.round(x + Randge(-4, +4)));
		
		if (this.B <= tgtb)
		{
			Box.PutAtB(this, tgtb);
			Box.PutAtX(this, x);
			
			this.Process = this.ProcessMain;
		}
		
		Box.PutAtX(this.Cockpit, this.X + this.Cockpit.RX);
		Box.PutAtY(this.Cockpit, this.Y + this.Cockpit.RY);
	}
	
	this.Shoop = function ()
	{
		for (var ei in this.Lazors)
		{
			var e = this.Lazors[ei];
			
			e.Source = {
				X: this.X + e.RX,
				Y: this.Y + e.RY
			};
			
			e.Target = {
				Zone: this.Zone,
				X: this.Zone.Player.X + Randge(-64, +64),
				Y: Screen.H - 8
			};
		}
		
		'''Targeting.ogg'''.Loop();
	}
	
	this.Whoop = function ()
	{
		'''Targeting.ogg'''.Stop();
		'''/Common/Kaboom.ogg'''.Play();
		
		for (var ei in this.Lazors)
		{
			var e = this.Lazors[ei];
			
			this.Zone.Add(new '''/Common/Explosion'''(e.Target, 1));
		}
	}
	
	this.ProcessOutro = function ()
	{
		Box.PutAtY(this, this.Y + Clock.Factor * 100);
		Box.PutAtX(this, x + Randge(-4, +4));
		
		if (this.T >= tgtb)
		{
			this.Zone.Win('/Missions/Chort/Briefing');
			this.Process = null;
		}
	}
	
	this.ProcessMain = function ()
	{
		this.LazBlink =! this.LazBlink;
		
		if (this.IdleTimer)
		{
			if (this.IdleTimer.Tick())
			{
				this.Shoop();
				this.ShoopTimer = new Timer(1);
				this.IdleTimer = null;
			}
			else return;
		}
		
		if (this.ShoopTimer)
		{
			if (this.ShoopTimer.Tick())
			{
				this.Whoop();
				this.WhoopTimer = new Timer(0.1);
				this.ShoopTimer = null;
			}
			else return;
		}
		
		if (this.WhoopTimer)
		{
			if (this.WhoopTimer.Tick())
			{
				this.WhoopTimer = null;
			}
			
			return;
		}
		
		this.IdleTimer = new Timer(2);
	}
	
	this.Draw = function ()
	{
		zone.Draw(this.BaseSprite, this.X, this.Y);
	}
	
	this.Deactivate = function ()
	{
		this.Process = null;
		
		this.ShoopTimer = null;
		this.WhoopTimer = null;
		
		'''Targeting.ogg'''.Stop();
	}
}

@.Lazor = function (owner, rx, ry)
{
	this.Owner = owner;
	this.Zone = owner.Zone;
	this.Z = +1;
	
	this.RX = rx;
	this.RY = ry;
	
	this.Shoop = false;
	this.Whoop = false;
	
	this.ShoopSprite = new Sprite('''Shoop.png''');
	this.WhoopSprite = new Sprite('''Whoop.png''');
	
	this.Draw = function (zone)
	{
		if (
			(this.Owner.ShoopTimer && this.Owner.LazBlink) ||
			this.Owner.WhoopTimer
		) {
			var v0 = this.Zone.LocalizePoint(this.Source);
			var v1 = this.Zone.LocalizePoint(this.Target);
			
			(this.Owner.WhoopTimer ? this.WhoopSprite : this.ShoopSprite).Draw(v0.X, v0.Y);
			
			Raster.BresenLine (
				Screen, v0, v1, Raster.RepShr,
				this.Owner.WhoopTimer ? this.Owner.WhoopColor : this.Owner.ShoopColor
			);
			
			if (
				this.Owner.WhoopTimer &&
				Rect.LineIntersect(this.Source, this.Zone.Player, this.Target)
			) this.Zone.Player.Hit(9000, 0, 0);
		}
	}
}
