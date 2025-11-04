//
//  OperationService.swift
//  FirePoint
//
//  Created by Jonas Prominzer on 01.11.25.
//

struct OperationService {
  private let api = ApiClient()

  func getList(federalState: FederalState) async throws -> [Operation] {
    if (federalState != FederalState.none) {
      try await api.get("/operation/list/" + federalState.rawValue)
    } else {
      try await api.get("/operation/list")
    }
  }
}
