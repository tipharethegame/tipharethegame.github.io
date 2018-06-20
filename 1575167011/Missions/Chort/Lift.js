@ = function (zone, shaft, t, noret, b)
{
	this.Zone = zone;
	this.Shaft = shaft;
	
	this.Sprite = new Sprite('''Lift.png''');
	
	Box.FromLTWH.call(this, shaft.L, shaft.B - this.Sprite.H, shaft.W, this.Sprite.H);
	Box.MoveT(this, +8);
	
	this.Type = 'SOLID';
	this.Speed = Config.Get('LIFTSPEED', 20);
	this.Z = -0.5;
	
	this.AllAboard = function ()
	{
		for (let i in zone.Things) { let t = zone.Things[i];
			
			if (t.Faction != 'LJR' || t.Cage) continue;
			if (!Rect.HasPoint(this.ShaftAbove, t)) return false;
		}
		
		return true;
	}
	
	this.Process = function (zone)
	{
		this.ShaftAbove = new Rect.FromLTRB (
			this.Shaft.L, this.Shaft.T, this.Shaft.R, this.T
		);
		
		if (!this.NoRet && this.T < noret)
		{
			this.OnNoRet();
			this.NoRet = true;
		}
		
		if ((this.NoRet || this.AllAboard()) && !zone.Failed) {
			Box.PutAtT(this, Math.max(t, this.T -= this.Speed * Clock.Factor));
		} else {
			Box.PutAtB(this, Math.min(b, this.B += this.Speed * Clock.Factor));
		}
		
		if (this.NoRet)
		{
			zone.WrapOverride.FixY = this.B - Screen.H / 2;
		}
	}
	
	this.Draw = function (zone)
	{
		zone.Draw(this.Sprite, this.X, this.Y);
	}
}
