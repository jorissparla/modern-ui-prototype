import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, Ca
import { Users, Settings } from '@phosphor-icon
interface TeamManagementDialogProps {
  onOpenChange: (open: boolea
  onUpdateTeamStatus: (teamId: string, isActive: boolea

interface TeamManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teams: Team[]
  onUpdateTeamStatus: (teamId: string, isActive: boolean) => void
}

export function TeamManagementDialog({ 
        
        </Dialog
        <
            <div clas
              <span className="
            <span className="text-sm text-muted-foreground">


            {teams.map(team => (
                <CardHeader className="pb-3
                    <d
                      <CardDescription className="text-sm">
                      </CardDescri
                    <Switch
                      on
                  </div>
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

            ))}


          {activeTeamsCount === 0 && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive font-medium mb-1">
                No teams enabled

              <p className="text-sm text-destructive/80">

              </p>

          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>

      </DialogContent>

  )
