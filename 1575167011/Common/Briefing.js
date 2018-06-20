@ = function (sheet, sprini, text, jump)
{
	'''Cutscene'''.call(this);
	
	this.Blank = true;
	
	this.Script = [
		[ 'Dim', 0 ],
		[ 'Show', sheet, sprini ],
		[ 'Play', '''Briefing.ogg''' ],
		[ 'Fade', 1 ],
		[ 'Type', text, { Top: 160, Left: 16, Right: Screen.W - 16 } ],
		[ 'Blink', { Text: '>', Top: Screen.H - 24, Left: Screen.W - 24 } ],
		[ 'Wait' ],
		[ 'Fade', 0, { AlsoFadeMusic: true } ],
		[ 'Stop', '''Briefing.ogg''' ],
		[ 'Jump', jump ]
	];
}
