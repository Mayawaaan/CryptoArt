// components/nft/CategoryTabs.jsx

const categories = [
  "All",
  "Art",
  "Collectibles",
  "Music",
  "Gaming",
  "Domain Names",
]

const CategoryTabs = ({ active, setActive }) => {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
      {categories.map((cat) => {
        const isActive = active === cat

        return (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
              ${
                isActive
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20"
                  : "bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white"
              }
            `}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}

export default CategoryTabs