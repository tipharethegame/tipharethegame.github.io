@ = function (alias)
{
	this.Gravity = 500;
	this.View = new Box.FromLTWH(0, 0, Screen.W, Screen.H);
	this.Things = [];
	
	this.ProcessCollisions = function (thing, how, ox, oy, tx, ty)
	{
		for (var ti = 0; ti < this.Things.length; ti++)
		{
			var t = this.Things[ti];
			if (t == thing || !how(t.Type)) continue;
			
			if (Rect.HasXY(t, ox, oy)) continue; //////
			
			var coll = Rect.Collide(ox, oy, t, tx, ty);
			if (coll) return coll;
		}
		
		var seek = this.Guide.Seek(ox, oy, tx, ty);
		if (seek && how(seek.What)) return seek;
		
		return null;
	}
	
	this.Add = function (thing)
	{
		this.Things.push(thing);
		if (thing.OnAdd) thing.OnAdd(this);
		return thing;
	}
	
	this.AddAll = function (things)
	{
		things.forEach(this.Add, this);
	}
	
	this.Remove = function (thing)
	{
		thing.Gone = true;
		if (thing.OnGone) thing.OnGone(this);
	}
	
	this.RemoveAll = function (things)
	{
		things.forEach(this.Remove, this);
	}
	
	this.Draw = function (sprite, x, y, shr, sharg)
	{
		sprite.Draw(x - this.View.L, y - this.View.T, shr, sharg);
	}
	
	
	this.VisualizeBounds = function (thing)
	{
		if (!Rect.Intersect(thing, this.View)) return;
		
		var l = thing.L - this.View.L, r = thing.R - this.View.L;
		var t = thing.T - this.View.T, b = thing.B - this.View.T;
		var x = thing.X - this.View.L, y = thing.Y - this.View.T;
		
		var color = { R: 0xFF, G: 0, B: 0, A: 0xFF };
		
		Raster.BresenLine(Screen, { X: l, Y: t }, { X: r, Y: t }, Raster.RepShr, color);
		Raster.BresenLine(Screen, { X: l, Y: b }, { X: r, Y: b }, Raster.RepShr, color);
		Raster.BresenLine(Screen, { X: l, Y: t }, { X: l, Y: b }, Raster.RepShr, color);
		Raster.BresenLine(Screen, { X: r, Y: t }, { X: r, Y: b }, Raster.RepShr, color);
		Raster.BresenLine(Screen, { X: l, Y: y }, { X: r, Y: y }, Raster.RepShr, color);
		Raster.BresenLine(Screen, { X: x, Y: t }, { X: x, Y: b }, Raster.RepShr, color);
	}
	
	
	this.Start = function ()
	{
		this.Started = true;
		this.Failed = false;
		
		Config.Set(this.Alias + '.Started', true);
	}
	
	this.Win = function (next, ini)
	{
		this.Won = true;
		this.Stopped = true;
		
		this.Music.Stop();
		
		if (Init(ini, 'WinMusic', true)) {
			Delay(this, 2, function () { '''Win.ogg'''.Play() });
		}
		
		var zone = this;
		
		Delay (
			this, 6,
			function () {
				this.Add (
					new @.Dimmer (
						1, 0, 1, +Infinity,
						function () {
							Delay (
								this, Init(ini, 'Wait', 1),
								function () { zone.Jump(next) });
						}
					)
				);
			}
		);
	}
	
	this.GameOver = function (why)
	{
		this.Failed = true;
		this.Stopped = true;
		
		if (this.Music) this.Music.Stop();
		'''GameOver.ogg'''.Play();
		
		this.gameOverTimeout = new Timer(5);
		
		this.gameOverText = new '''Text''' (
			why || this.CustomGameOverText ||
			"G A M E\n\nO V E R", {
				Shader: Raster.ColorizeShr,
				ShArg: { R: 0xFF, G: 0, B: 0 }
			}
		);
		
		this.gameOverText.CenterBlock();
	}
	
	
	this.Finalize = function ()
	{
		for (var ti in this.Things)
		{
			if (this.Things[ti].Finalize) this.Things[ti].Finalize();
		}
	}
	
	this.Jump = function (to)
	{
		this.Finalize();
		
		if (this.FinalMusic)
		{
			this.FinalMusic.Stop();
			this.FinalMusic = null;
		}
		
		Jump(to);
	}
	
	this.GetCurrentWrap = function ()
	{
		if (this.WrapOverride) return this.WrapOverride;
		else if (this.Wraps)
		{
			for (var i in this.Wraps)
			{
				if (
					Rect.HasPoint(this.Wraps[i], this.Player)
				) return this.Wraps[i];
			}
		}
		else return null;
	}
	
	this.Render = function ()
	{
		if (!this.Started)
		{
			this.Start();
		}
		
		for (var i = 0; i < this.Things.length; i++) { var t = this.Things[i];
			if (t.Process) t.Process(this);
		}
		
		this.Things = this.Things.filter (
			function (e, i, a) { return !e.Gone }
		);
		
		if (!this.Failed)
		{
			let wrap = this.GetCurrentWrap();
			
			let focSrc = this.Player.Focus;
			let focDst = this.Player.Focus;
			
			if (wrap)
			{
				focDst = wrap.Wrap(this.Player.Focus);
			}
			
			if (this.PreWrap != wrap)
			{
				this.WrapProgress = 0;
				this.FocSrc = focSrc = new ShCpy(this.Focus);
				this.PreWrap = wrap;
			}
			
			if (this.FocSrc)
			{
				if (this.WrapProgress > 1)
				{
					ShCpy.call(this.Focus, focDst);
					this.FocSrc = null;
				}
				else
				{
					this.Focus.X = this.FocSrc.X + (focDst.X - this.FocSrc.X) * this.WrapProgress;
					this.Focus.Y = this.FocSrc.Y + (focDst.Y - this.FocSrc.Y) * this.WrapProgress;
				}
				
				this.WrapProgress += @.Wrap.Increment;
			}
			else
			{
				ShCpy.call(this.Focus, focDst);
			}
			
			let x = this.Focus.X;
			let y = this.Focus.Y;
			
			if (this.FocusOffset)
			{
				x += this.FocusOffset.X;
				y += this.FocusOffset.Y;
			}
			
			Box.PutAtX(this.View, ~~x);
			Box.PutAtY(this.View, ~~y);
		
			Box.ConstrainLTRB (
				this.View, 0, 0, this.Guide.Raster.W, this.Guide.Raster.H
			);
		}
		
		this.Things = this.Things.sort( function (a, b) {
			var az = a.Z || 0, bz = b.Z || 0;
			return (az == bz) ? 0 : (az > bz ? +1 : -1);
		} );
		
		for (var i = 0; i < this.Things.length; i++)
		{
			if (this.Things[i].Draw) this.Things[i].Draw(this);
		}
		
//		for (var i in this.Things) this.VisualizeBounds(this.Things[i]);
//		Raster.BlitSLTWHLTD ( this.Guide.Raster,
//			this.View.L, this.View.T, this.View.W, this.View.H,
//			0, 0,
//		Screen );
		
		if (this.gameOverText) this.gameOverText.Draw();
		if (this.gameOverTimeout && this.gameOverTimeout.Tick()) this.Jump();
	}
	
	
	this.X2S = function (x) { return x - this.View.L; }
	this.Y2S = function (y) { return y - this.View.T; }
	
	this.LocalizeBox = function (box)
	{
		return new Box.FromXYWH (
			this.X2S(box.X),
			this.Y2S(box.Y),
			box.W, box.H
		);
	}
	
	this.LocalizePoint = function (pt)
	{
		return {
			X: this.X2S(pt.X),
			Y: this.Y2S(pt.Y)
		};
	}
	
	this.Add(new @.Dimmer(0, 1, 0.5, +Infinity));
	
	this.WrapProgress = 0;
	this.Focus = { X: 0, Y: 0 };
}


