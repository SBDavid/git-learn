package com.example.xmly.android_reactnative_shell;

import android.content.SharedPreferences;
import android.graphics.Color;
import android.preference.PreferenceManager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.FrameLayout;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.shell.MainReactPackage;

public class RNContainerWithBtnActivity extends AppCompatActivity {

    private ReactRootView mReactRootView;
    private ReactInstanceManager mReactInstanceManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        getSupportActionBar().hide();

        FrameLayout frameLayout = new FrameLayout(this);
        frameLayout.addView(getRNView());
        frameLayout.addView(getSettingView());

        setContentView(frameLayout);
    }

    @Override
    protected void onStart() {
        super.onStart();
        mReactInstanceManager.getDevSupportManager().setDevSupportEnabled(true);
    }

    private View getRNView() {
        SharedPreferences mPreferences = PreferenceManager.getDefaultSharedPreferences(this.getApplicationContext());

        String debugHttpHost = mPreferences.getString(MainApplication.DEBUG_HTTP_HOST, "192.168.1.4:8081");
        String bundleAssetName = mPreferences.getString(MainApplication.BUNDLE_ASSET_NAME, "index.android.bundle");
        String moduleName = mPreferences.getString(MainApplication.MODULE_NAME, "test");

        mPreferences.edit().putString("debug_http_host", debugHttpHost).commit();

        mReactRootView = new ReactRootView(this);
        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setBundleAssetName(bundleAssetName)
                .setJSMainModulePath("index")
                .addPackage(new MainReactPackage())
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .setCurrentActivity(this)
                .build();

        mReactRootView.startReactApplication(mReactInstanceManager, moduleName, null);

        return mReactRootView;
    }

    private View getSettingView() {
        Button settings = new Button(this);
        settings.setText("S");
        settings.setBackgroundColor(Color.parseColor("#ff4081"));
        settings.setTextColor(Color.parseColor("#ffffff"));
        settings.getBackground().setAlpha(50);
        settings.setLayoutParams(new FrameLayout.LayoutParams(200, 200));
        settings.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mReactInstanceManager.getDevSupportManager().showDevOptionsDialog();
            }
        });
        return settings;
    }
}
