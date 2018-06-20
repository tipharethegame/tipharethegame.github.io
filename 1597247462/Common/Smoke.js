@ = function (zone, l, t, w, h, z, time)
{
	this.Timer = new RTimer(0, time || 1);
	Box.FromLTWH.call(this, l, t, w, h);
	this.Z = z || 0;
	
	this.Process = function (zone)
	{
		if (
			Rect.Intersect(this, zone.View) &&
			this.Timer.Tick()
		) {
			zone.Add (
				new @.Particle ( zone,
					Randge(this.L, this.R),
					Randge(this.T, this.B),
					this.Z
				)
			);
		}
	}
}

@.Particle = function (zone, x, y, z)
{
	this.Sprite = new Sprite('''Smoke.png''', { N: 4, T: 0.25, Loop: false });
	
	this.X = x;
	this.Y = y;
	this.Z = z;
	
	this.VelCorr = {
		X: Randge(0.5, 1),
		Y: Randge(0.5, 1)
	};
	
	this.Process = function (zone)
	{
		if (this.Sprite.Repeat)
		{
			zone.Remove(this);
			return;
		}
		
		this.X += zone.Wind.X * Clock.Factor * this.VelCorr.X;
		this.Y += zone.Wind.Y * Clock.Factor * this.VelCorr.Y;
	}
	
	this.Draw = function (zone)
	{
		zone.Draw(this.Sprite, this.X, this.Y);
	}
}
