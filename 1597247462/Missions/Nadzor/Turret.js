@ = function (zone, x, y)
{
	Box.FromXYWH.call(this, x, y, 16, 16);
	
	this.MkSpr = function (dx, dy)
	{
		return {
			Sprite: new Sprite ( '''Turret.png''', {
					X: this.W * (dx < 0 ? 0 : dx == 0 ? 1 : 2), W: this.W,
					Y: this.H * (dy < 0 ? 0 : dy == 0 ? 1 : 2), H: this.H,
			} ), Dir: { X: dx, Y: dy }
		}
	}
	
	this.Modes = {
		LU: this.MkSpr(-1, -1), CU: this.MkSpr( 0, -1),
		RU: this.MkSpr(+1, -1), LC: this.MkSpr(-1,  0),
		RC: this.MkSpr(+1,  0), LD: this.MkSpr(-1, +1),
		CD: this.MkSpr( 0, +1), RD: this.MkSpr(+1, +1),
	}
	
	this.Faction = 'Them';
	this.Zone = zone;
	this.Z = -1;
	
	this.ShootInterval = 0.5;
	this.ShootTimer = 0;
	
	this.Hit = function (damage)
	{
		this.Zone.Add(new '''/Common/Explosion'''(this));
		this.Gone = true;
	}
	
	this.Process = function ()
	{
		if (!(this.Active = Rect.Intersect(this, this.Zone.View))) return;
		
		var tgt = this.Zone.Player;
		var dir = { X: tgt.X - this.X, Y: tgt.Y - this.Y };
		this.Mode = this.Modes[DirToEightDir(dir)];
		
		this.ShootTimer += Clock.Factor;
		
		if (this.ShootTimer > this.ShootInterval)
		{
			this.Zone.Add (
				new '''/Common/Bullet''' (this, this.X, this.Y)
			).FireTo(this.Mode.Dir.X, this.Mode.Dir.Y, 150);
			
			this.ShootTimer = 0;
		}
	}
	
	this.Draw = function ()
	{
		if (!this.Active) return;
		
		this.Zone.Draw(this.Mode.Sprite, this.X, this.Y);
	}
}
