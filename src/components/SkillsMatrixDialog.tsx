import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { X } from '@phosphor-icons/react'
import { TeamMember } from '../App'

export interface Skill {
  id: string
  name: string
  code: string
  category: string
  level: 'C' | 'E' | 'K' // Can work on Cases, Expert, In Training/Knowledge Building
}

interface SkillsMatrixDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: TeamMember | null
  skills: Skill[]
  memberSkills: Record<string, 'C' | 'E' | 'K'>
  onUpdateMemberSkills: (memberId: string, skills: Record<string, 'C' | 'E' | 'K'>) => void
}

export function SkillsMatrixDialog({
  open,
  onOpenChange,
  member,
  skills,
  memberSkills,
  onUpdateMemberSkills
}: SkillsMatrixDialogProps) {
  if (!member) return null

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  const toggleSkillLevel = (skillId: string, currentLevel: 'C' | 'E' | 'K' | undefined) => {
    const levels: ('C' | 'E' | 'K' | undefined)[] = [undefined, 'C', 'E', 'K']
    const currentIndex = levels.indexOf(currentLevel)
    const nextIndex = (currentIndex + 1) % levels.length
    const nextLevel = levels[nextIndex]

    const updatedSkills = { ...memberSkills }
    if (nextLevel === undefined) {
      delete updatedSkills[skillId]
    } else {
      updatedSkills[skillId] = nextLevel
    }

    onUpdateMemberSkills(member.id, updatedSkills)
  }

  const getLevelBadge = (level: 'C' | 'E' | 'K' | undefined) => {
    switch (level) {
      case 'C':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">C - Can work on Cases</Badge>
      case 'E':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">E - Expert</Badge>
      case 'K':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">K - in Training/Knowledge Building</Badge>
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Knowledge Matrix for {member.name}</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">C - Can work on Cases</Badge>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">E - Expert</Badge>
                <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">K - in Training/Knowledge Building</Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="space-y-3">
              <h3 className="font-semibold text-lg border-b pb-2">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categorySkills.map((skill) => {
                  const currentLevel = memberSkills[skill.id]
                  return (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => toggleSkillLevel(skill.id, currentLevel)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{skill.name}</span>
                          <Badge variant="secondary" className="text-xs">{skill.code}</Badge>
                        </div>
                      </div>
                      <div className="ml-3">
                        {getLevelBadge(currentLevel)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}