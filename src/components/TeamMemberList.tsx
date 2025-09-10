import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash } from '@phosphor-icons/react'
import { TeamMember } from '../App'

interface TeamMemberListProps {
  members: TeamMember[]
  onDeleteMember: (id: string) => void
}

export function TeamMemberList({ members, onDeleteMember }: TeamMemberListProps) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Team Members</h3>
      <div className="space-y-3">
        {members.map((member) => (
          <div key={member.id} className="border rounded-lg p-3 bg-card">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{member.name}</h4>
                <Badge variant="secondary" className="text-xs mt-1">
                  {member.role}
                </Badge>
                {member.info && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {member.info}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteMember(member.id)}
                className="text-destructive hover:text-destructive p-1 h-auto"
              >
                <Trash size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}