// BUAT SCRIPT UNTUK DEKLARASI ELEMEN dan CANVAS

// deklarasi variabel
// Buat nama yang sulit agar tidak tabrakan dengan kode utama
// var + "GameLib1x" agar susah
let canvasGameLib1x = null;
let elemenListGameLib1x = [];

const addCanvasToLib = (canvasId) => {
	canvasGameLib1x = document.getElementById(canvasId);
	inisialisasiEventDrag && inisialisasiEventDrag();
}; // manggil kanvas yang diberi eventdrag

// mendeklarasikan elemen
const createElement = (elemen) => {
	if (typeof elemen !== 'object' ||
		Array.isArray(elemen)) {console.error("ERROR : Data harus berupa object"); return;}
	if (elemen.x && elemen.y && elemen.name && (elemen.r || 
		( elemen.a && elemen.b) || (elemen.w && elemen.h))) {
		if (elemen.w || elemen.h) {elemen.a = elemen.w/2; elemen.b = elemen.h/2;}
		if (elemenListGameLib1x.map(x=>x.name).indexOf(elemen.name) != -1)
		{console.error("Nama sudah dipakai"); return;}
		elemenListGameLib1x.push(elemen);
		if (!elemen.click && "unclick" in elemen) elemen.click = () => {};
		return elemen;
	} else {
		console.error("ERROR : Data tidak lengkap. harus ada {name, x, y, (r atau a, b)}");

	}
};

function getProp(name,prop) {
	if (!name || !prop) return;
	const idx = elemenListGameLib1x.map(x=>x.name).indexOf(name);
        const elemen = elemenListGameLib1x[idx];
        if (!elemen) return 0;
	return elemen[prop];
}

function editProp(name,prop,val) {
	if (!name || !prop || (!val && val != 0))
	{console.error("Nama Objek, properti, nilai harus diisi"); return;}

	const elemen = elemenListGameLib1x[elemenListGameLib1x.map(x=>x.name).indexOf(name)];
	if (!elemen) {console.error("Nama Objek tidak valid"); return;}
	if (prop == "name") {
		 if (elemenListGameLib1x.map(x=>x.name).indexOf(val) != -1) 
		{console.error("Nama sudah dipakai"); return;}
	}
	elemen[prop] = val;
	if (elemen.w || elemen.h) {elemen.a = elemen.w/2; elemen.b = elemen.h/2;}

}

function deleteElement(name) {
	const idx = elemenListGameLib1x.map(x=>x.name).indexOf(name);
	elemenListGameLib1x.splice(idx,1);
}
// ================================================================
// BUAT SCRIPT UNTUK DRAG BENDA

let globalClick1x = {};
function globalClick(tipe,fungsi) {
	globalClick1x[tipe] = fungsi;

}
// deklarasi vriabel
let mouseDragX1x; let mouseDragY1x;                           
let touchDrag1x = [];
let OffsetXDrag1x = [];
let OffsetYDrag1x = [];

// nyentuh pakai rumus berbeda
// migrasi dari superelips karena ^10+ agak lambat

const nyentuh = (x,y,k,h,a,b,t,m=0) => {
	m = m*Math.PI/180; // degres to radian
	if (m != 0) {
		// rotasi dulu koordinat nya
		let nx = k + (x-k)*Math.cos(m)+(y-h)*Math.sin(m);
		let ny = h - (x-k)*Math.sin(m)+(y-h)*Math.cos(m);
		x = nx; y = ny; // kembalikan nilainya
	}
        if (["circle","ellipse"].includes(t)) {
		// rumus lingkaran atau elips
		if(((x-k)/a)**2+((y-h)/b)**2 < 1) return true;
		else return false;
	} else {
		// rumus pemgecekan 4 langkah persegi panjang
		if (x>(k-a)&&x<(k+a)&&y>(h-b)&&y<(h+b)) return true;
		else return false;
	}
}

