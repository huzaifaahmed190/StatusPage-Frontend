import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { setPages, addPage, removePage, setLoading } from '@/features/statusPages/statusPagesSlice'
import { fetchPages, createPage, deletePage } from '@/features/statusPages/statusPagesAPI'
import StatusPageCard from '@/components/shared/StatusPageCard'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

const createPageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens'),
})
type CreatePageFormData = z.infer<typeof createPageSchema>
export default function DashboardPage() {

  const dispatch = useAppDispatch()
  const pages = useAppSelector((state) => state.statusPages.list)
  const isLoading = useAppSelector((state) => state.statusPages.isLoading)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  

  const { register, handleSubmit, reset,watch, setValue, formState: { errors, isSubmitting } } = useForm<CreatePageFormData>({
    resolver: zodResolver(createPageSchema),
  })

  const slugValue = watch('slug')

  useEffect(() => {
    const loadPages = async () => {
      dispatch(setLoading(true))
      try {
        const data = await fetchPages()
        dispatch(setPages(data))
      } finally {
        dispatch(setLoading(false))
      }
    }
    loadPages()
  }, [dispatch])

  const onSubmit = async (data: CreatePageFormData) => {
    try {
      const newPage = await createPage(data)
      dispatch(addPage(newPage))
      toast.success('Status page created!')
      setIsCreateOpen(false)
      reset()
    } catch {
      toast.error('Failed to create page. Try again.')
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setValue('name', name)
    const autoSlug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    setValue('slug', autoSlug)
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Your Status Pages</h1>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-md
          transition-colors"
        >
          + Create New Page
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
              <div className="flex gap-2 pt-2">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
                <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && pages.length === 0 && (
        <div className="text-center py-24">
          <p className="text-4xl mb-4">📋</p>
          <p className="text-lg font-medium text-gray-900">No status pages yet</p>
          <p className="text-sm text-gray-500 mb-6">Create your first page to get started</p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            + Create Your First Page
          </button>
        </div>
      )}

      {/* Cards grid */}
      {!isLoading && pages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <StatusPageCard
              key={page.id}
              page={page}
              onDelete={(id) => setDeleteTarget(id)}
            />
          ))}
        </div>
      )}

      {/* Create Page Modal */}
      <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) reset() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Status Page</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {/* Name field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page Name</label>
              <input
                type="text"
                onChange={handleNameChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="My SaaS App"
              />
              <p className="h-4 text-xs text-red-500 mt-1">{errors.name?.message}</p>
            </div>

            {/* Slug field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                {...register('slug')}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="my-saas-app"
              />
              <p className="text-xs text-amber-600 mt-1">⚠ Cannot be changed after creation</p>
              <p className="h-4 text-xs text-red-500 mt-1">{errors.slug?.message}</p>
            </div>

            {/* Live URL preview */}
            {slugValue && (
              <p className="text-xs text-gray-500 bg-gray-50 rounded px-3 py-2">
                Public URL: <span className="font-mono text-indigo-600">/status/{slugValue}</span>
              </p>
            )}

            <DialogFooter className="pt-2">
              <button type="button" onClick={() => { setIsCreateOpen(false); reset() }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting}
                className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors disabled:opacity-50">
                {isSubmitting ? 'Creating...' : 'Create Page →'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Modal */}
      <Dialog open={deleteTarget !== null} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Status Page</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure? This will permanently delete all components and incidents for this page.
          </p>
          <p className="text-sm font-medium text-red-600">This action cannot be undone.</p>
          <DialogFooter className="pt-2">
            <button onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={async () => {
                if (deleteTarget === null) return
                try {
                  await deletePage(deleteTarget)
                  dispatch(removePage(deleteTarget))
                  toast.success('Status page deleted')
                } catch {
                  toast.error('Failed to delete. Try again.')
                } finally {
                  setDeleteTarget(null)
                }
              }}
              className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors">
              Delete Forever
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    
  )
}

