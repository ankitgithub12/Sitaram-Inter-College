import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { apiUrl } from '../lib/config';

const PhotosVideos = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);


  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);  const categories = [
    { id: 'all', name: 'All', icon: 'fas fa-layer-group', count: 24 },
    { id: 'events', name: 'Events', icon: 'fas fa-calendar-alt', count: 16 },
    { id: 'achievements', name: 'Achievements', icon: 'fas fa-trophy', count: 12 },
    { id: 'cultural', name: 'Cultural', icon: 'fas fa-music', count: 8 },
    { id: 'competitions', name: 'Competitions', icon: 'fas fa-gamepad', count: 6 },
  ];

  const initialPhotos = [
    // Farewell Photos
    { id: 'static_1', category: 'events', src: '/assets/farewell1.jpeg', title: 'Farewell 2026', description: 'Graduating Students', album: 'farewell-album' },
    { id: 'static_2', category: 'events', src: '/assets/farewell2.jpeg', title: 'Farewell 2026', description: 'Gift Distribution', album: 'farewell-album' },
    { id: 'static_3', category: 'events', src: '/assets/farewell3.jpeg', title: 'Farewell 2026', description: 'Group Photos', album: 'farewell-album' },
    { id: 'static_4', category: 'events', src: '/assets/farewell4.jpeg', title: 'Farewell 2026', description: 'Cultural Performances', album: 'farewell-album' },
    { id: 'static_5', category: 'events', src: '/assets/farewell5.jpeg', title: 'Farewell 2026', description: 'Cultural Performances', album: 'farewell-album' },
    { id: 'static_6', category: 'events', src: '/assets/farewell6.jpeg', title: 'Farewell 2026', description: 'Certificate Distribution', album: 'farewell-album' },
    { id: 'static_7', category: 'events', src: '/assets/farewell7.jpeg', title: 'Farewell 2026', description: 'Farewell Party', album: 'farewell-album' },
    { id: 'static_8', category: 'events', src: '/assets/farewell8.jpeg', title: 'Farewell 2024', description: 'Final Memories', album: 'farewell-album' },
    { id: 'static_9', category: 'events', src: '/assets/2018 farewell.jpeg', title: 'Farewell 2018', description: 'Nostalgic Memories', album: 'farewell-album' },
    
    // Prize Distribution Photos
    { id: 'static_10', category: 'achievements', src: '/assets/prize1.jpeg', title: 'Prize Day 2026', description: 'Top Performers', album: 'prize-album' },
    { id: 'static_11', category: 'achievements', src: '/assets/prize3.jpeg', title: 'Prize Day 2026', description: 'Award Winners', album: 'prize-album' },
    { id: 'static_12', category: 'achievements', src: '/assets/prize4.jpeg', title: 'Prize Day 2026', description: 'Certificate Distribution', album: 'prize-album' },
    { id: 'static_13', category: 'achievements', src: '/assets/prize5.jpeg', title: 'Prize Day 2026', description: 'Sports Achievements', album: 'prize-album' },
    { id: 'static_14', category: 'achievements', src: '/assets/prize6.jpeg', title: 'Prize Day 2026', description: 'Special Achievements', album: 'prize-album' },
    { id: 'static_15', category: 'achievements', src: '/assets/prize7.jpeg', title: 'Prize Day 2026', description: 'Perfect Attendance', album: 'prize-album' },
    { id: 'static_16', category: 'achievements', src: '/assets/prize8.jpeg', title: 'Glory Moment', description: 'Recognition Day', album: 'prize-album' },
    { id: 'static_17', category: 'achievements', src: '/assets/prize9.jpeg', title: 'Prize Day 2026', description: 'Winners with Teachers', album: 'prize-album' },
    
    // Competition Photos
    { id: 'static_18', category: 'competitions', src: '/assets/competition1.jpeg', title: 'GK Quiz Championship', description: 'Battle of Wits' },
    { id: 'static_19', category: 'competitions', src: '/assets/competition2.jpeg', title: 'Quiz Masters', description: 'Battle of Brilliance' },
    
    // Cultural Photos
    { id: 'static_20', category: 'cultural', src: '/assets/rangoli.jpeg', title: 'Rangoli Competition', description: 'Artistic Skills' },
    { id: 'static_21', category: 'cultural', src: '/assets/mehandi.jpeg', title: 'Mehandi Competition', description: 'Artistic Designs' },
    { id: 'static_22', category: 'cultural', src: '/assets/Mehandi 2025.jpeg', title: 'Mehandi 2025', description: 'Creative Patterns' },
    { id: 'static_23', category: 'cultural', src: '/assets/independence_day.jpeg', title: 'Independence Day', description: 'Patriotic Celebration', album: 'independence-album' },
    { id: 'static_24', category: 'events', src: '/assets/tour_photo.jpeg', title: 'School Excursion', description: 'Learning Beyond Classroom' },
  ];

  const [photoGalleryItems, setPhotoGalleryItems] = useState(initialPhotos);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch(apiUrl('/api/gallery'));
        const data = await res.json();
        if (data.success) {
          const mapped = data.data.map(p => ({
            id: p._id,
            category: p.category || 'general',
            album: p.album || '',
            src: p.secureUrl,
            title: p.title,
            description: p.description || ''
          }));
          // Prepend new admin photos before the hardcoded ones
          setPhotoGalleryItems([...mapped, ...initialPhotos]);
        }
      } catch (err) {
        console.error('Failed to fetch gallery', err);
      }
    };
    fetchPhotos();
  }, []);
    // Farewell Photos


  const albums = [
    { id: 'farewell-album', title: 'Farewell 2026', description: 'Graduation ceremony', cover: '/assets/farewell2.jpeg' },
    { id: 'prize-album', title: 'Prize Day 2026', description: 'Academic excellence', cover: '/assets/prize4.jpeg' },
    { id: 'independence-album', title: 'Independence Day', description: 'Patriotic celebrations', cover: '/assets/independence_day.jpeg' },
    { id: 'teacher-album', title: 'Teacher Recognition', description: 'Honoring our educators', cover: '/assets/teachers1.jpeg' },
  ].map(album => ({
    ...album,
    count: photoGalleryItems.filter(p => p.album === album.id).length
  }));

  const videos = [
    { id: 1, youtubeId: 'Yq_Edmb3hi8', title: 'Prize Distribution 2026', description: 'Highlights from our prize distribution event celebrating student achievements', date: 'July 15, 2026' },
    { id: 2, youtubeId: 'ZcQkTWSuDC0', title: 'Patriotic Drama', description: 'Student performance of a patriotic drama on Republic Day', date: 'January 26, 2026' },
    { id: 3, youtubeId: 'lNukl6lkgcg', title: 'Mehandi Competition', description: 'Creative showcase from our annual Mehandi competition', date: 'August 20, 2024' },
  ];

  const featuredEvents = [
    { id: 1, title: 'Annual Farewell 2026', description: 'An emotional farewell ceremony for our graduating students, celebrating their journey at SRIC with speeches, awards, and performances.', date: 'May 15, 2026', image: '/assets/farewell2.jpeg', albumId: 'farewell-album' },
    { id: 2, title: 'Prize Distribution 2026', description: 'Celebrating academic excellence and special achievements of our students with certificate distribution and honors.', date: 'April 10, 2026', image: '/assets/prize4.jpeg', albumId: 'prize-album' },
  ];

  const filteredItems = photoGalleryItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openAlbumModal = (albumId) => {
    setSelectedAlbum(albumId);
    setIsAlbumModalOpen(true);
  };

  const closeAlbumModal = () => {
    setIsAlbumModalOpen(false);
    setSelectedAlbum(null);
  };

  const openImageModal = (item) => {
    setSelectedImage(item);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  const getAlbumImages = (albumId) => {
    return photoGalleryItems.filter(p => p.album === albumId);
  };

  const getAlbumTitle = (albumId) => {
    const album = albums.find(a => a.id === albumId);
    return album ? album.title : '';
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="hero relative overflow-hidden text-white py-20">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">SRIC Memories Gallery</h1>
          <div className="w-24 h-1.5 bg-sricgold mx-auto mb-6 rounded-full"></div>
          <p className="text-xl max-w-3xl mx-auto">Relive the memorable moments, achievements, and celebrations that make SRIC special</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Featured Events Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12 border border-gray-100 shadow-lg">
          <div className="event-header mb-8">
            <div className="flex items-center mb-3">
              <div className="w-1 h-10 bg-sricgold mr-4 rounded-full"></div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-sricblue">Featured Events</h2>
                <p className="text-gray-600">Highlights from our most memorable school events</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 hover:shadow-xl">
                <div className="relative h-56 overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover transition duration-500 hover:scale-105" />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-2 h-8 bg-sricgold mr-3 rounded-full"></div>
                    <h3 className="text-xl font-bold text-sricblue">{event.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span><i className="far fa-calendar mr-1 text-sricblue"></i> {event.date}</span>
                    <button 
                      onClick={() => openAlbumModal(event.albumId)}
                      className="text-sricblue hover:text-sricblue font-medium transition duration-300 flex items-center"
                    >
                      View More <i className="fas fa-arrow-right ml-1 text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Gallery Filters */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2.5 rounded-full font-medium transition duration-300 flex items-center ${
                  activeCategory === category.id
                    ? 'bg-sricblue text-white shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <i className={`${category.icon} mr-2`}></i>
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Search Box */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search gallery by event name, date or keyword..."
                className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sricblue focus:border-transparent shadow-sm pl-12"
              />
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400">
                <i className="fas fa-search"></i>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Photo Gallery */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-sricblue">
              {activeCategory === 'all' ? 'All Photos' : `${categories.find(c => c.id === activeCategory)?.name} Photos`}
              <span className="ml-2 text-gray-500 text-lg">({filteredItems.length})</span>
            </h3>
            <p className="text-sm text-gray-500">Click any photo to view in full size</p>
          </div>
          
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <div className="text-gray-400 text-6xl mb-4">
                <i className="fas fa-images"></i>
              </div>
              <h4 className="text-xl font-semibold text-gray-600 mb-2">No photos found</h4>
              <p className="text-gray-500">Try changing your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openImageModal(item)}
                  className="gallery-item group relative block h-72 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sricblue/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-bold text-lg text-white mb-1">{item.title}</h3>
                    <p className="text-gray-200 text-sm">{item.description}</p>
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
                      <i className="fas fa-image mr-1"></i> Photo
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 bg-sricblue/90 text-white px-2 py-1 rounded-full text-xs capitalize">
                    {item.category}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Photo Albums Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12 border border-gray-100 shadow-lg">
          <div className="event-header mb-8">
            <div className="flex items-center mb-3">
              <div className="w-1 h-10 bg-sricgold mr-4 rounded-full"></div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-sricblue">Photo Albums</h2>
                <p className="text-gray-600">Browse our curated collections of memorable moments</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {albums.map((album, index) => (
              <div
                key={album.id}
                onClick={() => openAlbumModal(album.id)}
                className={`polaroid cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                  index % 2 === 0 ? '-rotate-2' : 'rotate-2'
                }`}
              >
                <div className="relative overflow-hidden rounded-xl h-52 mb-4">
                  <img
                    src={album.cover}
                    alt={album.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                    <h3 className="text-white font-bold">View Album</h3>
                  </div>
                </div>
                <div className="text-center px-2">
                  <h3 className="font-semibold text-sricblue">{album.title}</h3>
                  <p className="text-sm text-gray-600">{album.description}</p>
                  <div className="text-xs text-sricgold mt-1">
                    <i className="fas fa-images mr-1"></i> {album.count} photos
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Video Gallery Section */}
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-lg">
          <div className="event-header mb-8">
            <div className="flex items-center mb-3">
              <div className="w-1 h-10 bg-sricgold mr-4 rounded-full"></div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-sricblue">Featured Videos</h2>
                <p className="text-gray-600">Relive the excitement through our video collection</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div key={video.id} className="video-card bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 hover:shadow-xl">
                <div className="relative pt-[56.25%]">
                  <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  ></iframe>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg md:text-xl mb-3 text-sricblue">{video.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{video.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <i className="far fa-calendar-alt mr-2 text-sricblue"></i>
                    <span>{video.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
            >
              <i className="fab fa-youtube mr-3 text-xl"></i>
              Visit Our YouTube Channel
              <i className="fas fa-external-link-alt ml-2"></i>
            </a>
          </div>
        </div>
      </main>

      {/* Image Modal */}
      {isImageModalOpen && selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="relative max-w-5xl max-h-[90vh]">
            <button
              onClick={closeImageModal}
              className="absolute -top-12 right-0 text-white text-3xl hover:text-sricgold transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-center text-white">
              <h3 className="text-xl font-bold">{selectedImage.title}</h3>
              <p className="text-gray-300">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Album Modal */}
      {isAlbumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-sricblue text-white p-6 flex justify-between items-center">
              <h3 className="text-2xl md:text-3xl font-bold">
                {getAlbumTitle(selectedAlbum)} Album
              </h3>
              <button
                onClick={closeAlbumModal}
                className="text-white hover:text-sricgold text-3xl transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getAlbumImages(selectedAlbum).map((image, index) => (
                  <div 
                    key={index} 
                    onClick={() => openImageModal({ src: image.src, title: image.title, description: '' })}
                    className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  >
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <span className="text-white text-sm font-medium">View Image</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {getAlbumImages(selectedAlbum).length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">
                    <i className="fas fa-images"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-600 mb-2">Album under construction</h4>
                  <p className="text-gray-500">More photos coming soon!</p>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="bg-gray-50 p-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-gray-600">
                  <i className="fas fa-images mr-2"></i>
                  {getAlbumImages(selectedAlbum).length} photos in this album
                </div>
                <button
                  onClick={closeAlbumModal}
                  className="px-6 py-2 bg-sricblue text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Close Album
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

    </div>
  );
};

export default PhotosVideos;