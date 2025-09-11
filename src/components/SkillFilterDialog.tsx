import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MagnifyingGlass, X, User } from '@phosphor-icons/react'
import { TeamMember, Team } from '../App'
import { Skill } from './SkillsMatrixDialog'

interface SkillFilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  skills: Skill[]
  teamMembers: TeamMember[]
  teams: Team[]
  memberSkills: Record<string, Record<string, 'C' | 'E' | 'K'>>
  onMemberSelect?: (member: TeamMember) => void
}

export function SkillFilterDialog({
  open,
  onOpenChange,
  skills,
  teamMembers,
  teams,
  memberSkills,
  onMemberSelect
}: SkillFilterDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [minLevel, setMinLevel] = useState<'C' | 'E' | 'K' | 'any'>('any')
  const [selectedTeam, setSelectedTeam] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'matches' | 'team'>('matches')

  // Filter skills based on search term
  const filteredSkills = useMemo(() => {
    if (!searchTerm) return skills
    const term = searchTerm.toLowerCase()
    return skills.filter(skill => 
      skill.name.toLowerCase().includes(term) ||
      skill.code.toLowerCase().includes(term) ||
      skill.category.toLowerCase().includes(term)
    )
  }, [skills, searchTerm])

  // Get team members with their skills and filter them
  const filteredMembers = useMemo(() => {
    let members = teamMembers.map(member => {
      const memberSkillsData = memberSkills[member.id] || {}
      const relevantSkills = selectedSkills.length > 0 
        ? selectedSkills.map(skillId => {
            const skill = skills.find(s => s.id === skillId)
            const level = memberSkillsData[skillId]
            return skill && level ? { skill, level } : null
          }).filter(Boolean) as Array<{ skill: Skill; level: 'C' | 'E' | 'K' }>
        : Object.entries(memberSkillsData).map(([skillId, level]) => {
            const skill = skills.find(s => s.id === skillId)
            return skill ? { skill, level } : null
          }).filter(Boolean) as Array<{ skill: Skill; level: 'C' | 'E' | 'K' }>

      return {
        ...member,
        relevantSkills,
        matchingSkillsCount: selectedSkills.length > 0 
          ? selectedSkills.filter(skillId => memberSkillsData[skillId]).length
          : relevantSkills.length
      }
    })

    // Filter by selected skills
    if (selectedSkills.length > 0) {
      members = members.filter(member => {
        return selectedSkills.every(skillId => {
          const memberLevel = memberSkills[member.id]?.[skillId]
          if (!memberLevel) return false
          
          if (minLevel === 'any') return true
          
          const levelOrder = { 'K': 1, 'C': 2, 'E': 3 }
          const requiredLevel = levelOrder[minLevel]
          const actualLevel = levelOrder[memberLevel]
          
          return actualLevel >= requiredLevel
        })
      })
    }

    // Filter by team
    if (selectedTeam !== 'all') {
      members = members.filter(member => member.teamId === selectedTeam)
    }

    // Sort members
    members.sort((a, b) => {
      switch (sortBy) {
        case 'matches':
          return b.matchingSkillsCount - a.matchingSkillsCount
        case 'name':
          return a.name.localeCompare(b.name)
        case 'team':
          const teamA = teams.find(t => t.id === a.teamId)?.name || ''
          const teamB = teams.find(t => t.id === b.teamId)?.name || ''
          return teamA.localeCompare(teamB)
        default:
          return 0
      }
    })

    return members
  }, [teamMembers, memberSkills, skills, selectedSkills, minLevel, selectedTeam, sortBy, teams])

  const addSkillFilter = (skillId: string) => {
    if (!selectedSkills.includes(skillId)) {
      setSelectedSkills(prev => [...prev, skillId])
    }
  }

  const removeSkillFilter = (skillId: string) => {
    setSelectedSkills(prev => prev.filter(id => id !== skillId))
  }

  const clearAllFilters = () => {
    setSelectedSkills([])
    setMinLevel('any')
    setSearchTerm('')
    setSelectedTeam('all')
  }

  const getLevelBadgeColor = (level: 'C' | 'E' | 'K') => {
    switch (level) {
      case 'E': return 'bg-emerald-500 text-white'
      case 'C': return 'bg-blue-500 text-white'
      case 'K': return 'bg-gray-500 text-white'
      default: return 'bg-gray-300 text-gray-700'
    }
  }

  const getLevelLabel = (level: 'C' | 'E' | 'K') => {
    switch (level) {
      case 'C': return 'Competent'
      case 'E': return 'Expert'
      case 'K': return 'Knowledge'
      default: return level
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MagnifyingGlass size={20} />
            Find Team Members by Skills
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Skill Search */}
            <div className="relative">
              <MagnifyingGlass size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search skills by name, code, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-4 flex-wrap">
              <Select value={minLevel} onValueChange={(value: 'C' | 'E' | 'K' | 'any') => setMinLevel(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Min Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Level</SelectItem>
                  <SelectItem value="K">Knowledge+</SelectItem>
                  <SelectItem value="C">Competent+</SelectItem>
                  <SelectItem value="E">Expert</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: 'name' | 'matches' | 'team') => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matches">Skill Matches</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                </SelectContent>
              </Select>

              {(selectedSkills.length > 0 || searchTerm || minLevel !== 'any' || selectedTeam !== 'all') && (
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Selected Skills */}
            {selectedSkills.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Required Skills:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map(skillId => {
                    const skill = skills.find(s => s.id === skillId)
                    return skill ? (
                      <Badge key={skillId} variant="secondary" className="gap-1">
                        {skill.code}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeSkillFilter(skillId)}
                        >
                          <X size={12} />
                        </Button>
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
            {/* Available Skills */}
            <div className="space-y-2">
              <h3 className="font-medium">Available Skills</h3>
              <div className="border rounded-lg p-2 h-full overflow-y-auto space-y-1">
                {filteredSkills.map(skill => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between p-2 rounded border cursor-pointer hover:bg-muted"
                    onClick={() => addSkillFilter(skill.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {skill.code}
                        </Badge>
                        <span className="text-sm font-medium truncate">
                          {skill.name}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {skill.category}
                      </div>
                    </div>
                    {selectedSkills.includes(skill.id) && (
                      <Badge variant="secondary" className="ml-2">
                        Selected
                      </Badge>
                    )}
                  </div>
                ))}
                {filteredSkills.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No skills found matching your search
                  </div>
                )}
              </div>
            </div>

            {/* Matching Team Members */}
            <div className="space-y-2">
              <h3 className="font-medium">
                Matching Team Members ({filteredMembers.length})
              </h3>
              <div className="border rounded-lg p-2 h-full overflow-y-auto space-y-2">
                {filteredMembers.map(member => {
                  const team = teams.find(t => t.id === member.teamId)
                  return (
                    <Card 
                      key={member.id} 
                      className="p-3 cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => onMemberSelect?.(member)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-muted-foreground" />
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {member.role} • {team?.name}
                            </div>
                          </div>
                        </div>
                        {selectedSkills.length > 0 && (
                          <Badge variant="secondary" className="gap-1">
                            <span className="text-xs">
                              {member.matchingSkillsCount}/{selectedSkills.length}
                            </span>
                          </Badge>
                        )}
                      </div>
                      
                      {member.relevantSkills.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <div className="text-xs text-muted-foreground">Skills:</div>
                          <div className="flex flex-wrap gap-1">
                            {member.relevantSkills.slice(0, 6).map(({ skill, level }) => (
                              <Badge 
                                key={skill.id}
                                className={`text-xs ${getLevelBadgeColor(level)}`}
                              >
                                {skill.code} ({level})
                              </Badge>
                            ))}
                            {member.relevantSkills.length > 6 && (
                              <Badge variant="outline" className="text-xs">
                                +{member.relevantSkills.length - 6} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </Card>
                  )
                })}
                {filteredMembers.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    {selectedSkills.length > 0 
                      ? 'No team members found with the selected skills'
                      : 'No team members found'
                    }
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="border-t pt-2">
            <div className="text-xs text-muted-foreground">
              Skill Levels: 
              <Badge className="ml-2 text-xs bg-emerald-500 text-white">E - Expert</Badge>
              <Badge className="ml-1 text-xs bg-blue-500 text-white">C - Competent</Badge>
              <Badge className="ml-1 text-xs bg-gray-500 text-white">K - Knowledge</Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}