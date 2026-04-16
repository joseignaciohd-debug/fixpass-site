import { assignments, getProperty, getUser, serviceRequests, users } from "@/lib/demo-data";
import { createSupabaseServerClient, isSupabaseServerConfigured } from "@/lib/integrations/supabase/server";

type TechnicianJob = {
  id: string;
  title: string;
  description: string;
  status: string;
  scheduledFor: string | null;
  area: string;
  address: string;
  customerName: string;
  customerPhone: string;
  assignmentStatus: string;
  routeOrder: number | null;
};

type TechnicianJobDetail = TechnicianJob & {
  internalNotes: string;
  accessNotes: string;
  technicianName: string;
  fairUseReason: string | null;
};

type TechnicianSnapshot = {
  source: "live" | "demo";
  technicianId: string;
  technicianName: string;
  completionRate: string;
  regionLabel: string;
  jobs: TechnicianJob[];
};

type TechnicianAssignmentRow = {
  id: string;
  assignment_status: string;
  route_order: number | null;
  check_in_at: string | null;
  check_out_at: string | null;
  technician_id: string;
  technicians: {
    id: string;
    service_region: string | null;
    active: boolean;
    users: Array<{
      id: string;
      full_name: string;
      phone: string | null;
    }> | null;
  }[] | null;
  service_requests: Array<{
    id: string;
    title: string;
    description: string;
    request_status: string;
    area: string | null;
    scheduled_for: string | null;
    internal_notes: string | null;
    customers: {
      users: Array<{
        full_name: string;
        phone: string | null;
      }> | null;
    } | null;
    properties: {
      address_line_1: string;
      city: string;
      state: string;
      access_notes: string | null;
    } | null;
  }> | null;
} | null;

type FairUseFlagRow = {
  reason: string;
  status: string;
};

export async function getTechnicianSnapshot() : Promise<TechnicianSnapshot> {
  if (!isSupabaseServerConfigured()) {
    return getDemoTechnicianSnapshot();
  }

  const client = createSupabaseServerClient();
  if (!client) {
    return getDemoTechnicianSnapshot();
  }

  try {
    const { data: techniciansData, error: techniciansError } = await client
      .from("technicians")
      .select("id,service_region,active,users(id,full_name,phone)")
      .eq("active", true)
      .order("created_at", { ascending: true });

    if (techniciansError || !techniciansData?.length) {
      return getDemoTechnicianSnapshot();
    }

    const technician = techniciansData[0];
    const { data: assignmentsData, error: assignmentsError } = await client
      .from("technician_assignments")
      .select("id,assignment_status,route_order,check_in_at,check_out_at,technician_id,technicians(id,service_region,active,users(id,full_name,phone)),service_requests(id,title,description,request_status,area,scheduled_for,internal_notes,customers(users(full_name,phone)),properties(address_line_1,city,state,access_notes))")
      .eq("technician_id", technician.id)
      .order("route_order", { ascending: true, nullsFirst: false });

    if (assignmentsError) {
      return getDemoTechnicianSnapshot();
    }

    const assignmentsRows = (assignmentsData ?? []) as unknown as TechnicianAssignmentRow[];
    const jobs = assignmentsRows
      .filter((assignment): assignment is NonNullable<TechnicianAssignmentRow> => Boolean(assignment?.service_requests?.[0]))
      .map((assignment) => ({
        id: assignment.service_requests![0].id,
        title: assignment.service_requests![0].title,
        description: assignment.service_requests![0].description,
        status: assignment.service_requests![0].request_status,
        scheduledFor: assignment.service_requests![0].scheduled_for,
        area: assignment.service_requests![0].area ?? "General",
        address: assignment.service_requests![0].properties
          ? `${assignment.service_requests![0].properties.address_line_1}, ${assignment.service_requests![0].properties.city}, ${assignment.service_requests![0].properties.state}`
          : "Address pending",
        customerName: assignment.service_requests![0].customers?.users?.[0]?.full_name ?? "Unknown customer",
        customerPhone: assignment.service_requests![0].customers?.users?.[0]?.phone ?? "No phone on file",
        assignmentStatus: assignment.assignment_status,
        routeOrder: assignment.route_order,
      }));

    const completedAssignments = assignmentsRows.filter((assignment) => assignment?.assignment_status === "complete").length;
    const completionRate = assignmentsRows.length ? `${Math.round((completedAssignments / assignmentsRows.length) * 100)}%` : "0%";

    return {
      source: "live",
      technicianId: technician.id,
      technicianName: technician.users?.[0]?.full_name ?? "Assigned technician",
      completionRate,
      regionLabel: technician.service_region ?? "Fixpass service route",
      jobs,
    };
  } catch {
    return getDemoTechnicianSnapshot();
  }
}

