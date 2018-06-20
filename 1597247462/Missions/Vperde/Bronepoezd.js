@ = function (tgt)
{
	this.Target = tgt;
	this.Base = new Sprite('''Bronepoezd.png''');
	this.Zone = tgt.Zone;
	this.Z = -6;
	
	Box.FromXYWH.call (this,
		tgt.X - Screen.W / 2 - this.Base.W, Screen.H / 2,
		this.Base.W, this.Base.H
	);
	
	this.Agitation = 0;
	this.AgitTime = 3.5;
	this.AgitIncr = 1 / this.AgitTime * Clock.Factor;
	
	this.Attack = function ()
	{
		for (var ci in this.Coils)
		{
			this.Coils[ci].Attack();
		}
	}
	
	this.ProcessDead = function ()
	{
		Box.PutAtX(this, this.X + this.VX * Clock.Factor);
		this.VX -= 100 * Clock.Factor;
	}
	
	this.Process = function ()
	{
		Box.PutAtX(this, this.X + (tgt.X - this.X) * Clock.Factor / 4);
		
		if (Rect.HasPoint(this, this.Target))
		{
			this.Agitation += this.AgitIncr;
			
			if (this.Agitation >= 1)
			{
				this.Agitation = 1;
				this.Attack();
			}
			
		} else {
			this.Agitation -= this.AgitIncr;
			if (this.Agitation <= 0) this.Agitation = 0;
		}
		
		if (this.Agitation <= 0)
		{
			if (this.Buzz)
			{
				this.Buzz.Destroy();
				this.Buzz = null;
			}
		}
		else
		{
			if (!this.Buzz)
			{
				this.Buzz = new Synth('Sawtooth');
				this.Buzz.Start();
			}
			
			if (this.Agitation < 1)
			{
				this.Buzz.SetFrequency(20 + this.Agitation * 120);
				this.Buzz.SetVolume(0.25 + this.Agitation * 0.25);
			}
			else
			{
				this.Buzz.SetFrequency(80);
				this.Buzz.SetVolume(0.5);
			}
		}
	}
	
	this.Finalize = function ()
	{
		if (this.Buzz)
		{
			this.Buzz.Destroy();
			this.Buzz = null;
		}
	}
	
	this.Draw = function ()
	{
		this.Zone.Draw(this.Base, this.X, this.Y);
	}
	
	this.Coils = [
		new '''Coil''' (this, -72, -72, '''Coil.png'''),
		new '''Coil''' (this, 0, -72, '''Coil.png'''),
		new '''Coil''' (this, +72, -72, '''Coil.png'''),
	];
	
	this.Health = this.Coils.length;
	
	this.Damage = function (dmg)
	{
		if ((this.Health -= dmg) <= 0)
		{
			this.Die();
		}
	}
	
	this.Die = function ()
	{
		if (this.Buzz)
		{
			this.Buzz.Destroy();
			this.Buzz = 0;
		}
		
		this.VX = 0;
		this.Agitation = 0;
		this.Process = this.ProcessDead;
		this.Zone.Complete();
	}
	
	this.Migalki = [
		new @.Migalka(this, -112, -28),
		new @.Migalka(this, +112, -28),
	];
	
	this.Zone.AddAll(this.Coils);
	this.Zone.AddAll(this.Migalki);
}


@.Migalka = function (poezd, rx, ry)
{
	this.Poezd = poezd;
	this.Sprite = new Sprite('''Migalka.png''', { N: 4, T: 0.1 });
	this.Relative = { X: rx, Y: ry };
	this.Z = this.Poezd.Z;
	
	this.Process = function ()
	{
		Box.FromXYWH.call ( this,
			this.Poezd.X + this.Relative.X,
			this.Poezd.Y + this.Relative.Y,
			this.Sprite.W, this.Sprite.H
		);
	}
	
	this.Draw = function (zone)
	{
		zone.Draw(this.Sprite, this.X, this.Y);
	}
}
