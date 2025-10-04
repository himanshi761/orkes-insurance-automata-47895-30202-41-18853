import { Check, Clock, FileText, Brain, UserCheck, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  label: string;
  icon: React.ReactNode;
  status: "completed" | "current" | "upcoming";
}

interface WorkflowProgressProps {
  currentStep: number;
}

const WorkflowProgress = ({ currentStep }: WorkflowProgressProps) => {
  const steps: Step[] = [
    {
      id: "submitted",
      label: "Submitted",
      icon: <FileText className="h-5 w-5" />,
      status: currentStep >= 1 ? "completed" : "upcoming",
    },
    {
      id: "policy-check",
      label: "Policy Verified",
      icon: <Clock className="h-5 w-5" />,
      status: currentStep >= 2 ? "completed" : currentStep === 1 ? "current" : "upcoming",
    },
    {
      id: "ai-analysis",
      label: "AI Analysis",
      icon: <Brain className="h-5 w-5" />,
      status: currentStep >= 3 ? "completed" : currentStep === 2 ? "current" : "upcoming",
    },
    {
      id: "agent-review",
      label: "Agent Review",
      icon: <UserCheck className="h-5 w-5" />,
      status: currentStep >= 4 ? "completed" : currentStep === 3 ? "current" : "upcoming",
    },
    {
      id: "payment",
      label: "Payment",
      icon: <DollarSign className="h-5 w-5" />,
      status: currentStep >= 5 ? "completed" : currentStep === 4 ? "current" : "upcoming",
    },
  ];

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center relative">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all",
                  step.status === "completed" && "bg-success border-success text-success-foreground",
                  step.status === "current" && "bg-primary border-primary text-primary-foreground animate-pulse",
                  step.status === "upcoming" && "bg-muted border-muted-foreground/20 text-muted-foreground"
                )}
              >
                {step.status === "completed" ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.icon
                )}
              </div>
              <p
                className={cn(
                  "text-xs mt-2 text-center max-w-[80px]",
                  step.status === "upcoming" && "text-muted-foreground"
                )}
              >
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 transition-all",
                  currentStep > index + 1 ? "bg-success" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowProgress;
