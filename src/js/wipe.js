var cas = document.getElementById("cas");
var context = cas.getContext("2d");
var _w = cas.width;
var _h = cas.height;
var radius = 30;
//device保存设备类型,如果是移动端则为false,按下true
var device = (/android|webos|iPhone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
console.log(device);
if(device == true){
	Eventdown = "touchstart";
	Eventmove = "touchmove";
	Eventup = "touchend";
}else{
	Eventdown = "mousedown";
	Eventmove = "mousemove";
	Eventup = "mouseup";
}
//生成画布上的遮盖,默认为颜色#666
function drawRect(context){
	// context.save();
	context.fillStyle = "#666";
	context.fillRect(0,0,_w,_h);

	context.globalCompositeOperation = "destination-out";
	// context.restore();
}
//在画布上画半径为30的圆
var moveX;
var moveY;
// function drawPoint(context,movex,movey,a,b){
// console.log("传递的实参个数:"+arguments.length)
// 	context.save();
// 	context.beginPath();
// 	context.arc(movex,movey,radius,0,2*Math.PI)
// 	context.fillStyle = "rgb(255,0,0)";
// 	context.fill();
// 	context.restore();
// }
// function drawLine(context,movex,movey,a,b){
// console.log("传递的实参个数:"+arguments.length)
// 	context.save();
// 	context.lineCap = "round";
// 	context.beginPath();
// 	context.moveTo(movex,movey);
// 	context.lineTo(a,b);
// 	context.lineWidth = radius*2;
// 	context.stroke();
// 	context.restore();
// }
function drawnew(context,movex,movey,a,b){
	context.save();
	context.beginPath();
	if(arguments.length == 3){
		context.arc(movex,movey,radius,0,2*Math.PI)
		context.fillStyle = "rgb(255,0,0)";
		context.fill();
	}else if(arguments.length == 5){
		context.lineCap = "round";
		context.moveTo(movex,movey);
		context.lineTo(a,b);
		context.lineWidth = radius*2;
	}
	context.stroke();
	context.restore();
}
var xx = false;//表示鼠标的状态,是否按下,默认为未按下false,按下true;
//在canvas画布上监听自定义事件"mousedown",调用drawPoint函数
cas.addEventListener(Eventdown,function(evt){
	var event = evt || window.event;
		moveX = device ? event.touches[0].clientX : event.clientX;
		moveY = device ? event.touches[0].clientY : event.clientY;
		//获取鼠标在视口的坐标,传递参数到drawPoint
		// console.log(moveX,moveY);
	drawnew(context,moveX,moveY);
	xx = true;
},false)
//增加监听"mousemove",调用drawPoint函数
cas.addEventListener(Eventmove,function(evt){
	if(xx == true){
		var event = evt || window.event;
		event.preventDefault();
		//获取手指在视口的坐标,传递参数到drawPoint
		var a = device ? event.touches[0].clientX : event.clientX;
		var b = device ? event.touches[0].clientY : event.clientY;
		// console.log(moveX,moveY);
		// drawPoint(context,a,b);
		drawnew(context,moveX,moveY,a,b);
		//每次的结束点变成下一次划线的开始点
		moveX = a;
		moveY = b;
	}else{
		return false;
	}
},false)
cas.addEventListener(Eventup,function(){
	xx = false;
	// var pixArr = [];
	// var imgData = context.getImageData(0,0,_w,_h);
	// for(i=0;i<_h;i++){
	// 	for(j=0;j<_w;j++){
	// 		var Alpha = ((_w*i)+j)*4+3;//Alpha在数组中的位置
	// 		if (imgData.data[Alpha] ==0) {
	// 			pixArr.push(Alpha);
	// 		}
	// 	}
	// }
	// if((pixArr.length/(_w*_h))*100+"%" >= '60%'){
	// 	context.clearRect(0,0,_w,_h);
	// }
	
	// console.log(pixArr.length);
	// console.log((pixArr.length/(_w*_h))*100+"%");
	clearRect(context);
})
function clearRect(context){
	if(getTransparencyPercent(context) > 50){
		context.clearRect(0,0,_w,_h);
	}
}
function getTransparencyPercent(context){
	var zz = context.getImageData(0,0,_w,_h);
	var t = 0;
	for(var i = 0;i <_h;i++){
		for(var j = 0;j <_w;j++){
			var Alpha = ((_w*i)+j)*4+3;//Alpha在数组中的位置
			if(zz.data[Alpha] == 0){
				t++;
			}
		}
	}
	var percent = (t/(_w*_h))*100;
	console.log("透明点的个数"+t);
	console.log("占总面积"+Math.ceil(percent)+"%");
	return Math.round(percent);
}
window.onload = function(){
	drawRect(context);
}
