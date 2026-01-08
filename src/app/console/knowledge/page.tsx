import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Plus, 
  Search,
  FileText,
  Upload,
  MoreVertical,
  Calendar,
  Eye,
  Edit
} from 'lucide-react'

interface KnowledgeItem {
  id: string
  title: string
  description: string
  type: 'document' | 'faq' | 'guide' | 'policy'
  status: 'active' | 'draft' | 'archived'
  lastUpdated: string
  views: number
}

export default function KnowledgePage() {
  // Mock data for demonstration
  const knowledgeItems: KnowledgeItem[] = []

  const stats = [
    {
      title: 'Total Articles',
      value: knowledgeItems.length.toString() || '0',
      change: '+0',
      icon: FileText,
    },
    {
      title: 'Active Items',
      value: knowledgeItems.filter(item => item.status === 'active').length.toString() || '0',
      change: '+0',
      icon: Eye,
    },
    {
      title: 'Total Views',
      value: knowledgeItems.reduce((sum, item) => sum + item.views, 0).toLocaleString() || '0',
      change: '+0',
      icon: Brain,
    },
    {
      title: 'Draft Items',
      value: knowledgeItems.filter(item => item.status === 'draft').length.toString() || '0',
      change: '+0',
      icon: Edit,
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-800'
      case 'faq': return 'bg-green-100 text-green-800'
      case 'guide': return 'bg-purple-100 text-purple-800'
      case 'policy': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'draft': return 'secondary'
      case 'archived': return 'outline'
      default: return 'secondary'
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Knowledge Base</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Article
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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
                placeholder="Search knowledge base..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">All Types</Button>
            <Button variant="outline">All Status</Button>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Items */}
      {knowledgeItems.length > 0 ? (
        <div className="space-y-4">
          {knowledgeItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                        {item.type}
                      </span>
                      <Badge variant={getStatusColor(item.status) as any} className="text-xs">
                        {item.status}
                      </Badge>
                    </div>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Updated {item.lastUpdated}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{item.views.toLocaleString()} views</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
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
            <Brain className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No knowledge articles found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start building your knowledge base by adding articles, FAQs, and guides to help your AI agents provide better support.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Article
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common knowledge base management tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-3">
          <Button variant="outline" className="justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Create FAQ
          </Button>
          <Button variant="outline" className="justify-start">
            <Upload className="mr-2 h-4 w-4" />
            Bulk Import
          </Button>
          <Button variant="outline" className="justify-start">
            <Brain className="mr-2 h-4 w-4" />
            Train AI Model
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}