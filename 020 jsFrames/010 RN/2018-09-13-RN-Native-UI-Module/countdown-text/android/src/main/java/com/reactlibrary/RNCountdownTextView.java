package com.reactlibrary;

import android.content.Context;
import android.support.v7.widget.AppCompatTextView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.Timer;
import java.util.TimerTask;

public class RNCountdownTextView extends AppCompatTextView {

    private Timer timer = new Timer();
    private Integer countNum;

    public RNCountdownTextView(Context context) {
        super(context);
        this.setAutoSizeTextTypeWithDefaults(AppCompatTextView.AUTO_SIZE_TEXT_TYPE_UNIFORM);
    }

    public void setCount(final AppCompatTextView view, Integer count) {
        countNum = count;
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                view.setText(countNum.toString());
                onReceiveNativeEvent();
                countNum--;
                if (countNum < 0) {
                    timer.cancel();
                }
            }
        }, 0, 1000);
    }


    public void onReceiveNativeEvent() {
        WritableMap event = Arguments.createMap();
        event.putInt("count", countNum);
        ReactContext reactContext = (ReactContext)getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                "countdown",
                event);
    }
}
