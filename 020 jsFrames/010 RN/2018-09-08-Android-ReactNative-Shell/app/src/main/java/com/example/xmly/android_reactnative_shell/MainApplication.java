package com.example.xmly.android_reactnative_shell;

import android.app.Application;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

public class MainApplication extends Application {
    public static final String DEBUG_HTTP_HOST = "debug_http_host";
    public static final String BUNDLE_ASSET_NAME = "bundle_asset_name";
    public static final String MODULE_NAME = "module_name";

    @Override
    public void onCreate() {
        super.onCreate();

        SharedPreferences mPreferences = PreferenceManager.getDefaultSharedPreferences(this.getApplicationContext());

        if (!mPreferences.contains(MainApplication.DEBUG_HTTP_HOST)) {
            mPreferences.edit().putString(MainApplication.DEBUG_HTTP_HOST, "192.168.1.4:8081").commit();
        }

        if (!mPreferences.contains(MainApplication.BUNDLE_ASSET_NAME)) {
            mPreferences.edit().putString(MainApplication.BUNDLE_ASSET_NAME, "index.android.bundle").commit();
        }

        if (!mPreferences.contains(MainApplication.MODULE_NAME)) {
            mPreferences.edit().putString(MainApplication.MODULE_NAME, "test").commit();
        }
    }
}