// fungsi fungsi ini hanya akan dideklare ketika canvas sdh dideklar
function inisialisasiEventDrag() {

 // ketika nyentuh benda, buat, dia menyentuh elemen nomor berapa
canvasGameLib1x.addEventListener('pointerdown',(e) => {
	globalClick1x.click && globalClick1x.click();
	const rect = canvasGameLib1x.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;
	for(let i=0;i<elemenListGameLib1x.length;i++) {
		let a = elemenListGameLib1x[i].a || elemenListGameLib1x[i].r;
                let b = elemenListGameLib1x[i].b || elemenListGameLib1x[i].r;
		if(nyentuh(x,y,elemenListGameLib1x[i].x,elemenListGameLib1x[i].y,
			a,b,elemenListGameLib1x[i].type, elemenListGameLib1x[i].sudut ?? 0) && 
			!touchDrag1x.map(x=>x.elemen).includes(i)) {
			if ("click" in elemenListGameLib1x[i]) canvClick1x(elemenListGameLib1x[i]);
			let idxnull = touchDrag1x.map(x=>JSON.stringify(x)).indexOf("{}");
			if (idxnull === -1) {
				// jika tidak ada slot kosonh langsung push aja
				touchDrag1x.push({id:e.pointerId, elemen:i});
				OffsetXDrag1x.push(elemenListGameLib1x[i].x - x);
                                OffsetYDrag1x.push(elemenListGameLib1x[i].y - y);
			}
			else {
				// Jika ada, isi slot kosong
				touchDrag1x[idxnull] = {id:e.pointerId, elemen:i};
				OffsetXDrag1x[idxnull] = elemenListGameLib1x[i].x - x;
				OffsetYDrag1x[idxnull] = elemenListGameLib1x[i].y - y;
			}
			break;
		}
	}
});

function canvClick1x(tujuan) {
	tujuan.a *= 0.8;
	tujuan.b *= 0.8;
	setTimeout(()=> {
		tujuan.click();
	},50);
}
function canvUnclick1x(tujuan) {    
	tujuan.a *= 1.25;
	tujuan.b *= 1.25;
	setTimeout(()=> {
		if ("unclick" in tujuan) tujuan.unclick();
	},50);
}
// setelah diketahui elemen berapa yng disentuh, baru bisa digerakan
canvasGameLib1x.addEventListener('touchmove',(e) => {
	const rect = canvasGameLib1x.getBoundingClientRect();
	e.preventDefault(); //biar ngga scroll
	for (let i=0;i<touchDrag1x.length;i++) {
		let idx = touchDrag1x[i];
		let mouseDragX1x = e.touches[i].clientX - rect.left;
		let mouseDragY1x = e.touches[i].clientY - rect.top;
		if(idx.elemen>=0 && idx.elemen<elemenListGameLib1x.length
			&& elemenListGameLib1x[idx.elemen].drag) {
			elemenListGameLib1x[idx.elemen].x = mouseDragX1x + OffsetXDrag1x[i];
                        elemenListGameLib1x[idx.elemen].y = mouseDragY1x + OffsetYDrag1x[i];

			// Saya tidak buat Collision + Drag, Sulit soalnya
			// udah belasan kali nyoba dan gagal
		}
	}
},{passive:false}); // biar ngga skroll

canvasGameLib1x.addEventListener('pointerup',(e) => {
	globalClick1x.unclick && globalClick1x.unclick();
	let idx = touchDrag1x.map(x=>x.id).indexOf(e.pointerId);
	if (idx != -1) {
		if ("click" in elemenListGameLib1x[touchDrag1x[idx].elemen]) {  
			canvUnclick1x(elemenListGameLib1x[touchDrag1x[idx].elemen]);
                }
		if (idx == touchDrag1x.length-1) {
			// jika dia terakhir, pop aja
			touchDrag1x.pop();
			OffsetXDrag1x.pop();
			OffsetYDrag1x.pop();
		}else{
			// jika tidak, kosongkan saja
			touchDrag1x[idx] = {};
			OffsetXDrag1x[idx] = 0;   
			OffsetYDrag1x[idx] = 0;
		}
	}
}); // kalau dilepas, elemen yang disentuh = [], alias tidak ada
} 

// =========================
// simpan fungsi asli
const alertAsli = window.alert;
const confirmAsli = window.confirm;
const promptAsli = window.prompt;

// TIMPA ALERT, agar klik ok ngehapus touchDrag1x
window.alert = function(pesan) {
    alertAsli(pesan); 
    touchDrag1x = []; 
}
window.confirm = function(pesan) {
    let hasil = confirmAsli(pesan); 
    touchDrag1x = [];
    return hasil;
}
window.prompt = function(pesan, defaultVal = "") {
    let hasil = promptAsli(pesan, defaultVal);
    touchDrag1x = []; 
    return hasil;
}

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


