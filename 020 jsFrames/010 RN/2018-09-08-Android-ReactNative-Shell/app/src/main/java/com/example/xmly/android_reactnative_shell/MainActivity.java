package com.example.xmly.android_reactnative_shell;

import android.content.Intent;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.view.WindowManager;
import android.widget.EditText;

public class MainActivity extends AppCompatActivity {

    private EditText debugHttpHost;
    private EditText bundleAssetName;
    private EditText moduleName;
    private SharedPreferences mPreferences;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getSupportActionBar().hide();
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING);
        setContentView(R.layout.activity_main);

        debugHttpHost = (EditText) findViewById(R.id.DebugHttpHost);
        bundleAssetName = (EditText) findViewById(R.id.BundleAssetName);
        moduleName = (EditText) findViewById(R.id.ModuleName);

        mPreferences = PreferenceManager.getDefaultSharedPreferences(this.getApplicationContext());

        // 设置默认值
        debugHttpHost.setText(mPreferences.getString(MainApplication.DEBUG_HTTP_HOST, "192.168.1.4:8081"));
        bundleAssetName.setText(mPreferences.getString(MainApplication.BUNDLE_ASSET_NAME, "index.android.bundle"));
        moduleName.setText(mPreferences.getString(MainApplication.MODULE_NAME, "test"));

        // 保存修改的值
        debugHttpHost.addTextChangedListener(saveConfig(MainApplication.DEBUG_HTTP_HOST));
        bundleAssetName.addTextChangedListener(saveConfig(MainApplication.BUNDLE_ASSET_NAME));
        moduleName.addTextChangedListener(saveConfig(MainApplication.MODULE_NAME));
    }

    private TextWatcher saveConfig(final String key) {

        return new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void afterTextChanged(Editable s) {
                String text = s.toString();
                if (text.length() > 0) {
                    mPreferences.edit().putString(key, text).commit();
                }
            }
        };
    }

    public void startRNPage(View view) {
        Intent intent = new Intent(this, RNContainerActivity.class);
        startActivity(intent);
    }

    public void startRNPageWithMenuButton(View view) {
        Intent intent = new Intent(this, RNContainerWithBtnActivity.class);
        startActivity(intent);
    }
}
