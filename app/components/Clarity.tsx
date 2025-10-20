// import React, { useState, useEffect } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   Area,
//   AreaChart,
// } from "recharts";
// import {
//   Eye,
//   Users,
//   Clock,
//   MousePointer,
//   TrendingUp,
//   TrendingDown,
//   Activity,
//   Globe,
//   Smartphone,
//   Monitor,
//   AlertTriangle,
//   Mouse,
//   ScrollText,
//   Timer,
//   Bug,
//   Zap,
// } from "lucide-react";

// // Types based on Microsoft Clarity API response
// interface ClarityMetric {
//   metricName: string;
//   information: ClarityDataPoint[];
// }

// interface ClarityDataPoint {
//   // Traffic metrics
//   totalSessionCount?: string;
//   totalBotSessionCount?: string;
//   distantUserCount?: string;
//   PagesPerSessionPercentage?: number;

//   // Common dimensions
//   OS?: string;
//   Browser?: string;
//   Device?: string;
//   Country?: string;
//   URL?: string;
//   Source?: string;
//   Medium?: string;
//   Campaign?: string;
//   Channel?: string;

//   // Engagement metrics
//   ScrollDepth?: number;
//   EngagementTime?: number;

//   // Error metrics
//   DeadClickCount?: number;
//   ExcessiveScroll?: number;
//   RageClickCount?: number;
//   QuickbackClick?: number;
//   ScriptErrorCount?: number;
//   ErrorClickCount?: number;

//   // Page metrics
//   PageTitle?: string;
//   ReferrerURL?: string;
// }

// interface ProcessedMetrics {
//   totalSessions: number;
//   totalUsers: number;
//   avgPagesPerSession: number;
//   botSessions: number;
//   topOS: { name: string; sessions: number; percentage: number }[];
//   topBrowsers: { name: string; sessions: number; percentage: number }[];
//   topCountries: { name: string; users: number; percentage: number }[];
//   topDevices: { name: string; sessions: number; percentage: number }[];
//   errorMetrics: {
//     deadClicks: number;
//     rageClicks: number;
//     scriptErrors: number;
//     errorClicks: number;
//   };
// }

// const ClarityDashboard: React.FC = () => {
//   const [data, setData] = useState<ClarityMetric[]>([]);
//   const [processedData, setProcessedData] = useState<ProcessedMetrics | null>(
//     null
//   );
//   const [loading, setLoading] = useState(true);
//   const [selectedMetric, setSelectedMetric] = useState("Traffic");
//   const [activeTab, setActiveTab] = useState("overview");
//   const [error, setError] = useState<string | null>(null);

//   // Mock data matching Microsoft Clarity API structure
//   useEffect(() => {
//     const mockClarityData: ClarityMetric[] = [
//       {
//         metricName: "Traffic",
//         information: [
//           {
//             totalSessionCount: "9554",
//             totalBotSessionCount: "8369",
//             distantUserCount: "189733",
//             PagesPerSessionPercentage: 1.0931,
//             OS: "Other",
//           },
//           {
//             totalSessionCount: "291942",
//             totalBotSessionCount: "31076",
//             distantUserCount: "212836",
//             PagesPerSessionPercentage: 2.2609,
//             OS: "Android",
//           },
//           {
//             totalSessionCount: "156780",
//             totalBotSessionCount: "12450",
//             distantUserCount: "145890",
//             PagesPerSessionPercentage: 3.1456,
//             OS: "Windows",
//           },
//           {
//             totalSessionCount: "89234",
//             totalBotSessionCount: "5678",
//             distantUserCount: "78965",
//             PagesPerSessionPercentage: 2.8934,
//             OS: "iOS",
//           },
//         ],
//       },
//       {
//         metricName: "Browser",
//         information: [
//           {
//             totalSessionCount: "185640",
//             Browser: "Chrome",
//             distantUserCount: "167892",
//           },
//           {
//             totalSessionCount: "78934",
//             Browser: "Safari",
//             distantUserCount: "69845",
//           },
//           {
//             totalSessionCount: "45623",
//             Browser: "Firefox",
//             distantUserCount: "41234",
//           },
//           {
//             totalSessionCount: "23789",
//             Browser: "Edge",
//             distantUserCount: "21567",
//           },
//         ],
//       },
//       {
//         metricName: "Country/Region",
//         information: [
//           {
//             totalSessionCount: "156780",
//             Country: "United States",
//             distantUserCount: "134567",
//           },
//           {
//             totalSessionCount: "89234",
//             Country: "United Kingdom",
//             distantUserCount: "78945",
//           },
//           {
//             totalSessionCount: "67890",
//             Country: "Canada",
//             distantUserCount: "59876",
//           },
//           {
//             totalSessionCount: "45623",
//             Country: "Germany",
//             distantUserCount: "41234",
//           },
//         ],
//       },
//       {
//         metricName: "Device",
//         information: [
//           {
//             totalSessionCount: "234567",
//             Device: "Desktop",
//             distantUserCount: "198765",
//           },
//           {
//             totalSessionCount: "156789",
//             Device: "Mobile",
//             distantUserCount: "134567",
//           },
//           {
//             totalSessionCount: "23456",
//             Device: "Tablet",
//             distantUserCount: "21345",
//           },
//         ],
//       },
//     ];

