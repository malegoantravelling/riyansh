import { useEffect, useState } from 'react'
import { Edit, Trash2, Search, Filter, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal.tsx'
import Toast, { ToastType } from '@/components/SuccessToast'

interface UserType {
  id: string
  full_name: string
  email: string
  avatar_url?: string
  created_at: string
}

interface EditUserModalProps {
  user: UserType | null
  isOpen: boolean
  onClose: () => void
  onSave: (user: UserType) => void
  onError: (message: string) => void
}

function EditUserModal({ user, isOpen, onClose, onSave, onError }: EditUserModalProps) {
  const [formData, setFormData] = useState({ full_name: '', email: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({ full_name: user.full_name || '', email: user.email || '' })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    try {
      await api.put(`/api/users/${user.id}`, formData)
      onSave({ ...user, ...formData })
      onClose()
    } catch (error) {
      console.error('Error updating user:', error)
      onError('Failed to update user')
    } finally {
      setLoading(false)
    }
  }

  const handleDiscard = () => {
    if (user) setFormData({ full_name: user.full_name || '', email: user.email || '' })
    onClose()
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div
        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg sm:text-xl font-bold mb-5">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8C51]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8C51]"
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 min-h-[44px] bg-[#5B8C51] text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-[#4E7A46] disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleDiscard}
              className="flex-1 min-h-[44px] bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              Discard
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Users() {
  const [users, setUsers] = useState<UserType[]>([])
  const [editingUser, setEditingUser] = useState<UserType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: string | null; userName: string }>({
    isOpen: false, userId: null, userName: '',
  })
  const [toast, setToast] = useState<{ isOpen: boolean; type: ToastType; title: string; message: string }>({
    isOpen: false, type: 'success', title: '', message: '',
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const showToast = (type: ToastType, title: string, message: string) => {
    setToast({ isOpen: true, type, title, message })
  }

  const fetchUsers = async () => {
    try {
      const data = await api.get('/api/users')
      setUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
    }
  }

  const handleEdit = (user: UserType) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleDelete = async (userId: string) => {
    const user = users.find((u) => u.id === userId)
    if (user) {
      setDeleteModal({ isOpen: true, userId, userName: user.full_name || user.email })
    }
  }

  const confirmDelete = async () => {
    if (!deleteModal.userId) return
    try {
      await api.delete(`/api/users/${deleteModal.userId}`)
      setUsers(users.filter((user) => user.id !== deleteModal.userId))
      setDeleteModal({ isOpen: false, userId: null, userName: '' })
      showToast('success', 'Success!', 'User deleted successfully!')
    } catch (error) {
      console.error('Error deleting user:', error)
      showToast('error', 'Error', 'Failed to delete user')
    }
  }

  const handleSaveUser = (updatedUser: UserType) => {
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
    showToast('success', 'Success!', 'User updated successfully!')
  }

  const handleUserError = (message: string) => {
    showToast('error', 'Error', message)
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDate = (() => {
      const userDate = new Date(user.created_at)
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

      switch (dateFilter) {
        case 'today': return userDate >= today
        case 'yesterday': return userDate >= yesterday && userDate < today
        case 'last-week': return userDate >= lastWeek
        case 'last-month': return userDate >= lastMonth
        default: return true
      }
    })()

    return matchesSearch && matchesDate
  })

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Users</h1>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search by name or email…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-9 pr-4 h-10 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#5B8C51] focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last-week">Last 7 Days</option>
              <option value="last-month">Last 30 Days</option>
            </select>
          </div>
        </div>

        <div className="mt-3 text-xs sm:text-sm text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full mb-4">
              <User className="h-7 w-7 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No users found</h3>
            <p className="text-sm text-gray-500">
              {searchTerm || dateFilter !== 'all'
                ? 'No users match your current filters. Try adjusting your search criteria.'
                : 'No users available. Users will appear here when they register.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full min-w-[480px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Joined</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5 text-sm font-medium text-gray-900">
                        <div className="flex items-center gap-3">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover border border-gray-200 shrink-0" />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                              <User className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                          <span>{user.full_name || '-'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-500">{user.email}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                            title="Edit user"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="sm:hidden divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover border border-gray-200 shrink-0" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.full_name || '-'}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {new Date(user.created_at).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                      aria-label="Edit user"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                      aria-label="Delete user"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <EditUserModal
        user={editingUser}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingUser(null) }}
        onSave={handleSaveUser}
        onError={handleUserError}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, userId: null, userName: '' })}
        onConfirm={confirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        itemName={deleteModal.userName}
      />

      <Toast
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        duration={toast.type === 'success' ? 3000 : 4000}
      />
    </div>
  )
}
