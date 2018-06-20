@ = function (zone, x, y)
{
	'''/Common/WeakPoint'''.call ( this, zone, x, y, {
		Sprite: new Sprite ('''Mizulina.png''', { N: 2 }),
		Health: 44, Exps: 10, ExpDelay: 0.1
	});
}
