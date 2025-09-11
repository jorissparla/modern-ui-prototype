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
  const [minLevel, setMinLevel] = useState<'any' | 'C' | 'E'>('any')
  const [selectedTeam, setSelectedTeam] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'matches' | 'team'>('matches')

  // Filter available skills by search term
  const filteredSkills = useMemo(() => {
    return skills.filter(skill =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [skills, searchTerm])

  // Filter and sort team members based on selected criteria
  const filteredMembers = useMemo(() => {
    let members = teamMembers.map(member => {
      const memberSkillsForMember = memberSkills[member.id] || {}
      let matchingSkillsCount = 0
      let relevantSkills: Array<{skill: Skill, level: 'C' | 'E' | 'K'}> = []

      if (selectedSkills.length > 0) {
        relevantSkills = selectedSkills
          .map(skillId => {
            const skill = skills.find(s => s.id === skillId)
            const level = memberSkillsForMember[skillId]
            return skill && level ? { skill, level } : null
          })
          .filter(Boolean) as Array<{skill: Skill, level: 'C' | 'E' | 'K'}>

        matchingSkillsCount = relevantSkills.length
      }

      return {
        ...member,
        relevantSkills,
        matchingSkillsCount
      }
    })

    // Filter by selected skills and minimum level
    if (selectedSkills.length > 0) {
      members = members.filter(member => {
        return selectedSkills.every(skillId => {
          const memberLevel = memberSkills[member.id]?.[skillId]
          if (!memberLevel) return false

          const levelOrder = { 'K': 1, 'C': 2, 'E': 3 }
          const actualLevel = levelOrder[memberLevel]
          const requiredLevel = minLevel === 'any' ? 1 : levelOrder[minLevel]
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
      if (sortBy === 'matches') {
        return b.matchingSkillsCount - a.matchingSkillsCount
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      } else if (sortBy === 'team') {
        const teamA = teams.find(t => t.id === a.teamId)?.name || ''
        const teamB = teams.find(t => t.id === b.teamId)?.name || ''
        return teamA.localeCompare(teamB)
      }
      return 0
    })

    return members
  }, [teamMembers, memberSkills, skills, selectedSkills, minLevel, selectedTeam, sortBy, teams])

  const addSkill = (skillId: string) => {
    if (!selectedSkills.includes(skillId)) {
      setSelectedSkills(prev => [...prev, skillId])
    }
  }

  const removeSkill = (skillId: string) => {
    setSelectedSkills(prev => prev.filter(id => id !== skillId))
  }

  const clearFilters = () => {
    setSelectedSkills([])
    setMinLevel('any')
    setSelectedTeam('all')
    setSearchTerm('')
  }

  const getLevelBadgeColor = (level: 'C' | 'E' | 'K') => {
    switch (level) {
      case 'K': return 'bg-blue-500'
      case 'C': return 'bg-green-500'
      case 'E': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getLevelName = (level: 'C' | 'E' | 'K') => {
    switch (level) {
      case 'K': return 'Knowledge'
      case 'C': return 'Competent'
      case 'E': return 'Expert'
      default: return level
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MagnifyingGlass size={20} />
            Find Team Members by Skills
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <MagnifyingGlass size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search skills by name, category, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-3">
              <Select value={minLevel} onValueChange={(value: 'any' | 'C' | 'E') => setMinLevel(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Minimum skill level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Level</SelectItem>
                  <SelectItem value="C">Competent or higher</SelectItem>
                  <SelectItem value="E">Expert only</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: 'name' | 'matches' | 'team') => setSortBy(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matches">Best Matches</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>

            {/* Selected Skills */}
            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium">Selected skills:</span>
                {selectedSkills.map(skillId => {
                  const skill = skills.find(s => s.id === skillId)
                  return skill ? (
                    <Badge key={skillId} variant="secondary" className="gap-1">
                      {skill.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeSkill(skillId)}
                      >
                        <X size={12} />
                      </Button>
                    </Badge>
                  ) : null
                })}
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
            {/* Available Skills */}
            <div className="space-y-3">
              <h3 className="font-semibold">Available Skills ({filteredSkills.length})</h3>
              <div className="space-y-2 overflow-y-auto max-h-[500px] pr-2">
                {filteredSkills.map(skill => (
                  <Card
                    key={skill.id}
                    className={`p-3 cursor-pointer transition-colors hover:bg-accent/50 ${
                      selectedSkills.includes(skill.id) ? 'bg-accent/20 border-accent' : ''
                    }`}
                    onClick={() => addSkill(skill.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{skill.name}</div>
                        <div className="text-xs text-muted-foreground">{skill.code}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {skill.category}
                      </Badge>
                    </div>
                  </Card>
                ))}
                {filteredSkills.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No skills found matching your search
                  </div>
                )}
              </div>
            </div>

            {/* Matching Team Members */}
            <div className="space-y-3">
              <h3 className="font-semibold">
                Matching Team Members ({filteredMembers.length})
              </h3>
              <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2">
                {filteredMembers.map(member => {
                  const team = teams.find(t => t.id === member.teamId)
                  return (
                    <Card
                      key={member.id}
                      className="p-4 cursor-pointer transition-colors hover:bg-accent/50"
                      onClick={() => onMemberSelect?.(member)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {member.role} • {team?.name}
                            </div>
                          </div>
                          {selectedSkills.length > 0 && (
                            <Badge variant="secondary" className="gap-1">
                              <User size={12} />
                              <span className="text-xs">
                                {member.matchingSkillsCount}/{selectedSkills.length}
                              </span>
                            </Badge>
                          )}
                        </div>
                        
                        {member.relevantSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {member.relevantSkills.map(({ skill, level }) => (
                              <Badge 
                                key={skill.id}
                                className={`text-xs ${getLevelBadgeColor(level)} text-white`}
                              >
                                {skill.code} ({getLevelName(level)})
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  )
                })}
                {filteredMembers.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    {selectedSkills.length > 0 
                      ? 'No team members found with the selected skills'
                      : 'Select skills to find matching team members'
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
              <Badge className="ml-2 text-xs bg-blue-500 text-white">K - Knowledge</Badge>
              <Badge className="ml-1 text-xs bg-green-500 text-white">C - Competent</Badge>
              <Badge className="ml-1 text-xs bg-purple-500 text-white">E - Expert</Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}