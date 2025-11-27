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

interface ViennaClass {
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
}

interface ViennaClassificationSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (selected: ViennaClass[]) => void
  selectedItems?: ViennaClass[]
}

export default function ViennaClassificationSearch({
  open,
  onOpenChange,
  onSelect,
  selectedItems = []
}: ViennaClassificationSearchProps) {
  const [searchText, setSearchText] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<ViennaClass[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())
  const [expandedDivisions, setExpandedDivisions] = useState<Set<string>>(new Set())
  const [tempSelected, setTempSelected] = useState<ViennaClass[]>([])
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (open) {
      setTempSelected([...selectedItems])
    }
  }, [open, selectedItems])

  // Auto search with debounce
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    if (!searchText.trim()) {
      setSearchResults([])
      return
    }

    const timeout = setTimeout(() => {
      performSearch()
    }, 500)

    setSearchTimeout(timeout)

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [searchText])

  const performSearch = async () => {
    if (!searchText.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const params = new URLSearchParams()
      params.append('search', searchText)

      const response = await fetch(`/api/mongodb/vienna-classes?${params.toString()}`)
      const result = await response.json()
      
      if (result.success) {
        setSearchResults(result.data)
        // Auto-expand all categories and divisions that have results
        const categories = new Set<number>()
        const divisions = new Set<string>()
        result.data.forEach((item: ViennaClass) => {
          categories.add(item.category)
          divisions.add(`${item.category}-${item.division}`)
        })
        setExpandedCategories(categories)
        setExpandedDivisions(divisions)
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error('Error searching vienna classes:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const toggleCategory = (category: number) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const toggleDivision = (categoryDivisionKey: string) => {
    const newExpanded = new Set(expandedDivisions)
    if (newExpanded.has(categoryDivisionKey)) {
      newExpanded.delete(categoryDivisionKey)
    } else {
      newExpanded.add(categoryDivisionKey)
    }
    setExpandedDivisions(newExpanded)
  }

  const toggleSelectSection = (viennaClass: ViennaClass) => {
    const isSelected = tempSelected.some(item => item._id === viennaClass._id)
    
    if (isSelected) {
      setTempSelected(tempSelected.filter(item => item._id !== viennaClass._id))
    } else {
      setTempSelected([...tempSelected, viennaClass])
    }
  }

  const handleConfirm = () => {
    onSelect(tempSelected)
    onOpenChange(false)
  }

  const handleClear = () => {
    setSearchText("")
    setSearchResults([])
    setExpandedCategories(new Set())
    setExpandedDivisions(new Set())
    setTempSelected([])
  }

  // Group results by category and division
  const groupedResults = searchResults.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = {
        category_desc_vi: item.category_desc_vi,
        divisions: {}
      }
    }
    
    const divisionKey = item.division
    if (!acc[item.category].divisions[divisionKey]) {
      acc[item.category].divisions[divisionKey] = {
        division_desc_vi: item.division_desc_vi,
        sections: []
      }
    }
    
    acc[item.category].divisions[divisionKey].sections.push(item)
    
    return acc
  }, {} as Record<number, { 
    category_desc_vi: string
    divisions: Record<string, { 
      division_desc_vi: string
      sections: ViennaClass[] 
    }>
  }>)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl sm:max-w-[900px] h-[90vh] flex flex-col p-6">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Tìm kiếm phân loại Vienna</DialogTitle>
          <DialogDescription className="sr-only">
            Tìm kiếm theo mô tả phân loại Vienna
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search Input */}
          <div className="flex-shrink-0">
            <Label htmlFor="vienna-search">Tìm kiếm</Label>
            <Input
              id="vienna-search"
              placeholder="Nhập từ khóa tìm kiếm..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* Search Actions */}
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="outline" onClick={handleClear}>
              Xóa bộ lọc
            </Button>
          </div>

          {/* Selected Items Summary */}
          {tempSelected.length > 0 && (
            <div className="p-3 bg-muted rounded-md flex-shrink-0">
              <p className="text-sm font-medium mb-2">
                Đã chọn: {tempSelected.length} phân loại
              </p>
              <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                {tempSelected.map((item) => (
                  <Badge key={item._id} variant="secondary" className="text-xs">
                    {item.section}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          <div className="flex-1 min-h-0 border rounded-md overflow-hidden">
            <ScrollArea className="h-full p-4">
              {isSearching ? (
                <div className="text-center text-muted-foreground py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>Đang tìm kiếm...</p>
                </div>
              ) : Object.keys(groupedResults).length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p>Nhập từ khóa để tìm kiếm và hiển thị kết quả</p>
                  <p className="text-sm mt-2">Tìm kiếm theo mô tả phân loại Vienna</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupedResults).map(([category, categoryData]) => {
                    const categoryNum = parseInt(category)
                    const isCategoryExpanded = expandedCategories.has(categoryNum)

                    return (
                      <div key={category} className="border rounded-lg p-3 bg-card">
                        {/* Category Header */}
                        <div
                          className="flex items-start gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
                          onClick={() => toggleCategory(categoryNum)}
                        >
                          {isCategoryExpanded ? (
                            <ChevronDown className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                          ) : (
                            <ChevronRight className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <span className="font-semibold text-base">
                              Nhóm {category}:
                            </span>
                            <span className="text-sm ml-2">{categoryData.category_desc_vi}</span>
                          </div>
                        </div>

                        {/* Divisions */}
                        {isCategoryExpanded && (
                          <div className="mt-2 ml-6 space-y-3">
                            {Object.entries(categoryData.divisions).map(([division, divisionData]) => {
                              const divisionKey = `${category}-${division}`
                              const isDivisionExpanded = expandedDivisions.has(divisionKey)

                              return (
                                <div key={divisionKey} className="border-l-2 border-muted pl-3">
                                  {/* Division Header */}
                                  <div
                                    className="flex items-start gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
                                    onClick={() => toggleDivision(divisionKey)}
                                  >
                                    {isDivisionExpanded ? (
                                      <ChevronDown className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    )}
                                    <div className="flex-1">
                                      <span className="font-semibold text-sm">
                                        {division}:
                                      </span>
                                      <span className="text-sm ml-2">{divisionData.division_desc_vi}</span>
                                    </div>
                                  </div>

                                  {/* Sections */}
                                  {isDivisionExpanded && (
                                    <div className="mt-2 ml-4 space-y-2">
                                      {divisionData.sections.map((section) => {
                                        const isSelected = tempSelected.some(item => item._id === section._id)
                                        
                                        return (
                                          <div
                                            key={section._id}
                                            className={`p-2 rounded-lg border-2 cursor-pointer transition-all ${
                                              isSelected
                                                ? 'bg-primary/10 border-primary shadow-sm'
                                                : 'hover:bg-muted/50 border-border'
                                            }`}
                                            onClick={() => toggleSelectSection(section)}
                                          >
                                            <div className="flex items-start justify-between gap-3">
                                              <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                  <p className="font-semibold text-sm">
                                                    {section.section}
                                                  </p>
                                                  {isSelected && (
                                                    <Badge variant="default" className="text-xs">
                                                      ✓ Đã chọn
                                                    </Badge>
                                                  )}
                                                </div>
                                                <p className="text-sm leading-relaxed">
                                                  {section.section_desc_vi}
                                                </p>
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