function isCollision(objek1, objek2, mode="check") {
	if (!elemenListGameLib1x) return;

	// Deklarasi 
	let idx1 = elemenListGameLib1x.map(x=>x.name).indexOf(objek1);
	let idx2 = elemenListGameLib1x.map(x=>x.name).indexOf(objek2);

	if (idx1 == -1 || idx2 == -1) return;
	let obj1 = elemenListGameLib1x[idx1];
	let obj2 = elemenListGameLib1x[idx2];

	let x1 = obj1.x; let y1 = obj1.y; let x2 = obj2.x; let y2 = obj2.y;

	let sudut1 = obj1.sudut * Math.PI /180 || 0;
	let sudut2 = obj2.sudut * Math.PI /180 || 0;

	if (obj1.type == "circle" && obj2.type == "circle") {
		let r1 = obj1.r ?? obj1.a; let r2 = obj2.r ?? obj2.a;
		let T = [x2 - x1, y2 - y1]; // cari jarak antar x dan y
		let jarak = Math.sqrt(T[0] * T[0] + T[1] * T[1]);//rumus pythagoras, cari jarak pusat
		let overlap = (r2 + r1) - jarak; // jumlah jari2 - jarak(jarak antar ujung)

		if (0 > overlap) return false;
		if (mode == "check") return true;

		let nx = T[0]/jarak; let ny = T[1]/jarak; // cari nilai arah

		let pushX = nx * overlap;
		let pushY = ny * overlap;
		return [pushX,pushY];
	} else if ([obj1.type,obj2.type].includes("circle")) {

		// menentukan mana yang lingkaran mana yang persegi
		let normal = obj1.type == "circle" ? -1 : 1;
		let circ = obj1.type == "circle" ? obj1 : obj2;
		let rect = obj1.type == "circle" ? obj2 : obj1;
		let w = rect.a; let h = rect.b; let r = circ.r || circ.a;
		let sudut = rect.sudut * Math.PI/180 || 0;
		// Rotasi Vektor
		let Ax = [Math.cos(sudut), Math.sin(sudut)];
		let Ay = [-Math.sin(sudut), Math.cos(sudut)];
		// jarak antar titik tengah, dx dan dy 
		let T = [circ.x-rect.x,circ.y-rect.y];
		
		const dot = (a,b) => a[0]*b[0]+a[1]*b[1]; //perkalian vektor

		// Transformasi rotasi lingkaran ke posisi dimana Rect tegak lurus
		let localX = dot(T,Ax); // jarak dikali rotasi vektor
		let localY = dot(T,Ay);

		// cari jarak terdekat swtelah lingkaran di rotasi
		let closestX = Math.max(-w, Math.min(localX, w));
		let closestY = Math.max(-h, Math.min(localY, h));

		// hitung jarak local
		let TLoc = [localX-closestX, localY-closestY];
		let jarak = Math.sqrt(dot(TLoc,TLoc)); //pytagoras
		// √(dx² + dy²)
		let overlap = r - jarak;


		// sama kayak yang circle circle
		if (0> overlap) return false;
		if (mode == "check") return true;

		let nx = 0, ny = 0;

		if (jarak > 0) {
			nx = TLoc[0] / jarak;
			ny = TLoc[1] / jarak;
		} else {
			// Kasus Khusus: Pusat Lingkaran persis di dalam Persegi
			// Dorong ke sisi lokal terdekat
			let dx = w - Math.abs(localX);
			let dy = h - Math.abs(localY);
			if (dx < dy) {
				nx = localX >= 0 ? 1 : -1;
			} else {
				ny = localY >= 0 ? 1 : -1;
			}
		}
		
		let localPushX = nx * Ax[0] + ny * Ay[0];
                let localPushY = nx * Ax[1] + ny * Ay[1];
		let pushX = localPushX * overlap * normal;
                let pushY = localPushY * overlap * normal;
                return [pushX,pushY];
	

	} else {

		let w1 = obj1.a; let h1 = obj1.b; let w2 = obj2.a; let h2 = obj2.b;
		// Rotasi vector lagi
		let Ax = [Math.cos(sudut1), Math.sin(sudut1)];
		let Ay = [-Math.sin(sudut1), Math.cos(sudut1)];
		let Bx = [Math.cos(sudut2), Math.sin(sudut2)];
		let By = [-Math.sin(sudut2), Math.cos(sudut2)];
		// T = Jarak Antar titik tengah, atau [dx,dy]
		let T = [x2 - x1, y2 - y1];

		const abdot = (a,b) => Math.abs(a[0]*b[0]+a[1]*b[1]);

		// Pengecekan 4 Langkah, rumus SAT, dapat dari google
		let overlapAx = (w1 + w2*abdot(Bx,Ax) + h2*abdot(By,Ax)) - abdot(T,Ax);
		let overlapAy = (h1 + w2*abdot(Bx,Ay) + h2*abdot(By,Ay)) - abdot(T,Ay);
		let overlapBx = (w1*abdot(Ax,Bx) + h1*abdot(Ay,Bx) + w2) - abdot(T,Bx);
		let overlapBy = (w1*abdot(Ax,By) + h1*abdot(Ay,By) + h2) - abdot(T,By);

		if (overlapAx < 0 || overlapAy <0 || overlapBx <0 || overlapBy <0) return false;
		if (mode == "check") return true;

		let arrOverlap = [overlapAx,overlapAy,overlapBx,overlapBy];
		let minOverlap = Math.min(...arrOverlap);
		let sumbus = [Ax,Ay,Bx,By];
		let sumbu = sumbus[arrOverlap.indexOf(minOverlap)];
		// jarak antar ujung terdekat
		let jarak = T[0] * sumbu[0] + T[1] * sumbu[1];
		sumbu = jarak < 0 ? sumbu.map(x=>-x) : sumbu;

		let pushX = sumbu[0] * minOverlap;
		let pushY = sumbu[1] * minOverlap;


                return [pushX,pushY];
	}
}

