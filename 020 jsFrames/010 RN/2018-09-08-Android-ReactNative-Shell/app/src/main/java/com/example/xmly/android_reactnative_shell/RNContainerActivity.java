package com.example.xmly.android_reactnative_shell;

import android.app.Activity;
// import android.support.v7.app.AppCompatActivity;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.shell.MainReactPackage;

public class RNContainerActivity extends Activity {

    private ReactRootView mReactRootView;
    private ReactInstanceManager mReactInstanceManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        SharedPreferences mPreferences = PreferenceManager.getDefaultSharedPreferences(this.getApplicationContext());

        String debugHttpHost = mPreferences.getString(MainApplication.DEBUG_HTTP_HOST, "192.168.1.4:8081");
        String bundleAssetName = mPreferences.getString(MainApplication.BUNDLE_ASSET_NAME, "index.android.bundle");
        String moduleName = mPreferences.getString(MainApplication.MODULE_NAME, "test");

        mPreferences.edit().putString("debug_http_host", debugHttpHost).commit();

        super.onCreate(savedInstanceState);
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

        setContentView(mReactRootView);
    }

    @Override
    protected void onStart() {
        super.onStart();
        mReactInstanceManager.getDevSupportManager().setDevSupportEnabled(true);
    }
}
