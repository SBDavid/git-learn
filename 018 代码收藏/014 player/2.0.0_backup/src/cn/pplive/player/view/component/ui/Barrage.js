	//创建一个comment数据类,方便读取
	;var CommentData = function(){
			this._id = "";
			this.content = "";
			this.play_point = 0;
			this.ref_name = "";
			this.user_name = "";
			this.nick_name = "";
			this.isYearVip= 0;
			this.vipGrade = 0;
			this.facePic = "";
			this.character = 0;
			this.showTime = 8;
			this.appplt = "";
			this.appver = "";
			this.font_color = null;
			this.font_size = null;
			this.font_type = null;
			this.font_position = 0;
			this.upCount = 0;
			this.createtime = 0;
	};
	//Comment 显示弹幕cell  /////////////////////////////////////////////////////////
	;var Comment = (function(){
		//构造函数
		function Comment(){
			this.mode = 0;
			this.text = "你好";
			this.alpha = 1;
			this.duration = 8;//滚屏时间单位s
			this.remainTime = 8*1000;//剩余时间
			this._x = 0;
			this._y = 0;
			this.isAbsolute = true;
			this._alpha = 1;
			this._width = 0;
			this._height = 0;
			this.pindex = 0;//
			this.cindex = -1;//第几行
			this.startTime = 0;//单位是s
			this.progressTime = 0;
			this.progressWidth = 0;
			this.position = {x:0,y:0};
		};
		Comment.prototype = {
							"init" : function(parent,commentData,canvas){
										if(parent == null){
											throw new Error("CommentManager is null with creating Comment");
										}else{
											this.parent = parent;
										}
										this.data = commentData;
										if(this.canvas== null){
											this.canvas = document.createElement("canvas");
										}else{
											this.canvas.getContext("2d").clearRect(0,0,this.parent.width,this.parent.height);
										}
										if(this.data == null || this.data == {}){
											throw new Error("Commentdata is null with creating Comment");
										}else{
											this.text = this.trim(this.data.content);
//											this.text = this.text.replace(/&nbsp;/ig,"");
											this.duration = this.data.showTime;
											this.remainTime = this.duration*1000;
											this._id = this.data._id;
											var font = null;
											var size = null;
											var color = null;
											if(this.data.font_type == "" || this.data.font_type == null){
												font = "微软雅黑";
											}else{
												font = this.data.font_type;
											}
											if(this.data.font_size == 0 || this.data.font_size == null){
												size = this.getFontSize(0);
											}else{
												size = this.getFontSize(this.data.font_size);
											}
											if(this.data.font_color == "" || this.data.font_color == null){
												color = "#ffffff";
											}else{
												color = this.data.font_color;
											}
											var context = this.canvas.getContext("2d");
											context.font = size +"px "+ font;
											context.fillStyle = color;
											context.textBaseline = "top";
											this._width = context.measureText(this.text).width+10;
											this._height = size;
											context.fillText(this.text,0,0,this._width);
											if(this.data.play_point != 0 && this.data.play_point != null){
												this.setStartTime(this.data.play_point);//赋值是0.1s单位
											}else{
												this.setStartTime(0);
											}
										}
									},
						  "initPosition" : function(){
						  				this.position.x = this.parent.width;
										this.position.y = 0;
										this._y = this.position.y;
										this._x = this.position.x;
									},
							"setX" : function(value){
										this._x = value;
										this.position.x = this._x;
									},
							"getX" : function(){
										return this.position.x;
									},
							"setY" : function(value){
										this._y = value;
										this.position.y = this._y;
									},
							"getY" : function(){
										return this.position.y;
									},
						"getRight" : function(){
										return this.position.x + this._width;
									},
					   "getBottom" : function(){
					   					var bottom = this.position.y+this._height;
										return bottom;
									},
					"setStartTime" : function(value){
										this.startTime = value;
									},
						"getWidth" : function(){
										return this._width;
									},
					   "getHeight" : function(){
										return this._height;
									},
							"trim" : function(str){
										//去掉前后空格
										return str.replace(/(^\s*)|(\s*$)/g, ""); 	
									},
					 "getFontSize" : function(value){
										//去掉前后空格
										var size = 10;
										switch (value){
											case 100:
												size += 0;
												break;
											case 300:
												size += 10;
												break;
											case 0:
											case 200:
											default:
												size += 5;
												break;
										}
										return size; 	
									},
							"draw" : function(context){
										context.drawImage(this.canvas,this.position.x,this.position.y);
									},
						   "clear" : function(){
										//滚屏结束后清理
										this.canvas.getContext("2d").clearRect(0,0,this._width,this._height);
//										this.setX(2000);
										this.setY(0);
										this._width = 0;
										this._height= 0;
										this.data = null;
										this.parent = null;
									},
							
		};
		return Comment;
	})();
	//空间分布管理器///////////////////////////////////////////////////////////////
	;var CommentSpaceManager = (function(){
		function CommentSpaceManager(width,height){
			//存放滚动的弹幕
			this.pools = [
				[]
			];
			this._width = width;
			this._height = height;
			this.rowOffsetX = 10; // 行距
			this.columnOffsetY = 10;//间隔
		};
		CommentSpaceManager.prototype = {
										 "init" : function(){
													 //
												},
										 "resize" : function(w,h){
										 			 //弹幕显示区域大小
										 			 this._width = w;
										 			 this._height = h;
										 		},
								   "addComment" : function(comment){
													 //添加弹幕
													 comment.cindex = -1;
//													 comment.setY(0);
//													 comment.setX(this._width);
													 if(comment.getHeight() > this._height){
													 	return;
													 }else{
													 	this.setY(comment,0);
													 }
												},
									 "checkRow" : function(y,comment,pool){
									 				//如果插入出现下列情况的话，说明不能插入
									 				//情况如下，1：高度会将其他行的评论盖住；2：与前面滚动的评论重合
	 								 				var cmt = null;
									 				var bottom  = comment.getHeight() + y;
										 			for(var i = 0;i < pool.length;i++){
										 			 	cmt = pool[i];
										 			 	if(cmt.getY() > bottom || cmt.getBottom() < y){
													 		continue;
													 	}else {
													 		if(cmt.getX() > comment.getRight() || cmt.getRight() < comment.getX()){
														 		if(this.getToEnd(cmt) >= this.getToLeft(comment)){
														 			return false;
														 		}else{
														 			continue;
														 		}
														 	}else{
														 		return false;
														 	}
														}
										 			}
										 			return true;
												},
										 "setY" : function(comment,index){
													//设置comment的y值
													while(this.pools.length<=index){
														this.pools.push([]);
													}
													var arr = this.pools[index];
													var y = 0 ;
													var __index = -1;
													if(arr.length == 0){
														__index = 0;
														y = 0 ;
													}else if(this.checkRow(0,comment,arr)){
														//检测首行是否能插入
													 	__index = 0;
													 	y = 0 ;
													 }else{
													 	//检测非首行是否能插入
														for(var i = 0;i < arr.length ; i++){
															y = arr[i].getBottom()+ this.rowOffsetX;
															if(y + comment.getHeight() > this._height/2){
																 break;
															}
															if(this.checkRow(y,comment,arr)){
																 __index = i;
																 break;
															}
														}
													 }
													 
													//如果可以插入的话，添加到pools中
													if(__index != -1){
													 	comment.pindex = index;
													 	comment.setY(y);
													 	try{
															var cindex = comment.cindex;
															if(arr.length == 0){
																cindex = 0;
															}else{
																cindex = __index;
																for(var i = cindex;i<arr.length;i++){
																	if(i == arr.length - 1){
																		cindex = i+1;
																		break;
																	}
																	if(comment.getBottom() < arr[i].getBottom()){
														 				cindex = i;
														 				break;
														 			}else if(comment.getBottom() > arr[i].getBottom()){
														 				continue;
														 			}else if(comment.getBottom() == arr[i].getBottom()){
														 				if(i == 0){
														 					continue;
														 				}else if(arr[i-1].getBottom() < comment.getBottom() && arr[i+1].getBottom()> comment.getBottom()){
														 					cindex = i+1;
														 					break;
														 				}else {
														 					continue;
														 				}
														 			}
																}
															}
//															console.log("插入位置 cindex =",orderIndex);
															this.pools[index].splice(cindex,0,comment);
													 	}catch(e){
													 		Console.log( "错误信息："+e.message);
													 	}
													 	return;
													}
													return this.setY(comment,index+1);
												},
									 "getToEnd" : function(comment){
									   				//获取结束时间
									   				return comment.startTime + comment.duration*10;//(comment.remainTime*0.01);//
									  			},
									"getToLeft" : function(comment){
									   				//获取到达最左边的时间
									   				return comment.startTime + this._width/this.getSpeed(comment);//(comment.remainTime*0.01)/2;//
									  			},
									 "getSpeed" : function(comment){
									   				//获取comment滚动速度
									   				return (this._width + comment.getWidth())/(comment.duration*10);
									   			},
									   "remove" : function(comment){
									   				//清除
													if(comment.pindex<-1 || comment.pindex >= this.pools.length){
													 	return;
													}
													var index = this.pools[comment.pindex].indexOf(comment);
													if(index>-1){
													 	this.pools[comment.pindex].splice(index,1);
													}
												}
			
		};
		return CommentSpaceManager;
	})();
	//帧率控制器 每10毫秒移动一次/////////////////////////////////////////////////////
	;var TimeTick = (function(){
		function TimeTick(gapTime){
		this.running = false;
		//间隔时间
		this.interval = gapTime;
		//作用对象
		this.actionObejct = null;
		//timer事件
		this.onTimer = null;
		//最近时间
		this.lastTime = 0;
		this._timer = 0;
		};
		TimeTick.prototype = {
								"start" : function(){
											var self = this;
											if(this.running) return;
											this.running = true;
											this.lastTime = new Date().getTime();
											this._timer = setInterval(function(){self.onTick()},this.interval);
										},
								"stop"  : function(){
											var self  = this;
											window.clearInterval(self._timer);
											if(!this.running) return;
											this._timer = 0;
											this.running = false;
										},
							  "onTick" : function(){
									  		var espTime = new Date().getTime() - this.lastTime;
											this.lastTime = new Date().getTime();
											if(this.onTimer!=null){
												this.onTimer(espTime,this.actionObejct);
											}
							}
		};
		return TimeTick;
	})()
	//弹幕总管 管理着弹幕的显示逻辑///////////////////////////////////////////////////////////
	var CommentManager = (function(){
		//最大显示条数
		var max_comments = 20;
		//构造函数
		function CommentManager(_container,__w,__h){
			this.width = __w;
			this.height = __h;
			this.commentSpaceManager = new CommentSpaceManager(__w,__h);
			this.prepareCommentdatas = {};
			this.playStatus = true;
			this._pools = [];
			this.container = _container;
			this.commentFactory = [];
			this.elementDivFactory = [];
			this.timeTick = new TimeTick(10);
			this.timeTick.actionObejct = this;
			this.timeTick.onTimer = function(espTime,actionObejct){
											actionObejct.render(espTime);
										}
			this.seekTime = -1;
		}
		
		CommentManager.prototype = {
					"setPlayStatus" : function(value){
										//设置播放开关
										if(this.playStatus != value){
											this.playStatus = value;
										}
									},
					  "seekBarrage" : function(time){
					  					//显示某个时间点的弹幕
										if(this.seekTime == time){
											return;
										}
										this.seekTime = time;
					  					var comments = this.prepareCommentdatas[time];
					  					if(comments == null || comments.length == 0){
					  					   	return;
					  					}
					  					for(var i = 0;i<comments.length;i++){
					  					    if(i > max_comments){
					  					    	break;
					  					    }
					  					    var data = comments[i];
					  					   	this.startBarrage(data);
					  					}
					  					    
					  				},
					 "startBarrage" : function(data){
					 					//显示弹幕逻辑
					  					if(this.commentFactory == null || this.commentFactory == undefined){
					  						this.commentFactory = [];
					  					}
					  					
					  					var comment = null;
					  					if(this.commentFactory.length > 0){
					  						comment = this.commentFactory.pop();
					  					}else{
					  						comment = new Comment();
					  					}
					  					
										comment.init(this,data,null);
//										comment.draw(this.container.getContext("2d"));
										comment.initPosition();
										this.commentSpaceManager.addComment(comment);
										
										if(comment.pindex < 1){//如果同一秒，已经达到满屏的状态的话就不显示了
											this._pools.push(comment);
											if(this.playStatus) this.playBarrage();
											
										}else{
											this.commentSpaceManager.remove(comment);
											comment.clear();
										}
					  				},
					  	   "render" : function(espTime){
					  	   				//弹幕渲染逻辑
					  	   				if(this._pools.length >0){
					  	   					this.container.getContext("2d").clearRect(0,0,this.width,this.height);
					  	   				}
					  	   				for(var i = 0;i<this._pools.length;i++){
					  	   					var cmt = this._pools[i];
					  	   					cmt.remainTime -= espTime;//espTime是毫秒
//					  	   					var _xx = (((this.width+cmt._width)/cmt.duration) * cmt.remainTime*0.001)  - cmt._width;
					  	   					var _xx = ((this.width+cmt.getWidth())/cmt.duration) * espTime*0.001;
					  	   					cmt.setX(cmt.getX() - _xx);
					  	   					if(cmt.getX() <= -cmt.getWidth()){
					  	   						this.remove(cmt);
					  	   					}else{
					  	   						cmt.draw(this.container.getContext("2d"));
					  	   					}
					  	   				}
					  	   				
					  	   			},
					  "playBarrage" : function(){
					  					//开启播放弹幕
					  					this.timeTick.start();
					  				},
					 "pauseBarrage" : function(){
					 					//暂停弹幕滚动
					  					this.timeTick.stop();
					  				},
			 "addPrepareCommentData": function(commentData){
			 							//添加预播放的弹幕
			  							if(this.prepareCommentdatas == undefined || this.prepareCommentdatas == null){
			  								this.prepareCommentdatas = {};
			  							}
			  							if(commentData == null || commentData == {}){
			  								return;
			  							}
			  							var time = commentData.play_point;
			  							if(this.prepareCommentdatas[time] == undefined || this.prepareCommentdatas[time] == null){
			  								this.prepareCommentdatas[time] = [];
			  							}
			  							this.prepareCommentdatas[time].push(commentData);
			  						},
			  			   "resize" : function(w,h){
			  			   				//适应屏幕大小
			  							this.commentSpaceManager.resize(w,h);
			  							this.render(0);
			  							this.width = w;
										this.height = h;
			  						},
		  "clearPrepareCommentdata" : function(){
		  								//清除预加载的弹幕数据
		   								var key = null;
									   	for( key in this.prepareCommentdatas){
									   		var arr = this.prepareCommentdatas[key];
									   		if(arr.length == 0 || arr == null){
									   			continue;
									   		}
									   		while(arr.length>0){
									   			arr.splice(arr.length-1,1);
									   		}
									   		arr = null;
									   	}
									},
			               "remove" : function(comment){
			               				//清除弹幕
							            try{
								            if(comment != null){
												var index = this._pools.indexOf(comment);
												if( index != -1){
													if(this.commentFactory == null || this.commentFactory == undefined){
									  					this.commentFactory = [];
									  				}
													comment.clear();
													this.commentFactory.push(this._pools.splice(index,1)[0]);
													this.commentSpaceManager.remove(comment);
												}
											}
							            }catch(e){
							               	console.log("clear error======"+e.message);
							            }
									},
		};
		return CommentManager;
	})();
	
	/////////////////弹幕入口/////////////////////////////////////////////////////////////////////////////////////////
	var Barrage = function(obj){
		//点播获取弹幕的地址
		var host_vod_barrage = "//apicdn.danmu.pptv.com/danmu/v2/{platform}/ref/{ref_name}/danmu?pos={pos}";
		//直播获取弹幕的地址
		var host_live_barrage = "//livecdn.danmu.pptv.com/danmu/v1/{platform}/ref/{ref_name}/danmu?appplt=web&appver={appver}&pos={pos}";
		//平台类型
		var platform = "pplive";
		//当前弹幕的结束时间点，请求弹幕的数据中获取该值，也作为下次请求弹幕pos参数未赋值前，默认值为0，一般间隔时间为0.1s
		var pos = 0;
		//间隔时间
		var ts = 0.1;
		//视频类型 vod 点播 live 直播
		var vtype = "vod";
		//版本号
		var barrageVersion = "";
		//构造函数
		function Barrage(obj) {
			if(obj == null || obj == {}){
				alert("创建Barrage对象 未传参");
				return;
			}
			this.parent = obj.video;
			$('<canvas/>', {
								'id'    : 'p-canvas',
								'width' : obj.video.width(),
								'height': obj.video.height(),
								'style' : 'position:absolute;top:0px;left:0px;'
							}).insertAfter(obj.video);
			this.divBarrage = $('#p-canvas');
			
			this.cid = obj.chid;
			
			this.infoArr = new Array();//存入弹幕数据
			this.isInit = false;
			this.commentManager = null;
			
			this.requestingBarrage = false;
			this.currentVideoTime = 0;
			this.playStatus = true;//true 播放，false 暂停
			this.totalTime = 0;
			this.intervalTimer = 0;
			
			this.width = this.divBarrage.width();
			this.height = this.divBarrage.height();
			this.commentManager = new CommentManager(this.divBarrage[0],this.width,this.height);
		};
		 
		Barrage.prototype = {
						     "init" : function(){
									
										},
						  "display" : function(type) {
										//设置该组件是否显示
										this.divBarrage.css({'display':type});
										if(type == "block"){
											if(!this.isInit){
												this.isInit = true;
											}
										}
									},
					 "host_barrage" : function(){
										//根据视频类型，获取弹幕地址
										var host_value = "";
										if(vtype == "vod"){
											host_value = host_vod_barrage;
										}else if(vvtype == "live"){
											host_value = host_live_barrage;
										}
										host_value = host_value.replace("{platform}",platform)
															   .replace("{ref_name}",vtype+"_"+this.cid)
															   .replace("{pos}",pos)
															   .replace("{appver}",barrageVersion);
										return host_value;
									},
					"onLoadBarrage" : function(){
										//获取弹幕数据
										var self = this;
										self.requestingBarrage = true;
										var _url = this.host_barrage();
										$.ajax({
												dataType 	  : 'jsonp',
												type          : 'GET',
												cache         : true,
												url	    	  : _url,
												jsonpCallback : 'getbarrageEncode',
												jsonp         : 'cb',
												timeout       :10 * 1000,
												success       : function(data){
																	try{
																		console.log("============请求弹幕获取success data =");
																		self.initData(data);
																	}catch(e){
																		//TODO handle the exception
																		//this.display('none');
																	}
																	self.requestingBarrage = false;
																},
												  error       : function(XMLHttpRequest, textStatus, errorThrown){
																	//alert(XMLHttpRequest.status);
											                        //alert(XMLHttpRequest.readyState);
											                        //alert(textStatus);
											                        self.requestingBarrage = false;
																	//this.display('none');
																}
											});
									},
						 "initData" : function(data){
										//初始化弹幕数据
										var self = this;
										try{
											if(data.err != 0){
												console.log("弹幕请求出错 错误码："+data.err+",错误信息："+data.msg);
												return;
											}
											if(this.commentManager == undefined || this.commentManager == null){
												this.commentManager = new CommentManager(this.divBarrage[0],this.width,this.height);
											}
											var danmuData = data.data;
											pos = danmuData.end;
											if(danmuData.infos == null || danmuData.infos.length == 0){
												return;
											}
											this.infoArr = danmuData.infos;
											for(var i = 0;i<danmuData.infos.length;i++){
												this.infoArr[i] = this.createCommentData(danmuData.infos[i]);
												this.commentManager.addPrepareCommentData(this.infoArr[i]);
											}
										}catch(e){
											console.log(e.message);
										}
									},
					  "seekBarrage" : function(value){
					  					//播放器seek时间点的弹幕
					  					try{
						  					if(typeof value == "number"){
						  					    var time = value;
						  					}else if(typeof value == "object"){
						  					   	//直播
						  					    time = value.posi;
						  					}
						  					this.resize(this.parent.width(), this.parent.height());
						  					this.commentManager.seekBarrage(time);
						  					this.checkRequestBarrage(time);
					  					}catch(e){
					  					    	//TODO handle the exception
					  					    	console.log("seekBarrage 出错 "+e.message);
					  					}
					  				},
			  "checkRequestBarrage" : function(time){
			   							//检测是否需要去加载弹幕
			   							if(this.requestingBarrage || this.cid == ""){
			   								return ;
			   							}
			   							if(vtype == "vod"){
			   								if(time > pos || time <  this.currentVideoTime){
			   									this.commentManager.clearPrepareCommentdata();
			   									pos = Math.floor(time / 1000) * 1000;
			   									this.currentVideoTime = time;
			   								}else{
			   									this.currentVideoTime = time;
			   									var gap = pos - this.currentVideoTime;
												if(gap > 100){//相差10s左右需去加载弹幕
													return;
												}
			   								}
			   								this.onLoadBarrage();
			   							}
			  						},
					  "playBarrage" : function(){
					  					//播放弹幕
					  					this.playStatus = true;
					  					this.commentManager.setPlayStatus(true);
					  					this.commentManager.playBarrage();
					  				},
					 "pauseBarrage" : function(){
					 					//暂停弹幕
					  					this.playStatus = false;
					  					this.commentManager.setPlayStatus(false);
					  					this.commentManager.pauseBarrage();
					  				},
				"createCommentData" : function(data){
										//创建弹幕数据对象
										if(data == null || data == {}){
											return;
										}
										try{
											var commentdata = new CommentData();
											commentdata._id = data.id;
											commentdata.content = data.content;
											commentdata.play_point = data.play_point;
											commentdata.ref_name = data.ref_name;
											commentdata.user_name = data.user_name;
											commentdata.nick_name = data.nick_name;
											commentdata.isYearVip= data.isYearVip;
											commentdata.vipGrade = data.vipGrade;
											commentdata.facePic = data.facePic;
											commentdata.character = data.character;
											commentdata.showTime = data.showTime;
											commentdata.appplt = data.appplt;
											commentdata.appver = data.appver;
											commentdata.font_color = data.font_color;
											commentdata.font_size = data.font_size;
											commentdata.font_type = data.font_type;
											commentdata.font_position = data.font_position;
											commentdata.upCount = data.upCount;
											commentdata.createtime = data.createtime;
											return commentdata;
										}catch(e){
											console.log("getInfoObject = "+e.message);
										}
										return null;
									},
							"resize" : function(w,h){
										//适应屏幕大小
										if(this.width == w && this.height == h){
											return;
										}
										//字体不会变形的处理，需要用原生的属性改变大小，css改变大小有问题
										var imgData = this.divBarrage[0].getContext("2d").getImageData(0,0,this.width,this.height);
										this.divBarrage[0].width = w;
										this.divBarrage[0].height = h;
										this.width = w;
										this.height = h;
									    this.divBarrage[0].getContext("2d").putImageData(imgData,0,0);
										if(this.commentManager == undefined || this.commentManager == null){
											this.commentManager = new commentManager(this.width,this.height);
										}
										this.commentManager.resize(this.width,this.height);
									},
					  "clearBarrage" : function(){
					 					var ctx = this.divBarrage[0].getContext("2d");
					 					ctx.clearRect(0,0,this.width,this.height);
					 				}
							
		};
		var barrage = new Barrage(obj);
		var objInterface = {
					"display" : function(param){
									barrage.display(param);
								},
			    "seekBarrage" : function(param){
									barrage.seekBarrage(param);
								},
				"playBarrage" : function(){
									barrage.playBarrage();
								},
			   "pauseBarrage" : function(){
									barrage.pauseBarrage();
								},
			   "clearBarrage" : function(){
									barrage.clearBarrage();
								}
		}
		return objInterface;
	};

