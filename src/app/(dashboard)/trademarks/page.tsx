"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, Filter, Download, Eye, Pencil, Trash2, MoreHorizontal, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBreadcrumbs } from "@/contexts/breadcrumb-context"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { Label } from "@/components/ui/label"
import SingleSelect from "@/components/custom/select/single-select"
import React from 'react'
import Select from 'react-select'
import { DateRangePicker } from "@/components/custom/date/date-range-picker"

type Trademark = {
  id: number
  logo: string
  name: string
  application_number: string
  application_date: string
  publication_date: string
  status: string
  applicant: string
  classes: string
}

const fetchTrademarks = async (): Promise<Trademark[]> => {
  const response = await fetch('/data/trademarks.json')
  if (!response.ok) {
    throw new Error('Failed to fetch trademarks')
  }
  return response.json()
}

export default function TrademarksPage() {
  const { setBreadcrumbs } = useBreadcrumbs()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { data: allTrademarks = [], isLoading, error } = useQuery({
    queryKey: ['trademarks'],
    queryFn: fetchTrademarks,
  })
  
  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/" },
      { label: "Nhãn hiệu", href: "/trademarks" },
      { label: "Danh sách" }
    ])
  }, [setBreadcrumbs])

  // Pagination logic
  const totalPages = Math.ceil(allTrademarks.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTrademarks = allTrademarks.slice(startIndex, endIndex)

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const statusOptions = [
    { label: 'Đang giải quyết', value: 'pending' },
    { label: 'Cấp bằng', value: 'granted' },
    { label: 'Hủy', value: 'cancelled' },
  ]

  const [data, setData] = useState({
    date_from: '',
    date_to: '',
    status: ''
  })

  return (
    <div className="space-y-4">
      {/* Search and Filter Card */}
      <Card>
        <CardContent >
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by text..."
                className="pl-10"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                {/* <Label htmlFor="status" className="mb-1 text-gray-700 font-medium">Status</Label> */}
                {/* <Select
                  defaultValue={statusOptions[1]}
                  options={statusOptions}
                  placeholder="Select status..."
                /> */}
                <SingleSelect
                  instanceId="trademark-status-select"
                  isClearable
                  options={statusOptions}
                  value={statusOptions.find(b => b.value === data.status.toString()) ? {
                      value: data.status,
                      label: statusOptions.find(b => b.value === data.status.toString())?.label || ''
                  } : null}
                  onChange={(selected) => setData({
                    ...data,
                    status: selected ? selected.value as string : ''
                  })}
                  placeholder="Trạng thái"
              />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày nộp đơn</label>
                {/* <Label htmlFor="application_date" className="mb-1">Ngày nộp đơn</Label> */}
                <DateRangePicker
                    showPresets={true}
                    date={{ from: data.date_from ? new Date(data.date_from) : undefined, to: data.date_to ? new Date(data.date_to) : undefined }}
                    onDateChange={(range) => {
                        setData({
                          ...data,
                          date_from: range?.from ? range.from.toISOString().split('T')[0] : '',
                          date_to: range?.to ? range.to.toISOString().split('T')[0] : ''
                        });
                    }}
                    className="w-full"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 border-t pt-2 pt-1 mt-1">
              <Button variant="default" size="default" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="default" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              {/* <Button size="default" className="gap-2">
                <Plus className="h-4 w-4" />
                Create
              </Button> */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox />
                </TableHead>
                <TableHead className="w-[120px]">Mẫu nhãn</TableHead>
                <TableHead>Nhãn hiệu</TableHead>
                <TableHead className="min-w-[120px]">Số đơn</TableHead>
                <TableHead>Ngày nộp đơn</TableHead>
                <TableHead>Ngày công bố</TableHead>
                <TableHead>Số bằng</TableHead>
                <TableHead>Ngày cấp</TableHead>
                <TableHead>Nhóm sản phẩm/dịch vụ</TableHead>
                <TableHead>Chủ đơn/Chủ bằng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8">
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8 text-destructive">
                    Lỗi khi tải dữ liệu
                  </TableCell>
                </TableRow>
              ) : currentTrademarks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                currentTrademarks.map((trademark) => (
                <TableRow key={trademark.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <div className="flex h-16 w-16 items-center justify-center rounded border bg-white p-2">
                      <div className="text-center text-xs font-bold text-primary">
                        {trademark.name.split(" ")[0]}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {trademark.name}
                  </TableCell>
                  <TableCell className="text-sm">
                    {trademark.application_number}
                  </TableCell>
                  <TableCell className="text-sm">
                    {trademark.application_date}
                  </TableCell>
                  <TableCell className="text-sm">
                    {trademark.publication_date}
                  </TableCell>
                  <TableCell className="text-sm">
                    -
                  </TableCell>
                  <TableCell className="text-sm">
                    -
                  </TableCell>
                  <TableCell className="text-sm">
                    {trademark.classes}
                  </TableCell>
                  <TableCell className="  text-sm">
                    {trademark.applicant}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{trademark.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {!isLoading && !error && allTrademarks.length > 0 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                Hiển thị {startIndex + 1} - {Math.min(endIndex, allTrademarks.length)} của {allTrademarks.length} kết quả
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </Button>
                <div className="text-sm">
                  Trang {currentPage} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
