@ = function (zone, x, y, rays)
{
	'''/Common/Obstacle'''.call ( this, zone, x, y,
		new Sprite('''TripPower.png''', { N: 4, T: 0.1 } ), 3
	);
	
	this.Type = null;
	this.Rays = rays;
	
	this.OnDestruction = function ()
	{
		for (var i in rays) rays[i].ShutDown();
	}
}
