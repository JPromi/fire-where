import { ServiceOriginEnum } from "@/enums/ServiceOriginEnum";
import { OperationFiredepartment } from "./OperationFiredepartment";
import { OperationUnit } from "./OperationUnit";

export type Operation = {
  uuid: string;
  externalIds: {
    upperAustriaId?: string;
    tyrolEventId?: string;
    burgenlandId?: string;
    styriaId?: string;
    lowerAustriaWastlPubId?: string;
    lowerAustriaSysId?: string;
    lowerAustriaId?: string;
  };
  alarm: {
    type?: string;
    level?: number;
    levelAddition?: string;
    message?: string;
    upperAustriaId?: string;
    upperAustriaType?: string;
    tyrolOrganization?: string;
    tyrolOutOrder?: string;
    tyrolCategory?: string;
  },
  address: {
    country?: string;
    federalState?: string;
    city?: string;
    zipCode?: string;
    district?: string;
    location?: string;
  },
  firedepartments: OperationFiredepartment[];
  units: OperationUnit[];
  startTime?: string;
  endTime?: string;
  system: {
    serviceOrigin: ServiceOriginEnum;
    firstSeen?: string;
    lastSeen?: string;
    lastUpdate?: string;
  }
}