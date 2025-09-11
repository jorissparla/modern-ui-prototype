import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUp, ArrowDown } from '@phosphor-icons/react'
import { TeamMember, Assignment, ActivityCode } from '../App'
import { StatusCell } from './StatusCell'

interface CapacityGridProps {
  members: TeamMember[]
  currentDate: Date
  getAssignments: (memberId: string, date: string) => Assignment[]
  updateAssignment: (memberId: string, date: string, status: Assignment['status'], timeSlot?: Assignment['timeSlot']) => void
  sortDirection: 'asc' | 'desc'
  onToggleSort: () => void
  activityCodes: ActivityCode[]
  onMemberRightClick?: (member: TeamMember, event: React.MouseEvent) => void
  memberSkills?: Record<string, Record<string, 'C' | 'E' | 'K'>>
}

export function CapacityGrid({ members, currentDate, getAssignments, updateAssignment, sortDirection, onToggleSort, activityCodes, onMemberRightClick, memberSkills }: CapacityGridProps) {
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
  
  // Filter to show only active activity codes in the legend
  const activeActivityCodes = activityCodes.filter(code => code.isActive)

  return (
    <Card className="p-4">
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Capacity Grid - {monthName}</h3>
        <div className="flex gap-2 flex-wrap mb-2">
          <Badge variant="outline" className="text-xs">Available (Blank)</Badge>
          {activeActivityCodes.map(code => (
            <Badge 
              key={code.id}
              className={`${code.color} text-white text-xs`}
            >
              {code.label} ({code.shortLabel})
            </Badge>
          ))}
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>Split cells: Morning (top) / Afternoon (bottom)</span>
          <span>•</span>
          <span>Right-click team member names to view skills matrix</span>
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
          {members.map((member) => {
            const memberSkillsCount = memberSkills ? Object.keys(memberSkills[member.id] || {}).length : 0
            
            return (
              <div key={member.id} className="flex gap-1 mb-0.5 h-8">
                <div 
                  className="w-48 h-8 px-2 bg-card border-y border-l rounded-l flex items-center justify-between cursor-pointer hover:bg-muted/50"
                  onContextMenu={(e) => onMemberRightClick?.(member, e)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate leading-tight">{member.name}</div>
                    <div className="text-xs text-muted-foreground truncate leading-none">{member.role}</div>
                  </div>
                  {memberSkillsCount > 0 && (
                    <Badge variant="outline" className="text-[10px] h-4 px-1 ml-1 bg-background">
                      {memberSkillsCount} skills
                    </Badge>
                  )}
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
            )
          })}
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
                      activityCodes={activityCodes}
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