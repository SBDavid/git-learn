package com.example.xmly.android_reactnative_shell.nativemodules;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;


public class ModuleManager {

    private Context applicationContext;
    private SharedPreferences mPreferences;

    public ModuleManager(Context context) {
        applicationContext = context;
        mPreferences = PreferenceManager.getDefaultSharedPreferences(applicationContext);
    }
}
