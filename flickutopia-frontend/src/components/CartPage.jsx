import { Box, Typography, Button, Chip, Divider, IconButton } from '@mui/material';

function CartPage({ cart = [], setCart, movies = [], onViewDetails, getImagePath }) {
    // Get genres from cart items for recommendations
    const cartGenres = [...new Set(cart.map(item => item.genre))];

    // Get recommended movies based on cart genres (exclude items already in cart)
    const cartMovieIds = cart.map(item => item.id);
    const recommended = movies
        .filter(movie => cartGenres.includes(movie.genre) && !cartMovieIds.includes(movie.id))
        .slice(0, 6);

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => {
        return sum + (item.type === 'buy' ? item.buyPrice : item.rentPrice);
    }, 0);

    if (!cart || cart.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 12 }}>
                <span className="material-icons" style={{ fontSize: 100, color: '#333' }}>shopping_cart</span>
                <Typography variant="h4" sx={{ mt: 3, fontWeight: 600, color: '#fff' }}>
                    Your cart is empty
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    Add some movies to get started
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', lg: 'row' } }}>
            {/* Left Side - Cart Items */}
            <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                    My Cart ({cart.length} {cart.length === 1 ? 'Item' : 'Items'})
                </Typography>

                {/* Cart Items */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {cart.map((item, idx) => (
                        <Box
                            key={idx}
                            sx={{
                                display: 'flex',
                                bgcolor: '#1a1a1a',
                                borderRadius: 3,
                                p: 2.5,
                                transition: 'all 0.2s ease',
                                '&:hover': { bgcolor: '#222' }
                            }}
                        >
                            {/* Movie Poster */}
                            <Box
                                onClick={() => onViewDetails(item)}
                                sx={{
                                    width: 100,
                                    height: 140,
                                    borderRadius: 2,
                                    mr: 3,
                                    cursor: 'pointer',
                                    backgroundImage: `url(${getImagePath(item.title)})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundColor: '#000',
                                    flexShrink: 0
                                }}
                            />

                            {/* Movie Info */}
                            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 600, cursor: 'pointer', '&:hover': { color: '#0071e3' } }}
                                    onClick={() => onViewDetails(item)}
                                >
                                    {item.title}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                    <Chip
                                        label={item.type === 'buy' ? 'Purchase' : 'Rental'}
                                        size="small"
                                        sx={{
                                            bgcolor: item.type === 'buy' ? 'rgba(0,113,227,0.2)' : 'rgba(255,149,0,0.2)',
                                            color: item.type === 'buy' ? '#0071e3' : '#ff9500',
                                            fontWeight: 600
                                        }}
                                    />
                                    <Chip label={item.genre} size="small" variant="outlined" sx={{ borderColor: '#444' }} />
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    {item.duration} min • {item.releaseDate}
                                </Typography>
                            </Box>

                            {/* Price & Actions */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', minWidth: 120 }}>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
                                    ₺{(item.type === 'buy' ? item.buyPrice : item.rentPrice).toFixed(2)}
                                </Typography>
                                <IconButton
                                    onClick={() => setCart(cart.filter((_, i) => i !== idx))}
                                    sx={{
                                        mt: 1,
                                        color: '#ff5c5c',
                                        '&:hover': { bgcolor: 'rgba(255,92,92,0.1)' }
                                    }}
                                >
                                    <span className="material-icons">delete_outline</span>
                                </IconButton>
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/* Recommended Section */}
                {recommended.length > 0 && (
                    <Box sx={{ mt: 6 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                            Recommended For You
                        </Typography>
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                            gap: 2
                        }}>
                            {recommended.map((movie) => (
                                <Box
                                    key={movie.id}
                                    onClick={() => onViewDetails(movie)}
                                    sx={{
                                        cursor: 'pointer',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        transition: 'transform 0.2s ease',
                                        '&:hover': { transform: 'scale(1.05)' }
                                    }}
                                >
                                    <Box sx={{
                                        height: 200,
                                        backgroundImage: `url(${getImagePath(movie.title)})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        bgcolor: '#1a1a1a'
                                    }} />
                                    <Box sx={{ p: 1.5, bgcolor: '#1a1a1a' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {movie.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            ₺{movie.buyPrice}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>

            {/* Right Side - Basket Summary */}
            <Box sx={{
                width: { xs: '100%', lg: 340 },
                flexShrink: 0,
                position: { lg: 'sticky' },
                top: { lg: 100 },
                height: 'fit-content'
            }}>
                <Box sx={{
                    bgcolor: '#1a1a1a',
                    borderRadius: 3,
                    p: 3,
                    border: '1px solid #2a2a2a'
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                        Basket Summary
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography color="text.secondary">Subtotal</Typography>
                        <Typography sx={{ fontWeight: 600 }}>₺{subtotal.toFixed(2)}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography color="text.secondary">Items</Typography>
                        <Typography sx={{ fontWeight: 600 }}>{cart.length}</Typography>
                    </Box>

                    <Divider sx={{ my: 2, borderColor: '#333' }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#0071e3' }}>
                            ₺{subtotal.toFixed(2)}
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{
                            py: 1.8,
                            fontWeight: 700,
                            fontSize: '1rem',
                            borderRadius: 2,
                            textTransform: 'none',
                            bgcolor: '#0071e3',
                            '&:hover': { bgcolor: '#0077ed' }
                        }}
                    >
                        Confirm Cart
                    </Button>

                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
                        Secure checkout powered by Flickutopia
                    </Typography>
                </Box>

                {/* Quick Stats */}
                <Box sx={{
                    mt: 2,
                    p: 2.5,
                    bgcolor: 'rgba(0,113,227,0.1)',
                    borderRadius: 2,
                    border: '1px solid rgba(0,113,227,0.2)'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span className="material-icons" style={{ color: '#0071e3', fontSize: 20 }}>verified</span>
                        <Typography variant="body2" sx={{ color: '#0071e3', fontWeight: 500 }}>
                            Instant access after purchase
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default CartPage;
