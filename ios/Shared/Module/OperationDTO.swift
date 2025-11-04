//
//  OperationDTO.swift
//  FirePoint
//
//  Created by Jonas Prominzer on 01.11.25.
//

import Foundation

struct Operation: Codable, Identifiable {
    var id: String { uuid }
    let uuid: String
    let externalIds: ExternalIds
    let alarm: Alarm
    let address: Address
    let firedepartments: [OperationFiredepartment]
    let units: [OperationUnit]
    let startTime: String?
    let endTime: String?
    let system: System
}

// MARK: - Subtypes

struct ExternalIds: Codable {
    let upperAustriaId: String?
    let tyrolEventId: String?
    let burgenlandId: String?
    let styriaId: String?
    let lowerAustriaWastlPubId: String?
    let lowerAustriaSysId: String?
    let lowerAustriaId: String?
}

struct Alarm: Codable {
    let type: String?
    let level: Int?
    let levelAddition: String?
    let message: String?
    let upperAustriaId: String?
    let upperAustriaType: String?
    let tyrolOrganization: String?
    let tyrolOutOrder: String?
    let tyrolCategory: String?
}

struct Address: Codable {
    let country: String?
    let federalState: String?
    let city: String?
    let zipCode: String?
    let district: String?
    let location: String?
}

// MARK: - Firedepartment

struct OperationFiredepartment: Codable {
    let firedepartment: FireDepartmentInfo?
    let dispoTime: String?
    let outTime: String?
    let inTime: String?
    let alarmTime: String?
}

struct FireDepartmentInfo: Codable {
    let uuid: String?
    let name: String?
    let atFireDepartmentId: String?
    let isVolunteer: Bool
}

// MARK: - Unit

struct OperationUnit: Codable {
    let unit: UnitInfo?
    let dispoTime: String?
    let outTime: String?
    let inTime: String?
    let alarmTime: String?
}

struct UnitInfo: Codable {
    let uuid: String?
    let name: String?
}

// MARK: - System

struct System: Codable {
    let serviceOrigin: ServiceOriginEnum
    let firstSeen: String?
    let lastSeen: String?
    let lastUpdate: String?
}

enum ServiceOriginEnum: String, Codable {
    case UNKNOWN
    case BL_LSZ_PUB
    case LA_WASTL_PUB
    case UA_LFV_PUB
    case ST_LFV_PUB
    case TYROL_LFS_APP
}
