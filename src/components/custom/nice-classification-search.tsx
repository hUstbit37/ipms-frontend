"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Search, Loader2, ChevronDown, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import SingleSelect from "@/components/custom/select/single-select"

interface NiceGroup {
  label: string
  value: string
  classNumber: number
  description: string
  descriptionEn?: string
  type?: string
}

interface NiceClass {
  id: string
  classNumber: number
  classCode: string
  description: string
  descriptionEn?: string
}

interface NiceClassificationSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (selected: NiceClass[]) => void
  selectedItems?: NiceClass[]
}

export default function NiceClassificationSearch({
  open,
  onOpenChange,
  onSelect,
  selectedItems = []
}: NiceClassificationSearchProps) {
  const [groupSearch, setGroupSearch] = useState("")
  const [productSearch, setProductSearch] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [niceGroups, setNiceGroups] = useState<NiceGroup[]>([])
  const [searchResults, setSearchResults] = useState<Record<number, NiceClass[]>>({})
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set())
  const [tempSelected, setTempSelected] = useState<NiceClass[]>([])
  const [classOptions, setClassOptions] = useState<{ label: string; value: string }[]>([])
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

  // Load all Nice groups on mount
  useEffect(() => {
    if (open) {
      loadNiceGroups()
      setTempSelected([...selectedItems])
      
      // Generate class options 1-45
      const options = Array.from({ length: 45 }, (_, i) => ({
        label: `Nhóm ${i + 1}`,
        value: String(i + 1)
      }))
      setClassOptions(options)
    }
  }, [open])

  const loadNiceGroups = async () => {
    try {
      const response = await fetch('/api/mongodb/nice-groups')
      const result = await response.json()
      if (result.success) {
        setNiceGroups(result.data)
      }
    } catch (error) {
      console.error('Error loading nice groups:', error)
    }
  }

  const performSearch = async () => {
    if (!groupSearch && !productSearch) {
      setSearchResults({})
      return
    }

    setIsSearching(true)
    try {
      const params = new URLSearchParams()
      
      if (groupSearch) {
        params.append('class_number', groupSearch)
      }
      
      if (productSearch) {
        params.append('search', productSearch)
      }

      const response = await fetch(`/api/mongodb/nice-classes?${params.toString()}`)
      const result = await response.json()
      
      if (result.success) {
        setSearchResults(result.data.grouped)
        // Auto-expand groups that have results
        const groupsWithResults = Object.keys(result.data.grouped).map(Number)
        setExpandedGroups(new Set(groupsWithResults))
      } else {
        console.error('Search error:', result.message)
        setSearchResults({})
      }
    } catch (error) {
      console.error('Error searching nice classes:', error)
      setSearchResults({})
    } finally {
      setIsSearching(false)
    }
  }

  // Auto search with debounce
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    const timeout = setTimeout(() => {
      performSearch()
    }, 500) // 500ms debounce

    setSearchTimeout(timeout)

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [groupSearch, productSearch])

  const toggleGroup = (classNumber: number) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(classNumber)) {
      newExpanded.delete(classNumber)
    } else {
      newExpanded.add(classNumber)
    }
    setExpandedGroups(newExpanded)
  }

  const toggleSelectClass = (niceClass: NiceClass) => {
    const isSelected = tempSelected.some(item => item.id === niceClass.id)
    
    if (isSelected) {
      setTempSelected(tempSelected.filter(item => item.id !== niceClass.id))
    } else {
      setTempSelected([...tempSelected, niceClass])
    }
  }

  const handleConfirm = () => {
    onSelect(tempSelected)
    onOpenChange(false)
  }

  const handleClear = () => {
    setGroupSearch("")
    setProductSearch("")
    setSearchResults({})
    setExpandedGroups(new Set())
    setTempSelected([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-9xl sm:max-w-[900px] h-[90vh] flex flex-col p-6">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Tìm kiếm phân loại Nice</DialogTitle>
          <DialogDescription className="sr-only">
            Tìm kiếm theo số nhóm hoặc tên hàng hóa/dịch vụ
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-shrink-0">
            <div>
              <Label htmlFor="group-search">Tìm theo số nhóm (1-45)</Label>
              <SingleSelect
                instanceId="nice-group-search"
                options={classOptions}
                value={classOptions.find(o => o.value === groupSearch) || null}
                onChange={(selected) => setGroupSearch(selected?.value?.toString() || '')}
                placeholder="Chọn nhóm..."
                isClearable
              />
            </div>

            <div>
              <Label htmlFor="product-search">Tìm theo tên hàng hóa</Label>
              <Input
                id="product-search"
                placeholder="Nhập tên hàng hóa/dịch vụ..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Search Actions */}
          {/* <div className="flex gap-2 flex-shrink-0">
            <Button variant="outline" onClick={handleClear}>
              Xóa bộ lọc
            </Button>
          </div> */}

          {/* Selected Items Summary */}
          {tempSelected.length > 0 && (
            <div className="p-2 bg-muted rounded-md flex-shrink-0">
              <p className="text-sm font-medium ">
                Đã chọn: {tempSelected.length} phân loại
              </p>
              <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                {tempSelected.map((item) => (
                  <Badge key={item.id} variant="secondary" className="text-xs">
                    {item.classCode}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          <div className="flex-1 min-h-0 border rounded-md overflow-hidden">
            <ScrollArea className="h-full p-2">
            {isSearching ? (
              <div className="text-center text-muted-foreground py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p>Đang tìm kiếm...</p>
              </div>
            ) : Object.keys(searchResults).length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                <p>Nhập từ khóa để tìm kiếm và hiển thị kết quả</p>
                <p className="text-sm mt-2">Bạn có thể tìm theo số nhóm hoặc tên hàng hóa/dịch vụ</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(searchResults).map(([classNumber, classes]) => {
                  const group = niceGroups.find(g => g.classNumber === parseInt(classNumber))
                  const isExpanded = expandedGroups.has(parseInt(classNumber))

                  return (
                    <div key={classNumber} className="border rounded-lg p-2 bg-card">
                      {/* Group Header */}
                      <div
                        className="flex items-start gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
                        onClick={() => toggleGroup(parseInt(classNumber))}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                        ) : (
                          <ChevronRight className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 space-y-2">
                          <div >
                            <span className="font-semibold text-base">
                              Nhóm {classNumber} : 
                            </span>
                            <span className=" text-xs">{group?.description}</span> 
                          </div>
                          
                        </div>
                      </div>

                      {/* Class Details */}
                      {isExpanded && (
                        <div className="mt-2 ml-4 space-y-2">
                          {classes.map((niceClass) => {
                            const isSelected = tempSelected.some(item => item.id === niceClass.id)
                            
                            return (
                              <div
                                key={niceClass.id}
                                className={`p-2 rounded-lg border-2 cursor-pointer transition-all ${ 
                                  isSelected
                                    ? 'bg-primary/10 border-primary shadow-sm'
                                    : 'hover:bg-muted/50 border-border'
                                }`}
                                onClick={() => toggleSelectClass(niceClass)}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                      <p className="font-semibold text-xs">
                                        {niceClass.classCode}
                                      </p>
                                      {isSelected && (
                                        <Badge variant="default" className="text-xs">
                                          ✓ Đã chọn
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-sm leading-relaxed">
                                        <span className="font-medium"></span> {niceClass.description}
                                      </p>
                                      {/* {niceClass.descriptionEn && (
                                        <p className="text-xs text-muted-foreground italic leading-relaxed">
                                          <span className="font-medium">Description:</span> {niceClass.descriptionEn}
                                        </p>
                                      )} */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
            </ScrollArea>
          </div>

          {/* Dialog Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirm}>
              Xác nhận ({tempSelected.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
