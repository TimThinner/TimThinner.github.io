

var timerFunction = null;
function startAnimation() {
	if(timerFunction == null) {
		timerFunction = setInterval(animate, 20);
	}
}
function stopAnimation() {
	if(timerFunction != null){
		clearInterval(timerFunction);
		timerFunction = null;
	}
}
function animate() {
	const path_1 = document.getElementById("p1");
	const style_1 = getComputedStyle(path_1);
	const offs_1 = style_1.strokeDashoffset;
	let newOffs_1 = parseInt(offs_1)-1;
	if(newOffs_1 < 0) {
		newOffs_1 = 40;
	}
	//console.log(['newOffs_1=',newOffs_1]);
	path_1.style.strokeDashoffset = newOffs_1;
	
	
	
	const path_2 = document.getElementById("p2");
	const style_2 = getComputedStyle(path_2);
	const offs_2 = style_2.strokeDashoffset;
	let newOffs_2 = parseInt(offs_2)-1;
	if(newOffs_2 < 0) {
		newOffs_2 = 40;
	}
	//console.log(['newOffs_2=',newOffs_2]);
	path_2.style.strokeDashoffset = newOffs_2;
	
	
	
	
}
startAnimation();
console.log("Hip Hei!");

