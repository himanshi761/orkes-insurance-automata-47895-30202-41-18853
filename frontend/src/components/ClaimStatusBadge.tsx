import { Badge } from "@/components/ui/badge";

type ClaimStatus = "pending" | "in-progress" | "approved" | "rejected" | "paid";

interface ClaimStatusBadgeProps {
  status: ClaimStatus;
}

const ClaimStatusBadge = ({ status }: ClaimStatusBadgeProps) => {
  const statusConfig = {
    pending: {
      label: "Pending Review",
      className: "bg-warning/10 text-warning border-warning/20",
    },
    "in-progress": {
      label: "In Progress",
      className: "bg-accent/10 text-accent border-accent/20",
    },
    approved: {
      label: "Approved",
      className: "bg-success/10 text-success border-success/20",
    },
    rejected: {
      label: "Rejected",
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
    paid: {
      label: "Paid",
      className: "bg-success/10 text-success border-success/20",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};

export default ClaimStatusBadge;
