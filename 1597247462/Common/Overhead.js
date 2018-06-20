@ = function (zone, icon, text, delay)
{
	this.Z = +Infinity;
	this.Icon = new Sprite(icon, { PX: 0, PY: 0 });
	this.Font = new '''Font''';
	
	Delay(this, delay || 1, function () { this.Gone = true });
	
	this.Draw = function (zone)
	{
		var w = this.Icon.W + this.Font.GlyphW * (1 + text.length);
		var l = ~~zone.X2S(zone.Player.X - w / 2);
		var t = ~~zone.Y2S(zone.Player.T - this.Font.GlyphH * 2);
		
		this.Icon.Draw(l, t);
		this.Font.DrawLine(text, l + this.Icon.W + this.Font.GlyphW, t);
	}
}
