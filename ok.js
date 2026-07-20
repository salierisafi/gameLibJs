// BUAT SCRIPT UNTUK DEKLARASI ELEMEN dan CANVAS

// deklarasi variabel
let canvDrag1x = null;
let daftDrag1x = [];

const addCanvasToLib = (canvasId) => {
	canvDrag1x = document.getElementById(canvasId);
	inisialisasiEventDrag();
}; // manggil kanvas yang diberi eventdrag

// mendeklarasikan elemen
const createElement = (elemen) => {
	if (typeof elemen !== 'object' ||
		Array.isArray(elemen)) {console.error("ERROR : Data harus berupa object"); return;}
	if (elemen.x && elemen.y && elemen.name && (elemen.r || 
		( elemen.a && elemen.b))) {
		daftDrag1x.push(elemen);
		if (!elemen.click && "unclick" in elemen) elemen.click = () => {};
	} else {
		console.error("ERROR : Data tidak lengkap. harus ada {name, x, y, (r atau a, b)}");

	}
};

// ini untuk mengambil kembali properti elemen untuk digambar
function getProp(name){
        const idx = daftDrag1x.map(x=>x.name).indexOf(name);
        const elemen = daftDrag1x[idx];
        if (!elemen) return 0;            
	let a = elemen.a || elemen.r;
        let b = elemen.b || elemen.r;
        if (elemen.type === "circle"){
                return {x:elemen.x,y:elemen.y,r:a,sudut:elemen.sudut*Math.PI/180};
        } else if (elemen.type === "ellipse"){
                return {x:elemen.x,y:elemen.y,a:a,b:b,m:0,sudut:elemen.sudut*Math.PI/180};
        } else {
                return {x:elemen.x-a,y:elemen.y-b,w:a*2,h:b*2,sudut:elemen.sudut*Math.PI/180};
        }
}


function editProp(name,prop,val) {
	if (!name || !prop || !val)
	{console.error("Nama Objek, properti, nilai harus diisi"); return;}

	const elemen = daftDrag1x[daftDrag1x.map(x=>x.name).indexOf(name)];
	if (!elemen) {console.error("Nama Objek tidak valid"); return;}
	elemen[prop] = val;

}
// ================================================================

