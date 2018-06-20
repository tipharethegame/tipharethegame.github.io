@ = function (text, ini)
{
	this.Font = new '''/Common/Font''';
	
	this.Top = Init(ini, 'Top', this.Font.GlyphH);
	this.Left = Init(ini, 'Left', this.Font.GlyphW);
	this.Right = Init(ini, 'Right', Screen.W - this.Font.GlyphW);
	this.RowHeight = Init(ini, 'RowHeight', 1);
	this.Cutoff = Init(ini, 'Cutoff', Infinity);
	this.LineCutoff = Init(ini, 'LineCutoff', Infinity);
	this.Shader = Init(ini, 'Shader', null);
	this.ShArg = Init(ini, 'ShArg', null);
	
	this.Length = 0;
	
	this.TableWidth = (this.Right - this.Left) / this.Font.GlyphW;
	this.Lines = [];
	
	var curLine = 0;
	var lineWidth = 0;
	
	for (var ls = text.split('\n'), li = 0; li < ls.length; li++)
	{
		this.Length += ls[li].length;
		this.Lines[curLine] = [];
		
		for (var ws = ls[li].split(' '), wi = 0; wi < ws.length; wi++)
		{
			if (lineWidth + ws[wi].length > this.TableWidth)
			{
				this.Lines[++curLine] = [];
				lineWidth = 0;
			}
			
			this.Lines[curLine].push(ws[wi]);
			lineWidth += ws[wi].length + 1;
		}
		
		curLine++;
		lineWidth = 0;
	}
	
	for (var li = 0; li < this.Lines.length; li++)
	{
		this.Lines[li] = this.Lines[li].join(' ');
	}
	
	this.Draw = function ()
	{
		if (this.Cutoff == 0) return;
		if (this.LineCutoff == 0) return;
		
		var ox = Math.round(this.Left);
		var oy = Math.round(this.Top);
		
		for (
			var li = 0, y = oy, n = 0;
			li < this.Lines.length && li < this.LineCutoff;
			li++, y += this.Font.GlyphH * this.RowHeight
		) {
			for (
				var ci = 0, x = ox; ci < this.Lines[li].length;
				ci++, x += this.Font.GlyphW
			) {
				this.Font.DrawChar(this.Lines[li][ci], x, y, this.Shader, this.ShArg);
				if (++n >= this.Cutoff) return;
			}
		}
		
		this.Bottom = y;
	}
	
	this.CenterBlock = function ()
	{
		this.MaxWidth = 0;
		
		for (var li in this.Lines)
		{
			this.MaxWidth = Math.max(this.Lines[li].length, this.MaxWidth);
		}
		
		this.Left = Screen.W / 2 - this.MaxWidth / 2 * this.Font.GlyphW;
		this.Top = Screen.H / 2 - this.Lines.length / 2 * this.Font.GlyphH * this.RowHeight;
	}
}