export async function getTechnicianJobDetail(requestId: string): Promise<TechnicianJobDetail | null> {
  if (!isSupabaseServerConfigured()) {
    return getDemoTechnicianJobDetail(requestId);
  }

  const client = createSupabaseServerClient();
  if (!client) {
    return getDemoTechnicianJobDetail(requestId);
  }

  try {
    const { data: assignmentData, error } = await client
      .from("technician_assignments")
      .select("id,assignment_status,route_order,check_in_at,check_out_at,technician_id,technicians(id,service_region,active,users(id,full_name,phone)),service_requests(id,title,description,request_status,area,scheduled_for,internal_notes,customers(users(full_name,phone)),properties(address_line_1,city,state,access_notes))")
      .eq("service_request_id", requestId)
      .maybeSingle();

    if (error || !assignmentData?.service_requests?.[0]) {
      return getDemoTechnicianJobDetail(requestId);
    }

    const { data: flags } = await client
      .from("fair_use_flags")
      .select("reason,status")
      .eq("service_request_id", requestId)
      .order("created_at", { ascending: false })
      .limit(1);

    const assignment = assignmentData as unknown as NonNullable<TechnicianAssignmentRow>;
    const request = assignment.service_requests![0];
    const technician = assignment.technicians?.[0];

    return {
      id: request.id,
      title: request.title,
      description: request.description,
      status: request.request_status,
      scheduledFor: request.scheduled_for,
      area: request.area ?? "General",
      address: request.properties
        ? `${request.properties.address_line_1}, ${request.properties.city}, ${request.properties.state}`
        : "Address pending",
      customerName: request.customers?.users?.[0]?.full_name ?? "Unknown customer",
      customerPhone: request.customers?.users?.[0]?.phone ?? "No phone on file",
      assignmentStatus: assignment.assignment_status,
      routeOrder: assignment.route_order,
      internalNotes: request.internal_notes ?? "No internal notes yet.",
      accessNotes: request.properties?.access_notes ?? "No access notes.",
      technicianName: technician?.users?.[0]?.full_name ?? "Assigned technician",
      fairUseReason: ((flags ?? []) as FairUseFlagRow[])[0]?.reason ?? null,
    };
  } catch {
    return getDemoTechnicianJobDetail(requestId);
  }
}

function getDemoTechnicianSnapshot(): TechnicianSnapshot {
  const technician = users.find((user) => user.role === "technician")!;
  const jobs = assignments
    .filter((assignment) => assignment.technicianId === technician.id)
    .map((assignment) => {
      const request = serviceRequests.find((item) => item.id === assignment.requestId)!;
      const property = getProperty(request.propertyId)!;
      const customer = getUser(request.customerId)!;

      return {
        id: request.id,
        title: request.title,
        description: request.description,
        status: request.status,
        scheduledFor: request.scheduledFor ?? null,
        area: request.area,
        address: property.address,
        customerName: customer.name,
        customerPhone: customer.phone,
        assignmentStatus: assignment.status,
        routeOrder: assignment.routeOrder,
      };
    });

  return {
    source: "demo",
    technicianId: technician.id,
    technicianName: technician.name,
    completionRate: "96%",
    regionLabel: technician.location,
    jobs,
  };
}

function getDemoTechnicianJobDetail(requestId: string): TechnicianJobDetail | null {
  const snapshot = getDemoTechnicianSnapshot();
  const job = snapshot.jobs.find((entry) => entry.id === requestId);
  if (!job) {
    return null;
  }

  const request = serviceRequests.find((entry) => entry.id === requestId)!;
  const property = getProperty(request.propertyId)!;

  return {
    ...job,
    internalNotes: request.notes,
    accessNotes: property.accessNotes,
    technicianName: snapshot.technicianName,
    fairUseReason: request.fairUseFlag ? "Request requires fair-use / scope review." : null,
  };
}
