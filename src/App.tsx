import { useKV } from '@github/spark/hooks'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Toaster } from '@/components/ui/sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CaretLeft, CaretRight, Plus, Users, ArrowUp, ArrowDown, Settings, Palette, MagnifyingGlass } from '@phosphor-icons/react'
import { AddMemberDialog } from './components/AddMemberDialog'
import { CapacityGrid } from './components/CapacityGrid'
import { TeamMemberList } from './components/TeamMemberList'
import { TeamManagementDialog } from './components/TeamManagementDialog'
import { ActivityCodesDialog } from './components/ActivityCodesDialog'
import { SkillsMatrixDialog, Skill } from './components/SkillsMatrixDialog'
import { SkillFilterDialog } from './components/SkillFilterDialog'

export interface TeamMember {
  id: string
  name: string
  role: string
  info: string
  teamId: string
  load: {
    backlog: number
    awaitingCustomer: number
    researching: number
  }
}

export interface Team {
  id: string
  name: string
  description: string
  isActive: boolean
}

export interface ActivityCode {
  id: string
  label: string
  shortLabel: string
  color: string
  isActive: boolean
  isBuiltIn: boolean
}

export interface Assignment {
  memberId: string
  date: string
  status: 'available' | 'busy' | 'holiday' | 'project-a' | 'project-b' | 'meeting' | 'training' | 'support' | 'research' | 'vacation' | 'sick'
  timeSlot?: 'morning' | 'afternoon' | 'full-day'
  project?: string
}

