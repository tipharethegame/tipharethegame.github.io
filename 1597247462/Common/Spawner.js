@ = function (zone, x, y, thing, time, ini)
{
	this.Zone = zone;
	
	this.Timer = new Timer(time);
	
	this.MinTime = Init(ini, 'MinT', null);
	this.MaxTime = Init(ini, 'MaxT', null);
	
	this.OnScreen = Init(ini, 'OnScreen', false);
	this.Limit = Init(ini, 'Limit', null);
	
	this.X = x;
	this.Y = y;
	
	this.CountSpawns = function (t)
	{
		let c = 0;
		
		for (let i = 0; i < this.Zone.Things.length; i++) {
			if (this.Zone.Things[i].SpawnOf == t) c++;
		}
		
		return c;
	}
	
	this.Process = function ()
	{
		if (this.Timer.Tick())
		{
			if (this.Limit) {
				if (this.CountSpawns(thing) >= this.Limit) return;
			}
			
			let on = (
				this.X < this.Zone.View.R + this.Zone.View.W / 2 &&
				this.X > this.Zone.View.L - this.Zone.View.W / 2
			);
			
			if (this.OnScreen && !on) return;
			if (!this.OnScreen && on) return;
			
			let nt = new thing (this.Zone, this.X, this.Y);
			nt.SpawnOf = thing;
			
			this.Zone.Add(nt);
			
			if (this.MinTime && this.MaxTime)
			{
				this.Timer = new Timer(Randge(this.MinTime, this.MaxTime));
			}
		}
	}
}
