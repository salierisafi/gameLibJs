
// BUAT SCRIPT UNTUK JOY STICK

let JoyStickListGameLib1x = [];
let joyStickcanvasGameLib1x = null;
let offctxJoyGameLib1x = null;
let joyIdGameLib1x = 0;

function createJoyStick(paramX=0,paramY=0,paramR=50) {
	let tempJoy = {
		name:"joyStick"+joyIdGameLib1x,
		x:paramX,y:paramY,r:paramR,
		type:"circle",
		drag:true
	};
	let tempCover = {
		name:"joyStick"+joyIdGameLib1x,
                x:paramX,y:paramY,r:paramR*8/5,
		sudut:0,
		joyVx:3,
		joyVy:3
	};
	elemenListGameLib1x.push(tempJoy);
	JoyStickListGameLib1x.push(tempCover);
	const w = canvasGameLib1x ? canvasGameLib1x.width : window.innerWidth;
	const h = canvasGameLib1x ? canvasGameLib1x.height : window.innerHeight;
	joyStickcanvasGameLib1x = joyStickcanvasGameLib1x || new OffscreenCanvas(w,h);
	offctxJoyGameLib1x = joyStickcanvasGameLib1x.getContext('2d');
	joyIdGameLib1x++;
	return tempCover;
}

let lastAngleJoyStickGameLib1x = 0;

function renderJoyStick(name) {
	const joyId = elemenListGameLib1x[elemenListGameLib1x.map(x=>x.name).indexOf(name)];
	const coverId = JoyStickListGameLib1x[JoyStickListGameLib1x.map(x=>x.name).indexOf(name)];

	// gambar cover
	offctxJoyGameLib1x.globalAlpha = (coverId.bgOpacity ?? 100) /100;
	offctxJoyGameLib1x.clearRect(0,0,joyStickcanvasGameLib1x.width,joyStickcanvasGameLib1x.height);
	offctxJoyGameLib1x.fillStyle = coverId.bgColor ?? "black";
        offctxJoyGameLib1x.beginPath();
        offctxJoyGameLib1x.arc(coverId.x,coverId.y,coverId.r,0,Math.PI*2);
        offctxJoyGameLib1x.fill();
        offctxJoyGameLib1x.closePath();

	// gambar border
	offctxJoyGameLib1x.globalAlpha = (coverId.bdOpacity ?? 100) /100;
        offctxJoyGameLib1x.fillStyle = coverId.bdcolor ?? "grey";
        offctxJoyGameLib1x.beginPath();
	offctxJoyGameLib1x.arc(coverId.x,coverId.y,(coverId.r+(coverId.border ?? 0)),0,Math.PI*2);
	offctxJoyGameLib1x.arc(coverId.x,coverId.y,coverId.r,0,Math.PI*2,true);
        offctxJoyGameLib1x.fill();
        offctxJoyGameLib1x.closePath();

	// cara cari sudut, kan tan(x) = depan/samping
	// x = atan(depan/samping)
	// depan = x-k, samping = h-y
	let tambahan =  Math.PI*2; //360 °
	if (joyId.y > coverId.y) tambahan = Math.PI; //180°
	coverId.sudut = (Math.atan((coverId.x-joyId.x)
		/(joyId.y-coverId.y))+tambahan) % (Math.PI*2);
	// +360 atau 180 / 540 lalu mod 360
	
	// Untuk membuat bola tidak bisa keluar dari radius yang ditentukan
	
	// sin x = depan/miring;   sin x * miring = depan;
	// miring nya pake radius cover
	// sudut nya pake 180° - sudut joystick
	
	let depan = Math.sin(Math.PI-coverId.sudut) * coverId.r;
	// cos x = sampinh/miring; cos x * miring = samping
	let samping = Math.cos(Math.PI-coverId.sudut) * coverId.r;

	let realX; let realY;

	
	if (nyentuh(joyId.x,joyId.y,coverId.x,coverId.y,coverId.r,coverId.r)) {
		realX = joyId.x; realY = joyId.y;
	} else {
		realX = coverId.x + depan; realY = coverId.y + samping;
	}
	

	if (!touchDrag1x.map(x=>x.elemen).includes(elemenListGameLib1x.map(x=>x.name).indexOf(name))) {     
		if (coverId.sudut || coverId.sudut == 0) lastAngleJoyStickGameLib1x = coverId.sudut;
		joyId.x = coverId.x; joyId.y = coverId.y;
		coverId.sudut = lastAngleJoyStickGameLib1x;
	}

	offctxJoyGameLib1x.globalAlpha = (coverId.opacity ?? 100) /100;
	offctxJoyGameLib1x.fillStyle = coverId.color ?? "red";      
	offctxJoyGameLib1x.beginPath();                                             
	offctxJoyGameLib1x.arc(realX,realY,joyId.r,0,Math.PI*2);
        offctxJoyGameLib1x.fill();
        offctxJoyGameLib1x.closePath();
	offctxJoyGameLib1x.globalAlpha = 1;

	// pythagoras 
        let jarakTitikBola = Math.sqrt((coverId.x-joyId.x)**2+(joyId.y-coverId.y)**2);

	if (coverId.tujuan) {
		const elemenId = elemenListGameLib1x[elemenListGameLib1x.map(x=>x.name).indexOf(coverId.tujuan)];
		//let OldX = elemenId.x; let OldY = elemenId.y;
		let normalX = Math.sign(joyId.x - coverId.x);
		let normalY = Math.sign(joyId.y - coverId.y);

		let vx = coverId.joyVx;
		let vy = coverId.joyVy;

		if (Math.abs(joyId.x - coverId.x) < coverId.r) elemenId.x += (joyId.x - coverId.x)/100 * vx;
		else elemenId.x += coverId.r * normalX / 100 * vx;
		if (Math.abs(joyId.y - coverId.y) < coverId.r) elemenId.y += (joyId.y - coverId.y)/ 100 *vy;
		else elemenId.y += coverId.r * normalY /100*vy;

		
		for (let i = 0; i<elemenListGameLib1x.length; i++) {
			if (!elemenId.border) break;
			// Jika sentuhan, maka dorong ke luar
			if (elemenId.name == elemenListGameLib1x[i].name 
				|| !elemenListGameLib1x[i].border) continue;

			let push = isCollision ?
				isCollision(elemenId.name,elemenListGameLib1x[i].name,"resolve") : 0;
			if (push) {
				elemenId.x -= push[0];
				elemenId.y -= push[1];
				break;
			}
		}
		

		if (elemenId.dynamicAng == true) {
			elemenId.sudut = coverId.sudut*180/Math.PI;
		}
	}
	if (canvasGameLib1x) {
		canvasGameLib1x.getContext('2d').drawImage(joyStickcanvasGameLib1x,0,0);
	}

	if ('isAngle' in coverId) {
		const sudutKhusus = coverId.isAngle;
		for(let i=0;i<sudutKhusus.length;i++) {
			if (typeof isAngle === 'undefined') return;
			let kondisi = isAngle(coverId.sudut,sudutKhusus[i].From,
				sudutKhusus[i].To,"radian");
			if (kondisi && Math.abs(jarakTitikBola) >= coverId.r) {
				if('Run' in sudutKhusus) sudutKhusus[i].Run();
			} else {
				if('unRun' in sudutKhusus) sudutKhusus[i].unRun();
			}
		}
	}
	
}

