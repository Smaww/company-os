"use client";

import { useState } from "react";
import { 
  Mail, 
  MessageSquare, 
  Clock, 
  Github, 
  Phone, 
  ShoppingBag, 
  CreditCard, 
  LayoutDashboard,
  X,
  ExternalLink,
  Loader2,
  Maximize2,
  Minimize2,
  Folder,
  FileText,
  Users,
  Zap,
  Cloud,
  Database,
  Server,
  Settings,
  Wrench
} from "lucide-react";
import { appConfig } from "@/lib/config";
import { useTools } from "@/contexts/DataContext";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";

// ========================================
// TOOLS GRID - DYNAMIC FROM CONTEXT
// ========================================

// Icon mapping
const iconMap: Record<string, any> = {
  Mail,
  MessageSquare,
  Clock,
  Github,
  Phone,
  ShoppingBag,
  CreditCard,
  LayoutDashboard,
  Folder,
  FileText,
  Users,
  Zap,
  Cloud,
  Database,
  Server,
  Settings,
  Wrench,
};

function getIcon(iconName: string) {
  return iconMap[iconName] || Mail;
}

interface ToolModalProps {
  tool: { id: string; name: string; url: string; icon: string; color: string } | null;
  isOpen: boolean;
  onClose: () => void;
}

function ToolModal({ tool, isOpen, onClose }: ToolModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(true);

  if (!isOpen || !tool) return null;

  const handleOpenExternal = () => {
    window.open(tool.url, "_blank", "noopener,noreferrer");
  };

  const Icon = getIcon(tool.icon);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div 
        className={`
          bg-white flex flex-col transition-all duration-300
          ${isFullScreen 
            ? "fixed inset-0" 
            : "fixed inset-4 md:inset-8 lg:inset-16 rounded-3xl shadow-2xl overflow-hidden"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tool.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">{tool.name}</h2>
              <p className="text-xs text-gray-500 truncate max-w-[300px]">{tool.url}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors"
              title={isFullScreen ? "تصغير" : "تكبير"}
            >
              {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            
            <button
              onClick={handleOpenExternal}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">فتح خارجياً</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - iframe */}
        <div className="flex-1 relative bg-gray-100">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-500 font-medium">جاري تحميل {tool.name}...</p>
              </div>
            </div>
          )}
          
          <iframe
            src={tool.url}
            className="w-full h-full border-0"
            onLoad={() => setIsLoading(false)}
            title={tool.name}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}

export function ToolsGrid() {
  const { tools } = useTools();
  const [selectedTool, setSelectedTool] = useState<typeof tools[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToolClick = (tool: typeof tools[0]) => {
    setSelectedTool(tool);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTool(null);
  };

  return (
    <>
      <section>
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 
            className="text-2xl font-extrabold"
            style={{ color: appConfig.design_system.colors.text_primary }}
          >
            منظومة الأدوات
          </h2>
          <Link 
            href="/settings"
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <Settings className="w-4 h-4" />
            إدارة الأدوات
          </Link>
        </div>

        {/* Tools Grid or Empty State */}
        {tools.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <EmptyState
              type="tools"
              onAction={() => window.location.href = "/settings"}
            />
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-4">
            {tools.map((tool) => {
              const Icon = getIcon(tool.icon);
              
              return (
                <button
                  key={tool.id}
                  onClick={() => handleToolClick(tool)}
                  className="
                    group p-4 rounded-2xl flex flex-col items-center gap-3 
                    transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                  "
                  style={{ backgroundColor: appConfig.design_system.colors.surface }}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tool.color} transition-transform group-hover:scale-110`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 text-center line-clamp-1">
                    {tool.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <ToolModal
        tool={selectedTool}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
