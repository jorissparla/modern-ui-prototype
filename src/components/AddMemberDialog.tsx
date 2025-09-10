import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TeamMember, Team } from '../App'

interface AddMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddMember: (member: Omit<TeamMember, 'id'>) => void
  teams: Team[]
  selectedTeamId: string
}

export function AddMemberDialog({ open, onOpenChange, onAddMember, teams, selectedTeamId }: AddMemberDialogProps) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [info, setInfo] = useState('')
  const [backlog, setBacklog] = useState('0')
  const [awaitingCustomer, setAwaitingCustomer] = useState('0')
  const [researching, setResearching] = useState('0')
  const [teamId, setTeamId] = useState(selectedTeamId)

  // Update teamId when selectedTeamId changes or dialog opens
  useEffect(() => {
    if (open) {
      setTeamId(selectedTeamId)
    }
  }, [open, selectedTeamId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && role.trim() && teamId) {
      onAddMember({
        name: name.trim(),
        role: role.trim(),
        info: info.trim(),
        teamId,
        load: {
          backlog: parseInt(backlog) || 0,
          awaitingCustomer: parseInt(awaitingCustomer) || 0,
          researching: parseInt(researching) || 0
        }
      })
      setName('')
      setRole('')
      setInfo('')
      setBacklog('0')
      setAwaitingCustomer('0')
      setResearching('0')
      setTeamId(selectedTeamId)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="team">Team</Label>
            <Select value={teamId} onValueChange={setTeamId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map(team => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter team member name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Senior Developer, Designer"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="info">Additional Info</Label>
            <Textarea
              id="info"
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              placeholder="Skills, location, notes..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Current Load</Label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="backlog" className="text-xs">Backlog</Label>
                <Input
                  id="backlog"
                  type="number"
                  min="0"
                  value={backlog}
                  onChange={(e) => setBacklog(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="awaiting" className="text-xs">Awaiting Customer</Label>
                <Input
                  id="awaiting"
                  type="number"
                  min="0"
                  value={awaitingCustomer}
                  onChange={(e) => setAwaitingCustomer(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="researching" className="text-xs">Researching</Label>
                <Input
                  id="researching"
                  type="number"
                  min="0"
                  value={researching}
                  onChange={(e) => setResearching(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Member
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}