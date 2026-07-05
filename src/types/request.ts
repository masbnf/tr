import { ServiceType, OrderStatus } from "./enums";

export interface ServiceRequest {
  id:                string;
  name:              string;
  phone:             string;
  serviceType:       ServiceType;
  description?:      string;
  locationLat:       number;
  locationLng:       number;
  status:            OrderStatus;
  assignedProvider?: string;   // provider document ID
  createdAt:         Date;
  updatedAt?:        Date;
}

// Shape of the form before submission
export type CreateRequestInput = Omit<ServiceRequest, "id" | "status" | "createdAt" | "updatedAt" | "assignedProvider">;
