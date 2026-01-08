import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  BookOpen, 
  MessageCircle, 
  Mail, 
  ExternalLink,
  HelpCircle,
  Video,
  FileText,
  Users
} from 'lucide-react'

const helpCategories = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of Retenify',
    icon: BookOpen,
    articles: 12,
    color: 'bg-blue-500',
  },
  {
    title: 'Campaigns',
    description: 'Create and manage email campaigns',
    icon: Mail,
    articles: 8,
    color: 'bg-green-500',
  },
  {
    title: 'Analytics',
    description: 'Understanding your data and reports',
    icon: FileText,
    articles: 6,
    color: 'bg-purple-500',
  },
  {
    title: 'Integrations',
    description: 'Connect with other tools and services',
    icon: Users,
    articles: 15,
    color: 'bg-orange-500',
  },
]

const popularArticles = [
  {
    title: 'How to create your first campaign',
    category: 'Getting Started',
    readTime: '5 min read',
    views: 1247,
  },
  {
    title: 'Understanding email deliverability',
    category: 'Campaigns',
    readTime: '8 min read',
    views: 892,
  },
  {
    title: 'Setting up automation workflows',
    category: 'Automations',
    readTime: '12 min read',
    views: 634,
  },
  {
    title: 'Analyzing campaign performance',
    category: 'Analytics',
    readTime: '6 min read',
    views: 523,
  },
]

const quickActions = [
  {
    title: 'Video Tutorials',
    description: 'Watch step-by-step guides',
    icon: Video,
    action: 'Watch Now',
  },
  {
    title: 'Live Chat',
    description: 'Get instant help from our team',
    icon: MessageCircle,
    action: 'Start Chat',
  },
  {
    title: 'Contact Support',
    description: 'Send us a detailed message',
    icon: Mail,
    action: 'Send Message',
  },
]

export default function HelpPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Help Center</h2>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for help articles..."
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <Card key={action.title} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <action.icon className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </div>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  {action.action}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Categories */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Browse by Category</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {helpCategories.map((category) => (
              <Card key={category.title} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.color} text-white`}>
                      <category.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{category.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {category.articles} articles
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="mt-2">
                    {category.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Popular Articles</h3>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {popularArticles.map((article, index) => (
                  <div key={index} className="p-4 hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">{article.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                          <span>•</span>
                          <span>{article.readTime}</span>
                          <span>•</span>
                          <span>{article.views.toLocaleString()} views</span>
                        </div>
                      </div>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle>Still need help?</CardTitle>
            <CardDescription>
              Can&apos;t find what you&apos;re looking for? Our support team is here to help.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button>
                <MessageCircle className="mr-2 h-4 w-4" />
                Start Live Chat
              </Button>
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Email Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}