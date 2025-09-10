import { useKV } from '@github/spark/hooks'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Toaster } from '@/components/ui/sonner'
import { CaretLeft, CaretRight, Plus, Users, ArrowUp, ArrowDown } from '@phosphor-icons/react'
import { AddMemberDialog } from './components/AddMemberDialog'
import { CapacityGrid } from './components/CapacityGrid'
import { TeamMemberList } from './components/TeamMemberList'

export interface TeamMember {
  id: string
  name: string
  role: string
  info: string
  load: {
    backlog: number
    awaitingCustomer: number
    researching: number
  }
}

export interface Assignment {
  memberId: string
  date: string
  status: 'available' | 'busy' | 'holiday' | 'project-a' | 'project-b'
  timeSlot?: 'morning' | 'afternoon' | 'full-day'
  project?: string
}

function App() {
  const [teamMembers, setTeamMembers] = useKV<TeamMember[]>('team-members', [])
  const [assignments, setAssignments] = useKV<Assignment[]>('assignments', [])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Initialize with default team members if empty
  useEffect(() => {
    if (!teamMembers || teamMembers.length === 0) {
      const defaultMembers: TeamMember[] = [
        { 
          id: '1', 
          name: 'Sarah Chen', 
          role: 'Frontend Developer', 
          info: 'React specialist',
          load: { backlog: 8, awaitingCustomer: 2, researching: 1 }
        },
        { 
          id: '2', 
          name: 'Marcus Johnson', 
          role: 'Backend Developer', 
          info: 'Node.js expert',
          load: { backlog: 12, awaitingCustomer: 1, researching: 3 }
        },
        { 
          id: '3', 
          name: 'Elena Rodriguez', 
          role: 'UX Designer', 
          info: 'Design systems',
          load: { backlog: 5, awaitingCustomer: 4, researching: 2 }
        },
        { 
          id: '4', 
          name: 'David Kim', 
          role: 'DevOps Engineer', 
          info: 'AWS & Docker',
          load: { backlog: 15, awaitingCustomer: 0, researching: 1 }
        },
        { 
          id: '5', 
          name: 'Priya Sharma', 
          role: 'Product Manager', 
          info: 'Agile methodologies',
          load: { backlog: 3, awaitingCustomer: 6, researching: 4 }
        },
        { 
          id: '6', 
          name: 'Alex Thompson', 
          role: 'Full Stack Developer', 
          info: 'Python & React',
          load: { backlog: 9, awaitingCustomer: 2, researching: 2 }
        },
        { 
          id: '7', 
          name: 'Nina Petrov', 
          role: 'QA Engineer', 
          info: 'Automation testing',
          load: { backlog: 7, awaitingCustomer: 3, researching: 1 }
        },
        { 
          id: '8', 
          name: 'James Wilson', 
          role: 'Data Scientist', 
          info: 'ML & Analytics',
          load: { backlog: 11, awaitingCustomer: 1, researching: 5 }
        },
        { 
          id: '9', 
          name: 'Zoe Martinez', 
          role: 'Mobile Developer', 
          info: 'React Native',
          load: { backlog: 6, awaitingCustomer: 2, researching: 1 }
        },
        { 
          id: '10', 
          name: 'Ryan O\'Connor', 
          role: 'Tech Lead', 
          info: 'Architecture & mentoring',
          load: { backlog: 4, awaitingCustomer: 1, researching: 3 }
        }
      ]
      setTeamMembers(defaultMembers)
    }
  }, [])

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
    setTeamMembers(current => [...(current || []), newMember])
  }

  const toggleSort = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
  }

  const sortedMembers = [...(teamMembers || [])].sort((a, b) => {
    const comparison = a.load.backlog - b.load.backlog
    return sortDirection === 'asc' ? comparison : -comparison
  })

  const updateAssignment = (memberId: string, date: string, status: Assignment['status'], timeSlot: Assignment['timeSlot'] = 'full-day') => {
    setAssignments(current => {
      const currentAssignments = current || []
      // If setting to available, remove all assignments for this date
      if (status === 'available') {
        return currentAssignments.filter(a => !(a.memberId === memberId && a.date === date))
      }
      
      // For full-day assignments, replace any existing assignments
      if (timeSlot === 'full-day') {
        const filtered = currentAssignments.filter(a => !(a.memberId === memberId && a.date === date))
        return [...filtered, { memberId, date, status, timeSlot }]
      }
      
      // For time-specific assignments, check if there's a conflicting assignment
      const existing = currentAssignments.find(a => 
        a.memberId === memberId && 
        a.date === date && 
        (a.timeSlot === timeSlot || a.timeSlot === 'full-day')
      )
      
      if (existing) {
        // Update existing assignment
        return currentAssignments.map(a => 
          a.memberId === memberId && a.date === date && a.timeSlot === timeSlot
            ? { ...a, status }
            : a
        )
      } else {
        // Add new assignment
        return [...currentAssignments, { memberId, date, status, timeSlot }]
      }
    })
  }

  const getAssignments = (memberId: string, date: string): Assignment[] => {
    return (assignments || []).filter(a => a.memberId === memberId && a.date === date)
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
                {(teamMembers || []).length} team members
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigateMonth('prev')}
                className="p-2"
              >
                <CaretLeft size={16} />
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
                <CaretRight size={16} />
              </Button>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        {(!teamMembers || teamMembers.length === 0) ? (
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
          <div className="w-full">
            {/* Capacity Grid */}
            <CapacityGrid
              members={sortedMembers}
              currentDate={currentDate}
              getAssignments={getAssignments}
              updateAssignment={updateAssignment}
              sortDirection={sortDirection}
              onToggleSort={toggleSort}
            />
          </div>
        )}

        {/* Add Member Dialog */}
        <AddMemberDialog
          open={isAddMemberOpen}
          onOpenChange={setIsAddMemberOpen}
          onAddMember={addTeamMember}
        />
      </div>
      <Toaster />
    </div>
  )
}

export default App