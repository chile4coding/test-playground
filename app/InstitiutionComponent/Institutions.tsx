import React, { useState, useEffect, type ChangeEvent } from "react";
import {
  School,
  MapPin,
  Calendar,
  Code,
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  MoreVertical,
} from "lucide-react";

type Institution = {
  institutionID: number;
  institutionName: string;
  institutionCode: string;
  institutionAddress: string;
  createdDate: string;
  updatedDate: string | null;
};

type SampleData = {
  statusCode: number;
  message: string;
  data: Institution[];
  error: string | null;
};

export default function InstitutionListDashboard() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState<
    Institution[]
  >([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedInstitution, setSelectedInstitution] =
    useState<Institution | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Sample data from your JSON response
  const sampleData: SampleData = {
    statusCode: 200,
    message: "Institution List",
    data: [
      {
        institutionID: 1,
        institutionName: "Obafemi Awolowo University",
        institutionCode: "01123",
        institutionAddress: "Ibadan street",
        createdDate: "2025-01-26T15:03:43.7851986",
        updatedDate: "2025-01-26T15:37:10.493804",
      },
      {
        institutionID: 2,
        institutionName: "Olabisi Onabanjo University",
        institutionCode: "03335",
        institutionAddress: "Ago iwoye",
        createdDate: "2025-01-26T15:04:26.7062044",
        updatedDate: null,
      },
      {
        institutionID: 3,
        institutionName: "University of Lagos",
        institutionCode: "unilag14",
        institutionAddress: "Yaba, Lagos state",
        createdDate: "2025-01-26T15:06:50.9932758",
        updatedDate: null,
      },
      {
        institutionID: 4,
        institutionName: "Daniel Tutorial Center",
        institutionCode: "DANTOR",
        institutionAddress: "Sango Ota",
        createdDate: "2025-01-26T18:17:00.1195975",
        updatedDate: null,
      },
    ],
    error: null,
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setInstitutions(sampleData.data);
      setFilteredInstitutions(sampleData.data);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = institutions.filter(
      (institution) =>
        institution.institutionName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        institution.institutionCode
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        institution.institutionAddress
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredInstitutions(filtered);
  }, [searchTerm, institutions]);

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Not updated";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewDetails = (institution: Institution): void => {
    setSelectedInstitution(institution);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading institutions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <School className="w-8 h-8 text-blue-600" />
                Institution Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and view all educational institutions
              </p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Institution
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Institutions
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {institutions.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <School className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Recently Updated
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {institutions.filter((i) => i.updatedDate).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Today
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {
                    institutions.filter(
                      (i) =>
                        new Date(i.createdDate).toDateString() ===
                        new Date().toDateString()
                    ).length
                  }
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Filter className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Search Results
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {filteredInstitutions.length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search institutions by name, code, or address..."
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Institution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstitutions.map((institution) => (
            <div
              key={institution.institutionID}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <School className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetails(institution)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {institution.institutionName}
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Code className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {institution.institutionCode}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 mt-0.5" />
                    <span className="text-sm">
                      {institution.institutionAddress}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Created: {formatDate(institution.createdDate)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        institution.updatedDate ? "bg-green-400" : "bg-gray-400"
                      }`}></div>
                    <span className="text-xs text-gray-500">
                      {institution.updatedDate
                        ? "Recently Updated"
                        : "Not Updated"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredInstitutions.length === 0 && (
          <div className="text-center py-12">
            <School className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No institutions found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or add a new institution.
            </p>
          </div>
        )}
      </div>

      {/* Modal for institution details */}
      {showModal && selectedInstitution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Institution Details
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institution Name
                  </label>
                  <p className="text-gray-900">
                    {selectedInstitution.institutionName}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institution Code
                  </label>
                  <p className="text-gray-900 font-mono">
                    {selectedInstitution.institutionCode}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <p className="text-gray-900">
                    {selectedInstitution.institutionAddress}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created Date
                  </label>
                  <p className="text-gray-900">
                    {formatDate(selectedInstitution.createdDate)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Updated
                  </label>
                  <p className="text-gray-900">
                    {formatDate(selectedInstitution.updatedDate)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Edit Institution
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
