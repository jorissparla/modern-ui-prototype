import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
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

  const getLevelButton = (level: 'C' | 'E' | 'K' | undefined, skillId: string) => {
    const buttons = [
      { level: 'C' as const, label: 'C', className: 'bg-blue-500 hover:bg-blue-600 text-white' },
      { level: 'E' as const, label: 'E', className: 'bg-emerald-500 hover:bg-emerald-600 text-white' },
      { level: 'K' as const, label: 'K', className: 'bg-orange-500 hover:bg-orange-600 text-white' }
    ]

    return (
      <div className="flex gap-1">
        {buttons.map((btn) => (
          <Button
            key={btn.level}
            variant={level === btn.level ? 'default' : 'outline'}
            size="sm"
            className={`w-7 h-7 p-0 text-xs font-medium transition-all ${
              level === btn.level 
                ? btn.className 
                : 'text-muted-foreground hover:text-foreground border-border hover:border-muted-foreground'
            }`}
            onClick={() => toggleSkillLevel(skillId, level === btn.level ? undefined : btn.level)}
          >
            {btn.label}
          </Button>
        ))}
      </div>
    )
  }

  // Split categories into two columns for better layout
  const categories = Object.entries(groupedSkills)
  const midPoint = Math.ceil(categories.length / 2)
  const leftColumnCategories = categories.slice(0, midPoint)
  const rightColumnCategories = categories.slice(midPoint)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] w-[1800px] h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="text-xl">
            Knowledge Matrix for <span className="text-primary">{member.name}</span>
          </DialogTitle>
          <div className="flex items-center gap-6 text-sm text-muted-foreground mt-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center text-white text-xs font-medium">C</div>
              <span>Can work on Cases</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center text-white text-xs font-medium">E</div>
              <span>Expert</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center text-white text-xs font-medium">K</div>
              <span>In Training/Knowledge</span>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="grid grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="space-y-5">
              {leftColumnCategories.map(([category, categorySkills]) => (
                <div key={category} className="space-y-2.5">
                  <h3 className="font-semibold text-base text-foreground border-b border-border pb-2 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
                    {category}
                  </h3>
                  <div className="grid gap-1.5">
                    {categorySkills.map((skill) => {
                      const currentLevel = memberSkills[skill.id]
                      return (
                        <div
                          key={skill.id}
                          className="flex items-center justify-between py-2 px-3 rounded-lg border border-border/50 hover:border-border hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm text-foreground truncate">{skill.name}</span>
                                <Badge variant="secondary" className="text-xs px-1.5 py-0.5 shrink-0 font-mono">
                                  {skill.code}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 shrink-0">
                            {getLevelButton(currentLevel, skill.id)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              {rightColumnCategories.map(([category, categorySkills]) => (
                <div key={category} className="space-y-2.5">
                  <h3 className="font-semibold text-base text-foreground border-b border-border pb-2 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
                    {category}
                  </h3>
                  <div className="grid gap-1.5">
                    {categorySkills.map((skill) => {
                      const currentLevel = memberSkills[skill.id]
                      return (
                        <div
                          key={skill.id}
                          className="flex items-center justify-between py-2 px-3 rounded-lg border border-border/50 hover:border-border hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm text-foreground truncate">{skill.name}</span>
                                <Badge variant="secondary" className="text-xs px-1.5 py-0.5 shrink-0 font-mono">
                                  {skill.code}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 shrink-0">
                            {getLevelButton(currentLevel, skill.id)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
