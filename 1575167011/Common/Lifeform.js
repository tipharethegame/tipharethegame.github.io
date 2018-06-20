@ = function ()
{
	Box.call(this);
	
	this.Velocity = { X: 0, Y: 0 };
	this.Grounded = false;
	
	this.LRU = function (type) { return type == 'SOLID' }
	this.FLOOR = function (type) { return type == 'SOLID' || type == 'FLOOR' }
	this.FALL = function (type) { return type == 'FLOOR' }
	
	this.Stay = function ()
	{
		var down = this.Zone.ProcessCollisions(this, this.FLOOR, this.X, this.Y, this.X, this.B + 8);
		if (down) Box.PutAtB(this, down.Y); else this.Grounded = false;
	}
	
	this.Walk = function ()
	{
		if (this.Velocity.X)
		{
			var nx = this.X + this.Velocity.X * Clock.Factor;
			
			var seek = this.Zone.ProcessCollisions(this, this.LRU, this.X, this.Y, nx, this.Y);
			if (seek) nx = this.Velocity.X < 0 ? seek.X + 1 : seek.X - 1;
			
			Box.PutAtX(this, nx);
		}
		
		this.Stay();
	}
	
	this.Freefall = function ()
	{
		this.Velocity.Y += this.Zone.Gravity * Clock.Factor;
		
		if (this.Velocity.Y)
		{
			var dy = this.Velocity.Y * Clock.Factor;
			
			if (this.Velocity.Y < 0)
			{
				var nt = this.T + dy;
				var seek = this.Zone.ProcessCollisions(this, this.LRU, this.X, this.T, this.X, nt);
				if (seek) nt = seek.Y + 1, this.Velocity.Y = 0;
				Box.PutAtT(this, nt);
			}
			else
			{
				var nb = this.B + dy;
				var seek = this.Zone.ProcessCollisions(this, this.FLOOR, this.X, this.B, this.X, nb);
				
				if (seek)
				{
					if (this.OnFall) this.OnFall(this.Velocity.X, this.Velocity.Y);
					
					nb = seek.Y;
					this.Velocity.Y = 0;
					this.Grounded = true;
				}
				
				Box.PutAtB(this, nb);
			}
		}
		
		if (this.Velocity.X)
		{
			var dx = this.Velocity.X * Clock.Factor;
			var nx = this.X + dx;
			
			var st = this.Zone.ProcessCollisions(this, this.LRU, this.X, this.T, nx, this.T);
			var sb = this.Zone.ProcessCollisions(this, this.LRU, this.X, this.B - 1, nx, this.B - 1); /// -1 ?
			
			if (st || sb)
			{
				if (this.Velocity.X < 0)
				{
					if (st && sb) nx = (st.X > sb.X ? st.X : sb.X) + 1;
					else nx = (st ? st.X : sb.X) + 1;
				}
				else
				{
					if (st && sb) nx = (st.X < sb.X ? st.X : sb.X) - 1;
					else nx = (st ? st.X : sb.X) - 1;
				}
				
				this.Velocity.X = 0;
			}
			
			Box.PutAtX(this, nx);
		}
	}
	
	this.BlowUp = function (n)
	{
		this.Zone.Add(new '''Explosion'''(this, n, 0));
		this.Gone = true;
	}
}
