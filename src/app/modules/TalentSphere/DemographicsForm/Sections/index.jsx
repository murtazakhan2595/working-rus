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

const generateTempId = () => `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

const isTempId = (id) => typeof id === 'string' && id.startsWith('temp_')

const AddNewSection = React.memo(({ name, onChange = () => {}, value = [], error, formId }) => {
  const [isAdding, setIsAdding] = React.useState(false)

  const handleClick = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    setIsAdding(true)
    try {
      const newSectionData = {
        id: generateTempId(), 
        heading: "",
        description: "",
        order: (value?.length || 0) + 1,
        form: formId || null,
        fields: [],
      }

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

const AddNewSectionField = React.memo(({ name, onChange = () => {}, value = [], error, sectionId }) => {
  const [isAdding, setIsAdding] = React.useState(false)

  const handleClick = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    setIsAdding(true)
    try {
      const newFieldData = {
        id: generateTempId(), 
        label: "",
        field_type: "text",
        required: false,
        attachment_required: false,
        options: null,
        order: (value?.length || 0) + 1,
        section: sectionId || null, 
      }

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

const RemoveSection = React.memo(({ name, onChange = () => {}, value = [], index, section, type = "section" }) => {
  const [isRemoving, setIsRemoving] = React.useState(false)

  const handleClick = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    setIsRemoving(true)

    try {
      if (section?.id && !isTempId(section.id) && typeof section.id === "number") {
        if (type === "section") {
          await deleteDemographicSection(section.id)
          toast.success("Section deleted successfully")
        } else if (type === "field") {
          await deleteDemographicField(section.id)
          toast.success("Field deleted successfully")
        }
      } else {
        toast.success(`${type === "section" ? "Section" : "Field"} removed successfully`)
      }

      const updatedArray = value.filter((_, i) => i !== index)
      if (type === "section") {
        onChange(name, updatedArray)
      } else if (type === "field") {
        onChange(updatedArray)
      }
    } catch (error) {
      console.error("Error removing:", error)
      toast.error("Failed to remove item")
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleClick}
      disabled={isRemoving}
    >
      {isRemoving ? "Removing..." : "Remove"}
    </Button>
  )
})


export { AddNewSection, AddNewSectionField, RemoveSection }