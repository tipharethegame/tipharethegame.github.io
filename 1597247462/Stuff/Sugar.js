Randge = function (min, max)
{
	return min + Math.random() * (max - min);
}


Init = function (ini, key, deft)
{
	if (ini && key in ini) return ini[key];
	else return deft;
}


ShCpy = function (src)
{
	for (var i in src)
	{
		this[i] = src[i];
	}
}

DpCpy = function (src)
{
	for (var i in src)
	{
		if (typeof src[i] == 'Object') this[i] = new DpCpy(src[i]);
		else this[i] = src[i];
	}
}


JArs = function (ars)
{
	var cat = [];
	for (var i in ars) cat.push.apply(cat, ars[i]);
	return cat;
}

function LPadStr (pad, str)
{
	str = String(str);
	
	if (str.length >= pad.length) return str;
	return pad.substr(0, pad.length - str.length) + str;
}

NiceTime = function (secs)
{
	var mins = Math.floor(secs / 60);
	var secs = Math.floor(secs % 60);
		
	return (
		LPadStr("00", mins) + ":" +
		LPadStr("00", secs)
	);
}


log = console.log;
