import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, S
import type { TeamMember, Team } from '../A

  open: boolean
  skills: Skill[]
import type { TeamMember, Team } from '../App'
import type { Skill } from './SkillsMatrixDialog'

interface SkillSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  skills: Skill[]
  teamMembers: TeamMember[]
  matchCount: n
  memberSkills: Record<string, Record<string, 'C' | 'E' | 'K'>>
export function SkillSearchDialog({
}

interface MemberMatch {
  memberSkills,
  matchingSkills: Array<{ skill: Skill; level: 'C' | 'E' | 'K' }>
  matchCount: number
}

export function SkillSearchDialog({
    
  onOpenChange,
      ski
  teamMembers,
    )
  memberSkills,
  const matching
}: SkillSearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [minLevel, setMinLevel] = useState<'any' | 'K' | 'C' | 'E'>('any')

  const filteredSkills = useMemo(() => {
    if (!searchTerm) return skills
    
    const term = searchTerm.toLowerCase()
    return skills.filter(skill =>
      skill.name.toLowerCase().includes(term) ||
          }
      skill.category.toLowerCase().includes(term)

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
                  value={searchTerm}
                  className="pl-10"
                <MagnifyingGlass size={16} className="absolute lef
            </div>
            <div>
           
         
        

                  <SelectItem value="E
              </Select

              Clear All
          </div>
          
       
      

                    <Badge
                      variant="secondary"

                      {skill.name}
                    </Badge>
                })}
     


              <h3 className="text-sm font-me
                {filteredSkills.map(skill => (
   

                    onClic
                    <div 
                     
                      
   

                ))}
                  <d
                  </div>
              </div>

            <div className="space-y
     
   

          
                    >
                        <div className="flex justify-between items-start
                      
                            <div className="text-xs text-mu
                          <div className=
                            <span>{matc
                        
                       

                            >
                            </Badge>
                        </div>
                    </Card>
                })}
                  <div className="text-c
                  </di
                {selectedSkills.length === 0 && (
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





























