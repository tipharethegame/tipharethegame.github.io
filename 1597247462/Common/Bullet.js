@ = function (whose, x, y, ini)
{
	this.Whose = whose;
	this.Zone = this.Whose.Zone;
	
	this.X = x; this.Y = y;
	this.Velocity = { X: 0, Y: 0 };
	this.Z = +2;
	
	this.Sprite = Init(ini, 'Sprite', new Sprite ('''Bullet.png''', { Frames: 2, Period: 0.1 }));
	this.Damage = Init(ini, 'Damage', 1);
	this.DontDisappearOutside = Init(ini, 'DontDisappearOutside', false);
	
	this.FireThrough = function (tx, ty, dx, dy, speed, ivel)
	{
		this.Through = { X: tx, Y: ty };
		this.FireTo(dx, dy, speed, ivel);
	}
	
	this.FireTo = function (dx, dy, speed, ivel)
	{
		var to = speed / Math.sqrt(dx * dx + dy * dy);
		
		this.Velocity.X = dx * to;
		this.Velocity.Y = dy * to;
		
		if (ivel)
		{
			this.Velocity.X += ivel.X;
			this.Velocity.Y += ivel.Y;
		}
	}
	
	this.FireAt = function (x, y, speed, ivel)
	{
		var dx = x - this.X;
		var dy = y - this.Y;
		
		this.FireTo(dx, dy, speed, ivel);
	}
	
	this.Miss = function ()
	{
		this.Gone = true;
	}
	
	this.DoHit = function (tgt)
	{
		tgt.Hit(this.Damage, this.Velocity.X, this.Velocity.Y);
		
		this.Gone = true;
	}
	
	this.Process = function ()
	{
		if (Rect.HasPoint(this.Zone.View, this)) this.Appeared = true;
		else if (this.Appeared && !this.DontDisappearOutside) { this.Miss(); return; }
		
		
		if (this.Zone.Wind)
		{
			this.Velocity.X += this.Zone.Wind.X * Clock.Factor;
			this.Velocity.Y += this.Zone.Wind.Y * Clock.Factor;
		}
		
		
		if (this.Through)
		{
			var nx = this.Through.X;
			var ny = this.Through.Y;
			
			this.Through = null;
		}
		else
		{
			var nx = this.X + this.Velocity.X * Clock.Factor;
			var ny = this.Y + this.Velocity.Y * Clock.Factor;
		}
		
		
		var coll = this.Zone.Guide.Seek(this.X, this.Y, nx, ny);
		if (coll && coll.What == 'SOLID') { this.Miss(); return; }
		
		
		for (var i = 0; i < this.Zone.Things.length; i++)
		{
			var t = this.Zone.Things[i];
			
			if (!t.Hit) continue;
			if (t.Dead) continue;
			if (t.Faction == this.Whose.Faction) continue;
			
			if (
				Rect.Collide(this.X, this.Y, t, nx, ny)
			) {
				this.DoHit(t);
				break;
			}
		}
		
		
		this.X = nx;
		this.Y = ny;
	}
	
	this.Draw = function ()
	{
		this.Zone.Draw(this.Sprite, this.X, this.Y);
	}
}
