/**
 * ...
 * @author minliang_1112@foxmail.com
 */
;puremvc.define({
					name 		: 'cn.pplive.player.view.component.BarrageComponent',
					constructor : function() {
									this.barrage = new Barrage({
																	'video' : puremvc.video,
																	'chid'  : puremvc.cid
																});
								}
				},
				{
					display : function(bool) {
						this.barrage.display(bool?'block':'none');
						var inter
					},
					update : function(time) {
						this.barrage.seekBarrage(Math.round(time) * 10);
					},
					playstate : function(ps) {
						if (ps == 'playing') {
							this.barrage.playBarrage();
						} else {
							this.barrage.pauseBarrage();
						}
					}
				},
				{
					NAME : 'barragecomponent' 
				});
