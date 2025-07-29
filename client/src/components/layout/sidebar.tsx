import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
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

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                      isActive
                        ? "bg-medical-blue text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
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
        
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-xs text-gray-500">Demo Version</p>
                <p className="text-xs text-gray-400">Not for medical use</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
