@ = function ()
{
	this.Time = 0;
	this.TimeLimit = 3 * 60;
	
	this.Cam = new '''Cam''';
	this.HudFont = new '''/Common/Font''' ('''HudFont.png''');
	
	this.Sun = { X: 1, Y: -1, Z: 1, Power: 1 };
	Norm3(this.Sun, 149597870700);
	
	this.Earth = new '''Earth''';
	this.Earth.Lites = [ this.Sun ];
	
	this.Station = new '''Station''';
	this.Station.PovCollidable = true;
	this.Station.Parent = this.Earth;
	this.Station.Location.Z = this.Earth.Radius + 100000;
	this.Station.Angular = RotFromPYR(0, 0, 0.0025);
	
	this.Craft = new '''Soyuz''';
	this.Craft.Parent = this.Earth;
	this.Craft.Location.Z = this.Station.Location.Z;
	this.Craft.Location.Y = this.Station.Location.Y - 100;
	this.Craft.Rotation = RotFromPYR(TAU / 8, 0, 0);
	this.FuelLimit = 3;
	
	this.Pov = { X: 0, Y: -1.22, Z: this.Craft.HitBox.F };
	this.Rov = { X: 0, Y: 0, Z: 0, W: 1 };
	
	if (!Config.Get('FREE'))
	{
		this.Craft.Velocity = { X: 0.01, Y: 0.039932, Z: 0.002135 };
		this.Craft.Angular = RotFromPYR(0, 0, 0.001);
	}
	
	this.Earth.Children.push(this.Station);
	this.Earth.Children.push(this.Craft);
	
	this.FontShr = function (src, srci, dst, dsti, arg)
	{
		let b = dst.RawPixels[dsti];
		let f = src.RawPixels[srci];
		
		dst.RawPixels[dsti + 0] =
		dst.RawPixels[dsti + 1] =
		dst.RawPixels[dsti + 2] = b + f;
	}
	
	this.Print = function (x, y, t)
	{
		x = x * this.HudFont.GlyphW;
		y = y * this.HudFont.GlyphH + y * 6;
		
		if (x < 0) x = Screen.W - 6 + x; else x += 6;
		if (y < 0) y = Screen.H - 6 + y; else y += 6;
		
		this.HudFont.DrawLine(t, x, y, this.FontShr);
	}
	
	this.HudF = function (f, n)
	{
		let t = f < 0 ? "" : " ";
		return (t + f.toPrecision(n - 2)).substr(0, n);
	}
	
	this.Jump = function (to)
	{
		Jump(to);
	}
	
	this.GameOver = function (why)
	{
		this.Failed = true;
		this.Finished = true;
		
		if (this.Music) this.Music.Stop();
		if (this.CloseMusic) this.CloseMusic.Stop();
		
		'''/Common/GameOver.ogg'''.Play();
		
		(this.GameOverText = new '''/Common/Text''' (
			why || "G A M E\n\nO V E R", {
				Shader: Raster.ColorizeShr,
				ShArg: { R: 0xFF, G: 0, B: 0 }
			}
		)).CenterBlock();
		
		Screen.Blank();
		this.GameOverText.Draw();
		
		Input.OnKeyDown = Input.OnKeyUp = null;
		for (let i in this.Craft.Thrusters) this.Craft.Thrusters[i].Stop();
		
		this.Render = () => {};
		Delay(this, 5, this.Jump);
	}
	
	this.Win = function ()
	{
		this.Won = true;
		this.Finished = true;
		
		this.Render = () => {};
		
		if (this.Music) this.Music.Stop();
		if (this.CloseMusic) this.CloseMusic.Stop();
		
		'''/Common/Win.ogg'''.Play();
		
		Delay(this, 5, () => Jump('/Intro/TBC'));
	}
	
	this.Render = function ()
	{
		this.Time += Clock.Factor;
		let remt = new Date(this.TimeLimit - this.Time);
		
		if (remt < 0) return this.GameOver("TIME IS UP");
		if (this.Craft.SpentFuel > this.FuelLimit) return this.GameOver("FUEL DEPLETED");
		
		this.Cam.Clear();
		this.Cam.Render(this.Craft, this.Pov, this.Rov);
		if (this.Finished) return;
		this.Cam.PostProc();
		this.Cam.Expose();
		
		let hx = ~~(Screen.W / 2);
		let hy = ~~(Screen.H / 2);
		
		for (let x = 0; x < Screen.W; ++x) @.CrossBicolor(x, hy, x + 11);
		for (let y = 0; y < Screen.H; ++y) @.CrossBicolor(hx, y, y + 9);
		
		this.Print(0, 0, "F44  SBLIJENIE");
		this.Print(0, 1, "ZAPR SB");
		this.Print(0, 2, " B1");
		this.Print(0, 3, "DUS123  1");
		this.Print(0, 4, "K1 B12");
		this.Print(0, 5, "R " + this.FuelLimit);
		this.Print(0, 6, "S" + this.HudF(this.Craft.SpentFuel, 7));
		
		let vvel = Sub3(this.Craft.Velocity, this.Station.Velocity);
		let vdis = Sub3(this.Craft.Location, this.Station.Location);
		let vrot = this.Craft.Rotation;
		let sang = this.Station.Angular;
		let vang = this.Craft.Angular;
		let adif = Turn(FlipQ(this.Craft.Angular), FlipQ(this.Station.Angular));
		
		let vel = this.HudF(Len3(vvel) / Clock.Factor, 6); /* TODO */
		let dis = this.HudF(Len3(vdis) / 1000, 6);
		
		this.Print( -10, 0, "T=00:" + NiceTime(remt));
		this.Print(-9, 1, "GSO NET");
		this.Print(-8, 2, "wx" + this.HudF(vang.X, 6));
		this.Print(-8, 3, "wy" + this.HudF(vang.Y, 6));
		this.Print(-8, 4, "wz" + this.HudF(vang.Z, 6));
		this.Print(-6, 5, "KURS");
		this.Print(-7, 6, "g  " + this.HudF(vrot.X, 4));
		this.Print(-7, 7, "p  " + this.HudF(vrot.Y, 4));
		this.Print(-7, 8, "t  " + this.HudF(vrot.Z, 4));
		this.Print(-8, 9, "p~  " + this.HudF(adif.Y, 4));
		this.Print(-8, 10, "t~  " + this.HudF(adif.Z, 4));
		this.Print(-8, 11, "q " + dis);
		this.Print(-8, 12, "r " + vel);
		this.Print(0, 13, "F  q  " + dis + "km");
		this.Print(0, 14, "   r  " + vel + "m/s");
		this.Print(18, 13, "oy" + this.HudF(adif.Y, 6));
		this.Print(18, 14, "oz" + this.HudF(adif.Z, 6));
		
		Screen.Expose();
	}
	
	let dockMaxVel = 1;
	let dockAngle = RotFromPYR(+2, 0, +2);
	let dockMaxAngleDev = 0.1;
	
	this.Station.OnProcess = (thing, pov, rov) =>
	{
		for (let hbi in thing.HitBoxes)
		{
			let hb = thing.HitBoxes[hbi];
			if (Box3Has(hb, pov)) this.GameOver();
		}
		
		let diry = Rotate3({ X: 0, Y: +1, Z: 0 }, rov);
		let dirz = Rotate3({ X: 0, Y: 0, Z: -1 }, rov);
		
		if (
			Box3Has(thing.Mark, pov) &&
			dirz.Z > 0.9 && diry.Y > 0.9
		) this.Win();
	}
	
	this.Music = '''Docking.ogg''';
	this.Music.Loop();
}

@.CrossBicolor = function (x, y, s)
{
	let v = (~~(s / 7) % 2) ? 0x00 : 0xFF;
	Raster.SetXYRGBA(Screen, x, y, v, v, v, 0xFF);
}
