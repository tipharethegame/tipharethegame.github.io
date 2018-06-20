Key = function (codes)
{
	this.Codes = codes;
	this.Down = false;
	this.Pressed = false;
	this.Released = false;
	
	this.Match = function (code) {
		return this.Codes.indexOf(code) != -1;
	}
	
	this.Press = function () {
		if (this.Down) return;
		this.Down = true;
		this.Pressed = true;
		this.Released = false;
	}
	
	this.Release = function () {
		this.Released = true;
	}
	
	this.Forget = function () {
		this.Pressed = false;
		if (this.Released) this.Down = false;
		this.Released = false;
	}
}


Pad = {
	Left: new Key([37, 65]), // Left, A
	Right: new Key([39, 68]), // Right, D
	Up: new Key([38, 87]), // Up, W
	Down: new Key([40, 83]), // Down, S
	A: new Key([16, 75, 90]), // Shift, K, Z
	B: new Key([32, 17, 74, 88]), // Space, Ctrl, J, X
	Select: new Key([8, 86]), // Backspace, V
	Start: new Key([13, 66]), // Enter, B
}


Input = {
	
	Down: {},
	OnKeyDown: null,
	OnKeyUp: null,
	CbTgt: null,
	
	Match: function (code) {
		for (let i in Pad) {
			if (Pad[i].Match(code)) return Pad[i];
		}
	},
	
	Press: function (code) {
		let m = this.Match(code); if (m) m.Press();
		if (this.OnKeyDown) this.OnKeyDown.call(this.CbTgt, code);
		this.Down[code] = true;
	},
	
	Release: function (code) {
		let m = this.Match(code); if (m) m.Release();
		if (this.OnKeyUp) this.OnKeyUp.call(this.CbTgt, code);
		this.Down[code] = false;
	},
	
	Forget: function () {
		for (let i in Pad) {
			Pad[i].Forget();
		}
	}
};


document.onkeydown = function (e)
{
	if (e == undefined) e = window.event;
	Input.Press(e.keyCode);
}

document.onkeyup = function (e)
{
	if (e == undefined) e = window.event;
	Input.Release(e.keyCode);
}


Kbd = {
	Left: 37, Right: 39, Up: 38, Down: 40
}

for (let c = 'A'.charCodeAt(0), k = 65; k <= 90; ++c, ++k)
{
	Kbd[String.fromCharCode(c)] = k;
}
