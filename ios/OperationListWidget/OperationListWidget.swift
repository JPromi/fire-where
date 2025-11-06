//
//  OperationListWidget.swift
//  OperationListWidget
//
//  Created by Jonas Prominzer on 30.10.25.
//

import WidgetKit
import SwiftUI
import AppIntents

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

    return Timeline(entries: entries, policy: .after(Date().addingTimeInterval(120)))
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
  
  var locationLink: URL {
    if entry.configuration.federalState != .none {
      return URL(string: "firepoint://operation/\(entry.configuration.federalState.rawValue)")!
    } else {
      return URL(string: "firepoint://operation/")!
    }
  }

  var body: some View {
    switch family {
    case .systemSmall:
      smallWidget
    case .systemMedium:
      mediumWidget
    case .systemLarge:
      largeWidget
    default:
      smallWidget
    }
  }
  
  var smallWidget: some View {
    // TODO: Open selected federal state
    ZStack {
      // Title
      VStack(alignment: .leading, spacing: 0) {
        Text(LocalizedStringResource("operation.active"))
          .font(.caption2)
          .fontWeight(.light)
          .foregroundStyle(.secondary)
        
        Text(
          entry.configuration.federalState == .none ?
          LocalizedStringResource("country.at")
          :
            FederalState.caseDisplayRepresentations[entry.configuration.federalState]?
            .title
          ?? LocalizedStringResource(stringLiteral: "")
        )
        .font(.headline)
        .fontWeight(.semibold)
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
      .padding(0)
      
      // Active Operation count
      Text("\(entry.operations.count)")
        .font(.system(size: 64, weight: .bold, design: .default))
        .monospacedDigit()
        .opacity(0.9)
        .padding(.top, 24)
    }
  }
      
  var mediumWidget: some View {
    HStack(alignment: .top, spacing: 16) {
      
      /// Counter
      Link(destination: locationLink) {
        VStack(alignment: .leading, spacing: 4) {
          /// Title
          VStack(alignment: .leading, spacing: 0) {
            Text(LocalizedStringResource("operation.active"))
              .font(.caption2)
              .fontWeight(.light)
              .foregroundStyle(.secondary)
            
            Text(
              entry.configuration.federalState == .none ?
              LocalizedStringResource("country.at")
              :
                FederalState.caseDisplayRepresentations[entry.configuration.federalState]?
                .title
              ?? LocalizedStringResource(stringLiteral: "")
            )
            .font(.headline)
            .fontWeight(.semibold)
          }
          .frame(maxWidth: .infinity, alignment: .topLeading)
          
          Spacer()
          
          /// Counter
          Text("\(entry.operations.count)")
            .font(.system(size: 32, weight: .bold, design: .default))
            .monospacedDigit()
            .opacity(0.9)
        }
        .frame(width: 90, alignment: .leading)
      }
      
      // Operations
      VStack(alignment: .leading, spacing: 10) {
        ForEach(entry.operations.prefix(4), id: \.id) { operation in
          Link(destination: URL(string: "firepoint://operation/details/\(operation.uuid)")!) {
            HStack(spacing: 6) {
              operationTypeBox(alarm: operation.alarm)
              Text(operation.alarm.message ?? "")
                .font(.system(size: 14, weight: .regular, design: .default))
                .lineLimit(1)
            }
          }
        }
      }
      .frame(maxWidth: .infinity, alignment: .leading)
    }
  }
      
  var largeWidget: some View {
    VStack(spacing: 16) {
      
      /// Counter
      Link(destination: locationLink) {
        HStack(alignment: .center, spacing: 4) {
          /// Title
          VStack(alignment: .leading, spacing: 0) {
            Text(LocalizedStringResource("operation.active"))
              .font(.caption2)
              .fontWeight(.light)
              .foregroundStyle(.secondary)
            
            Text(
              entry.configuration.federalState == .none ?
              LocalizedStringResource("country.at")
              :
                FederalState.caseDisplayRepresentations[entry.configuration.federalState]?
                .title
              ?? LocalizedStringResource(stringLiteral: "")
            )
            .font(.headline)
            .fontWeight(.semibold)
          }
          .frame(maxWidth: .infinity, alignment: .topLeading)
          
          Spacer()
          
          /// Counter
          Text("\(entry.operations.count)")
            .font(.system(size: 48, weight: .bold, design: .default))
            .monospacedDigit()
            .opacity(0.9)
            .frame(width: 100, alignment: .center)
        }
        .frame(height: 60, alignment: .center)

      }
      
      Divider()
      
      // Operations
      VStack(alignment: .leading, spacing: 10) {
        ForEach(entry.operations.prefix(7), id: \.id) { operation in
          Link(destination: URL(string: "firepoint://operation/details/\(operation.uuid)")!) {
            HStack(spacing: 6) {
              operationTypeBox(alarm: operation.alarm)
              Text(operation.alarm.message ?? "")
                .font(.system(size: 14, weight: .regular, design: .default))
                .lineLimit(1)
                .frame(maxWidth: .infinity, alignment: .leading)
            }
              .frame(maxWidth: .infinity, alignment: .leading)
          }
        }
      }
      .frame(maxWidth: .infinity, alignment: .topLeading)
    }
    .frame(maxHeight: .infinity, alignment: .top)
    
  }
      
}

@ViewBuilder
func operationTypeBox(alarm: Alarm) -> some View {
  let colorService = OperationColorService()

  let alarmText: String = {
    if let tyrol = alarm.tyrolCategory, !tyrol.isEmpty {
      return tyrol
    }
    let type = alarm.type ?? ""
    let level = alarm.level.map(String.init) ?? ""
    let add = alarm.levelAddition ?? ""
    let s = type + level + add
    return s.isEmpty ? "" : s
  }()
  
  let fontSize: CGFloat = {
    if (alarm.tyrolCategory != nil) {
      return 12
    } else {
      return alarmText.count > 3 ? (alarmText.count > 3 ? 8 : 12) : 14
    }
  }()
  
  let boxWidth: CGFloat = {
    if (alarm.tyrolCategory != nil) {
      return 64
    } else {
      return 32
    }
  }()

  VStack {
    Text(alarmText)
      .font(
        .system(
          size: fontSize,
          weight: .regular
        )
      )
      .lineLimit(1)
      .frame(width: boxWidth, height: 20, alignment: .center)
      .padding(2)
      .foregroundColor(colorService.text(alarm: alarm))

  }
    .background(colorService.background(alarm: alarm))
    .cornerRadius(4)
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
