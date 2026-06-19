import { useState } from 'react'
import { MessageSquare, CheckSquare, Plus } from 'lucide-react'

export default function Sidebar({ project, sidebarOpen, setSidebarOpen, theme }) {
  const defaultChannels = [
    { id: 1, name: 'رسائل هامة', icon: MessageSquare, type: 'important' },
    { id: 2, name: 'رسائل عامة', icon: MessageSquare, type: 'general' },
    { id: 3, name: 'المهمات', icon: CheckSquare, type: 'tasks' },
    { id: 4, name: 'المهمات المكتملة', icon: CheckSquare, type: 'completed' }
  ]

  const [channels, setChannels] = useState(defaultChannels)

  return (
    <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} transition-all duration-300 flex flex-col overflow-y-auto`}>
      {/* Project Header */}
      <div className="p-4 border-b border-gray-300 dark:border-gray-700">
        {sidebarOpen ? (
          <h2 className="font-bold text-lg truncate">{project.name}</h2>
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            {project.name[0]}
          </div>
        )}
      </div>

      {/* Channels */}
      <div className="flex-1 p-4 space-y-2">
        {channels.map((channel) => {
          const Icon = channel.icon
          return (
            <button
              key={channel.id}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition group"
            >
              <Icon size={20} className="flex-shrink-0" />
              {sidebarOpen && (
                <span className="text-sm truncate group-hover:font-semibold">{channel.name}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Add Channel Button */}
      {sidebarOpen && (
        <div className="p-4 border-t border-gray-300 dark:border-gray-700">
          <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg hover:opacity-90 transition">
            <Plus size={18} />
            إضافة قناة
          </button>
        </div>
      )}

      {/* Members List */}
      {sidebarOpen && (
        <div className="p-4 border-t border-gray-300 dark:border-gray-700">
          <h3 className="font-bold text-sm mb-3">الأعضاء</h3>
          <div className="space-y-2">
            {project.members?.slice(0, 5).map((member) => (
              <div key={member.userId} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full"></div>
                <span className="text-sm truncate">عضو</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
