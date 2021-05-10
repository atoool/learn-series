package academy.learn.piano;

import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.os.Bundle;
import android.preference.PreferenceManager;
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {
  
   @Override
 public void onConfigurationChanged(Configuration newConfig) {
     super.onConfigurationChanged(newConfig);
     Intent intent = new Intent("onConfigurationChanged");
     intent.putExtra("newConfig", newConfig);
     this.sendBroadcast(intent);
 }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "newApp";
  }
  @Override
protected void onCreate(Bundle state){
    super.onCreate(state);

    SharedPreferences preferences =
        PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
preferences.edit().putString("debug_http_host", "192.168.10.6:8081").apply();
}
}
