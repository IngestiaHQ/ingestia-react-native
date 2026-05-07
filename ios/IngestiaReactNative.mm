#import "IngestiaReactNative.h"

#if __has_include("IngestiaReactNative-Swift.h")
  #import "IngestiaReactNative-Swift.h"
#else
  #import <IngestiaReactNative/IngestiaReactNative-Swift.h>
#endif

@implementation IngestiaReactNative

- (void)configure:(NSString *)apiKey
         endpoint:(NSString *)endpoint
    flushInterval:(double)flushInterval
        batchSize:(double)batchSize
{
  [[IngestiaReactNativeSwiftBridge shared] configureWithApiKey:apiKey
                                                      endpoint:endpoint
                                                 flushInterval:flushInterval
                                                     batchSize:batchSize];
}

- (void)initialize:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  [[IngestiaReactNativeSwiftBridge shared] initializeWithCompletion:^{
    resolve(nil);
  }];
}

- (void)track:(NSString *)event propertiesJson:(NSString *)propertiesJson {
  [[IngestiaReactNativeSwiftBridge shared] trackWithEvent:event propertiesJson:propertiesJson];
}

- (void)identify:(NSString *)alias traitsJson:(NSString *)traitsJson {
  [[IngestiaReactNativeSwiftBridge shared] identifyWithAlias:alias traitsJson:traitsJson];
}

- (void)flush:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  [[IngestiaReactNativeSwiftBridge shared] flushWithCompletion:^{
    resolve(nil);
  }];
}

- (void)destroy {
  [[IngestiaReactNativeSwiftBridge shared] destroy];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeIngestiaReactNativeSpecJSI>(params);
}

+ (NSString *)moduleName {
  return @"IngestiaReactNative";
}

@end