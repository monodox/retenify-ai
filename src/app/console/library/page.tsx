import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Library, 
  Plus, 
  Search,
  FileText,
  Image,
  Video,
  Download,
  MoreVertical,
  Calendar,
  HardDrive,
  Folder
} from 'lucide-react'

interface LibraryItem {
  id: string
  name: string
  type: 'document' | 'image' | 'video' | 'audio' | 'other'
  size: string
  uploadDate: string
  category: string
}

export default function LibraryPage() {
  // Mock data for demonstration
  const libraryItems: LibraryItem[] = []

  const stats = [
    {
      title: 'Total Files',
      value: libraryItems.length.toString() || '0',
      change: '+0',
      icon: FileText,
    },
    {
      title: 'Documents',
      value: libraryItems.filter(item => item.type === 'document').length.toString() || '0',
      change: '+0',
      icon: FileText,
    },
    {
      title: 'Images',
      value: libraryItems.filter(item => item.type === 'image').length.toString() || '0',
      change: '+0',
      icon: Image,
    },
    {
      title: 'Storage Used',
      value: '0 MB',
      change: '+0 MB',
      icon: HardDrive,
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText
      case 'image': return Image
      case 'video': return Video
      case 'audio': return HardDrive
      default: return FileText
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-800'
      case 'image': return 'bg-green-100 text-green-800'
      case 'video': return 'bg-purple-100 text-purple-800'
      case 'audio': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const categories = ['All', 'Training Materials', 'Templates', 'Brand Assets', 'Documentation']

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Folder className="mr-2 h-4 w-4" />
            New Folder
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Upload Files
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
                placeholder="Search files..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">All Types</Button>
            <Button variant="outline">Recent</Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={category === 'All' ? 'default' : 'outline'}
            size="sm"
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Library Items */}
      {libraryItems.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {libraryItems.map((item) => {
            const TypeIcon = getTypeIcon(item.type)
            return (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{item.uploadDate}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Library className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No files in library</h3>
            <p className="text-muted-foreground text-center mb-4">
              Upload documents, images, videos, and other files to build your media library for AI training and customer support.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Upload Your First File
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common library management tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-3">
          <Button variant="outline" className="justify-start">
            <Image className="mr-2 h-4 w-4" />
            Upload Images
          </Button>
          <Button variant="outline" className="justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Upload Documents
          </Button>
          <Button variant="outline" className="justify-start">
            <Folder className="mr-2 h-4 w-4" />
            Organize Files
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}