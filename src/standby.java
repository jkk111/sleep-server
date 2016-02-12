import com.sun.jna.Native;
import com.sun.jna.Platform;
public class standby {
  public static native boolean SetSuspendState(boolean hibernate, boolean forceCritical, boolean disableWakeEvent);

  static {
    if (Platform.isWindows())
      Native.register("powrprof");
  }
  
  public static void main(String[] args) {
	  standby.SetSuspendState(false, false, false);
  }
}