// BUAT SCRIPT UNTUK DRAG BENDA DULU

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
canvDrag1x.addEventListener('pointerdown',(e) => {
	globalClick1x.click && globalClick1x.click();
	const rect = canvDrag1x.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;
	for(let i=0;i<daftDrag1x.length;i++) {
		let a = daftDrag1x[i].a || daftDrag1x[i].r;
                let b = daftDrag1x[i].b || daftDrag1x[i].r;
		if(nyentuh(x,y,daftDrag1x[i].x,daftDrag1x[i].y,
			a,b,daftDrag1x[i].type, daftDrag1x[i].sudut ?? 0) && 
			!touchDrag1x.map(x=>x.elemen).includes(i)) {
			if ("click" in daftDrag1x[i]) canvClick1x(daftDrag1x[i]);
			let idxnull = touchDrag1x.map(x=>JSON.stringify(x)).indexOf("{}");
			if (idxnull === -1) {
				// jika tidak ada slot kosonh langsung push aja
				touchDrag1x.push({id:e.pointerId, elemen:i});
				OffsetXDrag1x.push(daftDrag1x[i].x - x);
                                OffsetYDrag1x.push(daftDrag1x[i].y - y);
			}
			else {
				// Jika ada, isi slot kosong
				touchDrag1x[idxnull] = {id:e.pointerId, elemen:i};
				OffsetXDrag1x[idxnull] = daftDrag1x[i].x - x;
				OffsetYDrag1x[idxnull] = daftDrag1x[i].y - y;
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
canvDrag1x.addEventListener('touchmove',(e) => {
	const rect = canvDrag1x.getBoundingClientRect();
	e.preventDefault(); //biar ngga scroll
	for (let i=0;i<touchDrag1x.length;i++) {
		let idx = touchDrag1x[i];
		let mouseDragX1x = e.touches[i].clientX - rect.left;
		let mouseDragY1x = e.touches[i].clientY - rect.top;
		if(idx.elemen>=0 && idx.elemen<daftDrag1x.length
			&& daftDrag1x[idx.elemen].drag) {
			daftDrag1x[idx.elemen].x = mouseDragX1x + OffsetXDrag1x[i];
                        daftDrag1x[idx.elemen].y = mouseDragY1x + OffsetYDrag1x[i];

			// Saya tidak buat Collision + Drag, Sulit soalnya
			// udah belasan kali nyoba dan gagal
		}
	}
},{passive:false}); // biar ngga skroll

canvDrag1x.addEventListener('pointerup',(e) => {
	globalClick1x.unclick && globalClick1x.unclick();
	let idx = touchDrag1x.map(x=>x.id).indexOf(e.pointerId);
	if (idx != -1) {
		if ("click" in daftDrag1x[touchDrag1x[idx].elemen]) {  
			canvUnclick1x(daftDrag1x[touchDrag1x[idx].elemen]);
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
}); // kalau dilepas, elemen yang disentuh = -1, alias tidak ada
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

 
// ==================================================================

// BARU BUAT SCRIPT UNTUK JOY STICK

let daftJoyStick = [];
let joyStick = null;
let offctxJoy = null;
let joyId = 0;

function createJoyStick(paramX=0,paramY=0,paramR=50) {
	let tempJoy = {
		name:"joyStick"+joyId,
		x:paramX,y:paramY,r:paramR,
		type:"circle",
		drag:true
	};
	let tempCover = {
		name:"joyStick"+joyId,
                x:paramX,y:paramY,r:paramR*8/5,
		sudut:0
	};
	daftDrag1x.push(tempJoy);
	daftJoyStick.push(tempCover);
	const w = canvDrag1x ? canvDrag1x.width : window.innerWidth;
	const h = canvDrag1x ? canvDrag1x.height : window.innerHeight;
	joyStick = joyStick || new OffscreenCanvas(w,h);
	offctxJoy = joyStick.getContext('2d');
	joyId++;
}

function renderJoyStick(name) {
	const joyId = daftDrag1x[daftDrag1x.map(x=>x.name).indexOf(name)];
	const coverId = daftJoyStick[daftJoyStick.map(x=>x.name).indexOf(name)];

	// gambar cover
	offctxJoy.globalAlpha = (coverId.bgOpacity ?? 100) /100;
	offctxJoy.clearRect(0,0,joyStick.width,joyStick.height);
	offctxJoy.fillStyle = coverId.bgColor ?? "black";
        offctxJoy.beginPath();
        offctxJoy.arc(coverId.x,coverId.y,coverId.r,0,Math.PI*2);
        offctxJoy.fill();
        offctxJoy.closePath();

	// gambar border
	offctxJoy.globalAlpha = (coverId.bdOpacity ?? 100) /100;
        offctxJoy.fillStyle = coverId.bdcolor ?? "grey";
        offctxJoy.beginPath();
	offctxJoy.arc(coverId.x,coverId.y,(coverId.r+(coverId.border ?? 0)),0,Math.PI*2);
	offctxJoy.arc(coverId.x,coverId.y,coverId.r,0,Math.PI*2,true);
        offctxJoy.fill();
        offctxJoy.closePath();

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
	

	if (!touchDrag1x.map(x=>x.elemen).includes(daftDrag1x.map(x=>x.name).indexOf(name))) {                     
		joyId.x = coverId.x; joyId.y = coverId.y;
		coverId.sudut = 0;             
		//realX = joyId.x; realY = joyId.y;
	}

	offctxJoy.globalAlpha = (coverId.opacity ?? 100) /100;
	offctxJoy.fillStyle = coverId.color ?? "red";      
	offctxJoy.beginPath();                                             
	offctxJoy.arc(realX,realY,joyId.r,0,Math.PI*2);
        offctxJoy.fill();
        offctxJoy.closePath();
	offctxJoy.globalAlpha = 1;

	// pythagoras 
        let jarakTitikBola = Math.sqrt((coverId.x-joyId.x)**2+(joyId.y-coverId.y)**2);

	if (coverId.tujuan) {
		const elemenId = daftDrag1x[daftDrag1x.map(x=>x.name).indexOf(coverId.tujuan)];
		//let OldX = elemenId.x; let OldY = elemenId.y;
		let normalX = Math.sign(joyId.x - coverId.x);
		let normalY = Math.sign(joyId.y - coverId.y);

		let vx = ('vx' in elemenId) ? elemenId.vx : 3;
		let vy = ('vy' in elemenId) ? elemenId.vy : 3;

		if (Math.abs(joyId.x - coverId.x) < coverId.r) elemenId.x += (joyId.x - coverId.x)/100 * vx;
		else elemenId.x += coverId.r * normalX / 100 * vx;
		if (Math.abs(joyId.y - coverId.y) < coverId.r) elemenId.y += (joyId.y - coverId.y)/ 100 *vy;
		else elemenId.y += coverId.r * normalY /100*vy;

		
		for (let i = 0; i<daftDrag1x.length; i++) {
			// Jika sentuhan, maka dorong ke luar
			if (elemenId.name == daftDrag1x[i].name 
				|| !elemenId.border || !daftDrag1x[i].border) continue;

			let push = isCollision ?
				isCollision(elemenId.name,daftDrag1x[i].name,"resolve") : 0;
			if (push) {
				elemenId.x -= push[0];
				elemenId.y -= push[1];
				break;
			}
		}
		

		if (coverId.sudut != 0 && elemenId.dynamicAng == true) {
			elemenId.sudut = coverId.sudut*180/Math.PI;
		}
	}
	if (canvDrag1x) {
		canvDrag1x.getContext('2d').drawImage(joyStick,0,0);
	}

	if ('isAngle' in coverId) {
		const sudutKhusus = coverId.isAngle;
		for(let i=0;i<sudutKhusus.length;i++) {
			if (!isAngle) return;
			let kondisi = isAngle(coverId.sudut,sudutKhusus[i].From,
				sudutKhusus[i].To,"radian");
			if (kondisi && Math.abs(jarakTitikBola) >= coverId.r) {
				sudutKhusus[i].Run();
			}
		}
	}
	
}

function editJoyStick(name, pilihan, tujuan) {
	const joyId = daftDrag1x[daftDrag1x.map(x=>x.name).indexOf(name)];
        const coverId = daftJoyStick[daftJoyStick.map(x=>x.name).indexOf(name)];
	if (pilihan == "attach") {
		coverId.tujuan = tujuan;
		
		const elemenId = daftDrag1x[daftDrag1x.map(x=>x.name).indexOf(tujuan)];
		elemenId.sudut = elemenId.sudut || 0;

	} else if (pilihan == "rename") {
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

		console.log(coverId.isAngle);
	}
}




