import { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Assignment } from '../App'

interface StatusCellProps {
  assignments: Assignment[]
  isWeekend: boolean
  onUpdate: (status: Assignment['status'], timeSlot?: Assignment['timeSlot']) => void
}

const statusConfig = {
  available: { label: 'Available', class: 'bg-transparent', short: '' },
  busy: { label: 'Busy', class: 'bg-yellow-500', short: 'B' },
  holiday: { label: 'Holiday', class: 'bg-purple-500', short: 'H' },
  'project-a': { label: 'Project A', class: 'bg-blue-500', short: 'PA' },
  'project-b': { label: 'Project B', class: 'bg-emerald-500', short: 'PB' }
}

export function StatusCell({ assignments, isWeekend, onUpdate }: StatusCellProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const hasFullDayAssignment = assignments.some(a => a.timeSlot === 'full-day')
  const morningAssignment = assignments.find(a => a.timeSlot === 'morning')
  const afternoonAssignment = assignments.find(a => a.timeSlot === 'afternoon')
  
  const isAvailable = assignments.length === 0 || assignments.every(a => a.status === 'available')
  
  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'available':
        return 'bg-transparent'
      case 'busy':
        return 'bg-yellow-500'
      case 'holiday':
        return 'bg-purple-500'
      case 'project-a':
        return 'bg-blue-500'
      case 'project-b':
        return 'bg-emerald-500'
      default:
        return 'bg-transparent'
    }
  }
  
  const renderCellContent = () => {
    if (isAvailable) {
      return (
        <div className={`h-full w-full rounded border-2 border-dashed border-gray-300 ${isWeekend ? 'bg-gray-100' : 'bg-white'} hover:border-gray-400 transition-colors`} />
      )
    }
    
    if (hasFullDayAssignment) {
      const assignment = assignments.find(a => a.timeSlot === 'full-day')!
      return (
        <div className={`h-full w-full rounded text-white text-xs font-medium flex items-center justify-center ${getStatusColor(assignment.status)}`}>
          {statusConfig[assignment.status].short}
        </div>
      )
    }
    
    // Split day view (morning/afternoon)
    return (
      <div className="h-full w-full rounded overflow-hidden flex flex-col">
        <div className={`flex-1 text-white text-[10px] font-medium flex items-center justify-center ${
          morningAssignment ? getStatusColor(morningAssignment.status) : 'bg-transparent border-b border-gray-300'
        }`}>
          {morningAssignment ? statusConfig[morningAssignment.status].short : ''}
        </div>
        <div className={`flex-1 text-white text-[10px] font-medium flex items-center justify-center ${
          afternoonAssignment ? getStatusColor(afternoonAssignment.status) : 'bg-transparent'
        }`}>
          {afternoonAssignment ? statusConfig[afternoonAssignment.status].short : ''}
        </div>
      </div>
    )
  }
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button 
          className="h-8 w-10 p-0.5 hover:ring-2 hover:ring-ring hover:ring-offset-1 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all"
        >
          {renderCellContent()}
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="center" className="w-40">
        <DropdownMenuItem
          onClick={() => {
            onUpdate('available', 'full-day')
            setIsOpen(false)
          }}
          className="text-sm"
        >
          Clear (Available)
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Full Day</div>
        {Object.entries(statusConfig).filter(([key]) => key !== 'available').map(([key, { label }]) => {
          const statusKey = key as Assignment['status']
          return (
            <DropdownMenuItem
              key={`full-${key}`}
              onClick={() => {
                onUpdate(statusKey, 'full-day')
                setIsOpen(false)
              }}
              className="text-sm"
            >
              <div className={`w-3 h-3 rounded mr-2 ${getStatusColor(statusKey)}`} />
              {label}
            </DropdownMenuItem>
          )
        })}
        
        <DropdownMenuSeparator />
        
        <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Morning</div>
        {Object.entries(statusConfig).filter(([key]) => key !== 'available').map(([key, { label }]) => {
          const statusKey = key as Assignment['status']
          return (
            <DropdownMenuItem
              key={`morning-${key}`}
              onClick={() => {
                onUpdate(statusKey, 'morning')
                setIsOpen(false)
              }}
              className="text-sm"
            >
              <div className={`w-3 h-3 rounded mr-2 ${getStatusColor(statusKey)}`} />
              AM - {label}
            </DropdownMenuItem>
          )
        })}
        
        <DropdownMenuSeparator />
        
        <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Afternoon</div>
        {Object.entries(statusConfig).filter(([key]) => key !== 'available').map(([key, { label }]) => {
          const statusKey = key as Assignment['status']
          return (
            <DropdownMenuItem
              key={`afternoon-${key}`}
              onClick={() => {
                onUpdate(statusKey, 'afternoon')
                setIsOpen(false)
              }}
              className="text-sm"
            >
              <div className={`w-3 h-3 rounded mr-2 ${getStatusColor(statusKey)}`} />
              PM - {label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}