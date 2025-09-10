import { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Assignment, ActivityCode } from '../App'

interface StatusCellProps {
  assignments: Assignment[]
  isWeekend: boolean
  onUpdate: (status: Assignment['status'], timeSlot?: Assignment['timeSlot']) => void
  activityCodes: ActivityCode[]
}

export function StatusCell({ assignments, isWeekend, onUpdate, activityCodes }: StatusCellProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const hasFullDayAssignment = assignments.some(a => a.timeSlot === 'full-day')
  const morningAssignment = assignments.find(a => a.timeSlot === 'morning')
  const afternoonAssignment = assignments.find(a => a.timeSlot === 'afternoon')
  
  const isAvailable = assignments.length === 0 || assignments.every(a => a.status === 'available')
  
  // Filter to only show active activity codes
  const activeActivityCodes = activityCodes.filter(code => code.isActive)
  
  // Create a lookup map for activity codes (including available)
  const activityCodeMap = new Map([
    ['available', { label: 'Available', shortLabel: '', color: 'bg-transparent' }],
    ...activeActivityCodes.map(code => [code.id, { 
      label: code.label, 
      shortLabel: code.shortLabel, 
      color: code.color 
    }])
  ])
  
  const getActivityCodeConfig = (status: Assignment['status']) => {
    return activityCodeMap.get(status) || { label: 'Unknown', shortLabel: '?', color: 'bg-gray-400' }
  }
  
  const getStatusColor = (status: Assignment['status']) => {
    const config = getActivityCodeConfig(status)
    return status === 'available' ? 'bg-transparent' : config.color
  }
  
  const renderCellContent = () => {
    if (isAvailable) {
      return (
        <div className={`h-full w-full rounded border-2 border-solid border-gray-300 ${isWeekend ? 'bg-gray-100' : 'bg-white'} hover:border-gray-400 transition-colors`} />
      )
    }
    
    if (hasFullDayAssignment) {
      const assignment = assignments.find(a => a.timeSlot === 'full-day')!
      const config = getActivityCodeConfig(assignment.status)
      return (
        <div className={`h-full w-full rounded text-white text-xs font-medium flex items-center justify-center ${getStatusColor(assignment.status)}`}>
          {config.shortLabel}
        </div>
      )
    }
    
    // Split day view (morning/afternoon)
    return (
      <div className="h-full w-full rounded overflow-hidden flex flex-col">
        <div className={`flex-1 text-white text-[10px] font-medium flex items-center justify-center ${
          morningAssignment ? getStatusColor(morningAssignment.status) : 'bg-transparent border-b border-gray-300'
        }`}>
          {morningAssignment ? getActivityCodeConfig(morningAssignment.status).shortLabel : ''}
        </div>
        <div className={`flex-1 text-white text-[10px] font-medium flex items-center justify-center ${
          afternoonAssignment ? getStatusColor(afternoonAssignment.status) : 'bg-transparent'
        }`}>
          {afternoonAssignment ? getActivityCodeConfig(afternoonAssignment.status).shortLabel : ''}
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
        {activeActivityCodes.map(code => {
          const statusKey = code.id as Assignment['status']
          return (
            <DropdownMenuItem
              key={`full-${code.id}`}
              onClick={() => {
                onUpdate(statusKey, 'full-day')
                setIsOpen(false)
              }}
              className="text-sm"
            >
              <div className={`w-3 h-3 rounded mr-2 ${code.color}`} />
              {code.label}
            </DropdownMenuItem>
          )
        })}
        
        <DropdownMenuSeparator />
        
        <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Morning</div>
        {activeActivityCodes.map(code => {
          const statusKey = code.id as Assignment['status']
          return (
            <DropdownMenuItem
              key={`morning-${code.id}`}
              onClick={() => {
                onUpdate(statusKey, 'morning')
                setIsOpen(false)
              }}
              className="text-sm"
            >
              <div className={`w-3 h-3 rounded mr-2 ${code.color}`} />
              AM - {code.label}
            </DropdownMenuItem>
          )
        })}
        
        <DropdownMenuSeparator />
        
        <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Afternoon</div>
        {activeActivityCodes.map(code => {
          const statusKey = code.id as Assignment['status']
          return (
            <DropdownMenuItem
              key={`afternoon-${code.id}`}
              onClick={() => {
                onUpdate(statusKey, 'afternoon')
                setIsOpen(false)
              }}
              className="text-sm"
            >
              <div className={`w-3 h-3 rounded mr-2 ${code.color}`} />
              PM - {code.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}