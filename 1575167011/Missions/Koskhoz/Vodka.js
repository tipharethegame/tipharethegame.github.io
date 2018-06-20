@ = function (zone, x, y)
{
	this.Zone = zone;
	this.Target = this.Zone.Player;
	this.Sprite = new Sprite('''Vodka.png''', { N: 4, T: 0.1 });
	Box.FromXYWH.call(this, x, y, this.Sprite.W, this.Sprite.H);
	this.Damage = 1;
	
	this.Velocity = {
		X: Math.sign(this.Target.X - this.X) * Randge(0, 100),
		Y: Randge(-400, -200)
	};
	
	this.BlowUp = function ()
	{
		this.Zone.Add(new '''/Common/Explosion'''(this, 1, 0));
		this.Gone = true;
	}
	
	this.Process = function ()
	{
		this.Velocity.Y += this.Zone.Gravity * Clock.Factor;
		
		let nx = this.X + this.Velocity.X * Clock.Factor;
		let ny = this.Y + this.Velocity.Y * Clock.Factor;
		
		let coll = this.Zone.Guide.Seek(this.X, this.Y, nx, ny);
		
		if (
			coll &&
			coll.What == 'SOLID'
		) {
			this.BlowUp();
			return;
		}
		
		if (
			Rect.Collide(this.X, this.Y, this.Target, nx, ny) &&
			!this.Target.Dead
		) {
			this.Target.Hit (
				this.Damage, this.Velocity.X, this.Velocity.Y
			);
			
			this.BlowUp();
			return;
		}
		
		Box.PutAtX(this, nx);
		Box.PutAtY(this, ny);
	}
	
	this.Hit = function (dmg, vx, vy)
	{
		this.BlowUp();
	}
	
	this.Draw = function ()
	{
		zone.Draw(this.Sprite, this.X, this.Y);
	}
}
