"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Plus, Search, Download, Eye, Pencil, Trash2, MoreHorizontal, RotateCcw, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
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
import ImageShowList from "@/components/custom/image/image-show-list"

type Copyright = {
  id: number
  code: string
  logo: string
  name: string
  origin_country: string // Quốc gia đơn gốc
  country: string // Quốc gia bảo hộ (chính là quốc gia trong mỗi bản ghi)
  applicant: string // Chủ đơn
  application_number: string
  application_date: string
  certificate_number: string
  status: string //trạng thái pháp lý
  agency: string // Đại diện
  commercial_status: string //trạng thái thương mại
  object_internal: string // loại tác phẩm nội bộ
  object_law: string // loại tác phẩm theo pháp luật
}

const fetchRecords = async (): Promise<Copyright[]> => {
  const response = await fetch('/data/copyrights.json')
  if (!response.ok) {
    throw new Error('Failed to fetch data')
  }
  return response.json()
}

export default function CopyrightsPage() {
  const { setBreadcrumbs } = useBreadcrumbs()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { data: allRecords = [], isLoading, error } = useQuery({
    queryKey: ['copyrights'],
    queryFn: fetchRecords,
  })
  
  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/" },
      { label: "Quyền tác giả", href: "/copyrights" },
      { label: "Danh sách" }
    ])
  }, [setBreadcrumbs])

  // Pagination logic
  const totalPages = Math.ceil(allRecords.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRecords = allRecords.slice(startIndex, endIndex)

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

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

  const countryOptions = [
    { label: 'Việt Nam', value: 'VN' },
    { label: 'Hoa Kỳ', value: 'US' },
    { label: 'Nhật Bản', value: 'JP' },
    { label: 'Hàn Quốc', value: 'KR' },
    { label: 'Trung Quốc', value: 'CN' },
    { label: 'Đức', value: 'DE' },
    { label: 'Pháp', value: 'FR' },
    { label: 'Anh', value: 'GB' },
    { label: 'Thái Lan', value: 'TH' },
    { label: 'Singapore', value: 'SG' },
  ]

  const objectInternalOptions = [
    { value: '1', label: 'Bao bì (Packaging)' },
    { value: '2', label: 'TVC (Television Commercial)' },
    { value: '3', label: 'Phần mềm (Software)' },
    { value: '4', label: 'Sách vở (Books)' },
    { value: '5', label: 'Âm nhạc (Music)' },
    { value: '6', label: 'Phim ảnh (Films)' },
    { value: '7', label: 'Thiết kế đồ họa (Graphic Arts)' },
    { value: '8', label: 'Kiến trúc (Architecture)' },
    { value: '9', label: 'Kịch bản (Scripts)' },
    { value: '10', label: 'Ảnh chụp (Photographs)' },
    { value: '11', label: 'Giao diện Website, phần mềm' },
  ]

  const objectLawOptions = [
    { value: '12', label: 'Tác phẩm văn học, khoa học, sách giáo khoa, giáo trình và tác phẩm khác được thể hiện dưới dạng chữ viết hoặc ký tự khác' },
    { value: '13', label: 'Bài giảng, bài phát biểu và bài nói khác' },
    { value: '14', label: 'Tác phẩm báo chí' },
    { value: '15', label: 'Tác phẩm âm nhạc' },
    { value: '16', label: 'Tác phẩm sân khấu' },
    { value: '17', label: 'Tác phẩm điện ảnh và tác phẩm được tạo ra theo phương pháp tương tự' },
    { value: '18', label: 'Tác phẩm tạo hình, mỹ thuật ứng dụng' },
    { value: '19', label: 'Tác phẩm nhiếp ảnh' },
    { value: '20', label: 'Tác phẩm kiến trúc' },
    { value: '21', label: 'Bản họa đồ, sơ đồ, bản đồ, bản vẽ liên quan đến địa hình, kiến trúc, công trình khoa học' },
    { value: '22', label: 'Tác phẩm văn học, nghệ thuật dân gian' },
    { value: '23', label: 'Chương trình máy tính, sưu tập dữ liệu' },
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
    status: '',
    commercial_status: '',
    search_status: '',
    // Phân loại
    object_internal_id: '',
    object_law_id: '',
    // Quốc gia
    origin_country: '',
    country: '',
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
                    <Label htmlFor="name">Tên</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Tên..."
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
                    <Label htmlFor="object_internal_id">Loại tác phẩm nội bộ</Label>
                    <SingleSelect
                      instanceId="object-internal-select"
                      isClearable
                      options={objectInternalOptions}
                      value={objectInternalOptions.find(b => b.value === data.object_internal_id) ? {
                        value: data.object_internal_id,
                        label: objectInternalOptions.find(b => b.value === data.object_internal_id)?.label || ''
                      } : null}
                      onChange={(selected) => setData({
                        ...data,
                        object_internal_id: selected ? selected.value as string : ''
                      })}
                      placeholder="Loại tác phẩm nội bộ"
                    />
                  </div>
                  <div>
                    <Label htmlFor="object_law_id">Loại tác phẩm theo pháp luật</Label>
                    <SingleSelect
                      instanceId="object-law-select"
                      isClearable
                      options={objectLawOptions}
                      value={objectLawOptions.find(b => b.value === data.object_law_id) ? {
                        value: data.object_law_id,
                        label: objectLawOptions.find(b => b.value === data.object_law_id)?.label || ''
                      } : null}
                      onChange={(selected) => setData({
                        ...data,
                        object_law_id: selected ? selected.value as string : ''
                      })}
                      placeholder="Loại tác phẩm theo pháp luật"
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

              {/* Status - Trạng thái */}
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-3 text-primary">Trạng thái (Status)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="status">Trạng thái pháp lý</Label>
                    <SingleSelect
                      instanceId="status-select"
                      isClearable
                      options={statusOptions}
                      value={statusOptions.find(b => b.value === data.status) ? {
                        value: data.status,
                        label: statusOptions.find(b => b.value === data.status)?.label || ''
                      } : null}
                      onChange={(selected) => setData({
                        ...data,
                        status: selected ? selected.value as string : ''
                      })}
                      placeholder="Trạng thái pháp lý"
                    />
                  </div>
                  <div>
                    <Label htmlFor="commercial_status">Trạng thái thương mại</Label>
                    <SingleSelect
                      instanceId="commercial-status-select"
                      isClearable
                      options={commercialStatusOptions}
                      value={commercialStatusOptions.find(b => b.value === data.commercial_status) ? {
                        value: data.commercial_status,
                        label: commercialStatusOptions.find(b => b.value === data.commercial_status)?.label || ''
                      } : null}
                      onChange={(selected) => setData({
                        ...data,
                        commercial_status: selected ? selected.value as string : ''
                      })}
                      placeholder="Trạng thái thương mại"
                    />
                  </div>
                  <div>
                    <Label htmlFor="search_status">Trạng thái tra cứu</Label>
                    <SingleSelect
                      instanceId="search-status-select"
                      isClearable
                      options={searchStatusOptions}
                      value={searchStatusOptions.find(b => b.value === data.search_status) ? {
                        value: data.search_status,
                        label: searchStatusOptions.find(b => b.value === data.search_status)?.label || ''
                      } : null}
                      onChange={(selected) => setData({
                        ...data,
                        search_status: selected ? selected.value as string : ''
                      })}
                      placeholder="Trạng thái tra cứu"
                    />
                  </div>
                </div>
              </div>

              {/* Other - Khác */}
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-3 text-primary">Khác (Other)</h3>
                <div className="grid grid-cols-1 gap-3">
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="default" className="gap-2">
                  <ChevronDown className="h-4 w-4" />
                  Thao tác
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Thao tác hàng loạt</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Xuất dữ liệu
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" />
                  Cập nhật hàng loạt
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa đã chọn
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              variant="default" 
              size="default" 
              className="gap-2"
              onClick={() => router.push('/trademarks/create')}
            >
              <Plus className="h-4 w-4" />
              Tạo mới
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox />
                </TableHead>
                <TableHead className="text-center">Hình ảnh</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead className="min-w-[120px]">Số đơn</TableHead>
                <TableHead>Ngày nộp đơn</TableHead>
                <TableHead>Số bằng</TableHead>
                <TableHead>Loại tác phẩm nội bộ</TableHead>
                <TableHead>Loại tác phẩm theo pháp luật</TableHead>
                <TableHead>Chủ đơn/Chủ bằng</TableHead>
                <TableHead>Trạng thái pháp lý</TableHead>
                <TableHead>Trạng thái thương mại</TableHead>
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
              ) : currentRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                currentRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="text-center">
                    <ImageShowList
                      src={record.logo} 
                      alt={record.name || "Logo"}
                      size="md"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {record.name}
                  </TableCell>
                  <TableCell className="text-sm">
                    {record.application_number}
                  </TableCell>
                  <TableCell className="text-sm">
                    {record.application_date}
                  </TableCell>
                  <TableCell className="text-sm">
                    {record.certificate_number || '-'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {record.object_internal}
                  </TableCell>
                  <TableCell className="text-sm">
                    {record.object_law}
                  </TableCell>
                  <TableCell className="text-sm">
                    {record.applicant}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{record.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{record.commercial_status}</Badge>
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
          {!isLoading && !error && allRecords.length > 0 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                Hiển thị {startIndex + 1} - {Math.min(endIndex, allRecords.length)} của {allRecords.length} kết quả
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
