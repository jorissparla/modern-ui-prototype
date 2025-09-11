import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MagnifyingGlass, X, User } from '@phosphor-icons/react'
  open: boolean
  onMemberSelect?: (member: TeamMember) => v

  open,
  skills,
  teams,
  onMemberSelect
  const [searchTerm, setSea
  teams: Team[]
  memberSkills: Record<string, Record<string, 'C' | 'E' | 'K'>>
  onMemberSelect?: (member: TeamMember) => void
}

export function SkillFilterDialog({
  open,
  onOpenChange,
    retur
            co
        
      return {
        relevant
          ? selectedSkills.f
      }

    if (selectedSkills.length > 0) {
        return selectedSkills.every(skillId => {
          if (!memberLevel) return false

          const levelOrder = { 'K': 1, 
          const actualLevel = levelOrder
          return actualLevel >= re
      })

    if (selectedTeam !== 'all') {
    }
    // Sort members
     
          return b.matchin

          const teamA = teams.find(t => t.id === a.team
          return teamA.localeCompare(team
          return 0
    })
    return members

    if (!selectedSkills.includes(skillId)) {
    }

    setSelectedSkills(prev => prev.filter(id => id !== skillId))

    setSelectedSkills([])
    setSearchTerm('')
  }

      return {
      case 'K': re
    }

    switch (level) {
      case 'E': return 'Expert'
      }
    }

      <DialogContent className="
    if (selectedSkills.length > 0) {
            Find Team Members by Skills
        return selectedSkills.every(skillId => {
        <div className="flex-1 overflow-hidden flex flex-col gap
          if (!memberLevel) return false
          
              <Input
          
                className="pl-10"
            </div>
            {/* Filter Controls */}
          
                  <SelectValue placeholder="M
          
      })
     

              <Select
    if (selectedTeam !== 'all') {
                <SelectContent>
    }

    // Sort members
              </Select>
              <Select v
                  <Sele
                <SelectContent>
                  <S
                </SelectContent>

          const teamA = teams.find(t => t.id === a.teamId)?.name || ''
          const teamB = teams.find(t => t.id === b.teamId)?.name || ''
          return teamA.localeCompare(teamB)
            </di
          return 0
       
    })

    return members
  }, [teamMembers, memberSkills, skills, selectedSkills, minLevel, selectedTeam, sortBy, teams])

                          onClick={() => remove
                          <X size={12} />
                      </Badge>
    }
   

          {/* Main Content Grid */}
            {/* Available Skills */}
   

                    key={skill.id
    setSelectedSkills([])
    setMinLevel('any')
                     
                        </
  }

  const getLevelBadgeColor = (level: 'C' | 'E' | 'K') => {
                    
                      <Badge variant="secondary" c
                      </Badge>
                  </div>
                {filteredSkills.length === 0 && (
    }
   

            {/* Matching Team Members */}
    switch (level) {
      case 'C': return 'Competent'
              <div className="b
                  return (
      default: return level
     
  }

          
                              {member.role} • {team?
                          </div>
                      
                            <span className="text-xs">
                            </span>
                        )}
                      
        </DialogHeader>

                              <Badge 
                                clas
          <div className="space-y-4">
                            ))}
            <div className="relative">
                              </Badge>
                    
                      )}
                value={searchTerm}
                {filteredMembers.length === 0 && (
                    {selectedSkil
                
            </div>

            {/* Filter Controls */}
          {/* Legend */}
            <div className="text-xs text-muted-foreground">
              <Badge className="ml-2 text-xs bg-
              <Badge className="ml-1 text-xs bg-gray-500 
          </div>
                <SelectContent>
  )










                <SelectContent>

                  {teams.map(team => (













                  <SelectItem value="name">Name</SelectItem>







                </Button>













                        <Button





                          <X size={12} />

                      </Badge>







          {/* Main Content Grid */}

            {/* Available Skills */}



















                        {skill.category}





                      </Badge>

                  </div>

                {filteredSkills.length === 0 && (







            {/* Matching Team Members */}



              </h3>



                  return (













                          </div>



                            <span className="text-xs">
                              {member.matchingSkillsCount}/{selectedSkills.length}
                            </span>
                          </Badge>

                      </div>







                                key={skill.id}

                              >







                            )}



                    </Card>

                })}







                )}





          <div className="border-t pt-2">

              Skill Levels: 



            </div>

        </div>

    </Dialog>

}