// ==========================================================================
function isAngle(objek,ang1,ang2,mode="object") {
	let sudut;
	if (mode == "object") {
		if (!elemenListGameLib1x) return;
		// Deklarasi
		let obj = elemenListGameLib1x[elemenListGameLib1x.map(x=>x.name).indexOf(objek)]; 
		sudut = 'sudut' in obj ? obj.sudut % 360 : 0;
	} else {
		sudut = (mode=="radian" ? (objek*180/Math.PI) : objek) % 360;
		// jika radian ubah jadi degres, jika degres yaudah
	}

	if (sudut == ang1 || sudut == ang2) return true;
	if (!ang2 && sudut != ang1) return false;
	if (ang1>ang2 && ((0<=sudut && sudut <ang2) || ang1 < sudut)) return true;
	if (ang2>ang1 && (ang1 < sudut && sudut < ang2)) return true;
	return false;
	
}

// ==========================================================================

// PERGERAKAN

let gravGameLib1x = 9.8;

function updateMovement() {
	for(let i=0;i<elemenListGameLib1x.length;i++) {
		const elemen = elemenListGameLib1x[i];
		if (elemen.static) continue;
		for(let j=0;j<elemenListGameLib1x.length;j++) {
			const elemen2 = elemenListGameLib1x[j];
			if (!elemen.border) break;
			if (elemen.name == elemen2.name ||
				!elemen2.border) continue;
			const dorong = isCollision(elemen.name,elemen2.name,"resolve");
			if (dorong) {
				elemen.x -= dorong[0];
				elemen.y -= dorong[1];
				break;
			}

		}
		let vy = (elemen.vy ?? 0);
		if (elemen.gravitasi) vy += gravGameLib1x;
		elemen.x += (elemen.vx ?? 0)/3;
		elemen.y += (vy ?? 0)/3;
	}
}

function getVelocityPartial(velocity,sudut) {
	let vx = Math.cos(sudut) * velocity;
	let vy = -Math.sin(sudut) * velocity;
	return {vx:vx, vy:vy};
}

function editGravitation(val=9.8) {
	gravGameLib1x = val;
}


function renderRect(x,y,w,h=w,m=0,
	axisX=50,axisY=50,warna="black"){
	if (!canvasGameLib1x) return;
	const ctx = canvasGameLib1x.getContext('2d');
	if (!x || !y || !w) {
		console.error("Isi x,y dan width!");
		return;
	}

	ctx.save();
	ctx.translate(axisX*w/100+x, axisY*h/100+y);
	ctx.rotate(m);
	ctx.fillStyle = warna;
	ctx.fillRect(-w*axisX/100,-h*axisY/100,w,h);
	ctx.restore();
}

function renderEllipse(x,y,a,b=a,m=0,warna="black"){
	if (!canvasGameLib1x) return;
        const ctx = canvasGameLib1x.getContext('2d');
        if (!x || !y || !a) {          
		console.error("Isi x,y dan radius!");
                return;
        }
	ctx.beginPath();
	ctx.ellipse(x,y,a,b,m,0,Math.PI*2);
	ctx.fillStyle = warna;
	ctx.fill();
	ctx.closePath();
}

