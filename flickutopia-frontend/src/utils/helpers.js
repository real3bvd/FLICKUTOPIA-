// Utility helper functions

// Format currency for display
export const formatPrice = (price) => {
    return `₺${price.toFixed(2)}`;
};

// Format date for display
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Generate image path from movie title
export const getImagePath = (title) => {
    const filename = title.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `http://localhost:8080/api/posters/${filename}.jpg`;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Check if user is logged in
export const isAuthenticated = (user) => {
    return user !== null && user !== undefined;
};
