import React, { useState, useEffect } from "react";
import { Modal, Table, Tag, Typography, Spin, Empty, Button, Form, Input, DatePicker, Popconfirm } from "antd";
import { toast } from "react-toastify";
import { logbookService, LogbookSession, CreateLogbookSessionPayload } from "@/src/api/logbooks";
import { FileTextOutlined, PlusOutlined, LockOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

interface VehicleLogbookModalProps {
    vehicleId: string | null;
    agencyId: string | null;
    isOpen: boolean;
    onClose: () => void;
    vehicleName?: string;
}

export const VehicleLogbookModal: React.FC<VehicleLogbookModalProps> = ({
    vehicleId,
    agencyId,
    isOpen,
    onClose,
    vehicleName,
}) => {
    const [sessions, setSessions] = useState<LogbookSession[]>([]);
    const [liveSession, setLiveSession] = useState<LogbookSession | null>(null);
    const [loading, setLoading] = useState(false);
    const [liveLoading, setLiveLoading] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [lockLoading, setLockLoading] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const [form] = Form.useForm();

    useEffect(() => {
        if (isOpen && vehicleId) {
            loadAllData();
        } else {
            setSessions([]);
            setLiveSession(null);
            setShowCreateForm(false);
            form.resetFields();
        }
    }, [isOpen, vehicleId]);

    const loadAllData = async () => {
        await Promise.all([loadSessions(), loadLiveSession()]);
    };

    const loadLiveSession = async () => {
        if (!vehicleId) return;
        setLiveLoading(true);
        try {
            const data = await logbookService.getLiveSession(vehicleId);
            setLiveSession(data);
        } catch (err: any) {
            // Already handled in table or via silent failure if no live session
            console.error("Failed to load live session", err);
        } finally {
            setLiveLoading(false);
        }
    };

    const loadSessions = async () => {
        if (!vehicleId) return;
        setLoading(true);
        try {
            const data = await logbookService.getSessionsByVehicle(vehicleId);
            setSessions(data);
        } catch (err: any) {
            toast.error(err.message || "Failed to load logbook sessions");
        } finally {
            setLoading(false);
        }
    };
    const handleCreateSession = async (values: any) => {
        if (!vehicleId) return;
        setCreateLoading(true);
        try {
            const payload: CreateLogbookSessionPayload = {
                vehicleId,
                fbtYear: values.fbtYear,
                startDate: values.dateRange?.[0]?.toISOString(),
                endDate: values.dateRange?.[1]?.toISOString(),
            };
            await logbookService.createSession(payload);
            toast.success("New logbook session created successfully!");
            setShowCreateForm(false);
            form.resetFields();
            loadAllData();
        } catch (err: any) {
            toast.error(err.message || "Failed to create logbook session");
        } finally {
            setCreateLoading(false);
        }
    };

    const handleLockSession = async () => {
        if (!liveSession) return;
        setLockLoading(true);
        try {
            await logbookService.lockSession(liveSession._id);
            toast.success("Logbook session locked successfully!");
            loadAllData();
        } catch (err: any) {
            toast.error(err.message || "Failed to lock logbook session");
        } finally {
            setLockLoading(false);
        }
    };

    const columns = [
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag color={status === "DRAFT" ? "processing" : "success"}>
                    {status === "DRAFT" ? "ACTIVE" : "LOCKED"}
                </Tag>
            ),
        },
        {
            title: "Start Date",
            dataIndex: "startDate",
            key: "startDate",
            render: (val: string) => (val ? new Date(val).toLocaleDateString() : "—"),
        },
        {
            title: "End Date",
            dataIndex: "endDate",
            key: "endDate",
            render: (val: string) => (val ? new Date(val).toLocaleDateString() : "—"),
        },
        {
            title: "FBT Year",
            dataIndex: "fbtYear",
            key: "fbtYear",
        },
        {
            title: "Business %",
            dataIndex: "businessUsePercentage",
            key: "businessUsePercentage",
            render: (val: number) => (
                <Text strong type={val > 0 ? "success" : "secondary"}>
                    {val.toFixed(2)}%
                </Text>
            ),
        },
        {
            title: "Total KMs",
            dataIndex: "totalKms",
            key: "totalKms",
            render: (val: number) => `${val.toLocaleString()} km`,
        },
    ];

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <FileTextOutlined className="text-amber-600" />
                    <span>ATO Logbooks - {vehicleName || "Vehicle"}</span>
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={900}
            destroyOnClose
        >
            <div className="p-4 space-y-8">
                {/* LIVE SESSION SECTION */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Current Logbook status</h3>
                        {!liveLoading && !liveSession && !showCreateForm && (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setShowCreateForm(true)}
                                className="bg-amber-500 hover:bg-amber-600 border-none"
                            >
                                Start New Logbook
                            </Button>
                        )}
                    </div>

                    {liveLoading ? (
                        <div className="flex justify-center p-8">
                            <Spin />
                        </div>
                    ) : showCreateForm ? (
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h4 className="font-medium text-gray-700 mb-4">Create New ATO Logbook</h4>
                            <Form form={form} layout="vertical" onFinish={handleCreateSession}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Form.Item
                                        name="fbtYear"
                                        label="FBT Year (e.g. 2025-2026)"
                                        rules={[{ required: true, message: 'Please input FBT Year!' }]}
                                    >
                                        <Input placeholder="2025-2026" />
                                    </Form.Item>
                                    <Form.Item
                                        name="dateRange"
                                        label="Logbook Period (Optional)"
                                        tooltip="A logbook must run for at least 12 continuous weeks (84 days)"
                                    >
                                        <DatePicker.RangePicker className="w-full" />
                                    </Form.Item>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="primary" htmlType="submit" loading={createLoading} className="bg-amber-500 hover:bg-amber-600 border-none">
                                        Create Session
                                    </Button>
                                    <Button onClick={() => setShowCreateForm(false)}>Cancel</Button>
                                </div>
                            </Form>
                        </div>
                    ) : liveSession ? (
                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex-1 space-y-4 w-full">
                                <div className="flex items-center gap-3">
                                    <Tag color="processing" className="text-sm px-3 py-1">ACTIVE (DRAFT)</Tag>
                                    <span className="font-semibold text-gray-700">FBT Year: {liveSession.fbtYear}</span>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-white p-3 rounded shadow-sm border border-blue-100">
                                        <div className="text-xs text-gray-500">Business Use</div>
                                        <div className="text-xl font-bold text-blue-700">{liveSession.businessUsePercentage.toFixed(2)}%</div>
                                    </div>
                                    <div className="bg-white p-3 rounded shadow-sm border border-blue-100">
                                        <div className="text-xs text-gray-500">Total KMs</div>
                                        <div className="text-xl font-bold text-gray-700">{liveSession.totalKms.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-white p-3 rounded shadow-sm border border-blue-100">
                                        <div className="text-xs text-gray-500">Business KMs</div>
                                        <div className="text-xl font-bold text-gray-700">{liveSession.businessKms.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-white p-3 rounded shadow-sm border border-blue-100">
                                        <div className="text-xs text-gray-500">Private KMs</div>
                                        <div className="text-xl font-bold text-gray-700">{liveSession.privateKms.toLocaleString()}</div>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <strong>Period:</strong> {liveSession.startDate ? new Date(liveSession.startDate).toLocaleDateString() : 'Auto-set from first trip'}
                                    {' '}to{' '}
                                    {liveSession.endDate ? new Date(liveSession.endDate).toLocaleDateString() : 'Ongoing'}
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-blue-100 min-w-[200px]">
                                <div className="text-center mb-3">
                                    <div className={`font-bold ${liveSession.minimumPeriodSatisfied ? 'text-green-600' : 'text-amber-600'}`}>
                                        {liveSession.minimumPeriodSatisfied ? '12-Week Met ✓' : '12-Week Not Met'}
                                    </div>
                                    <div className="text-xs text-gray-500">ATO Minimum Period</div>
                                </div>
                                <Popconfirm
                                    title="Lock Logbook Session"
                                    description="Are you sure you want to lock this session? No more trips can be added to it."
                                    onConfirm={handleLockSession}
                                    okText="Yes, Lock It"
                                    cancelText="Cancel"
                                    okButtonProps={{ danger: true, loading: lockLoading }}
                                >
                                    <Button
                                        danger
                                        type="primary"
                                        icon={<LockOutlined />}
                                    >
                                        Lock Session
                                    </Button>
                                </Popconfirm>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center text-gray-500">
                            There is currently no active (DRAFT) logbook session for this vehicle.
                        </div>
                    )}
                </div>

                <div className="h-px bg-gray-200 w-full" />

                {/* HISTORY SECTION */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Logbook History</h3>
                    <Table
                        columns={columns}
                        dataSource={sessions}
                        rowKey="_id"
                        loading={loading}
                        pagination={false}
                        locale={{
                            emptyText: (
                                <Empty
                                    description={<span className="text-gray-500">No logbook sessions found.</span>}
                                />
                            ),
                        }}
                    />
                </div>
            </div>
        </Modal>
    );
};
