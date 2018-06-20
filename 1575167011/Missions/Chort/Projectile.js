@ = function (whose, x, y, vx, vy)
{
	this.Whose = whose;
	this.Faction = this.Whose.Faction;
	this.Zone = this.Whose.Zone;
	this.Z = +1;
	this.Sprite = new Sprite('''Projectile.png''', { N: 2, T: 0.05 });
	Box.FromXYWH.call(this, x, y, this.Sprite.W, this.Sprite.H);
	this.Velocity = { X: vx, Y: vy };
	this.Damage = 1;
	
	this.BlowUp = function ()
	{
		this.Zone.Add(new '''/Common/Explosion'''(this, 1, 0));
		this.Gone = true;
	}
	
	this.Hit = function (d, x, y)
	{
		this.BlowUp();
	}
	
	this.Process = function (zone)
	{
		Box.PutAtX(this, this.X + this.Velocity.X * Clock.Factor);
		Box.PutAtY(this, this.Y + this.Velocity.Y * Clock.Factor);
		
		Box.Constrain(this, this.Whose.Lift.ShaftAbove);
		
		for (let i = 0; i < zone.Things.length; i++) { let t = zone.Things[i];
			
			if (
				t.Hit && !t.Dead && t.Faction != this.Faction &&
				Rect.Intersect(this, t)
			) {
				t.Hit(this.Damage, this.Velocity.X, this.Velocity.Y);
				this.BlowUp();
				return;
			}
		};
	}
	
	this.Draw = function (zone)
	{
		zone.Draw(this.Sprite, this.X, this.Y);
	}
}
