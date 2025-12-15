"use client";

import { useState } from "react";
import { MessageCircle, X, Phone, Send } from "lucide-react";
import { appConfig, type UserRole } from "@/lib/config";

// ========================================
// EXECUTIVE COMMUNICATIONS WIDGET
// Floating WhatsApp contact widget
// ========================================

interface ExecutiveCommsProps {
  currentUserRole: UserRole;
}

export function ExecutiveComms({ currentUserRole }: ExecutiveCommsProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Get contacts excluding current user's role
  const contacts = Object.entries(appConfig.contacts_registry)
    .filter(([role]) => role !== currentUserRole)
    .map(([role, data]) => ({
      role: role as UserRole,
      ...data
    }));

  const handleWhatsAppClick = (phone: string, label: string) => {
    const message = encodeURIComponent(`السلام عليكم، ${label}`);
    const url = `https://wa.me/${phone}?text=${message}`;
    window.open(url, "_blank");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen ? "bg-gray-800" : "bg-green-500"
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Contact Panel */}
      {isOpen && (
        <div 
          className="fixed bottom-24 left-6 z-50 w-72 overflow-hidden shadow-2xl"
          style={{ borderRadius: "24px" }}
        >
          {/* Header */}
          <div className="bg-green-500 p-5 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Phone className="w-6 h-6" />
              <h3 className="text-lg font-bold">التواصل التنفيذي</h3>
            </div>
            <p className="text-sm text-green-100">
              تواصل مباشر مع الإدارة التنفيذية
            </p>
          </div>

          {/* Contacts List */}
          <div className="bg-white p-4 space-y-3">
            {contacts.map((contact) => (
              <button
                key={contact.role}
                onClick={() => handleWhatsAppClick(contact.phone, contact.label)}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-green-50 border border-gray-100 hover:border-green-200 transition-all group"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {contact.label.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 text-right">
                  <p className="font-bold text-gray-800">{contact.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    +{contact.phone.slice(0, 3)} {contact.phone.slice(3, 5)} ***
                  </p>
                </div>

                {/* Send Icon */}
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Send className="w-4 h-4 text-white" />
                </div>
              </button>
            ))}

            {contacts.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">لا توجد جهات اتصال متاحة</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 border-t">
            <p className="text-xs text-gray-400 text-center">
              يتم فتح واتساب في نافذة جديدة
            </p>
          </div>
        </div>
      )}
    </>
  );
}

