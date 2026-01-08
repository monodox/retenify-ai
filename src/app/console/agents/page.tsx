import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Bot, 
  Plus, 
  Search,
  Settings,
  Play,
  Pause,
  MoreVertical,
  Zap,
  MessageSquare,
  Users,
  TrendingUp
} from 'lucide-react'

interface Agent {
  id: string
  name: string
  description: string
  status: 'active' | 'paused'
  conversations: number
  successRate: number
  lastActive: string
  avatar?: string
}

interface AgentStats {
  totalAgents: number
  activeConversations: number
  usersHelped: number
  avgSuccessRate: number
}

export default function AgentsPage() {
  // Mock data - in production this would come from props or API
  const agents: Agent[] = []
  const stats: AgentStats = {
    totalAgents: 0,
    activeConversations: 0,
    usersHelped: 0,
    avgSuccessRate: 0
  }
  
  const agentStats = [
    {
      title: 'Total Agents',
      value: stats?.totalAgents?.toString() || '0',
      change: '+0',
      icon: Bot,
    },
    {
      title: 'Active Conversations',
      value: stats?.activeConversations?.toString() || '0',
      change: '+0',
      icon: MessageSquare,
    },
    {
      title: 'Users Helped',
      value: stats?.usersHelped?.toLocaleString() || '0',
      change: '+0',
      icon: Users,
    },
    {
      title: 'Avg Success Rate',
      value: stats?.avgSuccessRate ? `${stats.avgSuccessRate}%` : '0%',
      change: '+0%',
      icon: TrendingUp,
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">AI Agents</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Agent
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {agentStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change} from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">All Status</Button>
            <Button variant="outline">All Types</Button>
          </div>
        </CardContent>
      </Card>

      {/* Agents Grid */}
      {agents.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Card key={agent.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={agent.avatar} alt={agent.name} />
                      <AvatarFallback>
                        <Bot className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <Badge 
                        variant={agent.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {agent.status}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="mt-2">
                  {agent.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Conversations</span>
                    <span className="font-medium">{agent.conversations}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Success Rate</span>
                    <span className="font-medium">{agent.successRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Active</span>
                    <span className="font-medium">{agent.lastActive}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <Button 
                      variant={agent.status === 'active' ? 'outline' : 'default'} 
                      size="sm" 
                      className="flex-1"
                    >
                      {agent.status === 'active' ? (
                        <>
                          <Pause className="mr-2 h-3 w-3" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-3 w-3" />
                          Activate
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bot className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No agents found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by creating your first AI agent to help with customer conversations.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Agent
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and agent management tools
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-3">
          <Button variant="outline" className="justify-start">
            <Zap className="mr-2 h-4 w-4" />
            Create Automation
          </Button>
          <Button variant="outline" className="justify-start">
            <MessageSquare className="mr-2 h-4 w-4" />
            View All Chats
          </Button>
          <Button variant="outline" className="justify-start">
            <TrendingUp className="mr-2 h-4 w-4" />
            Analytics Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}