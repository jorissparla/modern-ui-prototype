import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronLeft, ChevronRight } from '@phosphor-icons/react'
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
  const [currentPage, setCurrentPage] = useState(0)
  
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
      <div className="flex gap-0.5">
        {buttons.map((btn) => (
          <Button
            key={btn.level}
            variant={level === btn.level ? 'default' : 'outline'}
            size="sm"
            className={`w-6 h-6 p-0 text-xs font-medium transition-all ${
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

  // Get all categories and split into groups of 4 for tabs
  const categories = Object.entries(groupedSkills)
  const categoriesPerTab = 4
  const tabGroups = []
  
  for (let i = 0; i < categories.length; i += categoriesPerTab) {
    tabGroups.push(categories.slice(i, i + categoriesPerTab))
  }

  const totalPages = Math.max(1, tabGroups.length)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[1400px] h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg">
              Skills Matrix: <span className="text-primary">{member.name}</span>
            </DialogTitle>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="h-7 w-7 p-0"
                >
                  <ChevronLeft size={14} />
                </Button>
                <span className="text-xs text-muted-foreground px-2">
                  {currentPage + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="h-7 w-7 p-0"
                >
                  <ChevronRight size={14} />
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-blue-500 flex items-center justify-center text-white text-xs font-medium">C</div>
              <span>Cases</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-emerald-500 flex items-center justify-center text-white text-xs font-medium">E</div>
              <span>Expert</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-orange-500 flex items-center justify-center text-white text-xs font-medium">K</div>
              <span>Knowledge</span>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {tabGroups.length > 0 && (
            <div className="h-full">
              {/* Current page content */}
              <ScrollArea className="h-full pr-3">
                <div className="grid grid-cols-2 gap-6">
                  {tabGroups[currentPage]?.map(([category, categorySkills]) => (
                    <div key={category} className="space-y-2">
                      <h3 className="font-medium text-sm text-foreground border-b border-border pb-1 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
                        {category}
                      </h3>
                      <div className="space-y-1">
                        {categorySkills.map((skill) => {
                          const currentLevel = memberSkills[skill.id]
                          return (
                            <div
                              key={skill.id}
                              className="flex items-center justify-between py-1.5 px-2 rounded border border-border/30 hover:border-border/60 hover:bg-muted/20 transition-colors"
                            >
                              <div className="flex-1 min-w-0 mr-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium text-xs text-foreground truncate">{skill.name}</span>
                                  <Badge variant="secondary" className="text-xs px-1 py-0 h-4 shrink-0 font-mono">
                                    {skill.code}
                                  </Badge>
                                </div>
                              </div>
                              <div className="shrink-0">
                                {getLevelButton(currentLevel, skill.id)}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
