"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Plus, Search, Filter, Download, Eye, Pencil, Trash2, MoreHorizontal, RotateCcw, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
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
import { useRouter } from "next/navigation"
import { se } from "date-fns/locale"
import ImageShowList from "@/components/custom/image/image-show-list"

type Trademark = {
  _id: string
  code: string
  name: string
  name_upper_ascii: string
  trademark_type: string
  status: string
  country_code: string
  ip_family: string
  application_number: string
  application_date: string
  certificate_number: string
  certificate_date: string
  expiry_date: string
  publication_date: string
  declaration_date: string
  applicant_id: string
  agency_id: string
  applicant_name?: string // Populated from companies
  agency_name?: string // Populated from agencies
  authors: string
  workflow_status: string
  commercial_statuses: string[]
  search_status: string
  filing_number_1: string
  filing_date_1: string
  filing_country_1: string
  filing_number_2: string
  filing_date_2: string
  filing_country_2: string
  renewal_date_1: string
  renewal_date_2: string
  renewal_fee_due_1: string
  renewal_fee_due_2: string
  folder_name: string
  folder_path: string
  file_format: string
  file_type: string
  related_products: string[]
  notes: string
  gallery_images: string[]
  created_at: string
  updated_at: string
}

const fetchTrademarks = async (): Promise<Trademark[]> => {
  const response = await fetch('/api/trademarks/list')
  if (!response.ok) {
    throw new Error('Failed to fetch trademarks')
  }
  const result = await response.json()
  return result.success ? result.data : []
}

