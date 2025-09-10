import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Team } from '../App'
import { Users, Settings } from '@phosphor-icons/react'

interface TeamManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teams: Team[]
  onUpdateTeamStatus: (teamId: string, isActive: boolean) => void
}

export function TeamManagementDialog({ 
  open, 
  onOpenChange, 
  teams, 
  onUpdateTeamStatus 
}: TeamManagementDialogProps) {
  const activeTeamsCount = teams.filter(team => team.isActive).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings size={20} />
            Manage Available Teams
          </DialogTitle>
          <DialogDescription>
            Configure which teams are available for selection in the capacity planner.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium">Active Teams</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {activeTeamsCount} of {teams.length} teams enabled
            </span>
          </div>

          <div className="grid gap-3">
            {teams.map(team => (
              <Card key={team.id} className={`transition-all ${team.isActive ? 'ring-1 ring-primary/20' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{team.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {team.description}
                      </CardDescription>
                    </div>
                    <Switch
                      checked={team.isActive}
                      onCheckedChange={(checked) => onUpdateTeamStatus(team.id, checked)}
                    />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {activeTeamsCount === 0 && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive font-medium mb-1">
                No teams enabled
              </p>
              <p className="text-sm text-destructive/80">
                At least one team must be enabled to use the capacity planner.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}