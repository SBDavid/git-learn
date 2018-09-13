package com.reactlibrary;

import android.widget.TextView;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

public class RNCountdownTextManager extends SimpleViewManager<RNCountdownTextView> {

    @Override
    public String getName() {
        return "RNCountdownTextView";
    }

    @Override
    public RNCountdownTextView createViewInstance(ThemedReactContext context) {
        RNCountdownTextView view = new RNCountdownTextView(context);
        view.setWidth(200);
        view.setHeight(200);
        return view;
    }

    @ReactProp(name = "count", defaultInt = 3)
    public void setCount(RNCountdownTextView view, Integer count) {
        view.setCount(view, count);
    }

    @Override
    public Map getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.builder()
                .put(
                        "countdown",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of("bubbled", "onCountdown")))
                .build();
    }
}
