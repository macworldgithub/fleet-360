// "use client";

// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import { DataTable } from "@/src/components/dashboard/DataTable";
// import { officeService, Office, AgencyOption } from "@/src/api/office";
// import { vehicleService, Vehicle } from "@/src/api/vehicle";
// import { fetchAgencies } from "@/src/api/agencies";
// import { fetchFuelTracking, FuelTracking } from "@/src/api/fueltracking";
// import { Button, Select, Space, Table } from "antd";
// import { Building, Car } from "lucide-react";
// import type { ColumnsType } from "antd/es/table";

// export default function Fueltracking() {
//   const [agencies, setAgencies] = useState<AgencyOption[]>([]);
//   const [selectedAgencyId, setSelectedAgencyId] = useState<string>("");
//   const [offices, setOffices] = useState<Office[]>([]);
//   const [selectedOfficeId, setSelectedOfficeId] = useState<string>("");
//   const [vehicles, setVehicles] = useState<Vehicle[]>([]);
//   const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
//   const [fuelTracking, setFuelTracking] = useState<FuelTracking[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [officesLoading, setOfficesLoading] = useState(false);
//   const [vehiclesLoading, setVehiclesLoading] = useState(false);
//   const [fuelLoading, setFuelLoading] = useState(false);

//   useEffect(() => {
//     const loadAgencies = async () => {
//       try {
//         const data = await fetchAgencies();
//         setAgencies(
//           data.map((a) => ({ _id: a._id, agencyName: a.agencyName })),
//         );
//         if (data.length > 0) setSelectedAgencyId(data[0]._id);
//       } catch (err) {
//         toast.error("Failed to load agencies");
//       }
//     };
//     loadAgencies();
//   }, []);

//   useEffect(() => {
//     if (selectedAgencyId) {
//       const loadOffices = async () => {
//         setOfficesLoading(true);
//         try {
//           const data = await officeService.getOfficesByAgency(selectedAgencyId);
//           setOffices(data);
//           if (data.length > 0) setSelectedOfficeId(data[0]._id);
//         } catch (err) {
//           toast.error("Failed to load offices");
//         } finally {
//           setOfficesLoading(false);
//         }
//       };
//       loadOffices();
//     } else {
//       setOffices([]);
//       setSelectedOfficeId("");
//     }
//   }, [selectedAgencyId]);

//   useEffect(() => {
//     if (selectedOfficeId) {
//       const loadVehicles = async () => {
//         setVehiclesLoading(true);
//         try {
//           const data =
//             await vehicleService.getVehiclesByOffice(selectedOfficeId);
//           setVehicles(data);
//           if (data.length > 0) setSelectedVehicleId(data[0]._id);
//         } catch (err) {
//           toast.error("Failed to load vehicles");
//         } finally {
//           setVehiclesLoading(false);
//         }
//       };
//       loadVehicles();
//     } else {
//       setVehicles([]);
//       setSelectedVehicleId("");
//     }
//   }, [selectedOfficeId]);

//   useEffect(() => {
//     if (selectedVehicleId && selectedAgencyId) {
//       const loadFuelTracking = async () => {
//         setFuelLoading(true);
//         try {
//           const data = await fetchFuelTracking(
//             selectedVehicleId,
//             selectedAgencyId,
//           );
//           setFuelTracking(data);
//         } catch (err) {
//           toast.error("Failed to load fuel tracking data");
//         } finally {
//           setFuelLoading(false);
//         }
//       };
//       loadFuelTracking();
//     } else {
//       setFuelTracking([]);
//     }
//   }, [selectedVehicleId, selectedAgencyId]);

