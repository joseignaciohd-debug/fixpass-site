import { getPlan, getProperty, getUser, properties, quotes, serviceRequests } from "@/lib/demo-data";
import { ServiceRequest } from "@/lib/types";

export function getRequestsByCustomer(customerId: string) {
  return serviceRequests.filter((request) => request.customerId === customerId);
}

export function getRequestsByTechnician(technicianId: string) {
  return serviceRequests.filter((request) => request.assignedTechnicianId === technicianId);
}

export function getRequestById(id: string) {
  return serviceRequests.find((request) => request.id === id);
}

export function getRequestPresentation(input: string | ServiceRequest) {
  const request = typeof input === "string" ? getRequestById(input) : input;

  if (!request) {
    return null;
  }

  return {
    request,
    customer: getUser(request.customerId),
    property: getProperty(request.propertyId),
    plan: getPlan(request.planId),
    quote: quotes.find((quote) => quote.requestId === request.id),
  };
}

export function getPropertyByCustomer(customerId: string) {
  return properties.find((property) => property.customerId === customerId);
}

export function getRequestsByStatus() {
  return serviceRequests.reduce<Record<string, number>>((acc, request) => {
    acc[request.status] = (acc[request.status] ?? 0) + 1;
    return acc;
  }, {});
}

export function getCoverageSummary(request: ServiceRequest) {
  if (request.category === "covered") {
    return "Covered visit candidate";
  }

  if (request.category === "quote") {
    return "Likely separate quote";
  }

  return "Excluded service";
}