//     // Simulate API call
//     setTimeout(() => {
//       setData(mockClarityData);
//       setLoading(false);
//     }, 1000);
//   }, []);

//   // Process raw Clarity data into useful metrics
//   useEffect(() => {
//     if (data.length === 0) return;

//     try {
//       const trafficData = data.find(
//         (metric) => metric.metricName === "Traffic"
//       );
//       const browserData = data.find(
//         (metric) => metric.metricName === "Browser"
//       );
//       const countryData = data.find(
//         (metric) => metric.metricName === "Country/Region"
//       );
//       const deviceData = data.find((metric) => metric.metricName === "Device");

//       if (!trafficData) return;

//       const totalSessions = trafficData.information.reduce(
//         (sum, item) => sum + parseInt(item.totalSessionCount || "0"),
//         0
//       );

//       const totalUsers = trafficData.information.reduce(
//         (sum, item) => sum + parseInt(item.distantUserCount || "0"),
//         0
//       );

//       const botSessions = trafficData.information.reduce(
//         (sum, item) => sum + parseInt(item.totalBotSessionCount || "0"),
//         0
//       );

//       const avgPagesPerSession =
//         trafficData.information.reduce(
//           (sum, item) => sum + (item.PagesPerSessionPercentage || 0),
//           0
//         ) / trafficData.information.length;

//       // Process OS data
//       const topOS = trafficData.information
//         .map((item) => ({
//           name: item.OS || "Unknown",
//           sessions: parseInt(item.totalSessionCount || "0"),
//           percentage:
//             (parseInt(item.totalSessionCount || "0") / totalSessions) * 100,
//         }))
//         .sort((a, b) => b.sessions - a.sessions);

//       // Process Browser data
//       const topBrowsers =
//         browserData?.information
//           .map((item) => ({
//             name: item.Browser || "Unknown",
//             sessions: parseInt(item.totalSessionCount || "0"),
//             percentage:
//               (parseInt(item.totalSessionCount || "0") / totalSessions) * 100,
//           }))
//           .sort((a, b) => b.sessions - a.sessions) || [];

//       // Process Country data
//       const topCountries =
//         countryData?.information
//           .map((item) => ({
//             name: item.Country || "Unknown",
//             users: parseInt(item.distantUserCount || "0"),
//             percentage:
//               (parseInt(item.distantUserCount || "0") / totalUsers) * 100,
//           }))
//           .sort((a, b) => b.users - a.users) || [];

//       // Process Device data
//       const topDevices =
//         deviceData?.information
//           .map((item) => ({
//             name: item.Device || "Unknown",
//             sessions: parseInt(item.totalSessionCount || "0"),
//             percentage:
//               (parseInt(item.totalSessionCount || "0") / totalSessions) * 100,
//           }))
//           .sort((a, b) => b.sessions - a.sessions) || [];

//       const processed: ProcessedMetrics = {
//         totalSessions,
//         totalUsers,
//         avgPagesPerSession,
//         botSessions,
//         topOS,
//         topBrowsers,
//         topCountries,
//         topDevices,
//         errorMetrics: {
//           deadClicks: 0, // These would come from error-specific metrics
//           rageClicks: 0,
//           scriptErrors: 0,
//           errorClicks: 0,
//         },
//       };

//       setProcessedData(processed);
//     } catch (err) {
//       setError("Error processing Clarity data");
//       console.error(err);
//     }
//   }, [data]);

//   const formatNumber = (num: number): string => {
//     return new Intl.NumberFormat().format(num);
//   };

