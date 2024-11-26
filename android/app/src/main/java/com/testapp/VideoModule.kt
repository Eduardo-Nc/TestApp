package com.testapp

import android.net.Uri
import android.widget.VideoView
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class VideoModule(private val reactContext: ReactApplicationContext) :
        ReactContextBaseJavaModule(reactContext) {

  private var videoView: VideoView? = null

  override fun getName(): String {
    return "VideoModule" // Este será el nombre del módulo en JS
  }

  @ReactMethod
  fun playVideo(url: String) {
    val activity = currentActivity ?: return

    activity.runOnUiThread {
      // Inicializa el VideoView si no existe
      if (videoView == null) {
        videoView = VideoView(activity)
        activity.setContentView(videoView) // Agrega el VideoView a la vista principal
      }

      videoView?.apply {
        setVideoURI(Uri.parse(url))
        setOnPreparedListener { it.start() }
        setOnCompletionListener {
          // Puedes emitir un evento cuando termine el video
        }
        start()
      }
    }
  }

  @ReactMethod
  fun stopVideo() {
    videoView?.apply { stopPlayback() }
  }
}
