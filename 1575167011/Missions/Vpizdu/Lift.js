@ = function (zone, l, t, downstop, upstop)
{
	'''/Common/Obstacle'''.call(this, zone, l, t, new Sprite('''Lift.png'''), Infinity);
	
	this.Type = 'SOLID';
	this.Hit = null;
	
	Box.MoveT(this, +6);
	
	this.UpStop = upstop;
	this.DownStop = this.B;
	this.Speed = 80;
	this.Timer = new RTimer(0, 5);
	this.Pos = Randge(0, 180);
	
	this.Taken = function ()
	{
		return (
			zone.Player.B == this.T &&
			zone.Player.X >= this.L &&
			zone.Player.X <= this.R
		);
	}
	
	this.Process = function ()
	{
		if (this.Taken())
		{
			this.Zone.TakenLift = this;
			
			var t = this.T - Clock.Factor * this.Speed;
			Box.PutAtT(this, t > this.UpStop ? t : this.UpStop);
			if (t > this.UpStop) this.Zone.Player.RVel = { X: 0, Y: -this.Speed };
		}
		else if (this.Enemy)
		{
			if (this.Enemy.Gone) this.Enemy = null;
			else {
				var t = this.T - (this.T - this.Zone.Player.Y + this.Pos) / 32;
				Box.PutAtT(this, t > this.UpStop ? t : this.UpStop);
			}
		}
		else
		{
			if (this.Zone.TakenLift)
			{
				if (this.Zone.TakenLift == this)
				{
					this.Zone.TakenLift = null;
				}
				
				if (
					!this.Enemy &&
					this.T >= this.Zone.View.B + 32 &&
					this.Timer.Tick()
				) {
					Box.PutAtT(this, this.Zone.View.B + 32);
					this.Enemy = new '''Motordyke''' (this.Zone, this.X, this.Y, true);
					this.Zone.Add(this.Enemy);
				}
			}
			
			if (this.B > this.DownStop) {
				Box.PutAtB(this, this.B -= Clock.Factor * this.Speed);
			} else {
				var b = this.B + Clock.Factor * this.Speed;
				Box.PutAtB(this, b < this.DownStop ? b : this.DownStop);
			}
		}
		
		if (this.Enemy)
		{
			Box.PutAtB(this.Enemy, this.T + 2);
		}
	}
}
