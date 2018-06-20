@ = function (
	zone, l, t, spacing, xs, ys, count
) {
	this.Zone = zone;
	this.Spacing = spacing;
	
	this.Xs = xs;
	this.Ys = ys;
	
	this.L = l;
	this.T = t;
	
	this.Things = [];
	
	this.Time = 1;
	this.Increment = this.Spacing / this.Time * Clock.Factor;
	this.Caret = Infinity;
	
	this.G2X = function (x) { return this.L + this.Spacing * x; }
	this.G2Y = function (y) { return this.T + this.Spacing * y; }
	
	this.OnAdd = function (zone)
	{
		for (var i = 0; i < count; i++)
		{
			var cx = Math.floor(Math.random() * xs);
			var cy = Math.round(ys / 2);
			
			var t = new '''Seeker''' (this, this.G2X(cx), this.G2Y(cy));
			t.GridPos = { X: cx, Y: cy };
			
			this.Things.push(t);
			this.Zone.Add(t);
		}
	}
	
	this.OnGone = function (zone)
	{
		zone.RemoveAll(this.Things);
	}
	
	this.STOP = function (type) { return type == 'SOLID' };
	
	this.Decide = function (thing)
	{
		Box.PutAtX(thing, this.G2X(thing.GridPos.X));
		Box.PutAtY(thing, this.G2Y(thing.GridPos.Y));
		
		var dx = 0, dy = 0;
		var dir = ~~Randge(0, 4);
		
		for (var i = 0; i < 4; i++)
		{
			switch (dir)
			{
				case 0: dx = -1, dy = 0; break;
				case 1: dy = -1, dx = 0; break;
				case 2: dx = +1, dy = 0; break;
				case 3: dy = +1, dx = 0; break;
			}
			
			var ngx = thing.GridPos.X + dx;
			var ngy = thing.GridPos.Y + dy;
			
			if (
				ngx < 0 || ngx >= this.Xs ||
				ngy < 0 || ngy >= this.Ys ||
				this.Zone.ProcessCollisions (
					thing, this.STOP, thing.X, thing.Y,
					this.G2X(ngx), this.G2Y(ngy)
				)
			) {
				dir++;
				if (dir >= 4) dir = 0;
				continue;
			}
			
			break;
		}
		
		thing.GridPos.X += dx;
		thing.GridPos.Y += dy;
		
		thing.GridMov = {
			X: dx * this.Increment,
			Y: dy * this.Increment
		};
	}
	
	this.Move = function (thing)
	{
		Box.PutAtX(thing, thing.X + thing.GridMov.X);
		Box.PutAtY(thing, thing.Y + thing.GridMov.Y);
	}
	
	this.Process = function ()
	{
		if ((this.Caret += this.Increment) >= this.Spacing) {
			for (var i in this.Things) this.Decide(this.Things[i]);
			this.Caret = 0;
		} else {
			for (var i in this.Things) this.Move(this.Things[i]);
		}
	}
}
