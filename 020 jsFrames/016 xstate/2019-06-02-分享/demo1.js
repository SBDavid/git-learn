class Watch {

	// 正在显示日期 time|timer|date|alarm|setAlarm|setTime
	isDisplay = 'time';
	// 模式选择
	isSelectingMode = false;
	// 计时器状态 stop|run
	timerState = 'stop';
	// 闹铃设置模式 sec|min|hour
	setAlarmState = 'sec';
	// 时间设置模式 sec|min|hour|date|month|year
	setTimeState = 'sec';

	onTimer() {
		if (this.isDisplay === 'time') {
			// 更新时间
		}
	}

	onS1() {
		if (this.isDisplay === 'time') {
			// TODO 显示日期
			this.isDisplay = 'date';
		} else if (this.isDisplay === 'timer') {
			this.isSelectingMode = false;
			// 关闭模式选择 并开始计时
			if (this.timerState === 'stop') {
				// TODO 开始计时
				this.timerState = 'run';
			} else {
				// TODO 停止计时
				this.timerState = 'stop';
			}
		} else if (this.isDisplay === 'setAlarm') {
			// TODO 切换时分秒的设置
			this.isSelectingMode = false;
			if (this.setAlarmState === 'sec') {
				this.setAlarmState === 'min'
			} else if (this.setAlarmState === 'min') {
				this.setAlarmState === 'hour'
			} else if (this.setAlarmState === 'hour') {
				this.setAlarmState === 'sec';
				// 设置完成，恢复时间显示
				this.isDisplay = 'time';
			}
		} else if (this.isDisplay === 'setTime') {
			// ...和设置闹钟类似
		}
	}

	onS2() {
		if (this.isDisplay === 'time') {
			// TODO 显示闹钟
			this.isDisplay = 'alarm';
		} else if (this.isDisplay === 'timer') {
			// TODO 重置计时器
			this.timerState = 'stop';
		} else if (this.isDisplay === 'setAlarm') {
			if (this.setAlarmState === 'sec') {
				// 修改秒
			} else if (this.setAlarmState === 'min') {
				// 修改分
			} else if (this.setAlarmState === 'hour') {
				// 修改时
			}
		} else if (this.isDisplay === 'setTime') {
			// ...和设置闹钟类似
		}
	}

	onS3() {
		if (this.isDisplay === 'date' || this.isDisplay === 'alarm') {
			// TODO 显示时间
			this.isDisplay = 'time';
		} else if (this.isDisplay === 'time') {
			// 进入模式选择阶段
			this.isSelectingMode = true;
			// TODO 显示计时功能
			this.isDisplay = 'timer';
		} else if (this.isDisplay === 'timer' && this.isSelectingMode) {
			// TODO 显示闹钟设置界面
			this.isDisplay = 'setAlarm';
		} else if (this.isDisplay === 'setAlarm' && this.isSelectingMode) {
			// TODO 显示时间设置界面
			this.isDisplay = 'setTime';
		} else if (!this.isSelectingMode && 
			(this.isDisplay === 'setAlarm' || this.isDisplay === 'setTime')) {
			// TODO 恢复时间显示
			this.isDisplay = 'timer';
		}
		
	}
}