@ = function (zone, x, y)
{
	'''/Common/Lifeform'''.call(this);
	
	this.Zone = zone;
	this.Facing = -1;
	this.Faction = 'Them';
	
	Box.FromXYWH.call(this, x, y, 50, 50);
	
	this.Modes = {
		Left: {
			Sprite: new Sprite ('''Kazak.png''', { Y: 0, W: 50, H: 50, TT: [ 0.25, +Infinity ] } )
		}, Right: {
			Sprite: new Sprite ('''Kazak.png''', { Y: 50, W: 50, H: 50, TT: [ 0.25, +Infinity ] } )
		}
	}
	
	this.Jump = function (x, y)
	{
		this.Grounded = false;
		
		this.Velocity.X = x * Math.random() * this.Zone.Player.WalkingSpeed * 2;
		this.Velocity.Y = y * Math.random() * this.Zone.Player.JumpStrength;
		
		this.Mode.Sprite.SetFrame(0);
	}
	
	
	this.Process = function ()
	{
		this.Facing = (this.Zone.Player.X < this.X) ? -1 : +1;
		this.Mode = this.Modes[this.Facing < 0 ? 'Left' : 'Right']
		
		if (this.Grounded) this.Jump(this.Facing, -1);
		else this.Freefall();
		
		if (Rect.Intersect(this, this.Zone.Player))
		{
			this.Zone.Player.Hit(1, this.Velocity.X, this.Velocity.Y);
		}
	}
	
	this.Draw = function ()
	{
		this.Zone.Draw(this.Mode.Sprite, this.X, this.Y);
	}
	
	this.Hit = function (damage)
	{
		this.Zone.Add (new '''/Common/Explosion''' (this));
		this.Gone = true;
	}
}
