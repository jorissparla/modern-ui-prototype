import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TeamMember, Assignment } from '../App'
import { StatusCell } from './StatusCell'

interface CapacityGridProps {
  members: TeamMember[]
  currentDate: Date
  getAssignment: (memberId: string, date: string) => Assignment | undefined
  updateAssignment: (memberId: string, date: string, status: Assignment['status']) => void
}

export function CapacityGrid({ members, currentDate, getAssignment, updateAssignment }: CapacityGridProps) {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []
    
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
          <Badge className="status-available text-xs">Available</Badge>
          <Badge className="status-busy text-xs">Busy</Badge>
          <Badge className="status-holiday text-xs">Holiday</Badge>
          <Badge className="status-project-a text-xs">Project A</Badge>
          <Badge className="status-project-b text-xs">Project B</Badge>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header Row */}
          <div className="grid grid-cols-[200px_repeat(31,40px)] gap-1 mb-2">
            <div className="font-medium text-sm text-muted-foreground">Team Member</div>
            {days.map((day) => (
              <div 
                key={day.day} 
                className={`text-xs text-center p-1 rounded ${
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
            <div key={member.id} className="grid grid-cols-[200px_repeat(31,40px)] gap-1 mb-1">
              <div className="p-2 bg-card border rounded flex flex-col justify-center">
                <div className="font-medium text-sm truncate">{member.name}</div>
                <div className="text-xs text-muted-foreground truncate">{member.role}</div>
              </div>
              
              {days.map((day) => {
                const assignment = getAssignment(member.id, day.dateString)
                return (
                  <StatusCell
                    key={`${member.id}-${day.day}`}
                    status={assignment?.status || 'available'}
                    isWeekend={day.isWeekend}
                    onClick={(newStatus) => updateAssignment(member.id, day.dateString, newStatus)}
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