//   const fuelColumns: ColumnsType<FuelTracking> = [
//     {
//       title: "Fuel Date",
//       dataIndex: "fuelDate",
//       key: "fuelDate",
//       render: (date: string) => new Date(date).toLocaleDateString(),
//     },
//     {
//       title: "Liters",
//       dataIndex: "liters",
//       key: "liters",
//     },
//     {
//       title: "Price per Liter",
//       dataIndex: "pricePerLiter",
//       key: "pricePerLiter",
//       render: (price: number) => `$${price}`,
//     },
//     {
//       title: "Total Cost",
//       dataIndex: "totalCost",
//       key: "totalCost",
//       render: (cost: number) => `$${cost}`,
//     },
//     {
//       title: "Station Name",
//       dataIndex: "stationName",
//       key: "stationName",
//     },
//     {
//       title: "Odometer",
//       dataIndex: "odometer",
//       key: "odometer",
//     },
//     {
//       title: "Driver Name",
//       dataIndex: "driverName",
//       key: "driverName",
//     },
//     {
//       title: "Provider",
//       dataIndex: "provider",
//       key: "provider",
//     },
//   ];

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Fuel Tracking</h2>
//       <Space direction="vertical" size="middle" style={{ display: "flex" }}>
//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Select Agency
//           </label>
//           <Select
//             value={selectedAgencyId}
//             onChange={setSelectedAgencyId}
//             loading={loading}
//             style={{ width: 200 }}
//             placeholder="Select Agency"
//           >
//             {agencies.map((agency) => (
//               <Select.Option key={agency._id} value={agency._id}>
//                 <Space>
//                   <Building size={16} />
//                   {agency.agencyName}
//                 </Space>
//               </Select.Option>
//             ))}
//           </Select>
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Select Office
//           </label>
//           <Select
//             value={selectedOfficeId}
//             onChange={setSelectedOfficeId}
//             loading={officesLoading}
//             style={{ width: 200 }}
//             placeholder="Select Office"
//             disabled={!selectedAgencyId}
//           >
//             {offices.map((office) => (
//               <Select.Option key={office._id} value={office._id}>
//                 {office.officeName}
//               </Select.Option>
//             ))}
//           </Select>
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Select Vehicle
//           </label>
//           <Select
//             value={selectedVehicleId}
//             onChange={setSelectedVehicleId}
//             loading={vehiclesLoading}
//             style={{ width: 200 }}
//             placeholder="Select Vehicle"
//             disabled={!selectedOfficeId}
//           >
//             {vehicles.map((vehicle) => (
//               <Select.Option key={vehicle._id} value={vehicle._id}>
//                 <Space>
//                   <Car size={16} />
//                   {vehicle.registrationNumber} - {vehicle.make} {vehicle.model}
//                 </Space>
//               </Select.Option>
//             ))}
//           </Select>
//         </div>
//         <div>
//           <h3 className="text-lg font-semibold mb-2">Fuel Tracking Data</h3>
//           <Table
//             columns={fuelColumns}
//             dataSource={fuelTracking}
//             rowKey="_id"
//             loading={fuelLoading}
//             pagination={{ pageSize: 10 }}
//           />
//         </div>
//       </Space>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { officeService, Office, AgencyOption } from "@/src/api/office";
import { vehicleService, Vehicle } from "@/src/api/vehicle";
import { fetchAgencies } from "@/src/api/agencies";
import { fetchFuelTracking, FuelTracking } from "@/src/api/fueltracking";

import { Select, Space, Table } from "antd";
import { Building, Car } from "lucide-react";
import type { ColumnsType } from "antd/es/table";

