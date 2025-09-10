import { useKV } from '@github/spark/hooks'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Toaster } from '@/components/ui/sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CaretLeft, CaretRight, Plus, Users, ArrowUp, ArrowDown, Settings } from '@phosphor-icons/react'
import { AddMemberDialog } from './components/AddMemberDialog'
import { CapacityGrid } from './components/CapacityGrid'
import { TeamMemberList } from './components/TeamMemberList'
import { TeamManagementDialog } from './components/TeamManagementDialog'

export interface TeamMember {
  id: string
  name: string
  role: string
  info: string
  teamId: string
  load: {
    backlog: number
    awaitingCustomer: number
    researching: number
  }
}

export interface Team {
  id: string
  name: string
  description: string
  isActive: boolean
}

export interface Assignment {
  memberId: string
  date: string
  status: 'available' | 'busy' | 'holiday' | 'project-a' | 'project-b'
  timeSlot?: 'morning' | 'afternoon' | 'full-day'
  project?: string
}

function App() {
  const [teams, setTeams] = useKV<Team[]>('teams', [])
  const [teamMembers, setTeamMembers] = useKV<TeamMember[]>('team-members', [])
  const [assignments, setAssignments] = useKV<Assignment[]>('assignments', [])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isTeamManagementOpen, setIsTeamManagementOpen] = useState(false)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedTeamId, setSelectedTeamId] = useState<string>('')

  // Initialize with default teams and members if empty
  useEffect(() => {
    if (!teams || teams.length === 0) {
      const defaultTeams: Team[] = [
        { id: 'frontend', name: 'Frontend Team', description: 'User interface development', isActive: true },
        { id: 'backend', name: 'Backend Team', description: 'Server and API development', isActive: true },
        { id: 'design', name: 'Design Team', description: 'UX/UI and product design', isActive: false },
        { id: 'devops', name: 'DevOps Team', description: 'Infrastructure and deployment', isActive: false }
      ]
      setTeams(defaultTeams)
      setSelectedTeamId(defaultTeams.find(t => t.isActive)?.id || defaultTeams[0].id)
    }
  }, [])

  useEffect(() => {
    if (!teamMembers || teamMembers.length === 0) {
      const defaultMembers: TeamMember[] = [
        // Frontend Team
        { 
          id: '1', 
          name: 'Sarah Chen', 
          role: 'Frontend Developer', 
          info: 'React specialist',
          teamId: 'frontend',
          load: { backlog: 8, awaitingCustomer: 2, researching: 1 }
        },
        { 
          id: '2', 
          name: 'Alex Thompson', 
          role: 'Senior Frontend Developer', 
          info: 'Vue.js & TypeScript',
          teamId: 'frontend',
          load: { backlog: 6, awaitingCustomer: 3, researching: 2 }
        },
        { 
          id: '3', 
          name: 'Zoe Martinez', 
          role: 'Mobile Developer', 
          info: 'React Native',
          teamId: 'frontend',
          load: { backlog: 12, awaitingCustomer: 1, researching: 1 }
        },
        { 
          id: '4', 
          name: 'Oliver Johnson', 
          role: 'Frontend Engineer', 
          info: 'Angular & SCSS',
          teamId: 'frontend',
          load: { backlog: 9, awaitingCustomer: 2, researching: 3 }
        },
        { 
          id: '5', 
          name: 'Maya Patel', 
          role: 'UI Developer', 
          info: 'Component libraries',
          teamId: 'frontend',
          load: { backlog: 5, awaitingCustomer: 4, researching: 1 }
        },

        // Backend Team
        { 
          id: '6', 
          name: 'Marcus Johnson', 
          role: 'Backend Developer', 
          info: 'Node.js expert',
          teamId: 'backend',
          load: { backlog: 15, awaitingCustomer: 1, researching: 3 }
        },
        { 
          id: '7', 
          name: 'Elena Rodriguez', 
          role: 'Python Developer', 
          info: 'Django & FastAPI',
          teamId: 'backend',
          load: { backlog: 11, awaitingCustomer: 2, researching: 4 }
        },
        { 
          id: '8', 
          name: 'David Kim', 
          role: 'Java Developer', 
          info: 'Spring Boot',
          teamId: 'backend',
          load: { backlog: 7, awaitingCustomer: 5, researching: 2 }
        },
        { 
          id: '9', 
          name: 'James Wilson', 
          role: 'Database Engineer', 
          info: 'PostgreSQL & MongoDB',
          teamId: 'backend',
          load: { backlog: 13, awaitingCustomer: 1, researching: 1 }
        },
        { 
          id: '10', 
          name: 'Sofia Andersson', 
          role: 'API Developer', 
          info: 'GraphQL & REST',
          teamId: 'backend',
          load: { backlog: 8, awaitingCustomer: 3, researching: 2 }
        },

        // Design Team
        { 
          id: '11', 
          name: 'Priya Sharma', 
          role: 'UX Designer', 
          info: 'User research',
          teamId: 'design',
          load: { backlog: 4, awaitingCustomer: 6, researching: 5 }
        },
        { 
          id: '12', 
          name: 'Nina Petrov', 
          role: 'UI Designer', 
          info: 'Design systems',
          teamId: 'design',
          load: { backlog: 6, awaitingCustomer: 4, researching: 3 }
        },
        { 
          id: '13', 
          name: 'Lucas Brown', 
          role: 'Product Designer', 
          info: 'Prototyping & testing',
          teamId: 'design',
          load: { backlog: 9, awaitingCustomer: 2, researching: 4 }
        },
        { 
          id: '14', 
          name: 'Isabella Garcia', 
          role: 'Graphic Designer', 
          info: 'Branding & illustrations',
          teamId: 'design',
          load: { backlog: 3, awaitingCustomer: 7, researching: 2 }
        },

        // DevOps Team
        { 
          id: '15', 
          name: 'Ryan O\'Connor', 
          role: 'DevOps Engineer', 
          info: 'AWS & Kubernetes',
          teamId: 'devops',
          load: { backlog: 18, awaitingCustomer: 0, researching: 2 }
        },
        { 
          id: '16', 
          name: 'Emma Thompson', 
          role: 'Site Reliability Engineer', 
          info: 'Monitoring & alerts',
          teamId: 'devops',
          load: { backlog: 14, awaitingCustomer: 1, researching: 3 }
        },
        { 
          id: '17', 
          name: 'Carlos Mendez', 
          role: 'Cloud Engineer', 
          info: 'Azure & Terraform',
          teamId: 'devops',
          load: { backlog: 10, awaitingCustomer: 2, researching: 1 }
        },
        { 
          id: '18', 
          name: 'Aisha Ibrahim', 
          role: 'Security Engineer', 
          info: 'CI/CD & security',
          teamId: 'devops',
          load: { backlog: 12, awaitingCustomer: 1, researching: 4 }
        }
      ]
      setTeamMembers(defaultMembers)
    }
  }, [])

  // Set default selected team
  useEffect(() => {
    if (teams && teams.length > 0 && !selectedTeamId) {
      const activeTeam = teams.find(t => t.isActive)
      setSelectedTeamId(activeTeam?.id || teams[0].id)
    }
  }, [teams, selectedTeamId])

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

  const updateTeamStatus = (teamId: string, isActive: boolean) => {
    setTeams(current => 
      (current || []).map(team => 
        team.id === teamId ? { ...team, isActive } : team
      )
    )
  }

  // Filter to show only active teams in the selector
  const activeTeams = teams?.filter(team => team.isActive) || []
  
  // Filter members by selected team
  const filteredMembers = (teamMembers || []).filter(member => member.teamId === selectedTeamId)
  
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    const comparison = a.load.backlog - b.load.backlog
    return sortDirection === 'asc' ? comparison : -comparison
  })

  const selectedTeam = teams?.find(team => team.id === selectedTeamId)

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
          <div className="flex items-center gap-3">
            {/* Team Selector */}
            <div className="flex items-center gap-2">
              <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  {activeTeams.map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsTeamManagementOpen(true)}
                className="p-2"
                title="Manage Teams"
              >
                <Settings size={16} />
              </Button>
            </div>
            <Button onClick={() => setIsAddMemberOpen(true)} className="gap-2">
              <Plus size={16} />
              Add Team Member
            </Button>
          </div>
        </div>

        {/* Navigation Bar */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm font-medium">
                {selectedTeam?.name || 'Team'} Capacity
              </Badge>
              <span className="text-sm text-muted-foreground">
                {filteredMembers.length} team members
              </span>
              {selectedTeam?.description && (
                <span className="text-sm text-muted-foreground">•</span>
              )}
              {selectedTeam?.description && (
                <span className="text-sm text-muted-foreground">
                  {selectedTeam.description}
                </span>
              )}
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
        {(!teamMembers || teamMembers.length === 0 || filteredMembers.length === 0 || activeTeams.length === 0) ? (
          <Card className="p-12 text-center">
            <Users size={64} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {activeTeams.length === 0 
                ? 'No teams enabled' 
                : (!teamMembers || teamMembers.length === 0) 
                  ? 'No team members yet' 
                  : `No members in ${selectedTeam?.name || 'this team'}`
              }
            </h3>
            <p className="text-muted-foreground mb-4">
              {activeTeams.length === 0
                ? 'Enable at least one team in the team management settings to start capacity planning'
                : (!teamMembers || teamMembers.length === 0) 
                  ? 'Start by adding team members to begin capacity planning'
                  : `Add team members to ${selectedTeam?.name || 'this team'} to start capacity planning`
              }
            </p>
            {activeTeams.length === 0 ? (
              <Button onClick={() => setIsTeamManagementOpen(true)} className="gap-2">
                <Settings size={16} />
                Manage Teams
              </Button>
            ) : (
              <Button onClick={() => setIsAddMemberOpen(true)} className="gap-2">
                <Plus size={16} />
                Add {(!teamMembers || teamMembers.length === 0) ? 'Your First' : 'Team'} Member
              </Button>
            )}
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
          teams={teams || []}
          selectedTeamId={selectedTeamId}
        />

        {/* Team Management Dialog */}
        <TeamManagementDialog
          open={isTeamManagementOpen}
          onOpenChange={setIsTeamManagementOpen}
          teams={teams || []}
          onUpdateTeamStatus={updateTeamStatus}
        />
      </div>
      <Toaster />
    </div>
  )
}

export default App