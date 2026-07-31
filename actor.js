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
	if (!name) elemenListGameLib1x = [];
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

 

