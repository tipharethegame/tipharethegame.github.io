@ = function ()
{
	'''Obj3ct'''.call(this);
	'''StationMesh'''.call(this);
	this.Prepare();
	
	this.Mark = { L: -0.2, R: +0.2, B: -1.5, T: -1.0, F: -4.3, A: -4.0 };
	this.Port = { L: -0.5, R: +0.5, B: -0.5, T: +0.5, F: -4.3, A: -3.3 };
	
	this.Close = {
		L: -1.5, R: +1.5, B: -1.5, T: +1.5, F: -10, A: -4
	};
	
	this.HitBoxes = {
		
		CenBig: { L: -5, R: +5, B: -5, T: +5, F: 0, A: +10 },
		CenSml: { L: -2, R: +2, B: -2, T: +2, F: -4, A: +13 },
		
		DomeC: { L: -4, R: +4, B: -4, T: +4, F: +13, A: +19 },
		CrxsC: { L: -3, R: +3, B: -3, T: +3, F: +19, A: +30 },
		
		TrussX: { L: -22, R: +22, B: -2, T: +2, F: +2, A: +8 },
		TrussY: { L: -2, R: +2, B: -22, T: +22, F: +2, A: +8 },
		
		DomeL: { L: -20-4, R: -20+4, B: -4, T: +4, F: +7, A: +13 },
		DomeR: { L: +20-4, R: +20+4, B: -4, T: +4, F: +7, A: +13 },
		DomeB: { L: -4, R: +4, B: -20-4, T: -20+4, F: +7, A: +13 },
		DomeT: { L: -4, R: +4, B: +20-4, T: +20+4, F: +7, A: +13 },
		
		CrxsL: { L: -20-3, R: -20+3, B: -3, T: +3, F: +13, A: +24 },
		CrxsR: { L: +20-3, R: +20+3, B: -3, T: +3, F: +13, A: +24 },
		CrxsB: { L: -3, R: +3, B: -20-3, T: -20+3, F: +13, A: +24 },
		CrxsT: { L: -3, R: +3, B: +20-3, T: +20+3, F: +13, A: +24 },
	};
}
