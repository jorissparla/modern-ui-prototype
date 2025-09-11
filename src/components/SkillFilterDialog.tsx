import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TeamMember, Team } from '../App'

  open: boolean
  skills: Skill[]
import { TeamMember, Team } from '../App'
import { Skill } from './SkillsMatrixDialog'

interface SkillFilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  skills: Skill[]
  teamMembers: TeamMember[]
  const [minLev
  const [sortBy, setSortBy] = useState<'name' | 'matches' | 'te
  // Filter available skills by search term
 

    )

  const filtere
      con
      let rele
      if
          .map(
            cons
          })

      }
      return {
        relevantSkills,
      }

    if (selectedSkills.length > 0) {
        return selectedSkills.every(skil
          if (!memberLevel) retur
          const levelOrder = { 'K': 1, 'C': 2, 'E': 3 }
          const requiredLevel = minLevel === 'any' ? 1 : levelOrder[minL
        })
    }
    // Filter by team


    members.sort((a, b) => {
        return b.matchingSkillsCount - a.matc
        return a.name.localeCompare(b.name)
        const teamA = teams.find(
        return teamA.localeCompare(teamB)


  }, [teamMembers, memberSkills, skills
  const addSkill = (skillId
      setSelectedSkills(prev => [...prev, skillId])
  }
  const removeSkill = (skillId: string) => {
  }
  const clearFilters = () => {

    setSearchTerm('')


      case 'C'
      default: ret
  }
  const getLevelName = (lev
      c
      


    <Dialog open={open} onOpenChange
        <DialogHeader>
            <MagnifyingGlass size={20} />
          </DialogTitle>


            <div className="relative">
              <Input
                value={searchTerm}
                className="pl-10"
          
        
     

                <Sele
                  <SelectItem val
                </SelectContent>


                </S
                  <SelectIte
                    <SelectItem k
                </SelectContent>

                <SelectTrigger className="w
                </SelectTrigger>
                  <SelectItem value="matches">Best Matches</SelectIt
                  <SelectItem value="team">Team</SelectItem>
              </Select>
       
              


                <s
                  const skill = skills.find(s => s.id === skillId)

                      <Button
                        size="sm"
                        onClick={() => removeSkill(
     
   

            )}

   

              <div className="
                  <Card
                    cl
                    }`}
                  >
   

                      <Badge variant="outline" className="
                    
                  </Card>
                {filteredSkills.lengt
                    No skills found ma
                )}
     
   

              </h3>
                {fil
                  return (
                      key={member.
                      onClick={
                      <div 
     
   

          
                              <User size={12} />
                                {member.matchingSkil
                      
                        </div>
                        {member.relevantS
                            {member.rel
                        
                       

                          </div>
                      </div>
                  )
                {filteredMembers.lengt
                    {selectedSkills.length > 0 
                    
                  </div>
              </div>
          </div>
          {/* Legend */}
            <div
              <Bad

          </div>
      </DialogContent>
  )








































































































































































