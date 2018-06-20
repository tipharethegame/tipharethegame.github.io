@.Put = function (zone, l, t, opened)
{
	var ld = new @.Door(l, t, 0, 48);
	var rd = new @.Door(l + 48, t, 48, 48);
	
	zone.Add(ld);
	zone.Add(rd);
	
	var open = function ()
	{
		ld.Move(-1);
		rd.Move(+1);
	
		zone.Add(new @.Floor(zone, ld, rd));
	}
	
	if (opened) open();
	else {
		var lock = new @.Lock(zone, ld, rd);
		lock.OnDestruction = function () { open(); }
		zone.Add(lock);
	}
}

@.Floor = function (zone, ld, rd)
{
	this.Type = 'FLOOR';
	this.SmplArea = {};
	
	this.Process = function ()
	{
		Box.FromLTRB.call(this, ld.R, 232, rd.L, 232);
		
		if (this.SmplArea)
		{
			Box.FromLTRB.call(this.SmplArea, this.L, this.T - 8, this.R, this.T);
			
			if (Rect.Intersect(zone.Player, this.SmplArea))
			{
				zone.CollectSample();
				this.SmplArea = null;
			}
		}
	}
}

@.Door = function (l, t, sx, sw)
{
	this.Z = -1;
	this.Sprite = new Sprite('''Doors.png''', { X: sx, W: sw });
	
	Box.FromLTWH.call(this, l, t, sw, this.Sprite.H);
	
	this.Draw = function (zone)
	{
		zone.Draw(this.Sprite, this.X, this.Y);
	}
	
	this.Move = function (dir)
	{
		this.Direction = dir;
		this.Moving = true;
		this.Origin = this.X;
		this.Offset = 0;
	}
	
	this.Process = function ()
	{
		if (this.Moving)
		{
			this.Offset += 32 * Clock.Factor;
			
			if (this.Offset >= this.W)
			{
				this.Offset = this.W;
				this.Moving = false;
			}
			
			Box.PutAtX(this, Math.round(this.Origin + this.Offset  * this.Direction));
		}
	}
}

@.Lock = function (zone, ld, rd)
{
	this.LD = ld;
	this.RD = rd;
	
	var ls = new Sprite('''Lock.png''', { N: 2, Vertical: true } );
	
	'''/Common/Obstacle'''.call( this, zone,
		this.LD.R - ls.W / 2,
		this.LD.Y - ls.H / 2,
		ls, 3
	);
	
	this.Type = null;
}
