@ = function (lift)
{
	this.Lift = lift;
	this.Zone = lift.Zone;
	
	this.Faction = 'Kuklachort';
	this.Health = 50;
	
	this.EbloSprite = new Sprite('''Kuklachort.png''');
	Box.FromXYS.call(this, this.Lift.X, this.Lift.Shaft.T, this.EbloSprite);
	this.Offset = { X: 0, Y: 0 };
	
	this.EyeLSprite = new Sprite('''Eye.png''', { N: 8, T: 0.1 });
	this.EyeRSprite = new Sprite('''Eye.png''', { N: 8, T: 0.05 });
	this.EyeX = 11, this.EyeY = 5;
	
	this.TrussSprite = new Sprite('''Truss.png''');
	this.Truss = new Box.FromXYS(this.X, this.Y, this.TrussSprite);
	
	this.ZapperSprite = new Sprite('''Zapper.png''', { N: 2, T: 0.01, Vertical: true });
	this.Zapper = new Box.FromXYS(this.X, this.Y, this.ZapperSprite);
	
	this.ProjTimer = new RTimer(0, 1);
	this.MoveTimer = new Timer(1);
	
	this.Z = -1;
	
	this.ProjSprite = new Sprite('''Projectile.png''', { N: 2, T: 0.05 });
	this.ProjOff = { X: 0, Y: -19.5 };
	
	this.Die = function ()
	{
		this.Gone = true;
		this.Zone.Add(new '''/Common/Explosion'''(this, 8, 0.1));
		this.OnDeath();
	}
	
	this.Process = function (zone)
	{
		if (this.MoveTimer.Tick())
		{
			this.Offset.X = Randge(-128, +128);
			this.Offset.Y = Randge(-128, 0);
		}
		
		let tx = zone.Player.X + this.Offset.X;
		let ty = this.Lift.Y - Screen.H * 0.75 + this.Offset.Y;
		
		let nx = this.X + (tx - this.X) * Clock.Factor;
		let ny = this.Y = this.Y + (ty - this.Y) * Clock.Factor;
		
		Box.PutAtX(this, nx);
		Box.PutAtY(this, Math.max(ny, this.Lift.Shaft.T));
		Box.Constrain(this, this.Lift.Shaft);
		
		Box.PutAtY(this.Truss, this.Y);
		Box.PutAtB(this.Zapper, this.Truss.B);
		
		zone.Things.forEach ( function (t) {
			
			if (
				t.Hit && t.Faction != this.Faction &&
				Rect.Intersect(this.Zapper, t)
			) t.Hit(1, 0, 0);
			
		}, this);
		
		if (this.ProjTimer.Tick())
		{
			this.Zone.Add (
				new '''Projectile''' ( this,
					this.X + this.ProjOff.X,
					this.Y + this.ProjOff.Y,
					Randge(-20, +20), +10
				)
			);
		}
		
		this.JustHit = false;
	}
	
	this.Hit = function (d, x, y)
	{
		if ((this.Health -= d) <= 0) { this.Die(); return; }
		else { this.JustHit = true; '''/Common/Ricochet.ogg'''.Play(); }
	}
	
	this.Draw = function (zone)
	{
		zone.Draw(this.TrussSprite, this.Truss.X, this.Truss.Y);
		if (this.Kaput) return;
		
		zone.Draw(this.ZapperSprite, this.Zapper.X, this.Zapper.Y);
		
		zone.Draw (
			this.EbloSprite, this.X, this.Y,
			this.JustHit ? Raster.InverseShr : null
		);
		
		zone.Draw(this.EyeLSprite, this.X - this.EyeX, this.Y + this.EyeY);
		zone.Draw(this.EyeRSprite, this.X + this.EyeX, this.Y + this.EyeY);
		zone.Draw(this.ProjSprite, this.X + this.ProjOff.X, this.Y + this.ProjOff.Y);
	}
}
