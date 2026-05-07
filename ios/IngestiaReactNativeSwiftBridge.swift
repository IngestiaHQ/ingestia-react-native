import Foundation
import IngestiaSwift

@objc(IngestiaReactNativeSwiftBridge)
public class IngestiaReactNativeSwiftBridge: NSObject {
  @objc public static let shared = IngestiaReactNativeSwiftBridge()

  private var client: IngestiaClient?

  @objc
  public func configure(
    apiKey: String,
    endpoint: String,
    flushInterval: Double,
    batchSize: Double
  ) {
    let config = IngestiaConfig(
      apiKey: apiKey,
      endpoint: endpoint,
      flushInterval: Int(flushInterval),
      batchSize: Int(batchSize)
    )
    client = IngestiaClient(config: config)
  }

  @objc
  public func initializeWithCompletion(_ completion: @escaping () -> Void) {
    Task {
      await client?.initialize()
      completion()
    }
  }

  @objc
  public func track(event: String, propertiesJson: String) {
    client?.track(event: event, properties: parseJson(propertiesJson))
  }

  @objc
  public func identify(alias: String, traitsJson: String) {
    client?.identify(alias: alias, traits: parseJson(traitsJson))
  }

  @objc
  public func flushWithCompletion(_ completion: @escaping () -> Void) {
    Task {
      await client?.flush()
      completion()
    }
  }

  @objc
  public func destroy() {
    client?.destroy()
    client = nil
  }

  private func parseJson(_ json: String) -> [String: Any]? {
    guard json != "{}",
          let data = json.data(using: .utf8),
          let obj = try? JSONSerialization.jsonObject(with: data) as? [String: Any]
    else { return nil }
    return obj
  }
}