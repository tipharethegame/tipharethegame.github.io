@ = function (zone, lx, rx, y)
{
	'''/Common/Lifeform'''.call(this);
	
	this.Zone = zone;
	this.VelX = 40.666;
	this.Target = zone.Player;
	this.Health = 9.666;
	this.OffY = 0;
	
	this.Modes = {
		L: new Sprite('''Pop.png''', { N: 4, T: 0.1 }),
		R: new Sprite('''Pop.png''', { N: 4, T: 0.1, FX: -1 }),
	};
	
	this.Process = function (zone)
	{
		Box.PutAtX(this, this.X + this.VelX * Clock.Factor);
		
		if (
			(this.VelX > 0 && this.R > rx) ||
			(this.VelX < 0 && this.L < lx)
		) this.VelX *= -1;
		
		if (!Rect.Intersect(this, zone.View)) return;
		
		if (this.Firing.Tick())
		{
			zone.Add (
				new '''/Common/Bullet''' (
					this, this.X, this.Y,
					{
						Sprite: new Sprite('''Fire.png''', { N: 4, T: 0.1 }),
						DontDisappearOutside: true
					}
				)
			).FireAt(this.Target.X, this.Target.Y, 100);
		}
		
		if (Rect.Intersect(this.Target, this))
		{
			this.Target.Hit(1, this.Velocity.X, this.Velocity.Y);
		}
	}
	
	this.Draw = function (zone)
	{
		zone.Draw (
			this.Modes[this.VelX < 0 ? 'L' : 'R'],
			this.X, this.Y + this.OffY,
			this.JustHit ? Raster.InverseShr : null
		);
		
		this.JustHit = false;
	}
	
	this.Hit = function (d, vx, vy)
	{
		this.Health -= d;
	
		if (this.Health <= 0) this.BlowUp(5);
		else {
			'''Oink.ogg'''.Play();
			this.JustHit = true;
		}
	}
	
	this.Firing = new Timer(1);
	Box.FromXYWH.call(this, (lx + rx) / 2, y, this.Modes.L.W, this.Modes.L.H);
	Box.PutAtB(this, y);
}
