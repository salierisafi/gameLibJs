
function isCollision(objek1, objek2, mode="check") {
	if (!daftDrag1x) return;

	// Deklarasi 
	let obj1 = daftDrag1x[daftDrag1x.map(x=>x.name).indexOf(objek1)];
	let obj2 = daftDrag1x[daftDrag1x.map(x=>x.name).indexOf(objek2)];

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
		let sudut = rect.sudut * Math.PI /180 || 0;
		// Rotasi Vektor
		let Ax = [Math.cos(sudut), Math.sin(sudut)];
		let Ay = [-Math.sin(sudut), Math.cos(sudut)];
		// jarak antar titik tengah, dx dan dy 
		let T = [circ.x-rect.x,circ.y-rect.y];
		
		//vxv artinya v = vektor, x = kali. vektor kali vektor
		function vxv(a,b) {
			if(!Array.isArray(a) ||!Array.isArray(b)) return 0;
                        return a.reduce((acc,x,i)=>acc + x * (b[i]?? 0), 0)
		}

		// Transformasi rotasi lingkaran ke posisi dimana Rect tegak lurus
		let localX = vxv(T,Ax); // jarak dikali rotasi vektor
		let localY = vxv(T,Ay);

		// cari jarak terdekat swtelah lingkaran di rotasi
		let closestX = Math.max(-w, Math.min(localX, w));
		let closestY = Math.max(-h, Math.min(localY, h));

		// hitung jarak local
		let TLoc = [localX-closestX, localY-closestY];
		let jarak = Math.sqrt(vxv(TLoc,TLoc)); //pytagoras
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
		let T = [x2 - x1, y2 - y1]

		// abvxv sendiri artinya absolute vector x vecktor.
                // Mengembalikan nilai mutlak dua vektor yang dikalikan
                // Secara matematika itu simbolnya |a • b|
                function abvxv(a,b) {
                        if(!Array.isArray(a) ||!Array.isArray(b)) return 0;
                        return Math.abs(a.reduce((acc,x,i)=>acc + x * (b[i]?? 0), 0))
                }

		// Pengecekan 4 Langkah, rumus SAT, dapat dari google
		let overlapAx = (w1 + w2*abvxv(Bx,Ax) + h2*abvxv(By,Ax)) - abvxv(T,Ax);
		let overlapAy = (h1 + w2*abvxv(Bx,Ay) + h2*abvxv(By,Ay)) - abvxv(T,Ay);
		let overlapBx = (w1*abvxv(Ax,Bx) + h1*abvxv(Ay,Bx) + w2) - abvxv(T,Bx);
		let overlapBy = (w1*abvxv(Ax,By) + h1*abvxv(Ay,By) + h2) - abvxv(T,By);

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

function isAngle(objek,ang1,ang2,mode="object") {
	let sudut;
	if (mode == "object") {
		if (!daftDrag1x) return;
		// Deklarasi
		let obj = daftDrag1x[daftDrag1x.map(x=>x.name).indexOf(objek)]; 
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
