import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import heroArtwork from '../../assets/hero.png';
import brandLogo from '../../assets/OM.png';
import '../../styles/gallery/Gallery.css';

const categories = [
    'All',
    'Education & Tutoring',
    'Applications',
    'Career Services',
    'Training & Workshops',
    'Technology & Projects',
];

const galleryImages = [
    {
        src: heroArtwork,
        alt: 'Abstract layered artwork used on the Our Memories EduTech website',
        title: 'Digital learning, designed with purpose',
        category: 'Technology & Projects',
        size: 'feature',
    },
    {
        src: brandLogo,
        alt: 'Our Memories EduTech logo',
        title: 'Our Memories EduTech',
        category: 'Technology & Projects',
        size: 'standard',
    },
];

function Gallery() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeImageIndex, setActiveImageIndex] = useState(null);

    const visibleImages = galleryImages.filter(
        (image) => activeCategory === 'All' || image.category === activeCategory,
    );
    const activeImage =
        activeImageIndex === null ? null : visibleImages[activeImageIndex];

    useEffect(() => {
        if (!activeImage) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setActiveImageIndex(null);
            } else if (event.key === 'ArrowLeft') {
                setActiveImageIndex((current) =>
                    (current - 1 + visibleImages.length) % visibleImages.length,
                );
            } else if (event.key === 'ArrowRight') {
                setActiveImageIndex((current) =>
                    (current + 1) % visibleImages.length,
                );
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [activeImage, visibleImages.length]);

    const showPreviousImage = () => {
        setActiveImageIndex((current) =>
            (current - 1 + visibleImages.length) % visibleImages.length,
        );
    };

    const showNextImage = () => {
        setActiveImageIndex((current) => (current + 1) % visibleImages.length);
    };

    return (
        <div className="gallery-page">
            <section className="gallery-hero">
                <div className="gallery-hero-content">
                    <span className="gallery-eyebrow">OUR MEMORIES EDUTECH</span>
                    <h1>Our <span>Gallery</span></h1>
                    <p>
                        A glimpse of the learning and digital experiences behind
                        Our Memories EduTech. We’ll add more verified project
                        images as they become available.
                    </p>
                </div>
                <div className="gallery-hero-mark" aria-hidden="true">
                    <img src={brandLogo} alt="" />
                </div>
            </section>

            <section className="gallery-content" aria-label="Gallery images">
                <div className="gallery-intro">
                    <div>
                        <span className="gallery-eyebrow">EXPLORE</span>
                        <h2>Moments and ideas, <span>in focus.</span></h2>
                    </div>
                    <p>
                        Browse the categories below. Images shown are existing
                        Our Memories EduTech brand and website artwork—not
                        representations of unverified events.
                    </p>
                </div>

                <div className="gallery-filters" role="group" aria-label="Filter gallery by category">
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            className={`gallery-filter${activeCategory === category ? ' is-active' : ''}`}
                            aria-pressed={activeCategory === category}
                            onClick={() => {
                                setActiveCategory(category);
                                setActiveImageIndex(null);
                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {visibleImages.length > 0 ? (
                    <div className="gallery-grid">
                        {visibleImages.map((image, index) => (
                            <button
                                className={`gallery-card gallery-card--${image.size}`}
                                key={image.src}
                                type="button"
                                onClick={() => setActiveImageIndex(index)}
                                aria-label={`View image: ${image.title}`}
                            >
                                <span className="gallery-card-image">
                                    <img src={image.src} alt={image.alt} />
                                    <span className="gallery-card-zoom" aria-hidden="true">
                                        <i className="fas fa-expand-alt" />
                                    </span>
                                </span>
                                <span className="gallery-card-caption">
                                    <span>
                                        <span className="gallery-card-category">{image.category}</span>
                                        <span className="gallery-card-title">{image.title}</span>
                                    </span>
                                    <i className="fas fa-arrow-up" aria-hidden="true" />
                                </span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="gallery-empty" role="status">
                        <span className="gallery-empty-icon" aria-hidden="true">
                            <i className="far fa-images" />
                        </span>
                        <h3>More images are on the way</h3>
                        <p>
                            There are no verified images in this category yet.
                            Check back as we add more of our work and learning
                            resources.
                        </p>
                    </div>
                )}
            </section>

            <section className="gallery-cta">
                <div>
                    <span className="gallery-eyebrow">LET’S CONNECT</span>
                    <h2>Have a question or an idea to share?</h2>
                    <p>Talk to our team about education, applications, or digital services.</p>
                </div>
                <Link to="/contact" className="gallery-cta-button">
                    Make an enquiry <span aria-hidden="true">→</span>
                </Link>
            </section>

            {activeImage && (
                <div
                    className="gallery-lightbox"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setActiveImageIndex(null);
                        }
                    }}
                >
                    <div
                        className="gallery-lightbox-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Image viewer: ${activeImage.title}`}
                    >
                        <button
                            type="button"
                            className="gallery-lightbox-close"
                            onClick={() => setActiveImageIndex(null)}
                            aria-label="Close image viewer"
                        >
                            <i className="fas fa-times" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            className="gallery-lightbox-nav gallery-lightbox-previous"
                            onClick={showPreviousImage}
                            aria-label="Previous image"
                        >
                            <i className="fas fa-chevron-left" aria-hidden="true" />
                        </button>
                        <img
                            className="gallery-lightbox-image"
                            src={activeImage.src}
                            alt={activeImage.alt}
                        />
                        <button
                            type="button"
                            className="gallery-lightbox-nav gallery-lightbox-next"
                            onClick={showNextImage}
                            aria-label="Next image"
                        >
                            <i className="fas fa-chevron-right" aria-hidden="true" />
                        </button>
                        <div className="gallery-lightbox-caption">
                            <span>{activeImage.title}</span>
                            <span>{activeImageIndex + 1} / {visibleImages.length}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Gallery;