export default function Fueltracking() {
  const [agencies, setAgencies] = useState<AgencyOption[]>([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>("");

  const [offices, setOffices] = useState<Office[]>([]);
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>("");

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");

  const [fuelTracking, setFuelTracking] = useState<FuelTracking[]>([]);

  const [officesLoading, setOfficesLoading] = useState(false);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [fuelLoading, setFuelLoading] = useState(false);

  // Load Agencies
  useEffect(() => {
    const loadAgencies = async () => {
      try {
        const data = await fetchAgencies();

        setAgencies(
          data.map((a) => ({
            _id: a._id,
            agencyName: a.agencyName,
          })),
        );

        if (data.length > 0) {
          setSelectedAgencyId(data[0]._id);
        }
      } catch {
        toast.error("Failed to load agencies");
      }
    };

    loadAgencies();
  }, []);

  // Load Offices
  useEffect(() => {
    if (!selectedAgencyId) return;

    const loadOffices = async () => {
      setOfficesLoading(true);

      try {
        const data = await officeService.getOfficesByAgency(selectedAgencyId);

        setOffices(data);

        if (data.length > 0) {
          setSelectedOfficeId(data[0]._id);
        }
      } catch {
        toast.error("Failed to load offices");
      } finally {
        setOfficesLoading(false);
      }
    };

    loadOffices();
  }, [selectedAgencyId]);

  // Load Vehicles
  useEffect(() => {
    if (!selectedOfficeId) return;

    const loadVehicles = async () => {
      setVehiclesLoading(true);

      try {
        const data = await vehicleService.getVehiclesByOffice(selectedOfficeId);

        setVehicles(data);

        if (data.length > 0) {
          setSelectedVehicleId(data[0]._id);
        }
      } catch {
        toast.error("Failed to load vehicles");
      } finally {
        setVehiclesLoading(false);
      }
    };

    loadVehicles();
  }, [selectedOfficeId]);

  // Load Fuel Tracking
  useEffect(() => {
    if (!selectedVehicleId || !selectedAgencyId) return;

    const loadFuelTracking = async () => {
      setFuelLoading(true);

      try {
        // const data = await fetchFuelTracking(
        //   selectedVehicleId,
        //   selectedAgencyId,
        // );
        const data = await fetchFuelTracking();

        setFuelTracking(data);
      } catch {
        toast.error("Failed to load fuel tracking data");
      } finally {
        setFuelLoading(false);
      }
    };

    loadFuelTracking();
  }, [selectedVehicleId, selectedAgencyId]);

  const fuelColumns: ColumnsType<FuelTracking> = [
    {
      title: "Fuel Date",
      dataIndex: "fuelDate",
      key: "fuelDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Liters",
      dataIndex: "liters",
      key: "liters",
    },
    {
      title: "Price / Liter",
      dataIndex: "pricePerLiter",
      key: "pricePerLiter",
      render: (price: number) => `Rs ${price}`,
    },
    {
      title: "Total Cost",
      dataIndex: "totalCost",
      key: "totalCost",
      render: (cost: number) => `Rs ${cost}`,
    },
    {
      title: "Station",
      dataIndex: "stationName",
      key: "stationName",
    },
    {
      title: "Odometer",
      dataIndex: "odometer",
      key: "odometer",
    },
    {
      title: "Driver",
      dataIndex: "driverName",
      key: "driverName",
    },
    {
      title: "Provider",
      dataIndex: "provider",
      key: "provider",
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Fuel Tracking</h2>

      <Space direction="vertical" size="large" style={{ display: "flex" }}>
        {/* Agency */}
        <div>
          <label className="block mb-1 font-medium">Select Agency</label>

          <Select
            value={selectedAgencyId}
            onChange={setSelectedAgencyId}
            style={{ width: 250 }}
          >
            {agencies.map((agency) => (
              <Select.Option key={agency._id} value={agency._id}>
                <Space>
                  <Building size={16} />
                  {agency.agencyName}
                </Space>
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Office */}
        <div>
          <label className="block mb-1 font-medium">Select Office</label>

          <Select
            value={selectedOfficeId}
            onChange={setSelectedOfficeId}
            loading={officesLoading}
            style={{ width: 250 }}
            disabled={!selectedAgencyId}
          >
            {offices.map((office) => (
              <Select.Option key={office._id} value={office._id}>
                {office.officeName}
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Vehicle */}
        <div>
          <label className="block mb-1 font-medium">Select Vehicle</label>

          <Select
            value={selectedVehicleId}
            onChange={setSelectedVehicleId}
            loading={vehiclesLoading}
            style={{ width: 250 }}
            disabled={!selectedOfficeId}
          >
            {vehicles.map((vehicle) => (
              <Select.Option key={vehicle._id} value={vehicle._id}>
                <Space>
                  <Car size={16} />
                  {vehicle.registrationNumber} - {vehicle.make} {vehicle.model}
                </Space>
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Table */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Fuel Transactions</h3>

          <Table
            columns={fuelColumns}
            dataSource={fuelTracking}
            rowKey="_id"
            loading={fuelLoading}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </Space>
    </div>
  );
}
