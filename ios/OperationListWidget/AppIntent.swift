//
//  AppIntent.swift
//  OperationListWidget
//
//  Created by Jonas Prominzer on 30.10.25.
//

import WidgetKit
import AppIntents

struct ConfigurationAppIntent: WidgetConfigurationIntent {
  static var title: LocalizedStringResource { "Configuration" }
  static var description: IntentDescription { "This is an example widget." }

  @Parameter(title: "Bundesland", default: FederalState.none)
  var federalState: FederalState
  
  /* @Parameter(title: "Bezirk")
  var district: String? */
  
  @MainActor
  func perform() async throws -> some IntentResult {
    return .result()
  }
}
