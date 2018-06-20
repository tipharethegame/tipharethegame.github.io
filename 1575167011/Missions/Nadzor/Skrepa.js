@ = function (whose, x, y)
{
	this.Whose = whose;
	this.Zone = this.Whose.Zone;
	this.Faction = "Them";
	
	this.Velocity = { X: 0, Y: 0 };
	this.Sprite = new Sprite ('''Skrepa.png''', { N: 4, T: 0.25 });
	Box.FromXYWH.call(this, x, y, this.Sprite.W, this.Sprite.H);
	this.Z = +2;
	
	this.Damage = 1;
	this.Speed = 33;
	
	this.BlowUp = function ()
	{
		this.Zone.Add(new '''/Common/Explosion''' (this, 1));
		this.Gone = true;
	}
	
	this.Hit = function ()
	{
		this.BlowUp();
	}
	
	this.HomeAt = function (tgt)
	{
		this.Target = tgt;
	}
	
	this.Process = function ()
	{
		var dx = this.Target.X - this.X;
		var dy = this.Target.Y - this.Y;
		
		var to = this.Speed * Clock.Factor / Math.sqrt(dx * dx + dy * dy);
		
		this.Velocity.X = dx * to;
		this.Velocity.Y = dy * to;
		
		var nx = this.X + this.Velocity.X;
		var ny = this.Y + this.Velocity.Y;
		
		Box.PutAtX(this, nx);
		Box.PutAtY(this, ny);
		
		for (var ti in this.Zone.Things)
		{
			var t = this.Zone.Things[ti];
			
			if (!t.Hit) continue;
			if (t.Faction == this.Whose.Faction) continue;
			
			var hit = Rect.Collide(this.X, this.Y, t, nx, ny);
			
			if (hit)
			{
				t.Hit(this.Damage, this.Velocity.X, this.Velocity.Y);
				this.BlowUp();
			}
		}
	}
	
	this.Draw = function ()
	{
		this.Zone.Draw(this.Sprite, this.X, this.Y);
	}
}
