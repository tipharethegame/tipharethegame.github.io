@ = function (zone, x, y)
{
	Box.FromXYWH.call(this, x, y, 24, 32);
	Box.PutAtB(this, y);
	
	this.Modes = {
		Left: {
			Sprite: new Sprite ('''Verhuhai.L.png'''),
			Barrel: { X: -16, Y: +2 }
		}, Right: {
			Sprite: new Sprite ('''Verhuhai.R.png'''),
			Barrel: { X: +16, Y: +2 }
		}, LeftDown: {
			Sprite: new Sprite ('''Verhuhai.LD.png''', { PY: 4 } ),
			Barrel: { X: -13, Y: +24 }
		}, RightDown: {
			Sprite: new Sprite ('''Verhuhai.RD.png''', { PY: 4 } ),
			Barrel: { X: +13, Y: +24 }
		}, Hidden: {
			Sprite: new Sprite ('''Verhuhai.Hidden.png''')
		}
	}
	
	this.Faction = 'Them';
	this.Zone = zone;
	
	this.ShootInterval = 0.5;
	this.ShootTimer = this.ShootInterval * Math.random();
	
	this.Hit = function (damage)
	{
		if (this.Mode == this.Modes.Hidden) return;
		this.Zone.Add(new '''/Common/Explosion'''(this));
		this.Gone = true;
	}
	
	this.Process = function ()
	{
		if (!(this.Active = Rect.Intersect(this, this.Zone.View))) return;
		
		var tgt = this.Zone.Player;
		var dir = { X: tgt.X - this.X, Y: tgt.Y - this.B };
		
		var angle = Math.atan2(dir.X, dir.Y);
		var absan = Math.abs(angle) / Math.PI;
		
		if (absan < 0.1) this.Mode = this.Modes.Hidden;
		else if (absan > 0.6) this.Mode = this.Modes.Hidden;
		else {
			var hor = angle < 0 ? 'Left' : 'Right';
			var ver = absan < 0.4 ? 'Down' : '';
			this.Mode = this.Modes[hor + ver];
		}
		
		Box.SetHFromB(this, this.Mode.Sprite.H);
		Box.SetWFromX(this, this.Mode.Sprite.W);
		
		if (this.Mode != this.Modes.Hidden)
		{
			this.ShootTimer += Clock.Factor;
			
			if (this.ShootTimer > this.ShootInterval)
			{
				this.Zone.Add (
					new '''/Common/Bullet''' (this, this.X + this.Mode.Barrel.X, this.Y + this.Mode.Barrel.Y)
				).FireAt(this.Zone.Player.X, this.Zone.Player.Y, 150);
				
				this.ShootTimer = 0;
			}
			
			if (Rect.Intersect(this, this.Zone.Player))
			{
				this.Zone.Player.Hit(1, 0, 0);
			}
		}
	}
	
	this.Draw = function ()
	{
		if (!this.Active) return;
		
		this.Zone.Draw(this.Mode.Sprite, this.X, this.Y);
	}
}