//   const formatPercentage = (num: number): string => {
//     return `${num.toFixed(1)}%`;
//   };

//   const getChartColors = () => [
//     "#3B82F6",
//     "#10B981",
//     "#F59E0B",
//     "#EF4444",
//     "#8B5CF6",
//     "#06B6D4",
//   ];

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="flex items-center space-x-2">
//           <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//           <span className="text-gray-600">
//             Loading Microsoft Clarity data...
//           </span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-semibold text-gray-900 mb-2">
//             Error Loading Data
//           </h2>
//           <p className="text-gray-600">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (!processedData) return null;

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Microsoft Clarity Analytics
//           </h1>
//           <p className="text-gray-600">
//             User behavior insights and website performance metrics
//           </p>

//           <div className="flex items-center justify-between mt-6">
//             <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
//               {["overview", "traffic", "devices", "geography", "errors"].map(
//                 (tab) => (
//                   <button
//                     key={tab}
//                     onClick={() => setActiveTab(tab)}
//                     className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
//                       activeTab === tab
//                         ? "bg-blue-600 text-white"
//                         : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
//                     }`}>
//                     {tab}
//                   </button>
//                 )
//               )}
//             </div>

//             <div className="flex items-center space-x-4">
//               <select
//                 value={selectedMetric}
//                 onChange={(e) => setSelectedMetric(e.target.value)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 text-black">
//                 {data.map((metric) => (
//                   <option key={metric.metricName} value={metric.metricName}>
//                     {metric.metricName}
//                   </option>
//                 ))}
//               </select>
//               <div className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
//                 Live Data
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Overview Tab */}
//         {activeTab === "overview" && (
//           <div className="space-y-6">
//             {/* Key Metrics */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">
//                       Total Sessions
//                     </p>
//                     <p className="text-2xl font-bold text-gray-900">
//                       {formatNumber(processedData.totalSessions)}
//                     </p>
//                   </div>
//                   <div className="p-3 bg-blue-100 rounded-lg">
//                     <Eye className="w-6 h-6 text-blue-600" />
//                   </div>
//                 </div>
//                 <div className="flex items-center mt-2">
//                   <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
//                   <span className="text-sm text-green-600">
//                     Active tracking
//                   </span>
//                 </div>
//               </div>

//               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">
//                       Unique Users
//                     </p>
//                     <p className="text-2xl font-bold text-gray-900">
//                       {formatNumber(processedData.totalUsers)}
//                     </p>
//                   </div>
//                   <div className="p-3 bg-green-100 rounded-lg">
//                     <Users className="w-6 h-6 text-green-600" />
//                   </div>
//                 </div>
//                 <div className="flex items-center mt-2">
//                   <span className="text-sm text-gray-600">
//                     Distinct visitors
//                   </span>
//                 </div>
//               </div>

//               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">
//                       Pages/Session
//                     </p>
//                     <p className="text-2xl font-bold text-gray-900">
//                       {processedData.avgPagesPerSession.toFixed(2)}
//                     </p>
//                   </div>
//                   <div className="p-3 bg-purple-100 rounded-lg">
//                     <Activity className="w-6 h-6 text-purple-600" />
//                   </div>
//                 </div>
//                 <div className="flex items-center mt-2">
//                   <span className="text-sm text-gray-600">
//                     Average engagement
//                   </span>
//                 </div>
//               </div>

