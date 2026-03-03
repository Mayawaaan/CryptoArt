// components/nft/NFTGallery.jsx

import { useState, useMemo } from "react"
import GalleryHeader from "../components/nft-gallery/GalleryHeader"
import CategoryTabs from "../components/nft-gallery/CategoryTabs"
import NFTGrid from "../components/nft-gallery/NFTGrid"
import { nftData } from "../data/nftData"

const NFTGallery = () => {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [liked, setLiked] = useState([])

  const toggleLike = (id) => {
    setLiked((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    )
  }

  const filteredData = useMemo(() => {
    return nftData.filter((nft) => {
      const matchesCategory =
        activeCategory === "All" ||
        nft.category === activeCategory

      const matchesSearch =
        nft.title.toLowerCase().includes(search.toLowerCase()) ||
        nft.creator.toLowerCase().includes(search.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [search, activeCategory])

  return (
    <div className="bg-gray-900 min-h-screen text-white px-6 md:px-10 py-12">
      <GalleryHeader search={search} setSearch={setSearch} />

      <CategoryTabs
        active={activeCategory}
        setActive={setActiveCategory}
      />

      <NFTGrid
        data={filteredData.map((nft) => ({
          ...nft,
          liked: liked.includes(nft.id),
          toggleLike,
        }))}
      />
    </div>
  )
}

export default NFTGallery