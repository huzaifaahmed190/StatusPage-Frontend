import type {StatusPage} from '@/types'
import {OVERALL_STATUS_LABELS, OVERALL_STATUS_COLORS} from '@/constants'
import { useNavigate } from 'react-router-dom'
import{ Link} from 'lucide-react'
import {toast} from 'sonner'

interface Props {
    page: StatusPage
    onDelete: (id: number) => void
}

export default function StatusPageCard({ page, onDelete }: Props) {
    const publicUrl = `/status/${page.slug}`
    const navigate = useNavigate()

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(window.location.origin + publicUrl)
        toast.success('Public URL copied!')
    }
    return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col gap-4">

      {/* Name + status badge */}
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-base font-semibold text-gray-900 leading-tight">{page.name}</h2>
        <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${OVERALL_STATUS_COLORS[page.overall_status]}`}>
          {OVERALL_STATUS_LABELS[page.overall_status]}
        </span>
      </div>

      {/* Slug */}
      <p className="text-sm text-gray-500 font-mono">/{page.slug}</p>

      {/* Created date */}
      <p className="text-xs text-gray-400">
        Created {new Date(page.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </p>

      {/* Copy public URL */}
      <button
        onClick={handleCopyUrl}
        className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors w-fit"
      >
        <Link className="h-3.5 w-3.5" />
        Copy public URL
      </button>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-gray-100">
        <button
          onClick={() => navigate(`/pages/${page.id}`)}
          className="flex-1 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded-md transition-colors"
        >
          Manage
        </button>
        <button
          onClick={() => onDelete(page.id)}
          className="flex-1 text-sm font-medium border border-red-300 text-red-600 hover:bg-red-50 py-1.5 rounded-md transition-colors"
        >
          Delete
        </button>
      </div>

    </div>
  )
}