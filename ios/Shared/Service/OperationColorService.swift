//
//  OperationColorService.swift
//  FirePoint
//
//  Created by Jonas Prominzer on 06.11.25.
//
import SwiftUI

class OperationColorService {
  
  func background(alarm: Alarm) -> Color {
    if (alarm.tyrolCategory != nil) {
      switch alarm.tyrolOrganization {
      case
        "BRANDG",
        "BRANDK",
        "EXPLOSION",
        "BMA",
        "BSW":
        return Color.red
        
      case
        "TECHNIK",
        "VERKEHR",
        "WASSER",
        "EINSTURZ",
        "RETTUNG",
        "BAHN",
        "FLUG",
        "STROM":
        return Color.blue
        
      case
        "ÖL",
        "ABC",
        "GAS":
        return Color.green
        
      case
        "UNTERSTÜTZUNG":
        return Color.orange
        
      default:
        return Color.white
      }
    } else {
      switch alarm.type {
      case
        "B",
        "BMA",
        "F":
        return Color.red
        
      case
        "T",
        "V",
        "KL":
        return Color.blue
        
      case
        "G",
        "S":
        return Color.green
        
      case
        "SOF",
        "SD":
        return Color.orange
        
      default:
        return Color.white
      }
    }
  }
  
  func text(alarm: Alarm) -> Color {
    if (alarm.tyrolCategory != nil) {
      switch alarm.tyrolOrganization {
      case
        "BRANDG",
        "BRANDK",
        "EXPLOSION",
        "BMA",
        "BSW":
        return Color.white
        
      case
        "TECHNIK",
        "VERKEHR",
        "WASSER",
        "EINSTURZ",
        "RETTUNG",
        "BAHN",
        "FLUG",
        "STROM":
        return Color.white
        
      case
        "ÖL",
        "ABC",
        "GAS":
        return Color.white
        
      case
        "UNTERSTÜTZUNG":
        return Color.white
        
      default:
        return Color.black
      }
    } else {
      switch alarm.type {
      case
        "B",
        "BMA",
        "F":
        return Color.white
        
      case
        "T",
        "V",
        "KL":
        return Color.white
        
      case
        "G",
        "S":
        return Color.white
        
      case
        "SOF",
        "SD":
        return Color.white
        
      default:
        return Color.black
      }
    }
  }

}
