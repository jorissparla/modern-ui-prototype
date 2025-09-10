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
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button 
          className={`
            h-10 w-10 rounded text-xs font-medium transition-all
            hover:ring-2 hover:ring-ring hover:ring-offset-1
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1
            ${config.class}
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
        {Object.entries(statusConfig).map(([key, { label }]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => {
              onClick(key as Assignment['status'])
              setIsOpen(false)
            }}
            className="text-sm"
          >
            <div className={`w-3 h-3 rounded mr-2 ${statusConfig[key as Assignment['status']].class}`} />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}