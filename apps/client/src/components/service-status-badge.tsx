import { tv } from "tailwind-variants";

import { ServiceStatus } from "@/gql/graphql";

const serviceStatusBadge = tv({
  base: "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium",
  variants: {
    status: {
      [ServiceStatus.RUNNING]: "bg-green-100 text-green-700 border-green-200",
      [ServiceStatus.DEPLOYING]: "bg-blue-100 text-blue-700 border-blue-200",
      [ServiceStatus.PENDING]: "bg-yellow-100 text-yellow-700 border-yellow-200",
      [ServiceStatus.BUILDING]: "bg-blue-100 text-blue-700 border-blue-200",
      [ServiceStatus.FAILED]: "bg-red-100 text-red-700 border-red-200",
      [ServiceStatus.STOPPED]: "bg-gray-100 text-gray-600 border-gray-200",
      [ServiceStatus.UNKNOWN]: "bg-gray-100 text-gray-500 border-gray-200",
    },
  },
  defaultVariants: {
    status: ServiceStatus.UNKNOWN,
  },
});

const statusLabels: Record<ServiceStatus, string> = {
  [ServiceStatus.RUNNING]: "Running",
  [ServiceStatus.DEPLOYING]: "Deploying",
  [ServiceStatus.PENDING]: "Pending",
  [ServiceStatus.BUILDING]: "Building",
  [ServiceStatus.FAILED]: "Failed",
  [ServiceStatus.STOPPED]: "Stopped",
  [ServiceStatus.UNKNOWN]: "Unknown",
};

interface ServiceStatusBadgeProps {
  status: ServiceStatus;
  className?: string;
}

export function ServiceStatusBadge({
  status,
  className,
}: ServiceStatusBadgeProps) {
  return (
    <span className={serviceStatusBadge({ status, className })}>
      {statusLabels[status]}
    </span>
  );
}
