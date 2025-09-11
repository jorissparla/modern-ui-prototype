import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MagnifyingGlass, X, User } from '@phosphor-icons/react'
import type { TeamMember, Team } from '../App'
import type { Skill } from './SkillsMatrixDialog'

interface SkillSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  skills: Skill[]
  teamMembers: TeamMember[]
  teams: Team[]
  memberSkills: Record<string, Record<string, 'C' | 'E' | 'K'>>
  onMemberSelect: (member: TeamMember) => void
}

interface MemberMatch {
  member: TeamMember
  matchingSkills: Array<{ skill: Skill; level: 'C' | 'E' | 'K' }>
  matchCount: number
}

export function SkillSearchDialog({
  open,
  onOpenChange,
  skills,
  teamMembers,
  teams,
  memberSkills,
  onMemberSelect
}: SkillSearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [minLevel, setMinLevel] = useState<'any' | 'K' | 'C' | 'E'>('any')

  const filteredSkills = useMemo(() => {
    if (!searchTerm) return skills
    
    const term = searchTerm.toLowerCase()
    return skills.filter(skill =>
      skill.name.toLowerCase().includes(term) ||
      skill.code.toLowerCase().includes(term) ||
      skill.category.toLowerCase().includes(term)
    )
  }, [skills, searchTerm])

  const matchingMembers = useMemo(() => {
    if (selectedSkills.length === 0) return []

    const levelOrder = { 'K': 1, 'C': 2, 'E': 3 }
    const minLevelValue = minLevel === 'any' ? 0 : levelOrder[minLevel]

    const matches: MemberMatch[] = []

    teamMembers.forEach(member => {
      const skills = memberSkills[member.id] || {}
      const matchingSkills: Array<{ skill: Skill; level: 'C' | 'E' | 'K' }> = []

      selectedSkills.forEach(skillId => {
        const memberLevel = skills[skillId]
        if (memberLevel && (minLevel === 'any' || levelOrder[memberLevel] >= minLevelValue)) {
          const skill = filteredSkills.find(s => s.id === skillId)
          if (skill) {
            matchingSkills.push({ skill, level: memberLevel })
          }
        }
      })

      if (matchingSkills.length > 0) {
        matches.push({
          member,
          matchingSkills,
          matchCount: matchingSkills.length
        })
      }
    })

    return matches.sort((a, b) => b.matchCount - a.matchCount)
  }, [teamMembers, memberSkills, selectedSkills, minLevel, filteredSkills])

  const addSkill = (skillId: string) => {
    if (!selectedSkills.includes(skillId)) {
      setSelectedSkills(prev => [...prev, skillId])
    }
  }

  const removeSkill = (skillId: string) => {
    setSelectedSkills(prev => prev.filter(id => id !== skillId))
  }

  const clearAll = () => {
    setSelectedSkills([])
    setSearchTerm('')
    setMinLevel('any')
  }

  const getLevelColor = (level: 'K' | 'C' | 'E') => {
    switch (level) {
      case 'K': return 'bg-gray-500'
      case 'C': return 'bg-blue-500'
      case 'E': return 'bg-green-500'
      default: return 'bg-gray-400'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MagnifyingGlass size={20} />
            Find Team Members by Skills
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Search Skills</label>
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
              <label className="text-sm font-medium mb-1 block">Min Level</label>
              <Select value={minLevel} onValueChange={(value: 'any' | 'K' | 'C' | 'E') => setMinLevel(value)}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="K">K+</SelectItem>
                  <SelectItem value="C">C+</SelectItem>
                  <SelectItem value="E">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={clearAll}>
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
                      className="gap-1 cursor-pointer"
                      onClick={() => removeSkill(skillId)}
                    >
                      {skill.name}
                      <X size={12} />
                    </Badge>
                  ) : null
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 h-96">
            {/* Available Skills */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Available Skills ({filteredSkills.length})</h3>
              <div className="overflow-y-auto h-full space-y-1 pr-2">
                {filteredSkills.map(skill => (
                  <Card
                    key={skill.id}
                    className={`p-2 cursor-pointer hover:bg-muted transition-colors ${
                      selectedSkills.includes(skill.id) ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                    onClick={() => addSkill(skill.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">{skill.name}</div>
                        <div className="text-xs text-muted-foreground">{skill.category}</div>
                      </div>
                      <Badge variant="outline" className="text-xs ml-2 shrink-0">
                        {skill.code}
                      </Badge>
                    </div>
                  </Card>
                ))}
                {filteredSkills.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No skills found
                  </div>
                )}
              </div>
            </div>

            {/* Matching Members */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Matching Members ({matchingMembers.length})</h3>
              <div className="overflow-y-auto h-full space-y-1 pr-2">
                {matchingMembers.map(({ member, matchingSkills, matchCount }) => {
                  const team = teams.find(t => t.id === member.teamId)
                  return (
                    <Card
                      key={member.id}
                      className="p-3 cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => onMemberSelect(member)}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="min-w-0">
                            <div className="font-medium text-sm">{member.name}</div>
                            <div className="text-xs text-muted-foreground">{member.role}</div>
                            <div className="text-xs text-muted-foreground">{team?.name}</div>
                          </div>
                          <div className="flex items-center gap-1 text-xs shrink-0">
                            <User size={12} />
                            <span>{matchCount}/{selectedSkills.length}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {matchingSkills.map(({ skill, level }) => (
                            <Badge
                              key={skill.id}
                              className={`text-xs ${getLevelColor(level)} text-white`}
                            >
                              {skill.code} ({level})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  )
                })}
                {matchingMembers.length === 0 && selectedSkills.length > 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No members found with selected skills
                  </div>
                )}
                {selectedSkills.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    Select skills to find matching members
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="border-t pt-3">
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