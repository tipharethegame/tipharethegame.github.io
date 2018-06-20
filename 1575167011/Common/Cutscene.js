@ = function ()
{
	this.Pictures = [];
	this.Pointer = 0;
	this.Expo = 1;
	
	this.Show = function (sheet, ini)
	{
		if (!ini) ini = { };
		
		if (!ini.PX) ini.PX = 0;
		if (!ini.PY) ini.PY = 0;
		
		var pic = new Sprite (sheet, ini);
		
		pic.OX = ini.OX || 0;
		pic.OY = ini.OY || 0;
		
		this.Pictures.push(pic);
	}
	
	this.LogoText = function (text)
	{
		this.Text = new '''Text''' (text);
		this.Text.CenterBlock();
		this.Text.Top = Screen.H / 8 * 5;
	}
	
	this.Hide = function (sheet)
	{
		if (sheet) this.Pictures = this.Pictures.filter (
			function (e, i, a) { return e.Sheet == sheet; }
		); else this.Pictures.length = 0;
	}
	
	this.HideAll = function ()
	{
		this.Pictures.length = 0;
		this.Typing = null;
		this.Blinking = null;
		this.Titles = null;
		this.Text = null;
	}
	
	this.SetSkip = function (to)
	{
		this.SkipTo = to;
	}
	
	this.GoTo = function (mark)
	{
		this.Pointer = this.Script.findIndex (
			function (o, i, a) { return o[0] == 'Mark' && o[1] == mark; }
		);
	}
	
	this.Wait = function (timeOrConds)
	{
		if (timeOrConds && timeOrConds.length > 0) this.Conds = timeOrConds;
		else if (timeOrConds > 0) this.Waiting = new Date().getTime() + timeOrConds * 1000;
		else this.Waiting = -1;
	}
	
	this.Dim = function (dim)
	{
		this.Expo = dim;
	}
	
	this.Fade = function (target, ini)
	{
		this.FadeTarget = target;
		this.FadeDelta = (this.FadeTarget - this.Expo) * Clock.Factor / Init(ini, 'Time', 0.25);
		this.AlsoFadeMusic = Init(ini, 'AlsoFadeMusic', false);
	}
	
	this.Blank = function ()
	{
		this.Expo = 0;
		this.Pictures = [];
	}
	
	this.Play = function (music, start)
	{
		this.Music = music;
		this.Music.Loop(start);
	}
	
	this.Stop = function (music)
	{
		music.Stop();
		this.Music = null;
	}
	
	this.Type = function (text, ini)
	{
		this.Typing = new '''Text''' (text, ini);
		this.Typing.Cutoff = 0;
		this.Typing.Unskippable = Init(ini, 'Unskippable', false);
	}
	
	this.Jump = function (jump)
	{
		Jump(jump);
	}
	
	this.JumpCond = function ()
	{
		Jump(this.CondValue);
	}
	
	this.Blink = function (ini)
	{
		this.Blinking = new '''Text''' (ini.Text, ini);
		this.Blinking.Elapsed = 0;
		this.Blinking.Phase = true;
	}
	
	this.Mark = function ()
	{
		this.SkipTo = null;
	}
	
	this.RunTitles = function (text)
	{
		this.Titles = new '''Text''' ( text, { RowHeight: 2, Top: Screen.H } );
	}
	
	this.Render = function ()
	{
		if (this.Blank)
		{
			Screen.Blank();
		}
		
		for (var i = 0; i < this.Pictures.length; i++)
		{
			var pic = this.Pictures[i];
			pic.Draw(pic.OX, pic.OY);
		}
		
		if (this.Text)
		{
			this.Text.Draw();
		}
		
		if (this.Titles)
		{
			this.Titles.Draw();
			this.Titles.Top -= 25 * Clock.Factor;
			
			if (this.Titles.Bottom < 0)
			{
				this.Titles = null;
				this.Waiting = null;
			}
		}
		
		if (this.Typing)
		{
			this.Typing.Draw();
			
			if (!this.Typing.Unskippable && Pad.Start.Pressed)
			{
				this.Typing.Cutoff = Infinity;
			}
			else
			{
				if (Pad.Start.Pressed) this.Typing.Skip = true;
				this.Typing.Cutoff += 20 * Clock.Factor;
			}
		}
		
		if (this.Blinking)
		{
			if (this.Blinking.Elapsed > 0.5)
			{
				this.Blinking.Elapsed = 0;
				this.Blinking.Phase = !this.Blinking.Phase;
			}
			
			if (this.Blinking.Phase) this.Blinking.Draw();
			this.Blinking.Elapsed += Clock.Factor;
		}
		
		if (this.FadeDelta)
		{
			if (
				this.FadeDelta < 0 && this.Expo > this.FadeTarget ||
				this.FadeDelta > 0 && this.Expo < this.FadeTarget
			) {
				
				this.Expo += this.FadeDelta;
				
				if (this.Expo < 0) this.Expo = 0;
				else if (this.Expo > 1) this.Expo = 1;
				
				if (this.Music && this.AlsoFadeMusic) this.Music.SetVolume(this.Expo);
				
			} else this.FadeDelta = null;
		}
		
		if (this.Expo < 1)
		{
			Screen.Dim(this.Expo);
		}
		
		if (this.SkipTo && Pad.Start.Pressed)
		{
			this.GoTo(this.SkipTo);
			this.SkipTo = null;
			this.Waiting = null;
		}
		
		if (this.Waiting)
		{
			if (this.Waiting < 0 && !Pad.Start.Pressed) return;
			else if (this.Waiting > new Date().getTime()) return;
			else this.Waiting = null;
		}
		
		if (this.Conds)
		{
			for (var ci in this.Conds)
			{
				var cond = this.Conds[ci];
				
				if (cond.Pressed && cond.Pressed.Pressed)
				{
					this.CondValue = cond.Value;
					this.Conds = null;
					break;
				}
			}
			
			return;
		}
		
		while (
			!this.Conds && !this.Waiting && !this.FadeDelta
			&& (!this.Typing || this.Typing.Length < this.Typing.Cutoff || this.Typing.Skip)
		) {
			var step = this.Script[this.Pointer++];
			
			if (step[0] in this) this[step[0]].call ( this,
				step.length > 0 ? step[1] : null,
				step.length > 1 ? step[2] : null
			);
			
			if (this.Pointer >= this.Script.length) return;
		}
	}
}
