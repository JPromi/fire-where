//
//  FederalState.swift
//  FirePoint
//
//  Created by Jonas Prominzer on 01.11.25.
//
import AppIntents

enum FederalState: String, AppEnum, CaseIterable {
  case none = "none"
  case la = "lower-austria"
  case ua = "upper-austria"
  case st = "styria"
  case bl = "burgenland"
  case ty = "tyrol"

  static var typeDisplayRepresentation: TypeDisplayRepresentation { "Bundesland" }

  static var caseDisplayRepresentations: [FederalState: DisplayRepresentation] {
    [
      .none: .init(title: "--"),
      .la:   .init(title: LocalizedStringResource("federalState.la")),
      .ua:   .init(title: LocalizedStringResource("federalState.ua")),
      .st:   .init(title: LocalizedStringResource("federalState.st")),
      .bl:   .init(title: LocalizedStringResource("federalState.bl")),
      .ty:   .init(title: LocalizedStringResource("federalState.ty")),
    ]
  }
}
