import { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Assignment } from '../App'

interface StatusCellProps {
  status: Assignment['status']
  isWeekend: boolean
  onClick: (status: Assignment['status']) => void
}

const statusConfig = {
  available: { label: 'Available', class: 'status-available' },
  busy: { label: 'Busy', class: 'status-busy' },
  holiday: { label: 'Holiday', class: 'status-holiday' },
  'project-a': { label: 'Project A', class: 'status-project-a' },
  'project-b': { label: 'Project B', class: 'status-project-b' }
}

export function StatusCell({ status, isWeekend, onClick }: StatusCellProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const config = statusConfig[status]
  
  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-500 hover:bg-green-600'
      case 'busy':
        return 'bg-yellow-500 hover:bg-yellow-600'
      case 'holiday':
        return 'bg-purple-500 hover:bg-purple-600'
      case 'project-a':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'project-b':
        return 'bg-emerald-500 hover:bg-emerald-600'
      default:
        return 'bg-green-500 hover:bg-green-600'
    }
  }
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button 
          className={`
            h-10 w-10 rounded text-xs font-medium transition-all text-white
            hover:ring-2 hover:ring-ring hover:ring-offset-1
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1
            ${getStatusColor(status)}
            ${isWeekend && status === 'available' ? 'opacity-50' : ''}
          `}
        >
          {status === 'available' ? 'A' : 
           status === 'busy' ? 'B' :
           status === 'holiday' ? 'H' :
           status === 'project-a' ? 'PA' : 'PB'}
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="center" className="w-36">
        {Object.entries(statusConfig).map(([key, { label }]) => {
          const statusKey = key as Assignment['status']
          return (
            <DropdownMenuItem
              key={key}
              onClick={() => {
                onClick(statusKey)
                setIsOpen(false)
              }}
              className="text-sm"
            >
              <div className={`w-3 h-3 rounded mr-2 ${getStatusColor(statusKey).split(' ')[0]}`} />
              {label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}