package com.ingestiareactnative

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import io.ingestia.client.IngestiaClient
import io.ingestia.client.IngestiaConfig
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import org.json.JSONObject

class IngestiaReactNativeModule(reactContext: ReactApplicationContext) :
  NativeIngestiaReactNativeSpec(reactContext) {

  private var client: IngestiaClient? = null
  private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

  override fun configure(
    apiKey: String,
    endpoint: String,
    flushInterval: Double,
    batchSize: Double,
  ) {
    val config = IngestiaConfig(
      apiKey = apiKey,
      endpoint = endpoint,
      flushInterval = flushInterval.toInt(),
      batchSize = batchSize.toInt(),
    )
    client = IngestiaClient(config, reactApplicationContext)
  }

  override fun initialize(promise: Promise) {
    scope.launch {
      try {
        client?.initialize()
        promise.resolve(null)
      } catch (e: Exception) {
        promise.reject("INGESTIA_ERROR", e.message, e)
      }
    }
  }

  override fun track(event: String, propertiesJson: String) {
    client?.track(event, parseJson(propertiesJson))
  }

  override fun identify(alias: String, traitsJson: String) {
    client?.identify(alias, parseJson(traitsJson))
  }

  override fun flush(promise: Promise) {
    scope.launch {
      try {
        client?.flush()
        promise.resolve(null)
      } catch (e: Exception) {
        promise.reject("INGESTIA_ERROR", e.message, e)
      }
    }
  }

  override fun destroy() {
    client?.destroy()
    client = null
  }

  private fun parseJson(json: String): Map<String, Any>? {
    if (json == "{}") return null
    return try {
      val obj = JSONObject(json)
      buildMap { obj.keys().forEach { key -> put(key, obj.get(key)) } }
    } catch (e: Exception) {
      null
    }
  }

  companion object {
    const val NAME = NativeIngestiaReactNativeSpec.NAME
  }
}
