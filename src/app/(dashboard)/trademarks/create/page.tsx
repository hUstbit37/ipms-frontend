"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Upload, X } from "lucide-react"
import { useBreadcrumbs } from "@/contexts/breadcrumb-context"
import { useEffect, useState } from "react"
import SingleSelect from "@/components/custom/select/single-select"
import { DateRangePicker } from "@/components/custom/date/date-range-picker"
import { Textarea } from "@/components/ui/textarea"

export default function CreateTrademarkPage() {
  const { setBreadcrumbs } = useBreadcrumbs()
  
  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/" },
      { label: "Nhãn hiệu", href: "/trademarks" },
      { label: "Thêm mới" }
    ])
  }, [setBreadcrumbs])

  const [formData, setFormData] = useState({
    // Thông tin chung
    trademark_name: '',
    trademark_type: '',
    legal_status: '',
    country: '',
    // Số
    application_number: '',
    registration_number: '',
    location: '',
    ip_agency: '',
    // Ngày
    application_date: '',
    registration_date: '',
    expiry_date: '',
    // Số đăng ký
    filing_number_1: '',
    filing_date_1: '',
    filing_country_1: '',
    filing_number_2: '',
    filing_date_2: '',
    filing_country_2: '',
    // Ngày gia hạn
    renewal_date_1: '',
    renewal_date_2: '',
    renewal_fee_due_1: '',
    renewal_fee_due_2: '',
    // Tài liệu đính kèm
    folder_name: '',
    folder_path: '',
    file_format: '',
    file_type: '',
    // Các sản phẩm liên quan
    related_products: [] as string[],
    // Ghi chú
    notes: '',
    // Checkbox
    continue_adding: false
  })

  const trademarkTypeOptions = [
    { label: 'Nhãn hiệu chữ', value: 'text' },
    { label: 'Nhãn hiệu hình', value: 'image' },
    { label: 'Nhãn hiệu kết hợp', value: 'combined' },
  ]

  const countryOptions = [
    { label: 'Việt Nam', value: 'vn' },
    { label: 'Hoa Kỳ', value: 'us' },
    { label: 'Nhật Bản', value: 'jp' },
  ]

  const legalStatusOptions = [
    { label: 'Đang giải quyết', value: 'pending' },
    { label: 'Cấp bằng', value: 'granted' },
    { label: 'Hủy', value: 'cancelled' },
  ]

  const filingCountryOptions = [
    { label: 'Việt Nam', value: 'vn' },
    { label: 'Hoa Kỳ', value: 'us' },
    { label: 'Nhật Bản', value: 'jp' },
  ]

  const registrationStateOptions = [
    { label: 'Chưa đăng ký', value: 'not_registered' },
    { label: 'Đã đăng ký', value: 'registered' },
  ]

  const registrationMethodOptions = [
    { label: 'Chọn loại công việc', value: '' },
    { label: 'Đăng ký mới', value: 'new' },
    { label: 'Gia hạn', value: 'renewal' },
  ]

  const statusOptions = [
    { label: 'Chưa bắt đầu', value: 'not_started' },
    { label: 'Đang xử lý', value: 'in_progress' },
    { label: 'Hoàn thành', value: 'completed' },
  ]

  const fileFormatOptions = [
    { label: 'Chọn văn bản', value: '' },
    { label: 'PDF', value: 'pdf' },
    { label: 'Word', value: 'word' },
  ]

  const fileTypeOptions = [
    { label: 'Chọn loại tài liệu', value: '' },
    { label: 'Đơn đăng ký', value: 'application' },
    { label: 'Giấy chứng nhận', value: 'certificate' },
  ]

  const relatedProductOptions = [
    { label: 'OMAGHI', value: 'omaghi' },
    { label: 'OMAGHI II', value: 'omaghi_2' },
  ]

  return (
    <div className="space-y-4">
      {/* Upload Photo Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-muted">
                <User className="h-10 w-10 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm">
                Upload Photo
              </Button>
              <button className="text-sm text-destructive hover:underline">
                remove
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thông Tin Chung */}
      <Card>
        <CardContent >
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Thông Tin Chung</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="trademark_name">
                  Tên nhãn hiệu <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="trademark_name"
                  placeholder="Nhập tên nhãn hiệu"
                  value={formData.trademark_name}
                  onChange={(e) => setFormData({ ...formData, trademark_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="trademark_type">
                  Tên không dấu <span className="text-destructive">*</span>
                </Label>
                <SingleSelect
                  instanceId="trademark-type"
                  options={trademarkTypeOptions}
                  value={trademarkTypeOptions.find(o => o.value === formData.trademark_type) || null}
                  onChange={(selected) => setFormData({ ...formData, trademark_type: selected?.value as string || '' })}
                  placeholder="Chọn loại nhãn hiệu"
                />
              </div>
              <div>
                <Label htmlFor="legal_status">
                  Kiểu nhãn hiệu <span className="text-destructive">*</span>
                </Label>
                <SingleSelect
                  instanceId="legal-status"
                  options={legalStatusOptions}
                  value={legalStatusOptions.find(o => o.value === formData.legal_status) || null}
                  onChange={(selected) => setFormData({ ...formData, legal_status: selected?.value as string || '' })}
                  placeholder="Chọn trạng thái pháp lý"
                />
              </div>
              <div>
                <Label htmlFor="country">
                  Loại KĐCN <span className="text-destructive">*</span>
                </Label>
                <SingleSelect
                  instanceId="country"
                  options={countryOptions}
                  value={countryOptions.find(o => o.value === formData.country) || null}
                  onChange={(selected) => setFormData({ ...formData, country: selected?.value as string || '' })}
                  placeholder="Chọn quốc gia"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="application_number">Số đơn</Label>
                <Input
                  id="application_number"
                  placeholder="Nhập số đơn"
                  value={formData.application_number}
                  onChange={(e) => setFormData({ ...formData, application_number: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="application_date">Ngày nộp đơn</Label>
                <Input
                  id="application_date"
                  type="date"
                  value={formData.application_date}
                  onChange={(e) => setFormData({ ...formData, application_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="registration_number">Số VB</Label>
                <Input
                  id="registration_number"
                  placeholder="Nhập số văn bằng"
                  value={formData.registration_number}
                  onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="registration_date">Ngày cấp</Label>
                <Input
                  id="registration_date"
                  type="date"
                  value={formData.registration_date}
                  onChange={(e) => setFormData({ ...formData, registration_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="expiry_date">Ngày hết hạn</Label>
                <Input
                  id="expiry_date"
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Ghi chú</Label>
              <Textarea
                id="notes"
                placeholder="Nhập ghi chú"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* IP Family */}
      <Card>
        <CardContent >
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">IP Family</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="filing_number_1">Số đơn gốc</Label>
                <Input
                  id="filing_number_1"
                  placeholder=""
                  value={formData.filing_number_1}
                  onChange={(e) => setFormData({ ...formData, filing_number_1: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="filing_country_1">Tên quốc gia</Label>
                <SingleSelect
                  instanceId="filing-country-1"
                  options={countryOptions}
                  value={countryOptions.find(o => o.value === formData.filing_country_1) || null}
                  onChange={(selected) => setFormData({ ...formData, filing_country_1: selected?.value as string || '' })}
                  placeholder="Chọn loại công việc"
                />
              </div>
              <div>
                <Label htmlFor="ip_agency">Cơ quan cấp phép</Label>
                <SingleSelect
                  instanceId="ip-agency"
                  options={registrationMethodOptions}
                  value={registrationMethodOptions.find(o => o.value === formData.ip_agency) || null}
                  onChange={(selected) => setFormData({ ...formData, ip_agency: selected?.value as string || '' })}
                  placeholder="Chọn loại công việc"
                />
              </div>
              <div>
                <Label htmlFor="legal_status_family">Tình trạng</Label>
                <SingleSelect
                  instanceId="legal-status-family"
                  options={statusOptions}
                  placeholder="Chọn tên hệ thống"
                />
              </div>
            </div>

            <div className="border-t pt-4 space-y-3">
              <p className="text-sm font-medium">
                Đơn thành viên 1 - Số WIPO: 12345
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="filing_number_2">Số đơn gốc</Label>
                  <Input
                    id="filing_number_2"
                    placeholder=""
                    value={formData.filing_number_2}
                    onChange={(e) => setFormData({ ...formData, filing_number_2: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="filing_country_2">Tên quốc gia</Label>
                  <SingleSelect
                    instanceId="filing-country-2"
                    options={countryOptions}
                    value={countryOptions.find(o => o.value === formData.filing_country_2) || null}
                    onChange={(selected) => setFormData({ ...formData, filing_country_2: selected?.value as string || '' })}
                    placeholder="Chọn loại công việc"
                  />
                </div>
                <div>
                  <Label htmlFor="registration_method_2">Cơ quan cấp phép</Label>
                  <SingleSelect
                    instanceId="registration-method-2"
                    options={registrationMethodOptions}
                    placeholder="Chọn loại công việc"
                  />
                </div>
                <div>
                  <Label htmlFor="status_2">Tình trạng</Label>
                  <SingleSelect
                    instanceId="status-2"
                    options={statusOptions}
                    placeholder="Chọn tên hệ thống"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lịch sử gia hạn */}
      <Card>
        <CardContent >
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Lịch sử gia hạn</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="renewal_date_1">Ngày gia hạn lần 1</Label>
                <Input
                  id="renewal_date_1"
                  type="date"
                  value={formData.renewal_date_1}
                  onChange={(e) => setFormData({ ...formData, renewal_date_1: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="renewal_fee_due_1">Ngày hết hạn gia hạn lần 1</Label>
                <Input
                  id="renewal_fee_due_1"
                  type="date"
                  value={formData.renewal_fee_due_1}
                  onChange={(e) => setFormData({ ...formData, renewal_fee_due_1: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="renewal_date_2">Ngày gia hạn lần 2</Label>
                <Input
                  id="renewal_date_2"
                  type="date"
                  value={formData.renewal_date_2}
                  onChange={(e) => setFormData({ ...formData, renewal_date_2: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="renewal_fee_due_2">Ngày hết hạn gia hạn lần 2</Label>
                <Input
                  id="renewal_fee_due_2"
                  type="date"
                  value={formData.renewal_fee_due_2}
                  onChange={(e) => setFormData({ ...formData, renewal_fee_due_2: e.target.value })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tài liệu đính kèm */}
      <Card>
        <CardContent >
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Tài liệu đính kèm</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
              <div>
                <Label htmlFor="folder_name">Tên folder</Label>
                <Input
                  id="folder_name"
                  type="text"
                  placeholder="Nhập tên folder"
                  value={formData.folder_name}
                  onChange={(e) => setFormData({ ...formData, folder_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="folder_path">Tên tập tin</Label>
                <Input
                  id="folder_path"
                  type="text"
                  placeholder="Nhập tên tập tin"
                  value={formData.folder_path}
                  onChange={(e) => setFormData({ ...formData, folder_path: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="file_format">Tên văn bằng</Label>
                <Input
                  id="file_format"
                  type="text"
                  placeholder="Nhập tên văn bằng"
                  value={formData.file_format}
                  onChange={(e) => setFormData({ ...formData, file_format: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="file_type">Tài liệu khác</Label>
                <Input
                  id="file_type"
                  type="text"
                  placeholder="Nhập tài liệu khác"
                  value={formData.file_type}
                  onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Các sản phẩm liên quan */}
      <Card>
        <CardContent >
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Các sản phẩm liên quan</h3>
            
            <div>
              <Label htmlFor="related_products">Link sản phần</Label>
              <SingleSelect
                instanceId="related-products"
                options={relatedProductOptions}
                placeholder="Chọn sản phẩm liên quan"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="continue_adding"
            checked={formData.continue_adding}
            onCheckedChange={(checked) => setFormData({ ...formData, continue_adding: checked as boolean })}
          />
          <Label htmlFor="continue_adding" className="cursor-pointer text-sm font-normal">
            Tiếp tục thêm mới
          </Label>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="default">
            Hủy
          </Button>
          <Button variant="default" size="default">
            Thêm mới
          </Button>
        </div>
      </div>
    </div>
  )
}