function editJoyStick(name, pilihan, tujuan) {
	const joyId = elemenListGameLib1x[elemenListGameLib1x.map(x=>x.name).indexOf(name)];
        const coverId = JoyStickListGameLib1x[JoyStickListGameLib1x.map(x=>x.name).indexOf(name)];
	if (pilihan == "attach") {
		coverId.tujuan = tujuan;
		
		const elemenId = elemenListGameLib1x[elemenListGameLib1x.map(x=>x.name).indexOf(tujuan)];
		elemenId.sudut = elemenId.sudut || 0;

	} else if (pilihan == "rename") {
		if (elemenListGameLib1x.map(x=>x.name).indexOf(tujuan) != -1)
		{console.error("Nama sudah dipakai"); return;}
		joyId.name = tujuan;
		coverId.name = tujuan;
	} else if (pilihan == "setpos") {
		if ('x' in tujuan) joyId.x = coverId.x = tujuan.x;
		if ('y' in tujuan) joyId.y = coverId.y = tujuan.y;
		if ('r' in tujuan) joyId.r = tujuan.r; coverId.r = tujuan.r*8/5;
	} else if (pilihan == "style") {
		if ('radius' in tujuan) coverId.r = tujuan.radius;
		if ('bg-color' in tujuan) coverId.bgColor = tujuan['bg-color'];
		if ('color' in tujuan) coverId.color = tujuan.color;
		if ('bg-opacity' in tujuan) coverId.bgOpacity = tujuan['bg-opacity'];
		if ('opacity' in tujuan) coverId.opacity = tujuan.opacity;
		if ('bd-color' in tujuan) coverId.bdColor = tujuan['bd-color'];
		if ('border' in tujuan) coverId.border = tujuan.border;
		if ('bd-opacity' in tujuan) coverId.bdOpacity = tujuan['bd-opacity'];
	} else if (pilihan == "velocity") {
		if ('vx' in tujuan) coverId.joyVx = tujuan.vx;
		if ('vy' in tujuan) coverId.joyVy = tujuan.vy;
	} else if (pilihan == "isAngle") {
		let angle = {};
		if ('From' in tujuan) angle.From = tujuan.From;
		else {console.error("From (Sudut awal) harus diisi"); return;}
		if ('Run' in tujuan) angle.Run= tujuan.Run;
		else {console.error("Run (Fungsi) harus diisi"); return;}
		if ('To' in tujuan) angle.To = tujuan.To;
		else angle.To = tujuan.From;
		if (!coverId.isAngle) coverId.isAngle = [];
		coverId.isAngle.push(angle);

	}
}



function getJoyStick(name, prop) {
	if (!name || !prop) return;
	const coverId = JoyStickListGameLib1x[JoyStickListGameLib1x.map(x=>x.name).indexOf(name)];
	return coverId[prop];
}
