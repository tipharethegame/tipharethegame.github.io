Script = function (path)
{
	this.ID = path;
	
	var ajax = new XMLHttpRequest();
	ajax.Target = this;
	
	ajax.onreadystatechange = function ()
	{
		if (ajax.readyState != 4) return;
		ajax.onreadystatechange = null;
		if (ajax.status != 200) throw ajax.Target.ID;
		
		SetLoaded(ajax.Target.ID, ajax.Target);
		ajax.Target.Parse(ajax.responseText);
	}
	
	try {
		ajax.open('GET', IdToSrc(path));
		ajax.responseType = 'text';
		ajax.send();
	} catch (e) { throw(path + ": " + e); }
}

Script.prototype.Replace = function (raw, optok, cltok, oprep, clrep, func)
{
	var js = '';
	
	var next = 0;
	var prev = 0;
	
	while ((next = raw.indexOf(optok, prev)) >= 0)
	{
		var start = next + optok.length;
		var end = raw.indexOf(cltok, start);
		
		var spath = raw.substring(start, end);
		var abspath = RelToAbs(this.ID, spath);
		
		js += raw.substring(prev, next) + oprep;
		js += abspath + clrep;
		
		if (func) func(abspath);
		
		prev = end + cltok.length;
	}
	
	js += raw.substr(prev);
	return js;
}

Script.prototype.Parse = function (raw)
{
	raw = raw.replace(/\/\/.*\n/, '');
	raw = this.Replace(raw, "'''", "'''", 'Ready["', '"]', Load);
	raw = raw.replace(/\@/g, 'Ready["' + this.ID + '"]');
	
	this.Executable = raw;
}

Script.prototype.Realize = function ()
{
	SetReady(this.ID, {});
	eval(this.Executable);
}
