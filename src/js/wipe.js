/*
	eamil:1259821073@qq.com
	data:2018-11-16
*/
function Wipe(obj){
	this.cas = document.querySelector("#"+ obj.id);
	this.conId = obj.id;
	this.context = this.cas.getContext("2d");
	this.moveX = 0;
	this.moveY = 0;
	this.isMouseDown = false;
	//检测是移动端还是PC端
	this.device = (/android|webos|iPhone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
	this.cas.width = obj.width;
	this.cas.height = obj.height;
	this.backImgUrl = obj.backImgUrl;//背景图
	this.imgUrl = obj.imgUrl;//覆盖图
	this.coverType = obj.coverType;//覆盖的事颜色还是图片
	this.color = obj.color || "#666";//需要涂抹面积的颜色
	this._w = obj.width || this.cas.width;//宽
	this._h = obj.height || this.cas.height;//高
	this.radius = obj.radius || 20;//涂抹的半径
	this.percent = obj.percent || 50;
	this.callback = obj.callback;
	this.backImg();
	this.drawMask();
	this.addEvent();
}
//drawT()画点和画线的函数
//参数:如果只有两个参数,函数功能画圆,x1,y1即圆的中心坐标
//如果传递四个参数,函数功能画线,x1,y1为起始坐标,x2,y2为结束坐标
Wipe.prototype.drawT = function(x1,y1,x2,y2){
	if (arguments.length === 2) {
		// 调用的是画点功能
		this.context.save();
		this.context.beginPath();
		this.context.arc(x1,y1,this.radius,0,2*Math.PI);
		this.context.fillStyle = "rgb(250,0,0)";
		this.context.fill();
		this.context.restore();
	}else if (arguments.length === 4){
		// console.log("传递参数的个数:" +arguments.length);
		this.context.save();
		this.context.lineCap = "round";
		this.context.beginPath();
		this.context.moveTo(x1,y1);
		this.context.lineTo(x2,y2);
		this.context.lineWidth=this.radius*2;
		this.context.stroke();
		this.context.restore();
	}else{
		return false;
	}
};
//清除画布
Wipe.prototype.clearRect = function(){
	this.context.clearRect(0,0,this._w,this._h);
};
//获取透明点占整个画布的百分比
Wipe.prototype.getTransparencyPercent = function(){
	var _t = 0;
	var imgData = this.context.getImageData(0,0,this._w,this._h);
	for(i=0;i<this._h;i++){
		for(j=0;j < this._w;j++){
			var Alpha = ((this._w*i)+j)*4+3;//Alpha在数组中的位置
			if (imgData.data[Alpha] ===0) {
				_t++;
			}
		}
	}
	this.percent = ( _t / ( this._w * this._h ) ) * 100;
	console.log( Math.ceil(this.percent) + "%");
	return this.percent.toFixed(2);
	// return Math.ceil(percent);
};
//生成画布上的遮罩,默认颜色为#666
Wipe.prototype.drawMask=function(){
	if (this.coverType === "color" || this.coverType === "") {
		this.context.fillStyle = this.color;
		this.context.fillRect(0,0,this._w,this._h);
		this.context.globalCompositeOperation = "destination-out";
	}else if ( this.coverType === "image" ){
		//将imgUrl指定的图片填充画布
		var that = this;
		var img = new Image();
		img.src = this.imgUrl;
		img.onload=function(){
			that.context.drawImage(img,0,0,that._w,that._h);
			that.context.globalCompositeOperation = "destination-out";
		};
	}

};
Wipe.prototype.addEvent = function(){
	var clickEvtName = this.device ? "touchstart" : "mousedown";
	var moveEvtName = this.device ? "touchmove" : "mousemove";
	var endEvtName = this.device ? "touchend" : "mouseup";
	var that = this;

	var allLeft;
	var allTop;
	var currentObj;

	var scrollTop;
	var scrollLeft;
	this.cas.addEventListener(clickEvtName,function(evt){
		//点击获取上外边距
		allLeft = that.cas.offsetLeft;
		allTop = that.cas.offsetTop;
		currentObj = that.cas;
		while(currentObj = currentObj.offsetParent){
			allLeft += currentObj.offsetLeft;
			allTop += currentObj.offsetTop;
		}

		//获取上外滚动距离
		scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
		var event = evt || window.event;
		that.moveX = that.device ?  event.touches[0].clientX - allLeft + scrollLeft : event.clientX - allLeft + scrollLeft;
		that.moveY = that.device ?  event.touches[0].clientY - allTop + scrollTop : event.clientY - allTop + scrollTop;
		that.drawT(that.moveX,that.moveY);
		that.isMouseDown = true;
	});
	this.cas.addEventListener(moveEvtName,function(evt){
		scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
		if( that.isMouseDown ){
			var event = evt || window.event;
			event.preventDefault();
			var x2 = that.device ?  event.touches[0].clientX - allLeft + scrollLeft: event.clientX - allLeft + scrollLeft;
			var y2 = that.device ?  event.touches[0].clientY - allTop + scrollTop: event.clientY - allTop + scrollTop;
			that.drawT(that.moveX,that.moveY,x2,y2);
			that.moveX = x2;
			that.moveY = y2;
		}else{
			return false;
		}
	},false);
	this.cas.addEventListener(endEvtName,function(evt){
		that.isMouseDown = false;
		var percent = that.getTransparencyPercent();
		that.callback.call(null,percent);
		if (  percent > 50) {
			alert("超过了50%的面积");
			that.clearRect();
		}
	},false);
};
Wipe.prototype.backImg = function(){
	this.cas.style.cssText="background:url("+this.backImgUrl+") center 0 no-repeat; background-size: cover;";
};