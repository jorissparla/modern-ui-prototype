import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Plus, Palette, Eye, EyeOff } from '@phosphor-icons/react'
import { ActivityCode } from '../App'
import { toast } from 'sonner'

interface ActivityCodesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activityCodes: ActivityCode[]
  onUpdateActivityCodes: (codes: ActivityCode[]) => void
}

const colorOptions = [
  { value: 'bg-yellow-500', label: 'Yellow', color: '#eab308' },
  { value: 'bg-orange-500', label: 'Orange', color: '#f97316' },
  { value: 'bg-red-500', label: 'Red', color: '#ef4444' },
  { value: 'bg-pink-500', label: 'Pink', color: '#ec4899' },
  { value: 'bg-purple-500', label: 'Purple', color: '#a855f7' },
  { value: 'bg-indigo-500', label: 'Indigo', color: '#6366f1' },
  { value: 'bg-blue-500', label: 'Blue', color: '#3b82f6' },
  { value: 'bg-teal-500', label: 'Teal', color: '#14b8a6' },
  { value: 'bg-emerald-500', label: 'Emerald', color: '#10b981' },
  { value: 'bg-green-500', label: 'Green', color: '#22c55e' },
  { value: 'bg-lime-500', label: 'Lime', color: '#84cc16' },
  { value: 'bg-amber-500', label: 'Amber', color: '#f59e0b' },
  { value: 'bg-gray-500', label: 'Gray', color: '#6b7280' },
  { value: 'bg-slate-500', label: 'Slate', color: '#64748b' },
]

