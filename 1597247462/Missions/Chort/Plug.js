@ = function (zone, l, t, w, h)
{
	'''/Common/Obstacle'''.call( this, zone, l, t,
		new Sprite(w > h ? '''Plug.H.png''' : '''Plug.V.png'''), 3
	);
	
	Box.FromLTWH.call(this, l, t, w, h);
	if (w < h) Box.MoveR(this, -1); // TODO: wtf h4x
}
