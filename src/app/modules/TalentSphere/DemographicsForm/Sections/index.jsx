"use client"

import React from "react"
import { Button } from "components/ui/button"
import { errorClassName } from "components/FormControl"
import {
  saveUpdateDemographicSection,
  saveUpdateDemographicField,
  deleteDemographicSection,
  deleteDemographicField,
} from "app/hooks/talentSphere"
import { toast } from "react-toastify"

// Utility functions for temporary IDs
const generateTempId = () => `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

const isTempId = (id) => typeof id === 'string' && id.startsWith('temp_')

const AddNewSection = React.memo(({ name, onChange = () => {}, value = [], error, formId }) => {
  const [isAdding, setIsAdding] = React.useState(false)

  const handleClick = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    setIsAdding(true)
    try {
      // Create new section with temporary ID
      const newSectionData = {
        id: generateTempId(), // Generate temporary ID
        heading: "New Section",
        description: "",
        order: (value?.length || 0) + 1,
        form: formId || null, // Will be null for new forms
        fields: [],
      }

      // Add to local state immediately
      const updatedSections = [...(value || []), newSectionData]
      onChange(name, updatedSections)
      
      toast.success("Section added successfully")
    } catch (error) {
      console.error("Error adding section:", error)
      toast.error("Failed to add section")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div>
      <Button variant="outline" onClick={handleClick} disabled={isAdding}>
        {isAdding ? "Adding..." : "Add Section"}
      </Button>
      <div className={errorClassName}>{error}</div>
    </div>
  )
})

// AddNewSectionField Component
const AddNewSectionField = React.memo(({ name, onChange = () => {}, value = [], error, sectionId }) => {
  const [isAdding, setIsAdding] = React.useState(false)

  const handleClick = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    setIsAdding(true)
    try {
      // Create new field with temporary ID
      const newFieldData = {
        id: generateTempId(), // Generate temporary ID
        label: "New Field",
        field_type: "text",
        required: false,
        attachment_required: false,
        options: null,
        order: (value?.length || 0) + 1,
        section: sectionId || null, // Can be temp ID or null
      }

      // Add to local state immediately
      const updatedFields = [...(value || []), newFieldData]
      onChange(name, updatedFields)
      
      toast.success("Field added successfully")
    } catch (error) {
      console.error("Error adding field:", error)
      toast.error("Failed to add field")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div>
      <Button variant="outline" onClick={handleClick} disabled={isAdding}>
        {isAdding ? "Adding..." : "Add Field"}
      </Button>
      <div className={errorClassName}>{error}</div>
    </div>
  )
})

const RemoveSection = React.memo(({ name, onChange = () => {}, section, index, error, type = "section" }) => {
  const [isRemoving, setIsRemoving] = React.useState(false)

  const handleClick = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    setIsRemoving(true)
    try {
      // Only delete from backend if it's not a temporary ID
      if (section?.id && !isTempId(section.id) && typeof section.id === "number") {
        if (type === "section") {
          const deleted = await deleteDemographicSection(section.id)
          if (!deleted) throw new Error("Failed to delete section")
          toast.success("Section deleted successfully")
        } else if (type === "field") {
          const deleted = await deleteDemographicField(section.id)
          if (!deleted) throw new Error("Failed to delete field")
          toast.success("Field deleted successfully")
        }
      } else {
        // For temporary items, just show local removal message
        toast.success(`${type === "section" ? "Section" : "Field"} removed successfully`)
      }

      // Remove locally from form state
      const formValues = onChange.formik?.values || {}
      const pathParts = name.split(".")
      let currentValue = formValues

      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i]
        if (part.includes("[") && part.includes("]")) {
          const [arrayName, arrayIndex] = part.split("[")
          const cleanIndex = arrayIndex.replace("]", "")
          currentValue = currentValue[arrayName]?.[Number.parseInt(cleanIndex)]
        } else {
          currentValue = currentValue[part]
        }
      }

      const finalKey = pathParts[pathParts.length - 1]
      const currentArray = currentValue?.[finalKey] || []

      const updatedArray = currentArray.filter((_, i) => i !== index)
      onChange(name, updatedArray)
    } catch (error) {
      console.error("Error removing:", error)
      toast.error("Failed to remove item")
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <div className="flex justify-end">
      <Button variant="destructive" size="sm" onClick={handleClick} disabled={isRemoving}>
        {isRemoving ? "Removing..." : "Remove"}
      </Button>
      <div className={errorClassName}>{error}</div>
    </div>
  )
})

export { AddNewSection, AddNewSectionField, RemoveSection }