function renderObjek(objekname, warna="black"){
	if (!canvasGameLib1x) return;
	const ctx = canvasGameLib1x.getContext('2d');
        if (!objekname) { 
		console.error("Isi nama Objek");
                return;
        }
	const objek = elemenListGameLib1x[elemenListGameLib1x.map(x=>x.name).indexOf(objekname)];
	if (!objek) return;
	ctx.fillStyle = warna;
	let sudut = (objek.sudut ?? 0) * Math.PI/180;
	if (objek.type == "circle") {
		ctx.beginPath();
		ctx.arc(objek.x,objek.y,(objek.r ?? objek.a),0,Math.PI*2);
		ctx.fill();
		ctx.closePath();
	} else if (objek.type == "ellipse") {
		ctx.beginPath();
                ctx.arc(objek.x,objek.y,objek.a,objek.b,objek.sudut,0,Math.PI*2);
                ctx.fill();
                ctx.closePath();
	} else {
		ctx.save();
		ctx.translate(objek.x,objek.y);
		ctx.rotate(sudut);
		ctx.fillRect(-objek.a,-objek.b,2*objek.a,2*objek.b);
		ctx.restore();
	}
}

let imgListGameLib1x = [];
function addImgToLib(link,name,baris=1,kolom=1) {
	if (!link || !name) {console.error("Isi link dan nama!");return}
	if (imgListGameLib1x.map(x=>x.name).indexOf(name) != -1)
	{console.error("Nama sudah dipakai"); return;}

	let img = new Image();

	img.onload = () => {
		let imgW = img.width;
		let imgH = img.height;

		let objekImg = {
                name:name,
                link:img,
                baris:baris,
                width:imgW,
                kolom:kolom,
                height:imgH
		};

		imgListGameLib1x.push(objekImg);
	};
	img.src = link;
}

function renderImg(nameImg,nameObjek,idx=0, flipX=false, flipY=false) {
	if (!canvasGameLib1x) return;
        const ctx = canvasGameLib1x.getContext('2d');

	// definisikan variabel gambar dan objek
	if (!nameImg || !nameObjek) 
	{console.error("Isi nama Gambar dan Nama Objek!"); return;}
	let imgIdx = imgListGameLib1x.map(x=>x.name).indexOf(nameImg);
	let objIdx = elemenListGameLib1x.map(x=>x.name).indexOf(nameObjek);
	if (imgIdx == -1 || objIdx == -1) return;

	let img = imgListGameLib1x[imgIdx];
	let obj = elemenListGameLib1x[objIdx];

	//definisikan properti2 gambar dan objek
	
	let perIdxWidth = img.width/img.baris;
	let perIdxHeight = img.height/img.kolom;
	let idxX = idx % img.baris;
	let idxY = Math.floor(idx / img.baris);
	let sx = idxX * perIdxWidth;
	let sy = idxY * perIdxHeight;

	let scaleX = flipX ? -1 : 1;
	let scaleY = flipY ? -1 : 1;
	//gambar
	ctx.save();
	ctx.translate(obj.x,obj.y);
	ctx.rotate(Math.PI/180 * obj.sudut);
	ctx.scale(scaleX, scaleY);
	ctx.drawImage(img.link,sx,sy,perIdxWidth,perIdxHeight,
		-(obj.a??obj.r), -(obj.b??obj.r),
		(obj.a??obj.r)*2, (obj.b??obj.r)*2);
	ctx.restore();

}
animationListGameLib1x = [];

function createAnimation(nameAnm,nameImg,idxArr){
	if(!nameAnm || !nameImg || !idxArr) {
		console.error("Masukan nama Animasi, nama gambar sumber, dan index animasi!");
		return;
	}
	if (!Array.isArray(idxArr)) {console.error("index harus berupa array!");return;}
	let objAnm = {
		name:nameAnm,
		img:nameImg,
		idxArr:idxArr,
		detik:0
	};
	animationListGameLib1x.push(objAnm);
	return objAnm;
}

function renderAnimation(nameAnm, nameObjek, interval=1, flipX=false, flipY=false) {
	let anm = animationListGameLib1x[animationListGameLib1x.map(x=>x.name).indexOf(nameAnm)];
	let index = Math.floor(anm.detik / (interval*60)) % (anm.idxArr).length;
	renderImg(anm.img,nameObjek,anm.idxArr[index],flipX,flipY);
	anm.detik++;
	if (anm.detik >= interval*60*(anm.idxArr).length) anm.detik =0;
}
