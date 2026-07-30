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
