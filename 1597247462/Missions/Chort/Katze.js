@ = function (zone, x, y, cage)
{
	'''/Common/Lifeform'''.call(this);
	
	this.Faction = "LJR";
	this.Cage = cage;
	this.Zone = zone;
	
	this.Color = {
		R: Math.round(Math.random() * 0xFF),
		G: Math.round(Math.random() * 0xFF),
		B: Math.round(Math.random() * 0xFF),
		A: 0xFF
	}
	
	this.OnAdd = function ()
	{
		this.Owner = this.Zone.Player;
		this.Speed = this.Owner.WalkingSpeed * 1.1;
		this.JumpStrength = this.Owner.JumpStrength * 0.75;
		
		this.Zone.Cats.push(this);
	}
	
	this.Sprites = {
		L: new Sprite('''Katze.L.png'''),
		R: new Sprite('''Katze.R.png''')
	};
	
	Box.FromXYWH.call(this, x, y, this.Sprites.L.W, this.Sprites.L.H);
	
	this.Hit = function (d, x, y)
	{
		this.Zone.Add(new '''/Common/Explosion'''(this, 1, 0));
		this.Gone = true;
	}
	
	this.Process = function (zone)
	{
		if (this.Cage)
		{
			if (ProbSec(2)) this.Velocity.X = Randge(-this.Speed, +this.Speed);
			this.Walk();
			
			Box.PutAtB(this, this.Cage.Inner.B);
			Box.Constrain(this, this.Cage.Inner);
			
			this.Z = -1.1;
		}
		else
		{
			this.Z = -0.1;
			
			if (this.Grounded)
			{
				if (ProbSec(3))
				{
					this.Velocity.X = this.Speed * Math.sign(this.Owner.X - this.X);
				}
				
				this.Walk();
			}
			else
			{
				this.Freefall();
			}
		}
		
		this.Sprite = this.Sprites[this.Velocity.X < 0 ? 'L' : 'R'];
	}
	
	this.Draw = function (zone)
	{
		zone.Draw(this.Sprite, this.X, this.Y, Raster.MultiplyShr, this.Color);
	}
}
