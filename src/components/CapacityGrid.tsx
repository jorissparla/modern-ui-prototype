import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUp, ArrowDown } from '@phosphor-icons/react'
import { TeamMember, Assignment } from '../App'
import { StatusCell } from './StatusCell'

interface CapacityGridProps {
  members: TeamMember[]
  currentDate: Date
  getAssignments: (memberId: string, date: string) => Assignment[]
  updateAssignment: (memberId: string, date: string, status: Assignment['status'], timeSlot?: Assignment['timeSlot']) => void
  sortDirection: 'asc' | 'desc'
  onToggleSort: () => void
}

export function CapacityGrid({ members, currentDate, getAssignments, updateAssignment, sortDirection, onToggleSort }: CapacityGridProps) {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days: Array<{
      day: number
      date: Date
      dateString: string
      dayName: string
      isWeekend: boolean
    }> = []
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day)
      days.push({
        day,
        date: dayDate,
        dateString: dayDate.toISOString().split('T')[0],
        dayName: dayDate.toLocaleDateString('en-US', { weekday: 'short' }),
        isWeekend: dayDate.getDay() === 0 || dayDate.getDay() === 6
      })
    }
    
    return days
  }

  const days = getDaysInMonth(currentDate)
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <Card className="p-4">
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Capacity Grid - {monthName}</h3>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">Available (Blank)</Badge>
          <Badge className="bg-yellow-500 text-white text-xs">Busy</Badge>
          <Badge className="bg-purple-500 text-white text-xs">Holiday</Badge>
          <Badge className="bg-blue-500 text-white text-xs">Project A</Badge>
          <Badge className="bg-emerald-500 text-white text-xs">Project B</Badge>
          <div className="text-xs text-muted-foreground ml-2">Split cells: Morning (top) / Afternoon (bottom)</div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Header Row */}
          <div className="flex gap-1 mb-2">
            <div className="w-48 font-medium text-sm text-muted-foreground flex items-center">Team Member</div>
            <div className="w-32 font-medium text-sm text-muted-foreground flex items-center gap-1">
              Load
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 hover:bg-muted"
                onClick={onToggleSort}
              >
                {sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
              </Button>
            </div>
            {days.map((day) => (
              <div 
                key={day.day} 
                className={`w-10 text-xs text-center p-1 rounded flex-shrink-0 ${
                  day.isWeekend ? 'bg-muted text-muted-foreground' : 'text-foreground'
                }`}
              >
                <div className="font-medium">{day.day}</div>
                <div className="text-[10px] opacity-75">{day.dayName}</div>
              </div>
            ))}
          </div>

          {/* Member Rows */}
          {members.map((member) => (
            <div key={member.id} className="flex gap-1 mb-1">
              <div className="w-48 p-2 bg-card border rounded flex flex-col justify-center flex-shrink-0">
                <div className="font-medium text-sm truncate">{member.name}</div>
                <div className="text-xs text-muted-foreground truncate">{member.role}</div>
              </div>
              
              <div className="w-32 p-2 bg-card border rounded flex flex-col justify-center flex-shrink-0">
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Backlog:</span>
                    <span className="font-medium">{member.load.backlog}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Awaiting:</span>
                    <span className="font-medium">{member.load.awaitingCustomer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Research:</span>
                    <span className="font-medium">{member.load.researching}</span>
                  </div>
                </div>
              </div>
              
              {days.map((day) => {
                const assignments = getAssignments(member.id, day.dateString)
                return (
                  <StatusCell
                    key={`${member.id}-${day.day}`}
                    assignments={assignments}
                    isWeekend={day.isWeekend}
                    onUpdate={(status, timeSlot) => updateAssignment(member.id, day.dateString, status, timeSlot)}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}