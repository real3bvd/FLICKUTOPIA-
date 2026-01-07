import { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, Typography, TextField, Button, IconButton,
    Select, MenuItem, FormControl, InputLabel, Divider
} from '@mui/material';

function PaymentDialog({ open, onClose, movie, onPaymentSuccess }) {
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expMonth, setExpMonth] = useState('01');
    const [expYear, setExpYear] = useState('2025');
    const [cvv, setCvv] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const years = ['2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032'];

    const formatCardNumber = (value) => {
        // Remove all non-digits
        const digits = value.replace(/\D/g, '');
        // Add space every 4 digits
        const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
        return formatted.substring(0, 19); // Max 16 digits + 3 spaces
    };

    const handleCardNumberChange = (e) => {
        setCardNumber(formatCardNumber(e.target.value));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!cardName.trim()) newErrors.cardName = 'Name is required';
        if (cardNumber.replace(/\s/g, '').length !== 16) newErrors.cardNumber = 'Invalid card number';
        if (cvv.length < 3) newErrors.cvv = 'Invalid CVV';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePayment = async () => {
        if (!validateForm()) return;

        setProcessing(true);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        setProcessing(false);
        onPaymentSuccess(movie);
        handleClose();
    };

    const handleClose = () => {
        setCardName('');
        setCardNumber('');
        setExpMonth('01');
        setExpYear('2025');
        setCvv('');
        setErrors({});
        onClose();
    };

    if (!movie) return null;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: '#1d1d1f',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.1)'
                }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Complete Rental
                    </Typography>
                    <IconButton onClick={handleClose} sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        <span className="material-icons">close</span>
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                {/* Movie Summary */}
                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    p: 2,
                    bgcolor: 'rgba(255,255,255,0.05)',
                    borderRadius: 2,
                    mb: 3
                }}>
                    <Box sx={{
                        width: 80,
                        height: 120,
                        borderRadius: 1,
                        backgroundImage: `url(http://localhost:8080/api/posters/${movie.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.jpg)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        bgcolor: '#333'
                    }} />
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {movie.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            48-hour rental
                        </Typography>
                        <Typography variant="h5" sx={{
                            fontWeight: 700,
                            color: '#0071e3'
                        }}>
                            ₺{movie.rentPrice}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

                {/* Payment Form */}
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    <span className="material-icons" style={{ marginRight: 8, verticalAlign: 'middle' }}>
                        credit_card
                    </span>
                    Payment Details
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Name on Card */}
                    <TextField
                        label="Name on Card"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        error={!!errors.cardName}
                        helperText={errors.cardName}
                        fullWidth
                        placeholder="John Doe"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                bgcolor: 'rgba(255,255,255,0.05)'
                            }
                        }}
                    />

                    {/* Card Number */}
                    <TextField
                        label="Card Number"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        error={!!errors.cardNumber}
                        helperText={errors.cardNumber}
                        fullWidth
                        placeholder="1234 5678 9012 3456"
                        inputProps={{ maxLength: 19 }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                bgcolor: 'rgba(255,255,255,0.05)'
                            }
                        }}
                    />

                    {/* Expiration Date and CVV */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl sx={{ minWidth: 100 }}>
                            <InputLabel>Month</InputLabel>
                            <Select
                                value={expMonth}
                                label="Month"
                                onChange={(e) => setExpMonth(e.target.value)}
                                sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}
                            >
                                {months.map(m => (
                                    <MenuItem key={m} value={m}>{m}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ minWidth: 100 }}>
                            <InputLabel>Year</InputLabel>
                            <Select
                                value={expYear}
                                label="Year"
                                onChange={(e) => setExpYear(e.target.value)}
                                sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}
                            >
                                {years.map(y => (
                                    <MenuItem key={y} value={y}>{y}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="CVV"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                            error={!!errors.cvv}
                            helperText={errors.cvv}
                            placeholder="123"
                            inputProps={{ maxLength: 4 }}
                            sx={{
                                width: 100,
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: 'rgba(255,255,255,0.05)'
                                }
                            }}
                        />
                    </Box>
                </Box>

                {/* Security Notice */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mt: 3,
                    p: 1.5,
                    bgcolor: 'rgba(0,200,83,0.1)',
                    borderRadius: 1
                }}>
                    <span className="material-icons" style={{ color: '#00c853', fontSize: 20 }}>
                        lock
                    </span>
                    <Typography variant="caption" color="text.secondary">
                        Your payment is secured with 256-bit SSL encryption
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 2 }}>
                <Button
                    onClick={handleClose}
                    sx={{ color: 'rgba(255,255,255,0.7)' }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handlePayment}
                    disabled={processing}
                    sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #0071e3 0%, #00c6ff 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #005bb5 0%, #00b4e6 100%)',
                        }
                    }}
                >
                    {processing ? (
                        <>
                            <span className="material-icons" style={{
                                marginRight: 8,
                                animation: 'spin 1s linear infinite',
                                fontSize: 20
                            }}>
                                sync
                            </span>
                            Processing...
                        </>
                    ) : (
                        <>
                            <span className="material-icons" style={{ marginRight: 8, fontSize: 20 }}>
                                payment
                            </span>
                            Pay ₺{movie.rentPrice}
                        </>
                    )}
                </Button>
            </DialogActions>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </Dialog>
    );
}

export default PaymentDialog;