export function ActivityCodesDialog({ open, onOpenChange, activityCodes, onUpdateActivityCodes }: ActivityCodesDialogProps) {
  const [newCode, setNewCode] = useState({
    label: '',
    shortLabel: '',
    color: 'bg-blue-500'
  })

  const toggleCodeStatus = (codeId: string) => {
    const updatedCodes = activityCodes.map(code =>
      code.id === codeId ? { ...code, isActive: !code.isActive } : code
    )
    onUpdateActivityCodes(updatedCodes)
    
    const code = activityCodes.find(c => c.id === codeId)
    if (code) {
      toast.success(`${code.label} ${code.isActive ? 'hidden' : 'enabled'}`)
    }
  }

  const addCustomCode = () => {
    if (!newCode.label.trim() || !newCode.shortLabel.trim()) {
      toast.error('Please fill in both label and short label')
      return
    }

    // Check for duplicate labels or short labels
    const labelExists = activityCodes.some(code => 
      code.label.toLowerCase() === newCode.label.toLowerCase() ||
      code.shortLabel.toLowerCase() === newCode.shortLabel.toLowerCase()
    )

    if (labelExists) {
      toast.error('A code with this label or short label already exists')
      return
    }

    const customCode: ActivityCode = {
      id: `custom-${Date.now()}`,
      label: newCode.label.trim(),
      shortLabel: newCode.shortLabel.trim().toUpperCase(),
      color: newCode.color,
      isActive: true,
      isBuiltIn: false
    }

    onUpdateActivityCodes([...activityCodes, customCode])
    setNewCode({ label: '', shortLabel: '', color: 'bg-blue-500' })
    toast.success(`Added "${customCode.label}" activity code`)
  }

  const removeCustomCode = (codeId: string) => {
    const updatedCodes = activityCodes.filter(code => code.id !== codeId)
    onUpdateActivityCodes(updatedCodes)
    
    const code = activityCodes.find(c => c.id === codeId)
    if (code) {
      toast.success(`Removed "${code.label}" activity code`)
    }
  }

  const updateCodeColor = (codeId: string, newColor: string) => {
    const updatedCodes = activityCodes.map(code =>
      code.id === codeId ? { ...code, color: newColor } : code
    )
    onUpdateActivityCodes(updatedCodes)
  }

  const builtInCodes = activityCodes.filter(code => code.isBuiltIn)
  const customCodes = activityCodes.filter(code => !code.isBuiltIn)
  const activeCodes = activityCodes.filter(code => code.isActive)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette size={20} />
            Activity Codes Configuration
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary */}
          <Card className="p-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Badge variant="secondary">{activeCodes.length} Active Codes</Badge>
              <Badge variant="outline">{builtInCodes.length} Built-in</Badge>
              <Badge variant="outline">{customCodes.length} Custom</Badge>
            </div>
          </Card>

          {/* Built-in Codes */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Built-in Activity Codes</h3>
            <div className="grid gap-3">
              {builtInCodes.map(code => (
                <Card key={code.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${code.color}`} />
                      <div>
                        <span className="font-medium">{code.label}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {code.shortLabel}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Color Picker for built-in codes */}
                      <div className="flex gap-1">
                        {colorOptions.slice(0, 6).map(colorOption => (
                          <button
                            key={colorOption.value}
                            onClick={() => updateCodeColor(code.id, colorOption.value)}
                            className={`w-4 h-4 rounded ${colorOption.value} border-2 ${
                              code.color === colorOption.value ? 'border-foreground' : 'border-transparent'
                            } hover:border-muted-foreground transition-colors`}
                            title={`Change to ${colorOption.label}`}
                          />
                        ))}
                      </div>
                      <Switch
                        checked={code.isActive}
                        onCheckedChange={() => toggleCodeStatus(code.id)}
                      />
                      {code.isActive ? (
                        <Eye size={16} className="text-muted-foreground" />
                      ) : (
                        <EyeOff size={16} className="text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Custom Codes */}
          {customCodes.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Custom Activity Codes</h3>
                <div className="grid gap-3">
                  {customCodes.map(code => (
                    <Card key={code.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded ${code.color}`} />
                          <div>
                            <span className="font-medium">{code.label}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {code.shortLabel}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Color Picker for custom codes */}
                          <div className="flex gap-1">
                            {colorOptions.slice(0, 6).map(colorOption => (
                              <button
                                key={colorOption.value}
                                onClick={() => updateCodeColor(code.id, colorOption.value)}
                                className={`w-4 h-4 rounded ${colorOption.value} border-2 ${
                                  code.color === colorOption.value ? 'border-foreground' : 'border-transparent'
                                } hover:border-muted-foreground transition-colors`}
                                title={`Change to ${colorOption.label}`}
                              />
                            ))}
                          </div>
                          <Switch
                            checked={code.isActive}
                            onCheckedChange={() => toggleCodeStatus(code.id)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCustomCode(code.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Add Custom Code */}
          <Separator />
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Add Custom Activity Code</h3>
            <Card className="p-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="code-label">Label</Label>
                    <Input
                      id="code-label"
                      placeholder="e.g., Client Meeting"
                      value={newCode.label}
                      onChange={(e) => setNewCode(prev => ({ ...prev, label: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code-short">Short Label</Label>
                    <Input
                      id="code-short"
                      placeholder="e.g., CM"
                      maxLength={3}
                      value={newCode.shortLabel}
                      onChange={(e) => setNewCode(prev => ({ ...prev, shortLabel: e.target.value.toUpperCase() }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map(colorOption => (
                      <button
                        key={colorOption.value}
                        onClick={() => setNewCode(prev => ({ ...prev, color: colorOption.value }))}
                        className={`w-6 h-6 rounded ${colorOption.value} border-2 ${
                          newCode.color === colorOption.value ? 'border-foreground' : 'border-border'
                        } hover:border-muted-foreground transition-colors`}
                        title={colorOption.label}
                      />
                    ))}
                  </div>
                </div>

                <Button onClick={addCustomCode} className="gap-2">
                  <Plus size={16} />
                  Add Activity Code
                </Button>
              </div>
            </Card>
          </div>

          {/* Instructions */}
          <Card className="p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground">
              <strong>Tip:</strong> Use the switches to show/hide activity codes in the capacity grid. 
              The "Available" status is always available for clearing assignments.
            </p>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}