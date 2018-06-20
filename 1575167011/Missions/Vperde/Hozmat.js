@ = function (zone, x, b)
{
	this.Zone = zone;
	this.Faction = "Them";
	this.Target = this.Zone.Player;
	
	Box.FromXYWH.call(this, x, b, 48, 48);
	Box.PutAtB(this, b);
	
	this.Modes =
	{
		LU: {
			Sprite: new Sprite('''Hozmat.png''', { X:  0, Y:  0, W: 48, H: 48 }),
			Barrel: { X: 8, Y: 8 }
		},
		
		LM: {
			Sprite: new Sprite('''Hozmat.png''', { X:  0, Y: 48, W: 48, H: 48 }),
			Barrel: { X: 0, Y: 24 }
		},
		
		LD: {
			Sprite: new Sprite('''Hozmat.png''', { X:  0, Y: 96, W: 48, H: 48 }),
			Barrel: { X: 8, Y: 40 }
		},
		
		RU: {
			Sprite: new Sprite('''Hozmat.png''', { X: 48, Y:  0, W: 48, H: 48 }),
			Barrel: { X: 40, Y: 8 }
		},
		
		RM: {
			Sprite: new Sprite('''Hozmat.png''', { X: 48, Y: 48, W: 48, H: 48 }),
			Barrel: { X: 48, Y: 24 }
		},
		
		RD: {
			Sprite: new Sprite('''Hozmat.png''', { X: 48, Y: 96, W: 48, H: 48 }),
			Barrel: { X: 40, Y: 40 }
		},
	}
	
	this.Hit = function (dmg)
	{
		this.Zone.Add(new '''/Common/Explosion'''(this));
		this.Gone = true;
	}
	
	this.FireAt = function (tgt)
	{
		var fb = new '''/Common/Bullet''' ( this,
			this.L + this.Mode.Barrel.X, this.T + this.Mode.Barrel.Y,
			{ Sprite: new Sprite ('''Spray.png''', { N: 3, Loop: false } ) }
		);
		
		fb.FireAt(tgt.X, tgt.Y, 50);
		this.Zone.Add(fb);
	}
	
	this.StartFiring = function ()
	{
		this.IdleTimer = null;
		this.FireTimer = new RTimer(@.MinFireTime, @.MaxFireTime);
		'''Spray.ogg'''.Play();
	}
	
	this.StopFiring = function ()
	{
		this.FireTimer = null;
		this.IdleTimer = new RTimer(@.MinIdleTime, @.MaxIdleTime);
	}
	
	this.Process = function ()
	{
		if (!Rect.Intersect(this, this.Zone.View)) return;
		
		if (this.FireTimer)
		{
			var dir = { X: this.Target.X - this.X, Y: this.Target.Y - this.B };
			
			var angle = Math.atan2(dir.X, dir.Y);
			var absan = Math.abs(angle) / Math.PI;
			
			var hor = this.Target.X < this.X ? 'L' : 'R';
			var ver = absan < 0.3 ? 'D' : absan > 0.7 ? 'U' : 'M';
			
			this.Mode = this.Modes[hor + ver];
			
			this.FireAt(this.Target);
		}
		
		if (this.FireTimer && this.FireTimer.Tick()) this.StopFiring();
		if (this.IdleTimer && this.IdleTimer.Tick()) this.StartFiring();
		
		if (
			!this.FireTimer && !this.IdleTimer
		) {
			this.StartFiring();
		}
		
	}
	
	this.Draw = function ()
	{
		this.Zone.Draw(this.Mode.Sprite, this.X, this.Y);
	}
	
	this.Mode = this.Modes.LM;
}


@.MinFireTime = 0.1;
@.MaxFireTime = 0.5;

@.MinIdleTime = 1;
@.MaxIdleTime = 2;
