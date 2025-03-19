import { FaUsers } from 'react-icons/fa'

export const Header = () => {
  return (
    <header className="bg-gray-950 text-white shadow-lg p-8">
      <div className="flex items-center space-x-3">
        <FaUsers className="text-gray-300 text-2xl hover:text-gray-500 transition-colors" />
        <h1 className="text-2xl font-semibold text-white">Users Manager</h1>
      </div>
    </header>
  )
}
