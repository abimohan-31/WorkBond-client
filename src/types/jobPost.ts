export interface Application {
  providerId: string;
  status: "applied" | "approved" | "rejected";
  appliedAt: string;
  _id?: string;
}

export interface JobPostType {
  _id: string;
  title: string;
  description: string;
  duration: string;
  service_id: string | any; // ServiceType
  location?: string;
  customerId: string | any; // CustomerType
  applications: Application[];
  jobStatus: "open" | "in_progress" | "completed" | "cancelled";
  assignedProviderId?: string | any; // ProviderType
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateJobPostData {
  title: string;
  description: string;
  duration: string;
  service_id: string;
  location?: string;
}

export interface UpdateJobPostData {
  title?: string;
  description?: string;
  duration?: string;
  service_id?: string;
  location?: string;
  jobStatus?: "open" | "in_progress" | "completed" | "cancelled";
}

