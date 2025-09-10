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
      
      <div className="flex border border-border rounded-lg overflow-hidden">
        {/* Fixed Left Columns */}
        <div className="flex-shrink-0 bg-background">
          {/* Fixed Header */}
          <div className="flex gap-1 mb-2 bg-background border-b border-border pb-2 h-10">
            <div className="w-48 h-8 font-medium text-sm text-muted-foreground flex items-center px-2">Team Member</div>
            <div className="w-32 h-8 font-medium text-sm text-muted-foreground flex items-center gap-1 px-2">
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
          </div>

          {/* Fixed Member Rows */}
          {members.map((member) => (
            <div key={member.id} className="flex gap-1 mb-0.5 h-8">
              <div className="w-48 h-8 px-2 bg-card border-y border-l rounded-l flex flex-col justify-center">
                <div className="font-medium text-sm truncate leading-tight">{member.name}</div>
                <div className="text-xs text-muted-foreground truncate leading-none">{member.role}</div>
              </div>
              
              <div className="w-32 h-8 px-2 bg-card border-y border-r rounded-r flex items-center justify-center">
                <div className="flex items-center gap-2 text-[10px]">
                  <div className="flex items-center gap-0.5">
                    <span className="text-muted-foreground font-medium">B</span>
                    <span className="font-semibold text-xs px-1 py-0.5 bg-blue-100 text-blue-700 rounded">{member.load.backlog}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <span className="text-muted-foreground font-medium">A</span>
                    <span className="font-semibold text-xs px-1 py-0.5 bg-amber-100 text-amber-700 rounded">{member.load.awaitingCustomer}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <span className="text-muted-foreground font-medium">R</span>
                    <span className="font-semibold text-xs px-1 py-0.5 bg-purple-100 text-purple-700 rounded">{member.load.researching}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scrollable Right Section */}
        <div className="flex-1 overflow-x-auto border-l border-border">
          <div className="min-w-max">
            {/* Scrollable Header */}
            <div className="flex gap-1 mb-2 bg-background border-b border-border pb-2 h-10">
              {days.map((day) => (
                <div 
                  key={day.day} 
                  className={`w-10 h-8 text-xs text-center p-1 rounded flex-shrink-0 flex flex-col justify-center ${
                    day.isWeekend ? 'bg-muted text-muted-foreground' : 'text-foreground'
                  }`}
                >
                  <div className="font-medium leading-none">{day.day}</div>
                  <div className="text-[10px] opacity-75 leading-none">{day.dayName}</div>
                </div>
              ))}
            </div>

            {/* Scrollable Member Rows */}
            {members.map((member) => (
              <div key={member.id} className="flex gap-1 mb-0.5 h-8">
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
      </div>
    </Card>
  )
}