export default function TrademarksPage() {
  const { setBreadcrumbs } = useBreadcrumbs()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { data: allTrademarks = [], isLoading, error } = useQuery({
    queryKey: ['trademarks'],
    queryFn: fetchTrademarks,
  })
  
  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/" },
      { label: "Tra cứu", href: "/search/trademark" },
      { label: "Nhãn hiệu" }
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
    { label: 'Đã nộp đơn', value: 'filed' },
    { label: 'Từ chối hình thức', value: 'formal_refused' },
    { label: 'Giải trình hình thức', value: 'formal_response' },
    { label: 'Đơn hợp lệ', value: 'formally_accepted' },
    { label: 'Bị phản đối', value: 'opposed' },
    { label: 'Từ chối nội dung', value: 'content_refused' },
    { label: 'Giải trình nội dung', value: 'content_response' },
    { label: 'Công bố', value: 'published' },
    { label: 'Đóng phí cấp bằng', value: 'grant_fee_paid' },
    { label: 'Cấp bằng', value: 'granted' },
    { label: 'Từ chối cấp bằng', value: 'grant_refused' },
    { label: 'Khiếu nại/ Khởi kiện QĐHC', value: 'appealed' },
    { label: 'Chuyển nhượng đơn', value: 'app_transferred' },
    { label: 'Chuyển nhượng bằng', value: 'right_transferred' },
    { label: 'Rút đơn', value: 'withdrawn' },
    { label: 'Đang sửa đơn', value: 'app_under_amend' },
    { label: 'Đang sửa bằng', value: 'cert_under_amend' },
    { label: 'Gia hạn', value: 'renewed' },
    { label: 'Hết hiệu lực', value: 'expired' },
    { label: 'Từ bỏ đăng ký', value: 'abandoned' },
  ]

  const commercialStatusOptions = [
    { label: 'Đang sử dụng', value: 'in_use' },
    { label: 'Cấp phép', value: 'licensed' },
    { label: 'Nhượng quyền thương mại', value: 'franchised' },
    { label: 'Đã nhượng quyền', value: 'franchise_granted' },
    { label: 'Chưa khai thác', value: 'unused' },
    { label: 'Chuyển nhượng', value: 'assigned' },
    { label: 'Đang đàm phán', value: 'negotiating' },
    { label: 'Đã ngưng khai thác', value: 'discontinued' },
  ]

  const workflowStatusOptions = [
    { label: 'Nháp', value: 'draft' },
    { label: 'Chờ duyệt', value: 'pending_review' },
    { label: 'Đã duyệt', value: 'approved' },
    { label: 'Từ chối', value: 'rejected' },
  ]

  const searchStatusOptions = [
    { label: 'Đã tra cứu', value: 'searched' },
    { label: 'Chưa tra cứu', value: 'not_searched' },
  ]

  const niceClassOptions = Array.from({ length: 45 }, (_, i) => ({
    label: `Lớp ${i + 1}`,
    value: `${i + 1}`
  }))

  const [countryOptions, setCountryOptions] = useState<{ label: string; value: string }[]>([])

  useEffect(() => {
    fetch('/api/mongodb/countries')
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setCountryOptions(result.data)
        }
      })
      .catch(err => console.error('Error loading countries:', err))
  }, [])

  const [data, setData] = useState({
    // Thông tin cơ bản
    name: '',
    description: '',
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
    nice_class: '',
    goods_services: '',
    vienna_class: '',
    // Quốc gia
    origin_country: '',
    country: '',
    page: 1,
    pag_size: 50
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
              {/* Number - Số */}
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-3 text-primary">Số (Number)</h3>
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

              {/* Mark - Nhãn hiệu */}
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-3 text-primary">Nhãn hiệu (Mark)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="trademark_name">Tên nhãn hiệu</Label>
                    <Input
                      id="trademark_name"
                      type="text"
                      placeholder="Tên nhãn hiệu..."
                      value={data.name}
                      onChange={(e) => setData({ ...data, name: e.target.value })}
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
                </div>
              </div>

              {/* Name & Address - Tên và địa chỉ */}
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-3 text-primary">Tên & Địa chỉ (Name & Address)</h3>
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

              {/* Date - Ngày tháng */}
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-3 text-primary">Ngày tháng (Date)</h3>
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

              {/* Classification - Phân loại */}
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-3 text-primary">Phân loại (Classification)</h3>
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

              {/* Country - Quốc gia */}
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-3 text-primary">Quốc gia (Country)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="origin_country">Quốc gia đơn gốc</Label>
                    <SingleSelect
                      instanceId="origin-country-select"
                      isClearable
                      options={countryOptions}
                      value={countryOptions.find(b => b.value === data.origin_country) ? {
                        value: data.origin_country,
                        label: countryOptions.find(b => b.value === data.origin_country)?.label || ''
                      } : null}
                      onChange={(selected) => setData({
                        ...data,
                        origin_country: selected ? selected.value as string : ''
                      })}
                      placeholder="Quốc gia đơn gốc"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Quốc gia bảo hộ</Label>
                    <SingleSelect
                      instanceId="country-select"
                      isClearable
                      options={countryOptions}
                      value={countryOptions.find(b => b.value === data.country) ? {
                        value: data.country,
                        label: countryOptions.find(b => b.value === data.country)?.label || ''
                      } : null}
                      onChange={(selected) => setData({
                        ...data,
                        country: selected ? selected.value as string : ''
                      })}
                      placeholder="Quốc gia bảo hộ"
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
                <TableHead className="text-center">Hình ảnh</TableHead>
                <TableHead>Mã</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead className="min-w-[80px]">Quốc gia đơn gốc</TableHead>
                <TableHead className="min-w-[80px]">Quốc gia bảo hộ</TableHead>
                <TableHead>Chủ đơn</TableHead>
                <TableHead>Nhóm (nice)</TableHead>
                <TableHead className="min-w-[120px]">Số đơn</TableHead>
                <TableHead>Ngày nộp đơn</TableHead>
                <TableHead>Số bằng</TableHead>
                <TableHead>Đại diện</TableHead>
                <TableHead className="min-w-[80px]">Trạng thái pháp lý</TableHead>
                <TableHead className="min-w-[80px]">Trạng thái thương mại</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8">
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8 text-destructive">
                    Lỗi khi tải dữ liệu
                  </TableCell>
                </TableRow>
              ) : currentTrademarks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                currentTrademarks.map((trademark) => (
                <TableRow key={trademark._id}>
                  <TableCell>
                    <ImageShowList
                        src={trademark.gallery_images?.[0] || ''} 
                        alt={trademark.name || "Trademark image"}
                        size="md"
                    />
                  </TableCell>
                  <TableCell className="text-sm">
                    {trademark.code}
                  </TableCell>
                  <TableCell className="font-medium">
                    {trademark.name}
                  </TableCell>
                  <TableCell className="text-sm">
                    {trademark.country_code || '-'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {trademark.country_code || '-'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {trademark.applicant_name || '-'}
                  </TableCell>
                  <TableCell className="text-sm">
                    -
                  </TableCell>
                  <TableCell className="text-sm">
                    {trademark.application_number}
                  </TableCell>
                  <TableCell className="text-sm">
                    {trademark.application_date ? new Date(trademark.application_date).toLocaleDateString('vi-VN') : '-'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {trademark.certificate_number || '-'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {trademark.agency_name || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{trademark.status || '-'}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{trademark.commercial_statuses?.[0] || '-'}</Badge>
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