//               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">
//                       Bot Sessions
//                     </p>
//                     <p className="text-2xl font-bold text-gray-900">
//                       {formatNumber(processedData.botSessions)}
//                     </p>
//                   </div>
//                   <div className="p-3 bg-orange-100 rounded-lg">
//                     <Bug className="w-6 h-6 text-orange-600" />
//                   </div>
//                 </div>
//                 <div className="flex items-center mt-2">
//                   <span className="text-sm text-gray-600">
//                     {formatPercentage(
//                       (processedData.botSessions /
//                         processedData.totalSessions) *
//                         100
//                     )}{" "}
//                     of total
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Charts Row */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                   Operating Systems
//                 </h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie
//                       data={processedData.topOS}
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={100}
//                       dataKey="sessions"
//                       label={({ name, percentage }: any) =>
//                         `${name}: ${formatPercentage(percentage)}`
//                       }>
//                       {processedData.topOS.map((_, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={
//                             getChartColors()[index % getChartColors().length]
//                           }
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip
//                       formatter={(value: number) => [
//                         formatNumber(Number(value)),
//                         "Sessions",
//                       ]}
//                     />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                   Top Browsers
//                 </h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={processedData.topBrowsers}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip
//                       formatter={(value: string) => [
//                         formatNumber(Number(value)),
//                         "Sessions",
//                       ]}
//                     />
//                     <Bar dataKey="sessions" fill="#3B82F6" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Traffic Tab */}
//         {activeTab === "traffic" && (
//           <div className="space-y-6">
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//               <div className="p-6 border-b border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Traffic by Operating System
//                 </h3>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                         OS
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                         Sessions
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                         Users
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                         Share
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                         Pages/Session
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {data
//                       .find((m) => m.metricName === "Traffic")
//                       ?.information.map((item, index) => (
//                         <tr key={index} className="hover:bg-gray-50">
//                           <td className="px-6 py-4 text-sm font-medium text-gray-900">
//                             {item.OS}
//                           </td>
//                           <td className="px-6 py-4 text-sm text-gray-900">
//                             {formatNumber(
//                               parseInt(item.totalSessionCount || "0")
//                             )}
//                           </td>
//                           <td className="px-6 py-4 text-sm text-gray-900">
//                             {formatNumber(
//                               parseInt(item.distantUserCount || "0")
//                             )}
//                           </td>
//                           <td className="px-6 py-4 text-sm text-gray-900">
//                             {formatPercentage(
//                               (parseInt(item.totalSessionCount || "0") /
//                                 processedData.totalSessions) *
//                                 100
//                             )}
//                           </td>
//                           <td className="px-6 py-4 text-sm text-gray-900">
//                             {item.PagesPerSessionPercentage?.toFixed(2)}
//                           </td>
//                         </tr>
//                       ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Devices Tab */}
//         {activeTab === "devices" && (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                   Device Distribution
//                 </h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie
//                       data={processedData.topDevices}
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={100}
//                       dataKey="sessions"
//                       label={({ name, percentage }: any) =>
//                         `${name}: ${formatPercentage(percentage)}`
//                       }>
//                       {processedData.topDevices.map((_, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={
//                             getChartColors()[index % getChartColors().length]
//                           }
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip
//                       formatter={(value: number) => [
//                         formatNumber(Number(value)),
//                         "Sessions",
//                       ]}
//                     />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                   Device Metrics
//                 </h3>
//                 <div className="space-y-4">
//                   {processedData.topDevices.map((device, index) => (
//                     <div
//                       key={device.name}
//                       className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                       <div className="flex items-center">
//                         <div className="p-2 bg-white rounded-lg mr-3">
//                           {device.name === "Desktop" && (
//                             <Monitor className="w-5 h-5 text-blue-600" />
//                           )}
//                           {device.name === "Mobile" && (
//                             <Smartphone className="w-5 h-5 text-green-600" />
//                           )}
//                           {device.name === "Tablet" && (
//                             <Monitor className="w-5 h-5 text-purple-600" />
//                           )}
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-900">
//                             {device.name}
//                           </p>
//                           <p className="text-sm text-gray-600">
//                             {formatNumber(device.sessions)} sessions
//                           </p>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-semibold text-gray-900">
//                           {formatPercentage(device.percentage)}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Geography Tab */}
//         {activeTab === "geography" && (
//           <div className="space-y-6">
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Top Countries
//               </h3>
//               <div className="space-y-4">
//                 {processedData.topCountries.map((country, index) => (
//                   <div
//                     key={country.name}
//                     className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
//                         <Globe className="w-4 h-4 text-blue-600" />
//                       </div>
//                       <span className="text-sm font-medium text-gray-900">
//                         {country.name}
//                       </span>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                       <span className="text-sm text-gray-600">
//                         {formatNumber(country.users)} users
//                       </span>
//                       <span className="text-sm font-medium text-gray-900">
//                         {formatPercentage(country.percentage)}
//                       </span>
//                       <div className="w-24 h-2 bg-gray-200 rounded-full">
//                         <div
//                           className="h-2 bg-blue-600 rounded-full"
//                           style={{
//                             width: `${Math.min(country.percentage, 100)}%`,
//                           }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Errors Tab */}
//         {activeTab === "errors" && (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">
//                       Dead Clicks
//                     </p>
//                     <p className="text-2xl font-bold text-gray-900">
//                       {formatNumber(processedData.errorMetrics.deadClicks)}
//                     </p>
//                   </div>
//                   <div className="p-3 bg-red-100 rounded-lg">
//                     <MousePointer className="w-6 h-6 text-red-600" />
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">
//                       Rage Clicks
//                     </p>
//                     <p className="text-2xl font-bold text-gray-900">
//                       {formatNumber(processedData.errorMetrics.rageClicks)}
//                     </p>
//                   </div>
//                   <div className="p-3 bg-orange-100 rounded-lg">
//                     <Zap className="w-6 h-6 text-orange-600" />
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">
//                       Script Errors
//                     </p>
//                     <p className="text-2xl font-bold text-gray-900">
//                       {formatNumber(processedData.errorMetrics.scriptErrors)}
//                     </p>
//                   </div>
//                   <div className="p-3 bg-yellow-100 rounded-lg">
//                     <Bug className="w-6 h-6 text-yellow-600" />
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">
//                       Error Clicks
//                     </p>
//                     <p className="text-2xl font-bold text-gray-900">
//                       {formatNumber(processedData.errorMetrics.errorClicks)}
//                     </p>
//                   </div>
//                   <div className="p-3 bg-purple-100 rounded-lg">
//                     <AlertTriangle className="w-6 h-6 text-purple-600" />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Error Metrics Info
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <div className="flex items-start space-x-3">
//                     <MousePointer className="w-5 h-5 text-red-500 mt-1" />
//                     <div>
//                       <h4 className="font-medium text-gray-900">Dead Clicks</h4>
//                       <p className="text-sm text-gray-600">
//                         Clicks on non-interactive elements that users expected
//                         to work
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-start space-x-3">
//                     <Zap className="w-5 h-5 text-orange-500 mt-1" />
//                     <div>
//                       <h4 className="font-medium text-gray-900">Rage Clicks</h4>
//                       <p className="text-sm text-gray-600">
//                         Rapid, repeated clicks indicating user frustration
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="space-y-4">
//                   <div className="flex items-start space-x-3">
//                     <Bug className="w-5 h-5 text-yellow-500 mt-1" />
//                     <div>
//                       <h4 className="font-medium text-gray-900">
//                         Script Errors
//                       </h4>
//                       <p className="text-sm text-gray-600">
//                         JavaScript errors that may affect user experience
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-start space-x-3">
//                     <AlertTriangle className="w-5 h-5 text-purple-500 mt-1" />
//                     <div>
//                       <h4 className="font-medium text-gray-900">
//                         Error Clicks
//                       </h4>
//                       <p className="text-sm text-gray-600">
//                         Clicks that resulted in errors or unexpected behavior
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ClarityDashboard;

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  Eye,
  Users,
  Clock,
  MousePointer,
  TrendingUp,
  TrendingDown,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  AlertTriangle,
  Mouse,
  ScrollText,
  Timer,
  Bug,
  Zap,
} from "lucide-react";

