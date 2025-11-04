//
//  OperationListWidget.swift
//  OperationListWidget
//
//  Created by Jonas Prominzer on 30.10.25.
//

import WidgetKit
import SwiftUI

struct Provider: AppIntentTimelineProvider {
  func placeholder(in context: Context) -> SimpleEntry {
    SimpleEntry(
      date: Date(),
      configuration: ConfigurationAppIntent(),
      operations: []
    )
  }

  func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> SimpleEntry {
      
    return SimpleEntry(
      date: Date(),
      configuration: configuration,
      operations: []
    )
  }
    
  func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<SimpleEntry> {
    var entries: [SimpleEntry] = []

    do {
      let service = OperationService()
      let state = configuration.federalState
      let operations = try await service.getList(federalState: state)
        
      let entry = SimpleEntry(
        date: Date(),
        configuration: configuration,
        operations: operations,
      )
      
      entries.append(entry)
    } catch {
      print("Error loading operations: \(error)")
      let entry = SimpleEntry(
        date: Date(),
        configuration: configuration,
        operations: [],
      )
      entries.append(entry)
    }

    // z. B. alle 15 Minuten aktualisieren
    return Timeline(entries: entries, policy: .after(Date().addingTimeInterval(10)))
  }
}

struct SimpleEntry: TimelineEntry {
  let date: Date
  let configuration: ConfigurationAppIntent
  let operations: [Operation]
}

struct OperationListWidgetEntryView : View {
  
  @Environment(\.widgetFamily) var family
  var entry: Provider.Entry

  var body: some View {
    switch family {
    case .systemSmall:
      smallWidget
    case .systemMedium:
      mediumWidget
    default:
      smallWidget
    }
  }
  
  var smallWidget: some View {
    ZStack {
      
      // Title
      VStack(alignment: .leading, spacing: 0) {
        Text("Aktive Einsätze") // TODO: Translate
          .font(.caption2)
          .fontWeight(.light)
          .foregroundStyle(.secondary)
        
        Text(entry.configuration.district ?? entry.configuration.federalState.rawValue) // TODO: Custom Text
          .font(.headline)
          .fontWeight(.semibold)
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
      .padding(0)
      
      // Active Operation count
      Text("\(entry.operations.count)")
        .font(.system(size: 64, weight: .bold, design: .rounded))
        .monospacedDigit()
        .opacity(0.9)
        .padding(.top, 24)
    }
  }
      
  var mediumWidget: some View {
    ZStack {
      Text("\(entry.operations.count)")
          .font(.system(size: 64, weight: .bold, design: .rounded))
          .monospacedDigit()
          .opacity(0.9)
          .padding(.top, 24)
    }
  }
      
}

struct OperationListWidget: Widget {
    let kind: String = "OperationListWidget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: ConfigurationAppIntent.self, provider: Provider()) { entry in
            OperationListWidgetEntryView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
    }
}

extension ConfigurationAppIntent {
  // TODO: Check what this is
    fileprivate static var test: ConfigurationAppIntent {
        let intent = ConfigurationAppIntent()
        intent.federalState = FederalState.none
        return intent
    }
}

#Preview(as: .systemSmall) {
    OperationListWidget()
} timeline: {
  SimpleEntry(date: .now, configuration: .test, operations: [])
}
