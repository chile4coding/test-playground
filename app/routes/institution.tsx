import React from "react";
import InstitutionListDashboard from "~/InstitiutionComponent/Institutions";
import { ProtectedRoute } from "~/components/ProtectedRoute";

export default function Institution() {
  return (
    <ProtectedRoute>
      <div>
        <InstitutionListDashboard />
      </div>
    </ProtectedRoute>
  );
}
