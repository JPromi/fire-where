//
//  ApiClient.swift
//  FirePoint
//
//  Created by Jonas Prominzer on 01.11.25.
//

import Foundation

struct ApiClient {
  let baseURL: URL = {
    guard let urlString = Bundle.main.object(forInfoDictionaryKey: "API_BASE_URL") as? String,
      let url = URL(string: urlString) else {
      fatalError("API_BASE_URL not set or invalid in Info.plist")
    }
    return url
  }()
  
  func get<T: Decodable>(_ path: String) async throws -> T {
    print("GET: \(baseURL.appendingPathComponent(path).absoluteString)")
    let url = baseURL.appendingPathComponent(path)
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode(T.self, from: data)
  }
}