@.Plane = function (zone, raster, ini)
{
	this.Zone = zone;
	this.Raster = raster;
	
	this.Z = Init(ini, 'Z', 0);
	
	this.MX = Init(ini, 'MX', 1);
	this.MY = Init(ini, 'MY', 1);
	this.OX = Init(ini, 'OX', 0);
	this.OY = Init(ini, 'OY', 0);
	
	this.X2S = function (x) { return x - this.OX - ~~(this.Zone.View.L * this.MX); }
	this.Y2S = function (y) { return y - this.OY - ~~(this.Zone.View.T * this.MY); }
	
	this.Draw = function ()
	{
		Raster.BlitSLTWHLTD ( this.Raster,
			this.OX + ~~(this.Zone.View.L * this.MX),
			this.OY + ~~(this.Zone.View.T * this.MY),
			Screen.W, Screen.H, 0, 0, Screen
		);
	}
}


@.Dimmer = function (from, to, time, zindex, ondone)
{
	this.Z = zindex || 0;
	
	this.Value = from;
	this.Target = to;
	
	this.OnDone = ondone;
	
	this.Increment = (to - from) / time * Clock.Factor;
	
	this.Process = function (zone)
	{
		this.Value += this.Increment;
		
		if (
			(this.Increment < 0 && this.Value < this.Target) ||
			(this.Increment > 0 && this.Value > this.Target)
		) {
			this.Value = this.Target;
			if (this.Target == 1) this.Gone = true;
			delete this.Process;
			if (this.OnDone) this.OnDone();
		}
	}
	
	this.Draw = function (zone)
	{
		Screen.Dim(this.Value);
	}
}


@.IcoLine = function (sheet, text, l, t)
{
	this.Font = new '''/Common/Font''';
	this.Icon = new Sprite(sheet, { PX: 0, PY: 0 });
	this.Text = text;
	
	this.L = l >= 0 ? l * this.Font.GlyphW : Screen.W + l * this.Font.GlyphW;
	this.T = t >= 0 ? t * this.Font.GlyphH : Screen.H + t * this.Font.GlyphH;
	
	this.Draw = function ()
	{
		this.Icon.Draw(this.L, this.T);
		this.Font.DrawLine(this.Text, this.L + this.Icon.W + this.Font.GlyphW, this.T);
	}
}

@.Wrap = function (zone, l, t, r, b, ini)
{
	this.Zone = zone;
	Rect.FromLTRB.call(this, l, t, r, b);
	
	this.FixX = ini.FixX;
	this.FixY = ini.FixY;
	this.Bound = ini.Bound;
	
	this.Wrap = function (p)
	{
		let x = this.FixX ? this.FixX : p.X;
		let y = this.FixY ? this.FixY : p.Y;
		
		if (this.Bound)
		{
			let hvw = this.Zone.View.W / 2;
			let hvh = this.Zone.View.H / 2;
			
			let bl = this.L + hvw, bt = this.T + hvh;
			let br = this.R - hvw, bb = this.B - hvh;
			
			if (p.X < bl) x = bl; else if (p.X > br) x = br;
			if (p.Y < bt) y = bt; else if (p.Y > bb) y = bb;
		}
		
		return { X: x, Y: y };
	}
}

@.Wrap.Increment = Clock.Factor / 0.25;