// Types based on Microsoft Clarity API response
interface ClarityMetric {
  metricName: string;
  information: ClarityDataPoint[];
}

interface ClarityDataPoint {
  // Traffic metrics
  totalSessionCount?: string;
  totalBotSessionCount?: string;
  distantUserCount?: string;
  PagesPerSessionPercentage?: number;

  // Common dimensions
  OS?: string;
  Browser?: string;
  Device?: string;
  Country?: string;
  URL?: string;
  Source?: string;
  Medium?: string;
  Campaign?: string;
  Channel?: string;

  // Engagement metrics
  ScrollDepth?: number;
  EngagementTime?: number;

  // Error metrics
  DeadClickCount?: number;
  ExcessiveScroll?: number;
  RageClickCount?: number;
  QuickbackClick?: number;
  ScriptErrorCount?: number;
  ErrorClickCount?: number;

  // Page metrics
  PageTitle?: string;
  ReferrerURL?: string;
}

interface ProcessedMetrics {
  totalSessions: number;
  totalUsers: number;
  avgPagesPerSession: number;
  botSessions: number;
  topOS: { name: string; sessions: number; percentage: number }[];
  topBrowsers: { name: string; sessions: number; percentage: number }[];
  topCountries: { name: string; users: number; percentage: number }[];
  topDevices: { name: string; sessions: number; percentage: number }[];
  errorMetrics: {
    deadClicks: number;
    rageClicks: number;
    scriptErrors: number;
    errorClicks: number;
  };
}

