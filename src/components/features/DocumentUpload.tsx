import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  FileText,
  Image,
  X,
  Check,
  AlertCircle,
  Loader2,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useUploadDocument, useDeleteDocument, type DocumentInfo } from '@/hooks'
import { toast } from 'sonner'

interface DocumentUploadProps {
  documentType: 'id_document' | 'proof_of_address'
  title: string
  description: string
  existingDocument?: DocumentInfo | null
  onUploadComplete?: () => void
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']

export function DocumentUpload({
  documentType,
  title,
  description,
  existingDocument,
  onUploadComplete,
}: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const uploadDocument = useUploadDocument()
  const deleteDocument = useDeleteDocument()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Please upload a JPEG, PNG, WebP image or PDF file'
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File is too large. Maximum size is 10MB'
    }
    return null
  }

  const handleFile = (file: File) => {
    const error = validateFile(file)
    if (error) {
      toast.error(error)
      return
    }

    setSelectedFile(file)

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      await uploadDocument.mutateAsync({
        file: selectedFile,
        documentType,
      })
      toast.success('Document uploaded successfully!')
      setSelectedFile(null)
      setPreviewUrl(null)
      onUploadComplete?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload document')
    }
  }

  const handleDelete = async () => {
    if (!existingDocument) return

    try {
      await deleteDocument.mutateAsync(existingDocument.id)
      toast.success('Document removed')
    } catch (error) {
      toast.error('Failed to remove document')
    }
  }

  const handleCancelSelection = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Show existing document
  if (existingDocument && !selectedFile) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg',
                existingDocument.status === 'verified'
                  ? 'bg-green-100 text-green-600'
                  : existingDocument.status === 'rejected'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-primary-100 text-primary-600'
              )}
            >
              {existingDocument.status === 'verified' ? (
                <Check className="h-5 w-5" />
              ) : existingDocument.status === 'rejected' ? (
                <AlertCircle className="h-5 w-5" />
              ) : (
                <FileText className="h-5 w-5" />
              )}
            </div>
            <div>
              <h4 className="font-medium text-neutral-900">{title}</h4>
              <p className="text-sm text-neutral-500">{existingDocument.file_name}</p>
              <p className="text-xs text-neutral-400">
                {formatFileSize(existingDocument.file_size)} - Uploaded{' '}
                {new Date(existingDocument.uploaded_at).toLocaleDateString()}
              </p>
              {existingDocument.status === 'rejected' && existingDocument.rejection_reason && (
                <p className="mt-1 text-xs text-red-500">{existingDocument.rejection_reason}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleteDocument.isPending}
            >
              {deleteDocument.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        {existingDocument.status === 'pending' && (
          <div className="mt-3 rounded-lg bg-amber-50 p-2">
            <p className="text-xs text-amber-700">Pending verification</p>
          </div>
        )}
        {existingDocument.status === 'verified' && (
          <div className="mt-3 rounded-lg bg-green-50 p-2">
            <p className="text-xs text-green-700">Document verified</p>
          </div>
        )}
      </div>
    )
  }

  // Show selected file pending upload
  if (selectedFile) {
    return (
      <div className="rounded-xl border border-primary-200 bg-primary-50 p-4">
        <div className="flex items-start gap-3">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="h-16 w-16 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white">
              <FileText className="h-8 w-8 text-primary-500" />
            </div>
          )}
          <div className="flex-1">
            <h4 className="font-medium text-neutral-900">{title}</h4>
            <p className="text-sm text-neutral-600">{selectedFile.name}</p>
            <p className="text-xs text-neutral-500">{formatFileSize(selectedFile.size)}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            onClick={handleUpload}
            disabled={uploadDocument.isPending}
            className="flex-1"
          >
            {uploadDocument.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleCancelSelection}
            disabled={uploadDocument.isPending}
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  // Show drop zone
  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative rounded-xl border-2 border-dashed p-6 transition-colors',
        isDragging
          ? 'border-primary-500 bg-primary-50'
          : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'
      )}
    >
      <input
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleFileSelect}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
      <div className="flex flex-col items-center text-center">
        <div
          className={cn(
            'mb-3 flex h-12 w-12 items-center justify-center rounded-full',
            isDragging ? 'bg-primary-100' : 'bg-neutral-100'
          )}
        >
          {documentType === 'id_document' ? (
            <FileText className={cn('h-6 w-6', isDragging ? 'text-primary-600' : 'text-neutral-500')} />
          ) : (
            <Image className={cn('h-6 w-6', isDragging ? 'text-primary-600' : 'text-neutral-500')} />
          )}
        </div>
        <h4 className="font-medium text-neutral-900">{title}</h4>
        <p className="mt-1 text-sm text-neutral-500">{description}</p>
        <p className="mt-2 text-xs text-neutral-400">
          Drag & drop or click to select - JPEG, PNG, PDF (max 10MB)
        </p>
      </div>
    </div>
  )
}

interface DocumentUploadSectionProps {
  onComplete?: () => void
}

export function DocumentUploadSection({ onComplete }: DocumentUploadSectionProps) {
  const { data: documentStatus, isLoading, refetch } = useDocumentStatus()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
      </div>
    )
  }

  const handleUploadComplete = () => {
    refetch()
    if (documentStatus?.all_uploaded) {
      onComplete?.()
    }
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-neutral-900">Required Documents</h3>
        <p className="text-sm text-neutral-500">
          Please upload the following documents to complete your application
        </p>
      </div>

      <DocumentUpload
        documentType="id_document"
        title="ID Document"
        description="Upload a clear photo of your SA ID card or passport"
        existingDocument={documentStatus?.documents.id_document}
        onUploadComplete={handleUploadComplete}
      />

      <DocumentUpload
        documentType="proof_of_address"
        title="Proof of Address"
        description="Upload a utility bill or bank statement (not older than 3 months)"
        existingDocument={documentStatus?.documents.proof_of_address}
        onUploadComplete={handleUploadComplete}
      />

      {documentStatus?.all_uploaded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-green-50 p-4"
        >
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            <p className="font-medium text-green-700">All documents uploaded!</p>
          </div>
          <p className="mt-1 text-sm text-green-600">
            Your documents will be verified shortly.
          </p>
        </motion.div>
      )}
    </div>
  )
}
