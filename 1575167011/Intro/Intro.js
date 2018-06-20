@ = function ()
{
	'''/Common/Cutscene'''.call(this);
	
	this.Script = [
		
		[ 'SetSkip', 'Title' ],
		
		[ 'Dim', 0 ],
		[ 'Wait', 1 ],
		[ 'Show', '''Masonic.png''' ],
		[ 'LogoText', 'JUDEO-MASONIC\nENTERTAINMENT' ],
		[ 'Fade', 1 ],
		[ 'Wait', 1 ],
		[ 'Fade', 0 ],
		[ 'HideAll' ],
		
		[ 'Show', '''Gay.png''' ],
		[ 'LogoText', 'GAY AGENDA INC' ],
		[ 'Fade', 1 ],
		[ 'Wait', 1 ],
		[ 'Fade', 0 ],
		[ 'HideAll' ],
		
		[ 'Play', '''Story.ogg''' ],
		[ 'Show', '''Story.png''' ],
		[ 'Fade', 1 ],
		
		[ 'RunTitles',
			" The nuclear war has left the world dominated by two opposing superpowers: the Soviet Orthodox Oligarchate and the Islamic State of Feminism. One thing they have in common is censorship.\n\n" +
			" In a desperate effort to retake the planet, the few surviving dissidents ventured to resurrect an occult mathematician from the XXI century.\n\n" +
			" Only Misha can unban topology and save the world from sexual repression. This is the last hope for humanity."
		],
		[ 'Wait' ],
		
		[ 'Mark', 'Title' ],
		
		[ 'Fade', 0, { AlsoFadeMusic: true } ],
		[ 'Stop', '''Story.ogg''' ],
		[ 'HideAll' ],
		
		[ 'Show', '''Title.png''' ],
		[ 'Fade', 1 ],
		[ 'Play', '''Title.ogg''', 4 ],
		[ 'Blink', { Text: "PRESS START BUTTON", Left: 87, Top: 176 } ],
		
		[ 'Wait',
			[
				{ Pressed: Pad.Start, Value: '/Missions/Nadzor/Briefing' }
			]
		],
		
		[ 'Stop', '''Title.ogg''' ],
		[ 'Fade', 0, { AlsoFadeMusic: true } ],
		
		[ 'JumpCond' ]
	];
}
