import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Plus, Users, Moon, Sun, LogOut } from 'lucide-react'

export default function ProjectsPage({ user, theme, toggleTheme }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/projects/all')
      setProjects(response.data)
    } catch (error) {
      console.error('خطأ في تحميل المشاريع:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinProject = async (projectId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `http://localhost:5000/api/projects/${projectId}/join-request`,
        { userId: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('تم إرسال طلب الانضمام بنجاح')
    } catch (error) {
      alert(error.response?.data?.error || 'حدث خطأ')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">🎯 Teborad</h1>
            <p className="text-sm text-gray-500">مرحباً {user?.fullName}</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Projects Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">📚 المشاريع المتاحة</h2>
        
        {loading ? (
          <div className="text-center py-12">جاري التحميل...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition`}
              >
                {project.projectImage && (
                  <img
                    src={project.projectImage}
                    alt={project.name}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Users size={16} />
                      <span>{project.members?.length || 0} أعضاء</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleJoinProject(project._id)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg hover:opacity-90 transition"
                  >
                    الانضمام للمشروع
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
