Screen = new Raster(320, 240);


Screen.Dim = function (opa)
{
	for (var i = 0; i < this.RawPixels.length; i += 4)
	{
		this.RawPixels[i + 0] *= opa;
		this.RawPixels[i + 1] *= opa;
		this.RawPixels[i + 2] *= opa;
	}
}

Screen.Blank = function ()
{
	for (var i = 0; i < this.RawPixels.length; i += 4)
	{
		this.RawPixels[i + 0] = 0;
		this.RawPixels[i + 1] = 0;
		this.RawPixels[i + 2] = 0;
	}
}


Screen.FillRect = function (rect, shr, sharg)
{
	for (var y = rect.T; y < rect.B; y++)
	{
		for (var x = rect.L; x < rect.R; x++)
		{
			shr.call(this, Raster.LocatePixel(this, x, y), sharg);
		}
	}
}


Screen.Expose = function ()
{
	this.C2D.putImageData(Screen.RawData, 0, 0);
}


window.addEventListener("load", function () {
	
	Screen.Canvas = document.getElementById('Screen');
	Screen.C2D = Screen.Canvas.getContext('2d');
	
	Screen.Canvas.width = Screen.W;
	Screen.Canvas.height = Screen.H;
	
	Screen.RawData = Screen.C2D.getImageData(0, 0, Screen.W, Screen.H);
	Screen.RawPixels = Screen.RawData.data;
	Screen.RawStride = Screen.W * 4;
	
	for (var i = 0; i < Screen.RawPixels.length; i += 4)
	{
		Screen.RawPixels[i + 0] = 0x00;
		Screen.RawPixels[i + 1] = 0x00;
		Screen.RawPixels[i + 2] = 0x00;
		Screen.RawPixels[i + 3] = 0xFF;
	}
	
} );
