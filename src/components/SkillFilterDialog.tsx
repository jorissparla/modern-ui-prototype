import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
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
  onMemberSelect: (member: TeamMember) => void
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
  const [minLevel, setMinLevel] = useState<'any' | 'K' | 'C' | 'E'>('any')
  const [sortBy, setSortBy] = useState<'name' | 'matches' | 'team'>('matches')

  // Filter available skills by search term
  const filteredSkills = useMemo(() => {
    return skills.filter(skill =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [skills, searchTerm])

  // Filter and sort team members based on selected skills and criteria
  const filteredMembers = useMemo(() => {
    let members = teamMembers.map(member => {
      const skills = memberSkills[member.id] || {}
      let relevantSkills: Array<{ skill: Skill; level: 'C' | 'E' | 'K' }> = []
      
      if (selectedSkills.length > 0) {
        relevantSkills = selectedSkills
          .map(skillId => {
            const skill = skills.find(s => s.id === skillId)
            const level = skills[skillId]
            return skill && level ? { skill, level } : null
          })
          .filter(Boolean) as Array<{ skill: Skill; level: 'C' | 'E' | 'K' }>
      }

      return {
        ...member,
        relevantSkills,
        matchingSkillsCount: relevantSkills.filter(({ level }) => {
          if (minLevel === 'any') return true
          if (minLevel === 'E') return level === 'E'
          if (minLevel === 'C') return level === 'C' || level === 'E'
          return true // 'K' accepts all levels
        }).length
      }
    })

    // Filter by minimum level requirement
    if (selectedSkills.length > 0) {
      members = members.filter(member => member.matchingSkillsCount > 0)
    }

    // Sort members
    members.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'team':
          const teamA = teams.find(t => t.id === a.teamId)?.name || ''
          const teamB = teams.find(t => t.id === b.teamId)?.name || ''
          return teamA.localeCompare(teamB)
        case 'matches':
        default:
          return b.matchingSkillsCount - a.matchingSkillsCount
      }
    })

    return members
  }, [teamMembers, memberSkills, selectedSkills, minLevel, sortBy, teams, skills])

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
    setSearchTerm('')
    setMinLevel('any')
  }

  const getLevelColor = (level: 'C' | 'E' | 'K') => {
    switch (level) {
      case 'E': return 'bg-green-500'
      case 'C': return 'bg-blue-500'
      case 'K': return 'bg-gray-500'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MagnifyingGlass size={20} />
            Find Team Members by Skills
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 overflow-hidden">
          {/* Search and Filters */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Search Skills</label>
              <div className="relative">
                <Input
                  placeholder="Search by skill name, code, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <MagnifyingGlass size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Minimum Level</label>
              <Select value={minLevel} onValueChange={(value: 'any' | 'K' | 'C' | 'E') => setMinLevel(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="K">Knowledge</SelectItem>
                  <SelectItem value="C">Competent</SelectItem>
                  <SelectItem value="E">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={sortBy} onValueChange={(value: 'name' | 'matches' | 'team') => setSortBy(value)}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matches">Best Matches</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={clearFilters}>
              Clear All
            </Button>
          </div>

          {/* Selected Skills */}
          {selectedSkills.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Selected Skills ({selectedSkills.length})</h4>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map(skillId => {
                  const skill = skills.find(s => s.id === skillId)
                  return skill ? (
                    <Badge
                      key={skillId}
                      variant="secondary"
                      className="gap-1"
                    >
                      {skill.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeSkill(skillId)}
                      >
                        <X size={12} />
                      </Button>
                    </Badge>
                  ) : null
                })}
              </div>
            </div>
          )}

          <div className="flex gap-4 overflow-hidden flex-1">
            {/* Available Skills */}
            <div className="w-1/2 flex flex-col">
              <h3 className="text-sm font-medium mb-2">Available Skills ({filteredSkills.length})</h3>
              <div className="overflow-y-auto flex-1 space-y-2 pr-2">
                {filteredSkills.map(skill => (
                  <Card
                    key={skill.id}
                    className={`p-3 cursor-pointer hover:bg-muted transition-colors ${
                      selectedSkills.includes(skill.id) ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => addSkill(skill.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-sm">{skill.name}</div>
                        <div className="text-xs text-muted-foreground">{skill.category}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {skill.code}
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

            {/* Matching Members */}
            <div className="w-1/2 flex flex-col">
              <h3 className="text-sm font-medium mb-2">Matching Team Members ({filteredMembers.length})</h3>
              <div className="overflow-y-auto flex-1 space-y-2 pr-2">
                {filteredMembers.map(member => {
                  const team = teams.find(t => t.id === member.teamId)
                  return (
                    <Card
                      key={member.id}
                      className="p-3 cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => onMemberSelect(member)}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-sm">{member.name}</div>
                            <div className="text-xs text-muted-foreground">{member.role}</div>
                            <div className="text-xs text-muted-foreground">{team?.name}</div>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <User size={12} />
                            {selectedSkills.length > 0 && (
                              <span>{member.matchingSkillsCount}/{selectedSkills.length} skills</span>
                            )}
                          </div>
                        </div>
                        {member.relevantSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {member.relevantSkills.map(({ skill, level }) => (
                              <Badge
                                key={skill.id}
                                className={`text-xs ${getLevelColor(level)} text-white`}
                              >
                                {skill.code} ({level})
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
          <div className="border-t pt-4">
            <div className="flex items-center gap-4 text-xs">
              <span className="font-medium">Skill Levels:</span>
              <div className="flex items-center gap-1">
                <Badge className="bg-gray-500 text-white text-xs">K</Badge>
                <span>Knowledge</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge className="bg-blue-500 text-white text-xs">C</Badge>
                <span>Competent</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge className="bg-green-500 text-white text-xs">E</Badge>
                <span>Expert</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}