// API Configuration
const CLARITY_API_BASE_URL = "https://www.clarity.ms/export-data/api/v1";
const CLARITY_TOKEN = "YOUR_TOKEN"; // Replace with your actual token

interface ClarityApiParams {
  numOfDays?: number;
  dimension1?: string;
  dimension2?: string;
  metric?: string;
}

const ClarityDashboard: React.FC = () => {
  const [data, setData] = useState<ClarityMetric[]>([]);
  const [processedData, setProcessedData] = useState<ProcessedMetrics | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState("Traffic");
  const [activeTab, setActiveTab] = useState("overview");
  const [error, setError] = useState<string | null>(null);
  const [apiToken, setApiToken] = useState<string>(CLARITY_TOKEN);
  const [numOfDays, setNumOfDays] = useState<number>(1);

  // Function to fetch data from Microsoft Clarity API
  const fetchClarityData = async (
    params: ClarityApiParams
  ): Promise<ClarityMetric[]> => {
    const queryParams = new URLSearchParams();

    if (params.numOfDays)
      queryParams.append("numOfDays", params.numOfDays.toString());
    if (params.dimension1) queryParams.append("dimension1", params.dimension1);
    if (params.dimension2) queryParams.append("dimension2", params.dimension2);
    if (params.metric) queryParams.append("metric", params.metric);

    const url = `${CLARITY_API_BASE_URL}/project-live-insights?${queryParams.toString()}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching Clarity data:", error);
      throw error;
    }
  };

  // Function to fetch multiple dimensions
  const fetchAllClarityData = async (): Promise<ClarityMetric[]> => {
    const dimensions = ["OS", "Browser", "Country", "Device"];
    const allData: ClarityMetric[] = [];

    try {
      // Fetch data for each dimension
      for (const dimension of dimensions) {
        const data = await fetchClarityData({
          numOfDays,
          dimension1: dimension,
        });

        // Add metric name based on dimension for consistency
        const metricName =
          dimension === "Country" ? "Country/Region" : dimension;
        allData.push({
          metricName,
          information: data[0]?.information || [],
        });
      }

      return allData;
    } catch (error) {
      console.error("Error fetching all Clarity data:", error);
      throw error;
    }
  };

  // Load data on component mount and when dependencies change
  useEffect(() => {
    const loadData = async () => {
      if (!apiToken || apiToken === "YOUR_TOKEN") {
        // Use mock data if no valid token
        const mockClarityData: ClarityMetric[] = [
          {
            metricName: "Traffic",
            information: [
              {
                totalSessionCount: "9554",
                totalBotSessionCount: "8369",
                distantUserCount: "189733",
                PagesPerSessionPercentage: 1.0931,
                OS: "Other",
              },
              {
                totalSessionCount: "291942",
                totalBotSessionCount: "31076",
                distantUserCount: "212836",
                PagesPerSessionPercentage: 2.2609,
                OS: "Android",
              },
              {
                totalSessionCount: "156780",
                totalBotSessionCount: "12450",
                distantUserCount: "145890",
                PagesPerSessionPercentage: 3.1456,
                OS: "Windows",
              },
              {
                totalSessionCount: "89234",
                totalBotSessionCount: "5678",
                distantUserCount: "78965",
                PagesPerSessionPercentage: 2.8934,
                OS: "iOS",
              },
            ],
          },
          {
            metricName: "Browser",
            information: [
              {
                totalSessionCount: "185640",
                Browser: "Chrome",
                distantUserCount: "167892",
              },
              {
                totalSessionCount: "78934",
                Browser: "Safari",
                distantUserCount: "69845",
              },
              {
                totalSessionCount: "45623",
                Browser: "Firefox",
                distantUserCount: "41234",
              },
              {
                totalSessionCount: "23789",
                Browser: "Edge",
                distantUserCount: "21567",
              },
            ],
          },
          {
            metricName: "Country/Region",
            information: [
              {
                totalSessionCount: "156780",
                Country: "United States",
                distantUserCount: "134567",
              },
              {
                totalSessionCount: "89234",
                Country: "United Kingdom",
                distantUserCount: "78945",
              },
              {
                totalSessionCount: "67890",
                Country: "Canada",
                distantUserCount: "59876",
              },
              {
                totalSessionCount: "45623",
                Country: "Germany",
                distantUserCount: "41234",
              },
            ],
          },
          {
            metricName: "Device",
            information: [
              {
                totalSessionCount: "234567",
                Device: "Desktop",
                distantUserCount: "198765",
              },
              {
                totalSessionCount: "156789",
                Device: "Mobile",
                distantUserCount: "134567",
              },
              {
                totalSessionCount: "23456",
                Device: "Tablet",
                distantUserCount: "21345",
              },
            ],
          },
        ];

        // setError(
        //   "Using mock data - Please add your Microsoft Clarity API token"
        // );
        setTimeout(() => {
          setData(mockClarityData);
          setLoading(false);
        }, 1000);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const clarityData = await fetchAllClarityData();

        setData(clarityData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch Clarity data";
        setError(errorMessage);
        console.error("Error loading Clarity data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [apiToken, numOfDays]);

  // Function to refresh data manually
  const refreshData = async () => {
    setLoading(true);
    setError(null);

    try {
      const clarityData = await fetchAllClarityData();
      setData(clarityData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to refresh Clarity data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Process raw Clarity data into useful metrics
  useEffect(() => {
    if (data.length === 0) return;

    try {
      const trafficData = data.find(
        (metric) => metric.metricName === "Traffic"
      );
      const browserData = data.find(
        (metric) => metric.metricName === "Browser"
      );
      const countryData = data.find(
        (metric) => metric.metricName === "Country/Region"
      );
      const deviceData = data.find((metric) => metric.metricName === "Device");

      if (!trafficData) return;

      const totalSessions = trafficData.information.reduce(
        (sum, item) => sum + parseInt(item.totalSessionCount || "0"),
        0
      );

      const totalUsers = trafficData.information.reduce(
        (sum, item) => sum + parseInt(item.distantUserCount || "0"),
        0
      );

      const botSessions = trafficData.information.reduce(
        (sum, item) => sum + parseInt(item.totalBotSessionCount || "0"),
        0
      );

      const avgPagesPerSession =
        trafficData.information.reduce(
          (sum, item) => sum + (item.PagesPerSessionPercentage || 0),
          0
        ) / trafficData.information.length;

      // Process OS data
      const topOS = trafficData.information
        .map((item) => ({
          name: item.OS || "Unknown",
          sessions: parseInt(item.totalSessionCount || "0"),
          percentage:
            (parseInt(item.totalSessionCount || "0") / totalSessions) * 100,
        }))
        .sort((a, b) => b.sessions - a.sessions);

      // Process Browser data
      const topBrowsers =
        browserData?.information
          .map((item) => ({
            name: item.Browser || "Unknown",
            sessions: parseInt(item.totalSessionCount || "0"),
            percentage:
              (parseInt(item.totalSessionCount || "0") / totalSessions) * 100,
          }))
          .sort((a, b) => b.sessions - a.sessions) || [];

      // Process Country data
      const topCountries =
        countryData?.information
          .map((item) => ({
            name: item.Country || "Unknown",
            users: parseInt(item.distantUserCount || "0"),
            percentage:
              (parseInt(item.distantUserCount || "0") / totalUsers) * 100,
          }))
          .sort((a, b) => b.users - a.users) || [];

      // Process Device data
      const topDevices =
        deviceData?.information
          .map((item) => ({
            name: item.Device || "Unknown",
            sessions: parseInt(item.totalSessionCount || "0"),
            percentage:
              (parseInt(item.totalSessionCount || "0") / totalSessions) * 100,
          }))
          .sort((a, b) => b.sessions - a.sessions) || [];

      const processed: ProcessedMetrics = {
        totalSessions,
        totalUsers,
        avgPagesPerSession,
        botSessions,
        topOS,
        topBrowsers,
        topCountries,
        topDevices,
        errorMetrics: {
          deadClicks: 0, // These would come from error-specific metrics
          rageClicks: 0,
          scriptErrors: 0,
          errorClicks: 0,
        },
      };

      setProcessedData(processed);
    } catch (err) {
      setError("Error processing Clarity data");
      console.error(err);
    }
  }, [data]);

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };

  const formatPercentage = (num: number): string => {
    return `${num.toFixed(1)}%`;
  };

  const getChartColors = () => [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">
            Loading Microsoft Clarity data...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!processedData) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Microsoft Clarity Analytics
          </h1>
          <p className="text-gray-600">
            User behavior insights and website performance metrics
          </p>

          <div className="flex items-center justify-between mt-6">
            <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
              {["overview", "traffic", "devices", "geography", "errors"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}>
                    {tab}
                  </button>
                )
              )}
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 text-black">
                {data.map((metric) => (
                  <option key={metric.metricName} value={metric.metricName}>
                    {metric.metricName}
                  </option>
                ))}
              </select>
              <div className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Live Data
              </div>
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Sessions
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(processedData.totalSessions)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    Active tracking
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Unique Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(processedData.totalUsers)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600">
                    Distinct visitors
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Pages/Session
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {processedData.avgPagesPerSession.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600">
                    Average engagement
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Bot Sessions
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(processedData.botSessions)}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Bug className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600">
                    {formatPercentage(
                      (processedData.botSessions /
                        processedData.totalSessions) *
                        100
                    )}{" "}
                    of total
                  </span>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Operating Systems
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={processedData.topOS}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="sessions"
                      label={({ name, percentage }) =>
                        `${name}: ${formatPercentage(percentage)}`
                      }>
                      {processedData.topOS.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            getChartColors()[index % getChartColors().length]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        formatNumber(Number(value)),
                        "Sessions",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Top Browsers
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={processedData.topBrowsers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        formatNumber(Number(value)),
                        "Sessions",
                      ]}
                    />
                    <Bar dataKey="sessions" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Traffic Tab */}
        {activeTab === "traffic" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Traffic by Operating System
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        OS
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Sessions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Users
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Share
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Pages/Session
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data
                      .find((m) => m.metricName === "Traffic")
                      ?.information.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {item.OS}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {formatNumber(
                              parseInt(item.totalSessionCount || "0")
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {formatNumber(
                              parseInt(item.distantUserCount || "0")
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {formatPercentage(
                              (parseInt(item.totalSessionCount || "0") /
                                processedData.totalSessions) *
                                100
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {item.PagesPerSessionPercentage?.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Devices Tab */}
        {activeTab === "devices" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Device Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={processedData.topDevices}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="sessions"
                      label={({ name, percentage }) =>
                        `${name}: ${formatPercentage(percentage)}`
                      }>
                      {processedData.topDevices.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            getChartColors()[index % getChartColors().length]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        formatNumber(Number(value)),
                        "Sessions",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Device Metrics
                </h3>
                <div className="space-y-4">
                  {processedData.topDevices.map((device, index) => (
                    <div
                      key={device.name}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="p-2 bg-white rounded-lg mr-3">
                          {device.name === "Desktop" && (
                            <Monitor className="w-5 h-5 text-blue-600" />
                          )}
                          {device.name === "Mobile" && (
                            <Smartphone className="w-5 h-5 text-green-600" />
                          )}
                          {device.name === "Tablet" && (
                            <Monitor className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {device.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatNumber(device.sessions)} sessions
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPercentage(device.percentage)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Geography Tab */}
        {activeTab === "geography" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Countries
              </h3>
              <div className="space-y-4">
                {processedData.topCountries.map((country, index) => (
                  <div
                    key={country.name}
                    className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Globe className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {country.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">
                        {formatNumber(country.users)} users
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatPercentage(country.percentage)}
                      </span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-blue-600 rounded-full"
                          style={{
                            width: `${Math.min(country.percentage, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Errors Tab */}
        {activeTab === "errors" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Dead Clicks
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(processedData.errorMetrics.deadClicks)}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <MousePointer className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Rage Clicks
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(processedData.errorMetrics.rageClicks)}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Zap className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Script Errors
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(processedData.errorMetrics.scriptErrors)}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Bug className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Error Clicks
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(processedData.errorMetrics.errorClicks)}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Error Metrics Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MousePointer className="w-5 h-5 text-red-500 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Dead Clicks</h4>
                      <p className="text-sm text-gray-600">
                        Clicks on non-interactive elements that users expected
                        to work
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Zap className="w-5 h-5 text-orange-500 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Rage Clicks</h4>
                      <p className="text-sm text-gray-600">
                        Rapid, repeated clicks indicating user frustration
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Bug className="w-5 h-5 text-yellow-500 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Script Errors
                      </h4>
                      <p className="text-sm text-gray-600">
                        JavaScript errors that may affect user experience
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-purple-500 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Error Clicks
                      </h4>
                      <p className="text-sm text-gray-600">
                        Clicks that resulted in errors or unexpected behavior
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClarityDashboard;
