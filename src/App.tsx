import { useKV } from '@github/spark/hooks'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Plus, Users } from '@phosphor-icons/react'
import { AddMemberDialog } from './components/AddMemberDialog'
import { CapacityGrid } from './components/CapacityGrid'
import { TeamMemberList } from './components/TeamMemberList'

export interface TeamMember {
  id: string
  name: string
  role: string
  info: string
}

export interface Assignment {
  memberId: string
  date: string
  status: 'available' | 'busy' | 'holiday' | 'project-a' | 'project-b'
  project?: string
}

function App() {
  const [teamMembers, setTeamMembers] = useKV<TeamMember[]>('team-members', [])
  const [assignments, setAssignments] = useKV<Assignment[]>('assignments', [])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const addTeamMember = (member: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...member,
      id: Date.now().toString()
    }
    setTeamMembers(current => [...current, newMember])
  }

  const updateAssignment = (memberId: string, date: string, status: Assignment['status']) => {
    setAssignments(current => {
      const existing = current.find(a => a.memberId === memberId && a.date === date)
      if (existing) {
        return current.map(a => 
          a.memberId === memberId && a.date === date 
            ? { ...a, status }
            : a
        )
      } else {
        return [...current, { memberId, date, status }]
      }
    })
  }

  const getAssignment = (memberId: string, date: string): Assignment | undefined => {
    return assignments.find(a => a.memberId === memberId && a.date === date)
  }

  return (
    <div className="font-inter min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users size={32} className="text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Team Capacity Planner</h1>
              <p className="text-muted-foreground">Manage team availability and project assignments</p>
            </div>
          </div>
          <Button onClick={() => setIsAddMemberOpen(true)} className="gap-2">
            <Plus size={16} />
            Add Team Member
          </Button>
        </div>

        {/* Navigation Bar */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm font-medium">
                Capacity Overview
              </Badge>
              <span className="text-sm text-muted-foreground">
                {teamMembers.length} team members
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigateMonth('prev')}
                className="p-2"
              >
                <ChevronLeft size={16} />
              </Button>
              
              <div className="px-4 py-2 text-sm font-medium bg-secondary rounded-md">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigateMonth('next')}
                className="p-2"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        {teamMembers.length === 0 ? (
          <Card className="p-12 text-center">
            <Users size={64} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No team members yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding team members to begin capacity planning
            </p>
            <Button onClick={() => setIsAddMemberOpen(true)} className="gap-2">
              <Plus size={16} />
              Add Your First Team Member
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Team Members Sidebar */}
            <div className="lg:col-span-1">
              <TeamMemberList 
                members={teamMembers} 
                onDeleteMember={(id) => setTeamMembers(current => current.filter(m => m.id !== id))}
              />
            </div>
            
            {/* Capacity Grid */}
            <div className="lg:col-span-3">
              <CapacityGrid
                members={teamMembers}
                currentDate={currentDate}
                getAssignment={getAssignment}
                updateAssignment={updateAssignment}
              />
            </div>
          </div>
        )}

        {/* Add Member Dialog */}
        <AddMemberDialog
          open={isAddMemberOpen}
          onOpenChange={setIsAddMemberOpen}
          onAddMember={addTeamMember}
        />
      </div>
    </div>
  )
}

export default App