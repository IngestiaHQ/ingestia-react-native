package com.ingestiareactnative

import com.facebook.react.bridge.ReactApplicationContext

class IngestiaReactNativeModule(reactContext: ReactApplicationContext) :
  NativeIngestiaReactNativeSpec(reactContext) {

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = NativeIngestiaReactNativeSpec.NAME
  }
}