function App() {
  const [teams, setTeams] = useKV<Team[]>('teams', [])
  const [teamMembers, setTeamMembers] = useKV<TeamMember[]>('team-members', [])
  const [assignments, setAssignments] = useKV<Assignment[]>('assignments', [])
  const [activityCodes, setActivityCodes] = useKV<ActivityCode[]>('activity-codes', [])
  const [skills, setSkills] = useKV<Skill[]>('skills', [])
  const [memberSkills, setMemberSkills] = useKV<Record<string, Record<string, 'C' | 'E' | 'K'>>>('member-skills', {})
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isTeamManagementOpen, setIsTeamManagementOpen] = useState(false)
  const [isActivityCodesOpen, setIsActivityCodesOpen] = useState(false)
  const [isSkillsMatrixOpen, setIsSkillsMatrixOpen] = useState(false)
  const [isSkillFilterOpen, setIsSkillFilterOpen] = useState(false)
  const [selectedMemberForSkills, setSelectedMemberForSkills] = useState<TeamMember | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedTeamId, setSelectedTeamId] = useState<string>('')

  // Initialize with default activity codes if empty
  useEffect(() => {
    if (!activityCodes || activityCodes.length === 0) {
      const defaultActivityCodes: ActivityCode[] = [
        { id: 'busy', label: 'Busy', shortLabel: 'B', color: 'bg-yellow-500', isActive: true, isBuiltIn: true },
        { id: 'holiday', label: 'Holiday', shortLabel: 'H', color: 'bg-purple-500', isActive: true, isBuiltIn: true },
        { id: 'project-a', label: 'Project A', shortLabel: 'PA', color: 'bg-blue-500', isActive: true, isBuiltIn: true },
        { id: 'project-b', label: 'Project B', shortLabel: 'PB', color: 'bg-emerald-500', isActive: true, isBuiltIn: true },
        { id: 'meeting', label: 'Meeting', shortLabel: 'M', color: 'bg-orange-500', isActive: true, isBuiltIn: true },
        { id: 'training', label: 'Training', shortLabel: 'T', color: 'bg-indigo-500', isActive: true, isBuiltIn: true },
        { id: 'support', label: 'Support', shortLabel: 'S', color: 'bg-red-500', isActive: false, isBuiltIn: true },
        { id: 'research', label: 'R&D', shortLabel: 'R', color: 'bg-teal-500', isActive: false, isBuiltIn: true },
        { id: 'vacation', label: 'Vacation', shortLabel: 'V', color: 'bg-pink-500', isActive: false, isBuiltIn: true },
        { id: 'sick', label: 'Sick Leave', shortLabel: 'SL', color: 'bg-gray-500', isActive: false, isBuiltIn: true }
      ]
      setActivityCodes(defaultActivityCodes)
    }
  }, [])
  
  // Initialize with default skills if empty
  useEffect(() => {
    if (!skills || skills.length === 0) {
      const defaultSkills: Skill[] = [
        // Frontend Team Skills
        { id: 'react', name: 'React Framework', code: 'REACT', category: 'Frontend Frameworks', level: 'E' },
        { id: 'vue', name: 'Vue.js Framework', code: 'VUE', category: 'Frontend Frameworks', level: 'C' },
        { id: 'angular', name: 'Angular Framework', code: 'ANG', category: 'Frontend Frameworks', level: 'C' },
        { id: 'typescript', name: 'TypeScript', code: 'TS', category: 'Programming Languages', level: 'E' },
        { id: 'javascript', name: 'JavaScript ES6+', code: 'JS', category: 'Programming Languages', level: 'E' },
        { id: 'html-css', name: 'HTML5 & CSS3', code: 'HTML', category: 'Web Technologies', level: 'E' },
        { id: 'sass', name: 'SASS/SCSS', code: 'SASS', category: 'Styling', level: 'C' },
        { id: 'tailwind', name: 'Tailwind CSS', code: 'TW', category: 'Styling', level: 'E' },
        { id: 'webpack', name: 'Webpack Bundling', code: 'WP', category: 'Build Tools', level: 'C' },
        { id: 'vite', name: 'Vite Build Tool', code: 'VITE', category: 'Build Tools', level: 'E' },
        { id: 'jest', name: 'Jest Testing', code: 'JEST', category: 'Testing', level: 'C' },
        { id: 'cypress', name: 'Cypress E2E Testing', code: 'CYP', category: 'Testing', level: 'C' },
        { id: 'responsive', name: 'Responsive Design', code: 'RWD', category: 'UI/UX', level: 'E' },
        { id: 'accessibility', name: 'Web Accessibility (WCAG)', code: 'A11Y', category: 'UI/UX', level: 'C' },
        { id: 'react-native', name: 'React Native', code: 'RN', category: 'Mobile Development', level: 'C' },
        
        // Backend Team Skills
        { id: 'nodejs', name: 'Node.js Runtime', code: 'NODE', category: 'Backend Runtime', level: 'E' },
        { id: 'python', name: 'Python Programming', code: 'PY', category: 'Programming Languages', level: 'E' },
        { id: 'java', name: 'Java Programming', code: 'JAVA', category: 'Programming Languages', level: 'E' },
        { id: 'spring', name: 'Spring Boot Framework', code: 'SPRING', category: 'Backend Frameworks', level: 'E' },
        { id: 'django', name: 'Django Framework', code: 'DJG', category: 'Backend Frameworks', level: 'C' },
        { id: 'fastapi', name: 'FastAPI Framework', code: 'FAPI', category: 'Backend Frameworks', level: 'C' },
        { id: 'express', name: 'Express.js Framework', code: 'EXP', category: 'Backend Frameworks', level: 'E' },
        { id: 'postgresql', name: 'PostgreSQL Database', code: 'PSQL', category: 'Databases', level: 'E' },
        { id: 'mongodb', name: 'MongoDB Database', code: 'MONGO', category: 'Databases', level: 'C' },
        { id: 'redis', name: 'Redis Cache', code: 'REDIS', category: 'Databases', level: 'C' },
        { id: 'graphql', name: 'GraphQL API', code: 'GQL', category: 'API Technologies', level: 'C' },
        { id: 'rest-api', name: 'REST API Design', code: 'REST', category: 'API Technologies', level: 'E' },
        { id: 'microservices', name: 'Microservices Architecture', code: 'MSA', category: 'Architecture', level: 'C' },
        { id: 'auth', name: 'Authentication & Authorization', code: 'AUTH', category: 'Security', level: 'E' },
        { id: 'oauth', name: 'OAuth 2.0 / JWT', code: 'OAUTH', category: 'Security', level: 'C' },
        
        // Design Team Skills
        { id: 'figma', name: 'Figma Design Tool', code: 'FIG', category: 'Design Tools', level: 'E' },
        { id: 'sketch', name: 'Sketch Design Tool', code: 'SKT', category: 'Design Tools', level: 'C' },
        { id: 'adobe-xd', name: 'Adobe XD', code: 'XD', category: 'Design Tools', level: 'C' },
        { id: 'photoshop', name: 'Adobe Photoshop', code: 'PS', category: 'Graphics Tools', level: 'E' },
        { id: 'illustrator', name: 'Adobe Illustrator', code: 'AI', category: 'Graphics Tools', level: 'C' },
        { id: 'user-research', name: 'User Research Methods', code: 'UR', category: 'UX Research', level: 'E' },
        { id: 'usability-testing', name: 'Usability Testing', code: 'UT', category: 'UX Research', level: 'C' },
        { id: 'wireframing', name: 'Wireframing & Prototyping', code: 'WIRE', category: 'UX Design', level: 'E' },
        { id: 'design-systems', name: 'Design Systems', code: 'DS', category: 'Design Strategy', level: 'E' },
        { id: 'brand-design', name: 'Brand & Visual Identity', code: 'BRAND', category: 'Visual Design', level: 'C' },
        { id: 'interaction-design', name: 'Interaction Design', code: 'IXD', category: 'UX Design', level: 'E' },
        { id: 'motion-design', name: 'Motion & Animation Design', code: 'MOTION', category: 'Visual Design', level: 'C' },
        
        // DevOps Team Skills
        { id: 'aws', name: 'Amazon Web Services', code: 'AWS', category: 'Cloud Platforms', level: 'E' },
        { id: 'azure', name: 'Microsoft Azure', code: 'AZURE', category: 'Cloud Platforms', level: 'C' },
        { id: 'gcp', name: 'Google Cloud Platform', code: 'GCP', category: 'Cloud Platforms', level: 'C' },
        { id: 'kubernetes', name: 'Kubernetes Orchestration', code: 'K8S', category: 'Container Orchestration', level: 'E' },
        { id: 'docker', name: 'Docker Containerization', code: 'DOCK', category: 'Containerization', level: 'E' },
        { id: 'terraform', name: 'Terraform IaC', code: 'TF', category: 'Infrastructure as Code', level: 'E' },
        { id: 'ansible', name: 'Ansible Automation', code: 'ANS', category: 'Configuration Management', level: 'C' },
        { id: 'jenkins', name: 'Jenkins CI/CD', code: 'JEN', category: 'CI/CD Tools', level: 'C' },
        { id: 'github-actions', name: 'GitHub Actions', code: 'GHA', category: 'CI/CD Tools', level: 'E' },
        { id: 'prometheus', name: 'Prometheus Monitoring', code: 'PROM', category: 'Monitoring', level: 'C' },
        { id: 'grafana', name: 'Grafana Dashboards', code: 'GRAF', category: 'Monitoring', level: 'C' },
        { id: 'elk', name: 'ELK Stack (Elasticsearch, Logstash, Kibana)', code: 'ELK', category: 'Logging', level: 'C' },
        { id: 'security-scanning', name: 'Security Vulnerability Scanning', code: 'SEC', category: 'Security', level: 'E' },
        { id: 'incident-response', name: 'Incident Response & Management', code: 'IR', category: 'Operations', level: 'E' }
      ]
      setSkills(defaultSkills)
    }
  }, [])

  // Initialize with some sample member skills if empty
  useEffect(() => {
    if ((!memberSkills || Object.keys(memberSkills).length === 0) && teamMembers && teamMembers.length > 0) {
      const sampleMemberSkills: Record<string, Record<string, 'C' | 'E' | 'K'>> = {
        // Frontend Team Skills
        '1': { // Sarah Chen
          'react': 'E',
          'typescript': 'E',
          'javascript': 'E',
          'html-css': 'E',
          'tailwind': 'C',
          'vite': 'E',
          'responsive': 'E',
          'accessibility': 'C'
        },
        '2': { // Alex Thompson
          'vue': 'E',
          'typescript': 'E',
          'javascript': 'E',
          'html-css': 'E',
          'sass': 'E',
          'webpack': 'C',
          'jest': 'C'
        },
        '3': { // Zoe Martinez
          'react-native': 'E',
          'react': 'E',
          'typescript': 'C',
          'javascript': 'E',
          'responsive': 'E'
        },
        '4': { // Oliver Johnson
          'angular': 'E',
          'typescript': 'E',
          'javascript': 'E',
          'sass': 'E',
          'html-css': 'E',
          'cypress': 'C'
        },
        '5': { // Maya Patel
          'react': 'C',
          'html-css': 'E',
          'tailwind': 'E',
          'sass': 'C',
          'responsive': 'E',
          'accessibility': 'E'
        },

        // Backend Team Skills
        '6': { // Marcus Johnson
          'nodejs': 'E',
          'express': 'E',
          'postgresql': 'E',
          'rest-api': 'E',
          'auth': 'E',
          'microservices': 'C',
          'mongodb': 'C'
        },
        '7': { // Elena Rodriguez
          'python': 'E',
          'django': 'E',
          'fastapi': 'C',
          'postgresql': 'C',
          'rest-api': 'E',
          'auth': 'C'
        },
        '8': { // David Kim
          'java': 'E',
          'spring': 'E',
          'postgresql': 'E',
          'rest-api': 'E',
          'microservices': 'E',
          'auth': 'C'
        },
        '9': { // James Wilson
          'postgresql': 'E',
          'mongodb': 'E',
          'redis': 'C',
          'python': 'C',
          'nodejs': 'C'
        },
        '10': { // Sofia Andersson
          'graphql': 'E',
          'rest-api': 'E',
          'nodejs': 'E',
          'express': 'E',
          'postgresql': 'C',
          'auth': 'E'
        },

        // Design Team Skills
        '11': { // Priya Sharma
          'figma': 'E',
          'user-research': 'E',
          'wireframing': 'E',
          'design-systems': 'E',
          'interaction-design': 'E',
          'photoshop': 'C',
          'usability-testing': 'C'
        },
        '12': { // Nina Petrov
          'figma': 'E',
          'sketch': 'C',
          'design-systems': 'E',
          'wireframing': 'C',
          'interaction-design': 'C',
          'brand-design': 'C'
        },
        '13': { // Lucas Brown
          'figma': 'E',
          'wireframing': 'E',
          'user-research': 'C',
          'usability-testing': 'E',
          'interaction-design': 'E'
        },
        '14': { // Isabella Garcia
          'photoshop': 'E',
          'illustrator': 'E',
          'brand-design': 'E',
          'figma': 'C',
          'motion-design': 'C'
        },

        // DevOps Team Skills
        '15': { // Ryan O'Connor
          'aws': 'E',
          'kubernetes': 'E',
          'docker': 'E',
          'terraform': 'E',
          'github-actions': 'E',
          'security-scanning': 'E',
          'incident-response': 'E',
          'azure': 'C'
        },
        '16': { // Emma Thompson
          'aws': 'C',
          'kubernetes': 'E',
          'docker': 'E',
          'prometheus': 'E',
          'grafana': 'E',
          'incident-response': 'E',
          'security-scanning': 'C'
        },
        '17': { // Carlos Mendez
          'azure': 'E',
          'terraform': 'E',
          'kubernetes': 'C',
          'docker': 'E',
          'ansible': 'C',
          'jenkins': 'C'
        },
        '18': { // Aisha Ibrahim
          'security-scanning': 'E',
          'github-actions': 'E',
          'aws': 'C',
          'kubernetes': 'C',
          'docker': 'E',
          'incident-response': 'C'
        }
      }
      setMemberSkills(sampleMemberSkills)
    }
  }, [teamMembers])
  // Initialize with default teams and members if empty
  useEffect(() => {
    if (!teams || teams.length === 0) {
      const defaultTeams: Team[] = [
        { id: 'frontend', name: 'Frontend Team', description: 'User interface development', isActive: true },
        { id: 'backend', name: 'Backend Team', description: 'Server and API development', isActive: true },
        { id: 'design', name: 'Design Team', description: 'UX/UI and product design', isActive: false },
        { id: 'devops', name: 'DevOps Team', description: 'Infrastructure and deployment', isActive: false }
      ]
      setTeams(defaultTeams)
      setSelectedTeamId(defaultTeams.find(t => t.isActive)?.id || defaultTeams[0].id)
    }
  }, [])

  useEffect(() => {
    if (!teamMembers || teamMembers.length === 0) {
      const defaultMembers: TeamMember[] = [
        // Frontend Team
        { 
          id: '1', 
          name: 'Sarah Chen', 
          role: 'Frontend Developer', 
          info: 'React specialist',
          teamId: 'frontend',
          load: { backlog: 8, awaitingCustomer: 2, researching: 1 }
        },
        { 
          id: '2', 
          name: 'Alex Thompson', 
          role: 'Senior Frontend Developer', 
          info: 'Vue.js & TypeScript',
          teamId: 'frontend',
          load: { backlog: 6, awaitingCustomer: 3, researching: 2 }
        },
        { 
          id: '3', 
          name: 'Zoe Martinez', 
          role: 'Mobile Developer', 
          info: 'React Native',
          teamId: 'frontend',
          load: { backlog: 12, awaitingCustomer: 1, researching: 1 }
        },
        { 
          id: '4', 
          name: 'Oliver Johnson', 
          role: 'Frontend Engineer', 
          info: 'Angular & SCSS',
          teamId: 'frontend',
          load: { backlog: 9, awaitingCustomer: 2, researching: 3 }
        },
        { 
          id: '5', 
          name: 'Maya Patel', 
          role: 'UI Developer', 
          info: 'Component libraries',
          teamId: 'frontend',
          load: { backlog: 5, awaitingCustomer: 4, researching: 1 }
        },

        // Backend Team
        { 
          id: '6', 
          name: 'Marcus Johnson', 
          role: 'Backend Developer', 
          info: 'Node.js expert',
          teamId: 'backend',
          load: { backlog: 15, awaitingCustomer: 1, researching: 3 }
        },
        { 
          id: '7', 
          name: 'Elena Rodriguez', 
          role: 'Python Developer', 
          info: 'Django & FastAPI',
          teamId: 'backend',
          load: { backlog: 11, awaitingCustomer: 2, researching: 4 }
        },
        { 
          id: '8', 
          name: 'David Kim', 
          role: 'Java Developer', 
          info: 'Spring Boot',
          teamId: 'backend',
          load: { backlog: 7, awaitingCustomer: 5, researching: 2 }
        },
        { 
          id: '9', 
          name: 'James Wilson', 
          role: 'Database Engineer', 
          info: 'PostgreSQL & MongoDB',
          teamId: 'backend',
          load: { backlog: 13, awaitingCustomer: 1, researching: 1 }
        },
        { 
          id: '10', 
          name: 'Sofia Andersson', 
          role: 'API Developer', 
          info: 'GraphQL & REST',
          teamId: 'backend',
          load: { backlog: 8, awaitingCustomer: 3, researching: 2 }
        },

        // Design Team
        { 
          id: '11', 
          name: 'Priya Sharma', 
          role: 'UX Designer', 
          info: 'User research',
          teamId: 'design',
          load: { backlog: 4, awaitingCustomer: 6, researching: 5 }
        },
        { 
          id: '12', 
          name: 'Nina Petrov', 
          role: 'UI Designer', 
          info: 'Design systems',
          teamId: 'design',
          load: { backlog: 6, awaitingCustomer: 4, researching: 3 }
        },
        { 
          id: '13', 
          name: 'Lucas Brown', 
          role: 'Product Designer', 
          info: 'Prototyping & testing',
          teamId: 'design',
          load: { backlog: 9, awaitingCustomer: 2, researching: 4 }
        },
        { 
          id: '14', 
          name: 'Isabella Garcia', 
          role: 'Graphic Designer', 
          info: 'Branding & illustrations',
          teamId: 'design',
          load: { backlog: 3, awaitingCustomer: 7, researching: 2 }
        },

        // DevOps Team
        { 
          id: '15', 
          name: 'Ryan O\'Connor', 
          role: 'DevOps Engineer', 
          info: 'AWS & Kubernetes',
          teamId: 'devops',
          load: { backlog: 18, awaitingCustomer: 0, researching: 2 }
        },
        { 
          id: '16', 
          name: 'Emma Thompson', 
          role: 'Site Reliability Engineer', 
          info: 'Monitoring & alerts',
          teamId: 'devops',
          load: { backlog: 14, awaitingCustomer: 1, researching: 3 }
        },
        { 
          id: '17', 
          name: 'Carlos Mendez', 
          role: 'Cloud Engineer', 
          info: 'Azure & Terraform',
          teamId: 'devops',
          load: { backlog: 10, awaitingCustomer: 2, researching: 1 }
        },
        { 
          id: '18', 
          name: 'Aisha Ibrahim', 
          role: 'Security Engineer', 
          info: 'CI/CD & security',
          teamId: 'devops',
          load: { backlog: 12, awaitingCustomer: 1, researching: 4 }
        }
      ]
      setTeamMembers(defaultMembers)
    }
  }, [])

  // Set default selected team
  useEffect(() => {
    if (teams && teams.length > 0 && !selectedTeamId) {
      const activeTeam = teams.find(t => t.isActive)
      setSelectedTeamId(activeTeam?.id || teams[0].id)
    }
  }, [teams, selectedTeamId])

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const addTeamMember = (member: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...member,
      id: Date.now().toString()
    }
    setTeamMembers(current => [...(current || []), newMember])
  }

  const toggleSort = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
  }

  const updateTeamStatus = (teamId: string, isActive: boolean) => {
    setTeams(current => 
      (current || []).map(team => 
        team.id === teamId ? { ...team, isActive } : team
      )
    )
  }

  const updateActivityCodes = (codes: ActivityCode[]) => {
    setActivityCodes(codes)
  }

  const updateMemberSkills = (memberId: string, skills: Record<string, 'C' | 'E' | 'K'>) => {
    setMemberSkills(current => ({
      ...current,
      [memberId]: skills
    }))
  }

  const handleMemberRightClick = (member: TeamMember, event: React.MouseEvent) => {
    event.preventDefault()
    setSelectedMemberForSkills(member)
    setIsSkillsMatrixOpen(true)
  }

  const handleMemberSelectFromSkillFilter = (member: TeamMember) => {
    // Switch to the member's team if it's different from currently selected
    if (member.teamId !== selectedTeamId) {
      setSelectedTeamId(member.teamId)
    }
    // Close the skill filter dialog
    setIsSkillFilterOpen(false)
    // Optionally, you could highlight the member or show their skills
    setSelectedMemberForSkills(member)
    setIsSkillsMatrixOpen(true)
  }

  const getTeamSpecificSkills = (teamId: string): Skill[] => {
    if (!skills) return []
    
    // Filter skills based on team type
    const teamSkillCategories: Record<string, string[]> = {
      'frontend': [
        'Frontend Frameworks', 'Programming Languages', 'Web Technologies', 
        'Styling', 'Build Tools', 'Testing', 'UI/UX', 'Mobile Development'
      ],
      'backend': [
        'Backend Runtime', 'Programming Languages', 'Backend Frameworks', 
        'Databases', 'API Technologies', 'Architecture', 'Security'
      ],
      'design': [
        'Design Tools', 'Graphics Tools', 'UX Research', 'UX Design', 
        'Design Strategy', 'Visual Design'
      ],
      'devops': [
        'Cloud Platforms', 'Container Orchestration', 'Containerization', 
        'Infrastructure as Code', 'Configuration Management', 'CI/CD Tools', 
        'Monitoring', 'Logging', 'Security', 'Operations'
      ]
    }

    const relevantCategories = teamSkillCategories[teamId] || []
    return skills.filter(skill => relevantCategories.includes(skill.category))
  }

  // Filter to show only active teams in the selector
  const activeTeams = teams?.filter(team => team.isActive) || []
  
  // Filter members by selected team
  const filteredMembers = (teamMembers || []).filter(member => member.teamId === selectedTeamId)
  
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    const comparison = a.load.backlog - b.load.backlog
    return sortDirection === 'asc' ? comparison : -comparison
  })

  const selectedTeam = teams?.find(team => team.id === selectedTeamId)

  const updateAssignment = (memberId: string, date: string, status: Assignment['status'], timeSlot: Assignment['timeSlot'] = 'full-day') => {
    setAssignments(current => {
      const currentAssignments = current || []
      // If setting to available, remove all assignments for this date
      if (status === 'available') {
        return currentAssignments.filter(a => !(a.memberId === memberId && a.date === date))
      }
      
      // For full-day assignments, replace any existing assignments
      if (timeSlot === 'full-day') {
        const filtered = currentAssignments.filter(a => !(a.memberId === memberId && a.date === date))
        return [...filtered, { memberId, date, status, timeSlot }]
      }
      
      // For time-specific assignments, check if there's a conflicting assignment
      const existing = currentAssignments.find(a => 
        a.memberId === memberId && 
        a.date === date && 
        (a.timeSlot === timeSlot || a.timeSlot === 'full-day')
      )
      
      if (existing) {
        // Update existing assignment
        return currentAssignments.map(a => 
          a.memberId === memberId && a.date === date && a.timeSlot === timeSlot
            ? { ...a, status }
            : a
        )
      } else {
        // Add new assignment
        return [...currentAssignments, { memberId, date, status, timeSlot }]
      }
    })
  }

  const getAssignments = (memberId: string, date: string): Assignment[] => {
    return (assignments || []).filter(a => a.memberId === memberId && a.date === date)
  }

  return (
    <div className="font-inter min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users size={32} className="text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Team Capacity Planner</h1>
              <p className="text-muted-foreground">Manage team availability, project assignments, and skills</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Team Selector */}
            <div className="flex items-center gap-2">
              <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  {activeTeams.map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsTeamManagementOpen(true)}
                className="p-2"
                title="Manage Teams"
              >
                <Settings size={16} />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => setIsAddMemberOpen(true)} className="gap-2">
                <Plus size={16} />
                Add Team Member
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsSkillFilterOpen(true)}
                className="gap-2"
              >
                <MagnifyingGlass size={16} />
                Find by Skills
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsActivityCodesOpen(true)}
                className="gap-2"
              >
                <Palette size={16} />
                Activity Codes
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm font-medium">
                {selectedTeam?.name || 'Team'} Capacity
              </Badge>
              <span className="text-sm text-muted-foreground">
                {filteredMembers.length} team members
              </span>
              {selectedTeam?.description && (
                <span className="text-sm text-muted-foreground">•</span>
              )}
              {selectedTeam?.description && (
                <span className="text-sm text-muted-foreground">
                  {selectedTeam.description}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigateMonth('prev')}
                className="p-2"
              >
                <CaretLeft size={16} />
              </Button>
              
              <div className="px-4 py-2 text-sm font-medium bg-secondary rounded-md">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigateMonth('next')}
                className="p-2"
              >
                <CaretRight size={16} />
              </Button>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        {(!teamMembers || teamMembers.length === 0 || filteredMembers.length === 0 || activeTeams.length === 0) ? (
          <Card className="p-12 text-center">
            <Users size={64} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {activeTeams.length === 0 
                ? 'No teams enabled' 
                : (!teamMembers || teamMembers.length === 0) 
                  ? 'No team members yet' 
                  : `No members in ${selectedTeam?.name || 'this team'}`
              }
            </h3>
            <p className="text-muted-foreground mb-4">
              {activeTeams.length === 0
                ? 'Enable at least one team in the team management settings to start capacity planning'
                : (!teamMembers || teamMembers.length === 0) 
                  ? 'Start by adding team members to begin capacity planning'
                  : `Add team members to ${selectedTeam?.name || 'this team'} to start capacity planning`
              }
            </p>
            {activeTeams.length === 0 ? (
              <Button onClick={() => setIsTeamManagementOpen(true)} className="gap-2">
                <Settings size={16} />
                Manage Teams
              </Button>
            ) : (
              <Button onClick={() => setIsAddMemberOpen(true)} className="gap-2">
                <Plus size={16} />
                Add {(!teamMembers || teamMembers.length === 0) ? 'Your First' : 'Team'} Member
              </Button>
            )}
          </Card>
        ) : (
          <div className="w-full">
            {/* Capacity Grid */}
            <CapacityGrid
              members={sortedMembers}
              currentDate={currentDate}
              getAssignments={getAssignments}
              updateAssignment={updateAssignment}
              sortDirection={sortDirection}
              onToggleSort={toggleSort}
              activityCodes={activityCodes || []}
              onMemberRightClick={handleMemberRightClick}
              memberSkills={memberSkills}
            />
          </div>
        )}

        {/* Add Member Dialog */}
        <AddMemberDialog
          open={isAddMemberOpen}
          onOpenChange={setIsAddMemberOpen}
          onAddMember={addTeamMember}
          teams={teams || []}
          selectedTeamId={selectedTeamId}
        />

        {/* Team Management Dialog */}
        <TeamManagementDialog
          open={isTeamManagementOpen}
          onOpenChange={setIsTeamManagementOpen}
          teams={teams || []}
          onUpdateTeamStatus={updateTeamStatus}
        />

        {/* Activity Codes Dialog */}
        <ActivityCodesDialog
          open={isActivityCodesOpen}
          onOpenChange={setIsActivityCodesOpen}
          activityCodes={activityCodes || []}
          onUpdateActivityCodes={updateActivityCodes}
        />

        {/* Skills Matrix Dialog */}
        <SkillsMatrixDialog
          open={isSkillsMatrixOpen}
          onOpenChange={setIsSkillsMatrixOpen}
          member={selectedMemberForSkills}
          skills={selectedMemberForSkills ? getTeamSpecificSkills(selectedMemberForSkills.teamId) : []}
          memberSkills={selectedMemberForSkills ? (memberSkills[selectedMemberForSkills.id] || {}) : {}}
          onUpdateMemberSkills={updateMemberSkills}
        />

        {/* Skill Filter Dialog */}
        <SkillFilterDialog
          open={isSkillFilterOpen}
          onOpenChange={setIsSkillFilterOpen}
          skills={skills || []}
          teamMembers={teamMembers || []}
          teams={teams || []}
          memberSkills={memberSkills}
          onMemberSelect={handleMemberSelectFromSkillFilter}
        />
      </div>
      <Toaster />
    </div>
  )
}

export default App