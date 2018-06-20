@ = function (sheet)
{
	this.GlyphSheet = sheet || '''Font.png''';
	
	this.GlyphW = this.GlyphSheet.W / 128;
	this.GlyphH = this.GlyphSheet.H;
}
	
@.prototype.DrawChar = function (c, x, y, shr, arg)
{
	var ascii = c.charCodeAt();
	var gx = ascii * this.GlyphW;
	
	Raster.BlitSLTWHLTD (
		this.GlyphSheet, gx, 0,
		this.GlyphW, this.GlyphH,
		x, y, Screen, shr, arg
	);
}
	
@.prototype.DrawLine = function (l, x, y, shr, arg)
{
	for (
		var ci = 0; ci < l.length;
		ci++, x += this.GlyphW
	) {
		this.DrawChar(l[ci], x, y, shr, arg);
	}
}
