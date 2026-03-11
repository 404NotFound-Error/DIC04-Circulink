import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader, AlertCircle, Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { apiClient, Item } from "../lib/api";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadItem = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getItem(id);
        setItem(response.data as Item);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load item");
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>{error || "Item not found"}</span>
        </div>
      </div>
    );
  }

  // Parse images
  let images: string[] = [];
  try {
    images = Array.isArray(item.images) ? item.images : [item.images];
  } catch {
    images = item.images || [];
  }

  const currentImage = images[currentImageIndex] || "/placeholder.png";

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleToggleFavorite = async () => {
    try {
      if (isFavorited) {
        await apiClient.removeFavoriteByItemId(item.id);
      } else {
        await apiClient.addFavorite(item.id);
      }
      setIsFavorited(!isFavorited);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const handleContact = () => {
    navigate(`/messages?sellerId=${item.seller.id}&itemId=${item.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 via-emerald-200 to-green-300">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 max-w-5xl">
          {/* Image Section */}
          <div className="flex flex-col">
            {/* Main Image */}
            <div className="relative bg-white rounded-xl p-4 mb-4 aspect-square flex items-center justify-center overflow-hidden">
              <img
                src={currentImage}
                alt={item.title}
                className="w-full h-full object-cover rounded-lg"
              />

              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Image Indicators */}
            {images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition ${
                      index === currentImageIndex
                        ? "bg-gray-800 w-8"
                        : "bg-gray-400 hover:bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Title */}
              <h1 className="text-4xl font-bold mb-4 text-gray-800">{item.title}</h1>

              {/* Price */}
              <p className="text-3xl font-bold text-gray-800 mb-6">
                ${parseFloat(item.price).toFixed(2)}
              </p>

              {/* Seller Info */}
              <div className="mb-6 bg-white bg-opacity-60 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Seller</p>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-semibold text-gray-800">{item.seller?.name || "Unknown"}</p>
                    <p className="text-xs text-gray-600">{item.seller?.email || 'No email'}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <div className="bg-green-100 bg-opacity-60 rounded-lg p-4 min-h-32 text-gray-700">
                  {item.description}
                </div>
              </div>

              {/* Item Details */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="bg-white bg-opacity-60 rounded-lg p-3">
                  <p className="text-gray-600">Condition</p>
                  <p className="font-semibold text-gray-800">{item.condition}</p>
                </div>
                <div className="bg-white bg-opacity-60 rounded-lg p-3">
                  <p className="text-gray-600">Status</p>
                  <p className="font-semibold text-gray-800">{item.status}</p>
                </div>
                <div className="bg-white bg-opacity-60 rounded-lg p-3">
                  <p className="text-gray-600">Category</p>
                  <p className="font-semibold text-gray-800">{item.category?.name || "N/A"}</p>
                </div>
                <div className="bg-white bg-opacity-60 rounded-lg p-3">
                  <p className="text-gray-600">Posted</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  onClick={handleToggleFavorite}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full font-semibold transition ${
                    isFavorited
                      ? "bg-yellow-400 hover:bg-yellow-500 text-gray-800"
                      : "bg-green-200 hover:bg-green-300 text-gray-800"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
                  {isFavorited ? "Favorited" : "Favorite"}
                </button>
                <button
                  onClick={handleContact}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-green-300 hover:bg-green-400 text-gray-800 rounded-full font-semibold transition"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Contact
                </button>
              </div>
              <button className="w-full py-3 px-4 bg-green-400 hover:bg-green-500 text-gray-800 rounded-full font-bold text-lg transition">
                BUY NOW
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
