"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import * as ToastPrimitives from "@radix-ui/react-toast"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cva } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import { X, PanelLeft } from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

import { cn } from "@/lib/utils"

/* -------------------- Tooltip -------------------- */
const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef(({
  className,
  sideOffset = 4,
  ...props
}, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 rounded-md border bg-popover px-3 py-1.5 text-sm shadow-md",
      className
    )}
    {...props}
  />
))

/* -------------------- Toggle -------------------- */
const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size }), className)}
    {...props}
  />
))

/* -------------------- Tabs -------------------- */
const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("inline-flex h-10 bg-muted p-1 rounded-md", className)}
    {...props}
  />
))

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn("px-3 py-1.5 text-sm", className)}
    {...props}
  />
))

/* -------------------- Toast -------------------- */
const ToastProvider = ToastPrimitives.Provider

const Toast = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Root
    ref={ref}
    className={cn("rounded-md border p-4 shadow", className)}
    {...props}
  />
))

const ToastClose = React.forwardRef((props, ref) => (
  <ToastPrimitives.Close ref={ref} {...props}>
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))

/* -------------------- Switch -------------------- */
const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      "inline-flex h-6 w-11 items-center rounded-full bg-input",
      className
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb
      className="block h-5 w-5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-5"
    />
  </SwitchPrimitives.Root>
))

/* -------------------- Slider -------------------- */
const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="h-2 w-full bg-secondary rounded-full">
      <SliderPrimitive.Range className="bg-primary h-full" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="h-5 w-5 rounded-full bg-white border" />
  </SliderPrimitive.Root>
))

/* -------------------- Textarea -------------------- */
const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn("w-full rounded-md border p-2", className)}
    {...props}
  />
))

/* -------------------- Table -------------------- */
const Table = React.forwardRef(({ className, ...props }, ref) => (
  <table ref={ref} className={cn("w-full text-sm", className)} {...props} />
))

/* -------------------- Skeleton -------------------- */
function Skeleton({ className, ...props }) {
  return <div className={cn("animate-pulse bg-muted", className)} {...props} />
}

/* -------------------- Sidebar -------------------- */
const SidebarContext = React.createContext(null)

const SidebarProvider = ({ children }) => {
  const [open, setOpen] = React.useState(true)
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

const Sidebar = ({ children }) => (
  <div className="w-64 bg-sidebar">{children}</div>
)

const SidebarTrigger = () => {
  const { setOpen } = React.useContext(SidebarContext)
  return (
    <button onClick={() => setOpen(prev => !prev)}>
      <PanelLeft />
    </button>
  )
}

/* -------------------- Toaster -------------------- */
const Toaster = (props) => {
  const { theme = "system" } = useTheme()

  return <Sonner theme={theme} className="toaster" {...props} />
}

/* -------------------- EXPORTS -------------------- */
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Toggle,
  Tabs,
  TabsList,
  TabsTrigger,
  Toast,
  ToastProvider,
  ToastClose,
  Switch,
  Slider,
  Textarea,
  Table,
  Skeleton,
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  Toaster,
  toast,
}