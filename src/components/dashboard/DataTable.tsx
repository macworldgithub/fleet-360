"use client";

import React from "react";
import { Table, TableProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

interface DataTableProps<T> extends Omit<
  TableProps<T>,
  "dataSource" | "columns" | "title"
> {
  title?: string;
  description?: string;
  dataSource: T[];
  columns: ColumnsType<T>;
  loading?: boolean;
  emptyText?: string;
  onAddClick?: () => void;
  addButtonText?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  extraHeaderContent?: React.ReactNode;
}

export function DataTable<T extends { key?: string | number; _id?: string }>({
  title,
  description,
  dataSource,
  columns,
  loading = false,
  emptyText = "No records found",
  onAddClick,
  addButtonText = "Add New",
  searchValue = "",
  onSearchChange,
  extraHeaderContent,
  ...tableProps
}: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden shadow-md">
      {/* Header */}
      {(title || onAddClick) && (
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {onSearchChange && (
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              />
            )}

            {onAddClick && (
              <button
                onClick={onAddClick}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#C46A0A] text-white rounded-lg hover:from-amber-600 hover:to-orange-700 font-medium shadow-sm whitespace-nowrap"
              >
                <PlusOutlined size={18} />
                {addButtonText}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          rowClassName={() => "agency-table-row"}
          dataSource={dataSource.map((item) => ({
            ...item,
            key: item._id || item.key,
          }))}
          loading={{
            spinning: loading,
            indicator: <LoadingOutlined spin style={{ fontSize: 24 }} />,
          }}
          locale={{ emptyText }}
          pagination={dataSource.length > 10 ? { pageSize: 10 } : false}
          className="agency-table min-w-[800px]"
          scroll={{ x: 'max-content' }}
          {...tableProps}
        />
      </div>
    </div>
  );
}
