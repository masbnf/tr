import { ServiceType } from "./enums";

export interface Provider {
  id:          string;
  name:        string;
  phone:       string;
  serviceType: ServiceType;
  isActive:    boolean;
  createdAt:   Date;
}

export type CreateProviderInput = Omit<Provider, "id" | "createdAt">;
