@ = function (ini)
{
	this.Z = ini.Z || -1;
	this.Sprite = new Sprite('''TripEmitter.png''');
	this.AlertSprite = new Sprite('''TripEmitter.Alert.png''', { N: 2, T: 0.125 });
	
	if (ini.Path)
	{
		this.Path = [];
		this.Caret = 0;
		
		let appp = function (dst, src, i0, i1, dir)
		{
			for (let i = i0; i != i1; i += dir)
			{
				let p0 = src[i];
				let p1 = src[i + dir];
				
				let len = Dis(p0, p1);
				let cnt = ini.T / Clock.Factor;
				
				let dx = (p1.X - p0.X) / cnt;
				let dy = (p1.Y - p0.Y) / cnt;
				
				let x = p0.X;
				let y = p0.Y;
				
				for (let j = 0; j < cnt; j++)
				{
					dst.push({ X: x, Y: y });
				
					x += dx;
					y += dy;
				}
			}
		}
		
		appp(this.Path, ini.Path, 0, ini.Path.length - 1, +1);
		appp(this.Path, ini.Path, ini.Path.length - 1, 0, -1);
	}
	else
	{
		this.X = ini.X;
		this.Y = ini.Y;
	}
	
	this.Process = function (zone)
	{
		if (this.Path)
		{
			if (this.Caret >= this.Path.length) this.Caret = 0;
			
			Box.PutAtX(this, this.Path[this.Caret].X);
			Box.PutAtY(this, this.Path[this.Caret].Y);
			
			this.Caret++;
		}
	}
	
	this.Draw = function (zone)
	{
		zone.Draw (
			this.Alert ? this.AlertSprite : this.Sprite,
			this.X, this.Y
		);
	}
}
