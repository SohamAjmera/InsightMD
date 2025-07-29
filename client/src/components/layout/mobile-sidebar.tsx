import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  BarChart3,
  Users,
  Calendar,
  Video,
  Brain,
  FileText,
  MessageSquare,
  PieChart,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Telehealth", href: "/telehealth", icon: Video },
  { name: "AI Insights", href: "/ai-insights", icon: Brain },
  { name: "Medical Records", href: "/medical-records", icon: FileText },
  { name: "Messages", href: "/messages", icon: MessageSquare, badge: 3 },
  { name: "Analytics", href: "/analytics", icon: PieChart },
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const [location] = useLocation();

  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-40">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
        <div className="absolute top-0 right-0 -mr-12 pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full text-white hover:bg-gray-600"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={cn(
                      "group flex items-center px-2 py-2 text-base font-medium rounded-md",
                      isActive
                        ? "bg-medical-blue text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    onClick={onClose}
                  >
                    <Icon className="mr-4 h-6 w-6" />
                    {item.name}
                    {item.badge && (
                      <span className="ml-auto bg-medical-error text-white text-xs rounded-full px-2 py-1">
                        {item.badge}
                      </span>
                    )}
                  </a>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
