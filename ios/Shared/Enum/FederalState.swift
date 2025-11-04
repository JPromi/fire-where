//
//  FederalState.swift
//  FirePoint
//
//  Created by Jonas Prominzer on 01.11.25.
//
import AppIntents


enum FederalState: String, AppEnum, CaseIterable {
  case none = "None"
  case la = "lower-austria"
  case ua = "upper-austria"
  case st = "styria"
  case bl = "burgenland"
  case ty = "tyrol"

  static var typeDisplayRepresentation: TypeDisplayRepresentation { "Bundesland" }

  static var caseDisplayRepresentations: [FederalState: DisplayRepresentation] {
    [
      .none: "--",
      .la: "Niederösterreich",
      .ua: "Oberösterreich",
      .st: "Steiermark",
      .bl: "Burgenland",
      .ty: "Tirol",
    ]
  }
}
