"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useBreadcrumbs } from "@/contexts/breadcrumb-context"
import { useEffect, useState, useCallback } from "react"
import SingleSelect from "@/components/custom/select/single-select"
import { DateRangePicker } from "@/components/custom/date/date-range-picker"
import { DatePickerSingle } from "@/components/custom/date/date-picker-single"
import { Textarea } from "@/components/ui/textarea"
import ImageUploadMulti from "@/components/custom/image/image-upload-multi"
import MultiSelect from "@/components/custom/select/multi-select"
import InputError from "@/components/custom/input-error"
import { Loader2, Search, X } from "lucide-react"
import NiceClassificationSearch from "@/components/custom/nice-classification-search"
import ViennaClassificationSearch from "@/components/custom/vienna-classification-search"
import { Badge } from "@/components/ui/badge"

export default function CreateTrademarkPage() {
  const { setBreadcrumbs } = useBreadcrumbs()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showNiceSearch, setShowNiceSearch] = useState(false)
  const [showViennaSearch, setShowViennaSearch] = useState(false)
  
  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/" },
      { label: "Nhãn hiệu", href: "/trademarks" },
      { label: "Thêm mới" }
    ])
  }, [setBreadcrumbs])

  const [formData, setFormData] = useState({
    // Thông tin chung
    name: '', // Tên nhãn hiệu
    name_upper_ascii: '', // Tên không dấu
    trademark_type: '', // Loại nhãn hiệu
    status: '', // Trạng thái pháp lý
    wipo_status: '', // Trạng thái của cục
    country_code: '', // Mã quốc gia đăng ký
    ip_family: '', // Họ nhãn
    code: '', // Mã số ip cấu trúc TM-họ nhãn-loại nhãn(code của trademark_type)-mã viết tắt của chủ đơn-stt(từ 001)

    application_number: '', // Số đơn
    application_date: '', // Ngày nộp đơn
    certificate_number: '', // Số văn bằng
    certificate_date: '', // Ngày cấp văn bằng
    expiry_date: '',  
    publication_date: '', // Ngày công bố 
    declaration_date: '', // Ngày tuyên bố sử dụng

    applicant_id: '',
    agency_id: '',
    authors: '',

    workflow_status: '', // Trạng thái quy trình
    commercial_statuses: [] as string[], // Tình trạng thương mại
    search_status: '', // Tình trạng tra cứu

    
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
    // Phân loại Nice & Vienna
    nice_classifications: [] as Array<{
      id: string
      classNumber: number
      classCode: string
      description: string
      descriptionEn?: string
      customDescription?: string
    }>,
    vienna_classifications: [] as Array<{
      _id: string
      category: number
      category_desc_vi: string
      category_desc_en: string
      division: string
      division_desc_vi: string
      division_desc_en: string
      section: string
      section_desc_vi: string
      section_desc_en: string
    }>,
    goods_services: '',
    // Checkbox
    continue_adding: false,
    gallery_images: [] as File[],
    existing_gallery_urls: [] as string[],
    removed_gallery_urls: [] as string[],
    gallery_order: [] as { type: 'file' | 'url'; index: number; originalUrl?: string }[],
  })

  const [trademarkTypeOptions, setTrademarkTypeOptions] = useState<{ label: string; value: string }[]>([])
  const [commercialStatusOptions, setCommercialStatusOptions] = useState<{ label: string; value: string }[]>([])
  const [searchStatusOptions, setSearchStatusOptions] = useState<{ label: string; value: string }[]>([])
  const [workflowStatusOptions, setWorkflowStatusOptions] = useState<{ label: string; value: string }[]>([])
  const [ipFamilyOptions, setIpFamilyOptions] = useState<{ label: string; value: string }[]>([])

  const [countryOptions, setCountryOptions] = useState<{ label: string; value: string }[]>([])
  const [companyOptions, setCompanyOptions] = useState<{ label: string; value: string }[]>([])
  const [agencyOptions, setAgencyOptions] = useState<{ label: string; value: string }[]>([])

  const registrationStateOptions = [
    { label: 'Chưa đăng ký', value: 'not_registered' },
    { label: 'Đã đăng ký', value: 'registered' },
  ]

  const registrationMethodOptions = [
    { label: 'Chọn loại công việc', value: '' },
    { label: 'Đăng ký mới', value: 'new' },
    { label: 'Gia hạn', value: 'renewal' },
  ]

  const [statusOptions, setStatusOptions] = useState<{ label: string; value: string }[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/data/statuses.json').then(res => res.json()),
      fetch('/data/trademark-types.json').then(res => res.json()),
      fetch('/data/commercial-statuses.json').then(res => res.json()),
      fetch('/data/search-statuses.json').then(res => res.json()),
      fetch('/data/workflow-statuses.json').then(res => res.json()),
      fetch('/data/ip-families.json').then(res => res.json()),
      fetch('/api/mongodb/countries').then(res => res.json()),
      fetch('/api/mongodb/companies').then(res => res.json()),
      fetch('/api/mongodb/agencies').then(res => res.json())
    ])
      .then(([statuses, trademarkTypes, commercialStatuses, searchStatuses, workflowStatuses, ipFamilies, countries, companies, agencies]) => {
        setStatusOptions(statuses)
        setTrademarkTypeOptions(trademarkTypes)
        setCommercialStatusOptions(commercialStatuses)
        setSearchStatusOptions(searchStatuses)
        setWorkflowStatusOptions(workflowStatuses)
        setIpFamilyOptions(ipFamilies)
        setCountryOptions(countries.success ? countries.data : [])
        setCompanyOptions(companies.success ? companies.data : [])
        setAgencyOptions(agencies.success ? agencies.data : [])
      })
      .catch(err => console.error('Error loading data:', err))
  }, [])

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

  useEffect(() => {
    const generateCode = async () => {
      const { ip_family, trademark_type, applicant_id } = formData

      // If any required field is empty, clear the code
      if (!ip_family || !trademark_type || !applicant_id) {
        if (formData.code !== '') {
          setFormData(prev => ({ ...prev, code: '' }))
        }
        return
      }

      try {
        // Get trademark type code
        const trademarkTypeData = trademarkTypeOptions.find(t => t.value === trademark_type)
        const typeCode = (trademarkTypeData as any)?.code || ''

        // Get applicant short name
        const applicantData = companyOptions.find(c => c.value === applicant_id)
        const applicantShortName = (applicantData as any)?.shortName || ''
        
        // Extract first letters or create abbreviation from applicant name
        let applicantCode = ''
        if (applicantShortName) {
          // Remove spaces and get first 2-3 characters in uppercase
          applicantCode = applicantShortName.replace(/\s+/g, '').substring(0, 3).toUpperCase()
        }

        // Get next sequence number from API (global counter for all trademarks)
        const response = await fetch('/api/trademarks/next-sequence')
        const result = await response.json()
        
        const sequentialNumber = result.success ? result.data.sequence : '001'

        // Build code: TM-ipFamily-typeCode-applicantCode-seq
        const generatedCode = `TM-${ip_family}-${typeCode}-${applicantCode}-${sequentialNumber}`
        
        if (formData.code !== generatedCode) {
          setFormData(prev => ({ ...prev, code: generatedCode }))
        }
      } catch (error) {
        console.error('Error generating code:', error)
        // Fallback to default sequence if API fails
        const trademarkTypeData = trademarkTypeOptions.find(t => t.value === trademark_type)
        const typeCode = (trademarkTypeData as any)?.code || ''
        const applicantData = companyOptions.find(c => c.value === applicant_id)
        const applicantShortName = (applicantData as any)?.shortName || ''
        let applicantCode = ''
        if (applicantShortName) {
          applicantCode = applicantShortName.replace(/\s+/g, '').substring(0, 3).toUpperCase()
        }
        const generatedCode = `TM-${ip_family}-${typeCode}-${applicantCode}-001`
        if (formData.code !== generatedCode) {
          setFormData(prev => ({ ...prev, code: generatedCode }))
        }
      }
    }

    generateCode()
  }, [formData.ip_family, formData.trademark_type, formData.applicant_id, trademarkTypeOptions, companyOptions])

  const handleGalleryChange = useCallback((data: {
    newFiles: File[]
    existingUrls: string[]
    removedUrls: string[]
    order: { type: 'file' | 'url'; index: number; originalUrl?: string }[]
  }) => {
    setFormData(prev => ({ 
      ...prev, 
      gallery_images: data.newFiles,
      existing_gallery_urls: data.existingUrls,
      removed_gallery_urls: data.removedUrls,
      gallery_order: data.order
    }))
  }, [setFormData])

  const handleNiceClassificationSelect = (selected: Array<{
    id: string
    classNumber: number
    classCode: string
    description: string
    descriptionEn?: string
  }>) => {
    setFormData(prev => ({ ...prev, nice_classifications: selected }))
  }

  const removeNiceClassification = (id: string) => {
    setFormData(prev => ({
      ...prev,
      nice_classifications: prev.nice_classifications.filter(item => item.id !== id)
    }))
  }

  const updateNiceCustomDescription = (id: string, customDescription: string) => {
    setFormData(prev => ({
      ...prev,
      nice_classifications: prev.nice_classifications.map(item =>
        item.id === id ? { ...item, customDescription } : item
      )
    }))
  }

  const handleViennaClassificationSelect = (selected: Array<{
    _id: string
    category: number
    category_desc_vi: string
    category_desc_en: string
    division: string
    division_desc_vi: string
    division_desc_en: string
    section: string
    section_desc_vi: string
    section_desc_en: string
  }>) => {
    setFormData(prev => ({ ...prev, vienna_classifications: selected }))
  }

  const removeViennaClassification = (id: string) => {
    setFormData(prev => ({
      ...prev,
      vienna_classifications: prev.vienna_classifications.filter(item => item._id !== id)
    }))
  }

  // Auto-generate goods_services when nice_classifications changes
  useEffect(() => {
    if (formData.nice_classifications.length === 0) {
      setFormData(prev => ({ ...prev, goods_services: '' }))
      return
    }

    // Group by classNumber
    const grouped = formData.nice_classifications.reduce((acc, item) => {
      if (!acc[item.classNumber]) {
        acc[item.classNumber] = []
      }
      acc[item.classNumber].push(item)
      return acc
    }, {} as Record<number, typeof formData.nice_classifications>)

    // Sort groups by classNumber and generate description
    const sortedGroups = Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b)

    const descriptions = sortedGroups.map(classNumber => {
      const items = grouped[classNumber]
      // Sort items by classCode (convert to string for comparison)
      items.sort((a, b) => String(a.classCode).localeCompare(String(b.classCode)))
      
      // Use customDescription if available, otherwise use default description
      const itemDescriptions = items.map(item => 
        item.customDescription?.trim() || item.description
      ).join('; ')
      
      return `Nhóm ${classNumber}: ${itemDescriptions}.`
    })

    const generatedDescription = descriptions.join('\n')
    setFormData(prev => ({ ...prev, goods_services: generatedDescription }))
  }, [formData.nice_classifications])

  const handleSubmit = async () => {
    // Reset errors
    setErrors({})

    // Validate required fields
    const validationErrors: Record<string, string> = {}

    if (!formData.name) {
      validationErrors.name = 'Tên nhãn hiệu là bắt buộc'
    }

    if (!formData.trademark_type) {
      validationErrors.trademark_type = 'Kiểu nhãn hiệu là bắt buộc'
    }

    if (!formData.ip_family) {
      validationErrors.ip_family = 'Họ nhãn là bắt buộc'
    }

    if (!formData.applicant_id) {
      validationErrors.applicant_id = 'Chủ đơn là bắt buộc'
    }

    if (!formData.agency_id) {
      validationErrors.agency_id = 'Đại diện là bắt buộc'
    }

    if (!formData.country_code) {
      validationErrors.country_code = 'Quốc gia đăng ký là bắt buộc'
    }

    // If there are validation errors, show them and stop
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      // alert('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    setIsSubmitting(true)

    try {
      let uploadedImageUrls: string[] = []

      // Upload images if there are new files
      if (formData.gallery_images.length > 0) {
        const imageFormData = new FormData()
        formData.gallery_images.forEach((file) => {
          imageFormData.append('files', file)
        })

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData,
        })

        const uploadResult = await uploadResponse.json()
        
        if (uploadResult.success) {
          uploadedImageUrls = uploadResult.data.urls
        } else {
          throw new Error('Failed to upload images')
        }
      }

      // Combine uploaded URLs with existing URLs according to gallery_order
      const allImageUrls: string[] = []
      formData.gallery_order.forEach((item) => {
        if (item.type === 'url' && item.originalUrl) {
          allImageUrls.push(item.originalUrl)
        } else if (item.type === 'file') {
          allImageUrls.push(uploadedImageUrls[item.index])
        }
      })

      // Prepare data to send to MongoDB
      const trademarkData = {
        ...formData,
        gallery_images: allImageUrls, // Replace File[] with string[]
        existing_gallery_urls: undefined,
        removed_gallery_urls: undefined,
        gallery_order: undefined,
      }

      const response = await fetch('/api/trademarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trademarkData),
      })

      const result = await response.json()

      if (result.success) {
        alert('Thêm nhãn hiệu thành công!')
        
        // If "Tiếp tục thêm mới" is checked, reset form
        if (formData.continue_adding) {
          setFormData({
            name: '',
            name_upper_ascii: '',
            trademark_type: '',
            status: '',
            wipo_status: '',
            country_code: '',
            ip_family: '',
            code: '',
            application_number: '',
            application_date: '',
            certificate_number: '',
            certificate_date: '',
            expiry_date: '',
            publication_date: '',
            declaration_date: '',
            applicant_id: '',
            agency_id: '',
            authors: '',
            workflow_status: '',
            commercial_statuses: [],
            search_status: '',
            filing_number_1: '',
            filing_date_1: '',
            filing_country_1: '',
            filing_number_2: '',
            filing_date_2: '',
            filing_country_2: '',
            renewal_date_1: '',
            renewal_date_2: '',
            renewal_fee_due_1: '',
            renewal_fee_due_2: '',
            folder_name: '',
            folder_path: '',
            file_format: '',
            file_type: '',
            related_products: [],
            notes: '',
            nice_classifications: [],
            vienna_classifications: [],
            goods_services: '',
            continue_adding: formData.continue_adding,
            gallery_images: [],
            existing_gallery_urls: [],
            removed_gallery_urls: [],
            gallery_order: [],
          })
        } else {
          // Navigate back to trademark list
          window.location.href = '/trademarks'
        }
      } else {
        alert(result.message || 'Có lỗi xảy ra khi thêm nhãn hiệu')
      }
    } catch (error) {
      console.error('Error submitting trademark:', error)
      alert('Có lỗi xảy ra khi thêm nhãn hiệu')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Photo Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Hình ảnh</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploadMulti
            value={formData.gallery_images}
            existingUrls={formData.existing_gallery_urls}
            onChange={handleGalleryChange}
          />
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
                  Tên nhãn hiệu
                </Label>
                <Input
                  id="trademark_name"
                  placeholder="Nhập tên nhãn hiệu"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <InputError message={errors?.name} />
              </div>
              {/* <div>
                <Label htmlFor="name_upper_ascii">
                  Tên không dấu
                </Label>
                <Input
                  id="name_upper_ascii"
                  placeholder="Nhập tên không dấu"
                  value={formData.name_upper_ascii}
                  onChange={(e) => setFormData({ ...formData, name_upper_ascii: e.target.value })}
                />
              </div> */}
              <div>
                <Label htmlFor="ip_family">
                  Họ nhãn
                </Label>
                <SingleSelect
                  instanceId="ip-family"
                  options={ipFamilyOptions} // Will be populated with IP families from MongoDB
                  value={ipFamilyOptions.find(o => o.value === formData.ip_family) || null}
                  onChange={(selected) => setFormData({ ...formData, ip_family: selected?.value as string || '' })}
                  placeholder="Chọn họ nhãn"
                />
                <InputError message={errors?.ip_family} />
              </div>
              
              <div>
                <Label htmlFor="trademark_type">
                  Kiểu nhãn hiệu 
                </Label>
                <SingleSelect
                  instanceId="trademark-type"
                  options={trademarkTypeOptions}
                  value={trademarkTypeOptions.find(o => o.value === formData.trademark_type) || null}
                  onChange={(selected) => setFormData({ ...formData, trademark_type: selected?.value as string || '' })}
                  placeholder="Chọn kiểu nhãn hiệu"
                />
                <InputError message={errors?.trademark_type} />
              </div>
              {/* <div>
                <Label htmlFor="legal_status">
                  Trạng thái pháp lý 
                </Label>
                <SingleSelect
                  instanceId="legal-status"
                  options={statusOptions}
                  value={statusOptions.find(o => o.value === formData.status) || null}
                  onChange={(selected) => setFormData({ ...formData, status: selected?.value as string || '' })}
                  placeholder="Chọn trạng thái pháp lý"
                />
              </div> */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Mã số IP</Label>
                <Input
                  id="code"
                  placeholder="TM-họ nhãn-loại nhãn-chủ đơn-số thứ tự"
                  value={formData.code}
                  readOnly
                  className="bg-muted"
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

      {/* Chủ đơn & Đại diện */}
      <Card>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Chủ đơn & Đại diện</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="applicant">
                  Chủ đơn 
                </Label>
                <SingleSelect
                  instanceId="applicant"
                  options={companyOptions}
                  value={companyOptions.find(o => o.value === formData.applicant_id) || null}
                  onChange={(selected) => setFormData({ ...formData, applicant_id: selected?.value as string || '' })}
                  placeholder="Chọn chủ đơn"
                />
                <InputError message={errors?.applicant_id} />
              </div>
              <div>
                <Label htmlFor="agency">
                  Đại diện 
                </Label>
                <SingleSelect
                  instanceId="agency"
                  options={agencyOptions}
                  value={agencyOptions.find(o => o.value === formData.agency_id) || null}
                  onChange={(selected) => setFormData({ ...formData, agency_id: selected?.value as string || '' })}
                  placeholder="Chọn đại diện"
                />
                <InputError message={errors?.agency_id} />
              </div>
            </div>
            <div>
              <Label htmlFor="authors">Tác giả</Label>
              <Textarea
                id="authors"
                placeholder="Nhập thông tin tác giả"
                value={formData.authors}
                onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thông tin đơn */}
      <Card>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Thông tin đơn</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="registration_country">
                  Quốc gia đăng ký
                </Label>
                <SingleSelect
                  instanceId="registration-country"
                  options={countryOptions}
                  value={countryOptions.find(o => o.value === formData.country_code) || null}
                  onChange={(selected) => setFormData({ ...formData, country_code: selected?.value as string || '' })}
                  placeholder="Chọn quốc gia"
                />
                <InputError message={errors?.country_code} />
              </div>
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
                <DatePickerSingle
                  value={formData.application_date}
                  onChange={(value) => setFormData({ ...formData, application_date: value })}
                  placeholder="Chọn ngày nộp đơn"
                />
              </div>
              <div>
                <Label htmlFor="registration_number">Số VB</Label>
                <Input
                  id="registration_number"
                  placeholder="Nhập số văn bằng"
                  value={formData.certificate_number}
                  onChange={(e) => setFormData({ ...formData, certificate_number: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="registration_date">Ngày cấp</Label>
                <DatePickerSingle
                  value={formData.certificate_date}
                  onChange={(value) => setFormData({ ...formData, certificate_date: value })}
                  placeholder="Chọn ngày cấp"
                />
              </div>
              <div>
                <Label htmlFor="expiry_date">Ngày hết hạn</Label>
                <DatePickerSingle
                  value={formData.expiry_date}
                  onChange={(value) => setFormData({ ...formData, expiry_date: value })}
                  placeholder="Chọn ngày hết hạn"
                />
              </div>
              <div>
                <Label htmlFor="publication_date">Ngày công bố</Label>
                <DatePickerSingle
                  value={formData.publication_date}
                  onChange={(value) => setFormData({ ...formData, publication_date: value })}
                  placeholder="Chọn ngày công bố"
                />
              </div>
              <div>
                <Label htmlFor="declaration_date">Ngày tuyên bố sử dụng</Label>
                <DatePickerSingle
                  value={formData.declaration_date}
                  onChange={(value) => setFormData({ ...formData, declaration_date: value })}
                  placeholder="Chọn ngày tuyên bố"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Trạng thái */}
      <Card>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Trạng thái</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="status">
                  Trạng thái nội bộ
                </Label>
                <SingleSelect
                  instanceId="status"
                  options={statusOptions}
                  value={statusOptions.find(o => o.value === formData.status) || null}
                  onChange={(selected) => setFormData({ ...formData, status: selected?.value as string || '' })}
                  placeholder="Chọn trạng thái"
                />
              </div>
              <div>
                <Label htmlFor="wipo_status">
                  Trạng thái của cục SHTT
                </Label>
                <SingleSelect
                  instanceId="wipo_status"
                  options={[]}
                  onChange={(selected) => setFormData({ ...formData, wipo_status: selected?.value as string || '' })}
                  placeholder="Chọn trạng thái"
                />
              </div>
              
              <div>
                <Label htmlFor="commercial_status">
                  Tình trạng thương mại
                </Label>
                <MultiSelect
                  instanceId="commercial-status"
                  options={commercialStatusOptions}
                  value={(formData.commercial_statuses || []).map((value: string) => {
                      const tag = commercialStatusOptions.find(t => t.value === value.toString());
                      return tag ? { value: tag.value, label: tag.label } : { value: value, label: value };
                  })}
                  onChange={(selectedOptions) => {
                      const selectedValues = selectedOptions.map(option => String(option.value));
                      setFormData({ ...formData, commercial_statuses: selectedValues });
                  }}
                  placeholder={"Chọn tình trạng thương mại"}
                />
              </div>
              {/* <div>
                <Label htmlFor="search_status">
                  Tình trạng tra cứu
                </Label>
                <SingleSelect
                  instanceId="search-status"
                  options={searchStatusOptions}
                  value={searchStatusOptions.find(o => o.value === formData.search_status) || null}
                  onChange={(selected) => setFormData({ ...formData, search_status: selected?.value as string || '' })}
                  placeholder="Chọn tình trạng tra cứu"
                />
              </div> */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phân loại Nice & Vienna */}
      <Card>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Phân loại Nice & Vienna</h3>
            
            {/* Nice Classification */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Phân loại Nice</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNiceSearch(true)}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Tìm kiếm phân loại Nice
                </Button>
              </div>
              
              {formData.nice_classifications.length > 0 ? (
                <div className="space-y-2">
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-2 font-semibold text-sm w-[150px]">Mã nhóm</th>
                          <th className="text-left p-2 font-semibold text-sm">Tên hàng hóa mặc định</th>
                          <th className="text-left p-2 font-semibold text-sm">Tên hàng hóa sửa đổi</th>
                          <th className="text-center p-2 font-semibold text-sm w-[80px]">Xóa</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {formData.nice_classifications.map((item, index) => (
                          <tr key={item.id} className="hover:bg-muted/50">
                            <td className="p-2">
                              <span className="font-semibold text-sm">
                                {item.classCode}
                              </span>
                            </td>
                            <td className="p-2">
                              <span className="text-sm text-muted-foreground">
                                {item.description}
                              </span>
                            </td>
                            <td className="p-2 text-left">
                              <Input
                                placeholder="Nhập tên hàng hóa sửa đổi (nếu có)"
                                className="text-sm"
                                value={item.customDescription || ''}
                                onChange={(e) => updateNiceCustomDescription(item.id, e.target.value)}
                              />
                            </td>
                            <td className="p-2 text-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeNiceClassification(item.id)}
                                className="hover:bg-destructive/20 hover:text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Đã chọn {formData.nice_classifications.length} phân loại
                  </p>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Chưa có phân loại Nice nào được chọn
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNiceSearch(true)}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Thêm phân loại
                  </Button>
                </div>
              )}
            </div>
            {/* Goods and Services Description */}
            <div>
              <Label htmlFor="goods_services">Mô tả hàng hóa/dịch vụ (Tự động tạo từ phân loại Nice)</Label>
              <Textarea
                id="goods_services"
                placeholder="Mô tả sẽ được tạo tự động khi bạn chọn phân loại Nice..."
                value={formData.goods_services}
                readOnly
                className="bg-muted"
                rows={6}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Nội dung được tạo tự động từ các phân loại Nice đã chọn. Bạn có thể sửa tên hàng hóa trong bảng phía trên.
              </p>
            </div>

            {/* Vienna Classification */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Phân loại Vienna</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowViennaSearch(true)}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Tìm kiếm phân loại Vienna
                </Button>
              </div>
              
              {formData.vienna_classifications.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {formData.vienna_classifications.map((item) => (
                      <Badge
                        key={item._id}
                        variant="secondary"
                        className="px-3 py-1.5 text-sm flex items-center gap-2"
                      >
                        <span className="font-semibold">
                          {item.section}
                        </span>
                        <span className="text-muted-foreground">-</span>
                        <span className="max-w-[300px] truncate">
                          {item.section_desc_vi}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeViennaClassification(item._id)}
                          className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Đã chọn {formData.vienna_classifications.length} phân loại
                  </p>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Chưa có phân loại Vienna nào được chọn
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowViennaSearch(true)}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Thêm phân loại
                  </Button>
                </div>
              )}
            </div>

            
          </div>
        </CardContent>
      </Card>

      {/* Nice Classification Search Modal */}
      <NiceClassificationSearch
        open={showNiceSearch}
        onOpenChange={setShowNiceSearch}
        onSelect={handleNiceClassificationSelect}
        selectedItems={formData.nice_classifications}
      />

      {/* Vienna Classification Search Modal */}
      <ViennaClassificationSearch
        open={showViennaSearch}
        onOpenChange={setShowViennaSearch}
        onSelect={handleViennaClassificationSelect}
        selectedItems={formData.vienna_classifications}
      />

      {/* IP Family */}
      {/* <Card>
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
                  value={registrationMethodOptions.find(o => o.value === formData.agency_id) || null}
                  onChange={(selected) => setFormData({ ...formData, agency_id: selected?.value as string || '' })}
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
      </Card> */}

      {/* Lịch sử gia hạn */}
      <Card>
        <CardContent >
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Lịch sử gia hạn</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="renewal_date_1">Ngày gia hạn lần 1</Label>
                <DatePickerSingle
                  value={formData.renewal_date_1}
                  onChange={(value) => setFormData({ ...formData, renewal_date_1: value })}
                  placeholder="Chọn ngày gia hạn"
                />
              </div>
              <div>
                <Label htmlFor="renewal_fee_due_1">Ngày hết hạn gia hạn lần 1</Label>
                <DatePickerSingle
                  value={formData.renewal_fee_due_1}
                  onChange={(value) => setFormData({ ...formData, renewal_fee_due_1: value })}
                  placeholder="Chọn ngày hết hạn"
                />
              </div>
              <div>
                <Label htmlFor="renewal_date_2">Ngày gia hạn lần 2</Label>
                <DatePickerSingle
                  value={formData.renewal_date_2}
                  onChange={(value) => setFormData({ ...formData, renewal_date_2: value })}
                  placeholder="Chọn ngày gia hạn"
                />
              </div>
              <div>
                <Label htmlFor="renewal_fee_due_2">Ngày hết hạn gia hạn lần 2</Label>
                <DatePickerSingle
                  value={formData.renewal_fee_due_2}
                  onChange={(value) => setFormData({ ...formData, renewal_fee_due_2: value })}
                  placeholder="Chọn ngày hết hạn"
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
              <MultiSelect
              instanceId="related-products"
              options={relatedProductOptions}
              value={(formData.related_products || []).map((value: string) => {
                const product = relatedProductOptions.find(p => p.value === value.toString());
                return product ? { value: product.value, label: product.label } : { value: value, label: value };
              })}
              onChange={(selectedOptions) => {
                const selectedValues = selectedOptions.map(option => String(option.value));
                setFormData({ ...formData, related_products: selectedValues });
              }}
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
          <Button variant="outline" size="default" disabled={isSubmitting}>
            Hủy
          </Button>
          <Button 
            variant="default" 
            size="default"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Đang xử lý...' : 'Thêm mới'}
          </Button>
        </div>
      </div>
    </div>
  )
}
