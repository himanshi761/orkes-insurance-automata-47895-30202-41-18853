import { Badge } from "@/components/ui/badge";

const ClaimStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      label: "Pending Review",
      className: "bg-warning/10 text-warning border-warning/20",
    },
    assigned: {
      label: "Assigned",
      className: "bg-blue-100 text-blue-700 border-blue-200",
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

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};

export default ClaimStatusBadge;
