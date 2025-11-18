"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
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

  const workflowStatusOptions = [
    { label: 'Nháp', value: 'draft' },
    { label: 'Đang xem xét', value: 'in_review' },
    { label: 'Xác nhận', value: 'approved' },
  ]

  const niceClassOptions = [
    { label: 'Lớp 1', value: '1' },
    { label: 'Lớp 2', value: '2' },
    { label: 'Lớp 3', value: '3' },
    { label: 'Lớp 9', value: '9' },
    { label: 'Lớp 25', value: '25' },
    { label: 'Lớp 35', value: '35' },
  ]

  const [data, setData] = useState({
    // Thông tin cơ bản
    name: '',
    product: '',
    description: '',
    note: '',
    // Số đơn
    application_number: '',
    certificate_number: '',
    original_number: '',
    // Ngày
    application_date_from: '',
    application_date_to: '',
    publication_date_from: '',
    publication_date_to: '',
    grant_date_from: '',
    grant_date_to: '',
    expiry_date_from: '',
    expiry_date_to: '',
    // Chủ thể
    applicant: '',
    representative: '',
    // Trạng thái
    legal_status: '',
    workflow_status: '',
    // Phân loại
    nice_class: '',
    goods_services: '',
    vienna_class: '',
  })

  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)

  return (
    <div className="space-y-4">
      {/* Search and Filter Card */}
      <Card>
        <CardContent >
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Switch
                id="advanced-search"
                checked={showAdvancedSearch}
                onCheckedChange={setShowAdvancedSearch}
              />
              <Label htmlFor="advanced-search" className="cursor-pointer text-sm font-normal">
                Tìm kiếm nâng cao
              </Label>
            </div>
            {!showAdvancedSearch && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by text..."
                    className="pl-10"
                  />
                </div>
                <Button variant="default" size="default" className="gap-2">
                  <Search className="h-4 w-4" />
                  Tìm kiếm
                </Button>
                <Button variant="secondary" size="default" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Đặt lại
                </Button>
              </div>
            )}
            {showAdvancedSearch && (
            <div className="space-y-4">
              {/* Thông tin cơ bản */}
              <div>
                {/* <h3 className="text-sm font-semibold mb-3">Thông tin cơ bản</h3> */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                  <div>
                    <Label htmlFor="trademark_name">Nhãn hiệu</Label>
                    <Input
                      id="trademark_name"
                      type="text"
                      placeholder="Nhãn hiệu..."
                      value={data.name}
                      onChange={(e) => setData({ ...data, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="product">Sản phẩm</Label>
                    <Input
                      id="product"
                      type="text"
                      placeholder="Sản phẩm..."
                      value={data.product}
                      onChange={(e) => setData({ ...data, product: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Mô tả</Label>
                    <Input
                      id="description"
                      type="text"
                      placeholder="Mô tả..."
                      value={data.description}
                      onChange={(e) => setData({ ...data, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="note">Ghi chú</Label>
                    <Input
                      id="note"
                      type="text"
                      placeholder="Ghi chú..."
                      value={data.note}
                      onChange={(e) => setData({ ...data, note: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Số đơn */}
              <div>
                {/* <h3 className="text-sm font-semibold mb-3">Số đơn</h3> */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="application_number">Số đơn</Label>
                    <Input
                      id="application_number"
                      type="text"
                      placeholder="Số đơn..."
                      value={data.application_number}
                      onChange={(e) => setData({ ...data, application_number: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="certificate_number">Số văn bằng</Label>
                    <Input
                      id="certificate_number"
                      type="text"
                      placeholder="Số văn bằng..."
                      value={data.certificate_number}
                      onChange={(e) => setData({ ...data, certificate_number: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="original_number">Số đơn gốc</Label>
                    <Input
                      id="original_number"
                      type="text"
                      placeholder="Số đơn gốc..."
                      value={data.original_number}
                      onChange={(e) => setData({ ...data, original_number: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Ngày */}
              <div>
                {/* <h3 className="text-sm font-semibold mb-3">Ngày</h3> */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                  <div>
                    <Label htmlFor="application_date">Ngày nộp đơn</Label>
                    <DateRangePicker
                      showPresets={true}
                      date={{
                        from: data.application_date_from ? new Date(data.application_date_from) : undefined,
                        to: data.application_date_to ? new Date(data.application_date_to) : undefined
                      }}
                      onDateChange={(range) => {
                        setData({
                          ...data,
                          application_date_from: range?.from ? range.from.toISOString().split('T')[0] : '',
                          application_date_to: range?.to ? range.to.toISOString().split('T')[0] : ''
                        });
                      }}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="publication_date">Ngày công bố</Label>
                    <DateRangePicker
                      showPresets={true}
                      date={{
                        from: data.publication_date_from ? new Date(data.publication_date_from) : undefined,
                        to: data.publication_date_to ? new Date(data.publication_date_to) : undefined
                      }}
                      onDateChange={(range) => {
                        setData({
                          ...data,
                          publication_date_from: range?.from ? range.from.toISOString().split('T')[0] : '',
                          publication_date_to: range?.to ? range.to.toISOString().split('T')[0] : ''
                        });
                      }}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="grant_date">Ngày cấp VB</Label>
                    <DateRangePicker
                      showPresets={true}
                      date={{
                        from: data.grant_date_from ? new Date(data.grant_date_from) : undefined,
                        to: data.grant_date_to ? new Date(data.grant_date_to) : undefined
                      }}
                      onDateChange={(range) => {
                        setData({
                          ...data,
                          grant_date_from: range?.from ? range.from.toISOString().split('T')[0] : '',
                          grant_date_to: range?.to ? range.to.toISOString().split('T')[0] : ''
                        });
                      }}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiry_date">Ngày hết hạn</Label>
                    <DateRangePicker
                      showPresets={true}
                      date={{
                        from: data.expiry_date_from ? new Date(data.expiry_date_from) : undefined,
                        to: data.expiry_date_to ? new Date(data.expiry_date_to) : undefined
                      }}
                      onDateChange={(range) => {
                        setData({
                          ...data,
                          expiry_date_from: range?.from ? range.from.toISOString().split('T')[0] : '',
                          expiry_date_to: range?.to ? range.to.toISOString().split('T')[0] : ''
                        });
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Chủ thể */}
              <div>
                {/* <h3 className="text-sm font-semibold mb-3">Chủ thể</h3> */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="applicant">Chủ đơn/Chủ bằng</Label>
                    <Input
                      id="applicant"
                      type="text"
                      placeholder="Chủ đơn/Chủ bằng..."
                      value={data.applicant}
                      onChange={(e) => setData({ ...data, applicant: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="representative">Đại diện</Label>
                    <Input
                      id="representative"
                      type="text"
                      placeholder="Đại diện..."
                      value={data.representative}
                      onChange={(e) => setData({ ...data, representative: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Trạng thái */}
              <div>
                {/* <h3 className="text-sm font-semibold mb-3">Trạng thái</h3> */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="legal_status">Trạng thái pháp lý</Label>
                    <SingleSelect
                      instanceId="legal-status-select"
                      isClearable
                      options={statusOptions}
                      value={statusOptions.find(b => b.value === data.legal_status) ? {
                        value: data.legal_status,
                        label: statusOptions.find(b => b.value === data.legal_status)?.label || ''
                      } : null}
                      onChange={(selected) => setData({
                        ...data,
                        legal_status: selected ? selected.value as string : ''
                      })}
                      placeholder="Trạng thái pháp lý"
                    />
                  </div>
                  <div>
                    <Label htmlFor="workflow_status">Trạng thái nội bộ</Label>
                    <SingleSelect
                      instanceId="workflow-status-select"
                      isClearable
                      options={workflowStatusOptions}
                      value={workflowStatusOptions.find(b => b.value === data.workflow_status) ? {
                        value: data.workflow_status,
                        label: workflowStatusOptions.find(b => b.value === data.workflow_status)?.label || ''
                      } : null}
                      onChange={(selected) => setData({
                        ...data,
                        workflow_status: selected ? selected.value as string : ''
                      })}
                      placeholder="Trạng thái nội bộ"
                    />
                  </div>
                </div>
              </div>

              {/* Phân loại */}
              <div>
                {/* <h3 className="text-sm font-semibold mb-3">Phân loại</h3> */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="nice_class">Nice Class</Label>
                    <SingleSelect
                      instanceId="nice-class-select"
                      isClearable
                      options={niceClassOptions}
                      value={niceClassOptions.find(b => b.value === data.nice_class) ? {
                        value: data.nice_class,
                        label: niceClassOptions.find(b => b.value === data.nice_class)?.label || ''
                      } : null}
                      onChange={(selected) => setData({
                        ...data,
                        nice_class: selected ? selected.value as string : ''
                      })}
                      placeholder="Nice Class"
                    />
                  </div>
                  <div>
                    <Label htmlFor="goods_services">Tên hàng hóa</Label>
                    <Input
                      id="goods_services"
                      type="text"
                      placeholder="Tên hàng hóa..."
                      value={data.goods_services}
                      onChange={(e) => setData({ ...data, goods_services: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vienna_class">Vienna Class</Label>
                    <Input
                      id="vienna_class"
                      type="text"
                      placeholder="Vienna Class..."
                      value={data.vienna_class}
                      onChange={(e) => setData({ ...data, vienna_class: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-t pt-3">
                <Button variant="default" size="default" className="gap-2">
                  <Search className="h-4 w-4" />
                  Tìm kiếm
                </Button>
                <Button variant="secondary" size="default" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Đặt lại
                </Button>
                {/* <Button size="default" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create
                </Button> */}
              </div>
            </div>
            )}
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
