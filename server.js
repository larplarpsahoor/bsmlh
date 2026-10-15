const express = require('express');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Configuration - Bu değerleri .env dosyasında saklayın
const CONFIG = {
    // Demo şifresi (hash'lenmiş hali)
    PASSWORD_HASH: process.env.PASSWORD_HASH || crypto.createHash('sha256').update('demo2024').digest('hex'),
    
    // Dropbox dosya indirme linki (gizli tutulacak)
    DROPBOX_DOWNLOAD_URL: process.env.DROPBOX_DOWNLOAD_URL || 'https://dropbox.com/s/your-secret-link/demo.zip?dl=1',
    
    // Discord Webhook URL
    DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/YOUR_WEBHOOK_URL',
    
    // Rate limiting
    MAX_ATTEMPTS_PER_IP: 5,
    RATE_LIMIT_WINDOW: 15 * 60 * 1000 // 15 dakika
};

// Rate limiting için IP bazlı tracker
const ipAttempts = new Map();

// Rate limiting middleware
function rateLimitMiddleware(req, res, next) {
    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Eski kayıtları temizle
    for (const [ip, data] of ipAttempts.entries()) {
        if (now - data.firstAttempt > CONFIG.RATE_LIMIT_WINDOW) {
            ipAttempts.delete(ip);
        }
    }
    
    // Mevcut IP'nin denemelerini kontrol et
    const attempts = ipAttempts.get(clientIP) || { count: 0, firstAttempt: now };
    
    if (attempts.count >= CONFIG.MAX_ATTEMPTS_PER_IP) {
        return res.status(429).json({
            success: false,
            message: 'Çok fazla deneme yapıldı. Lütfen 15 dakika sonra tekrar deneyin.'
        });
    }
    
    next();
}

// Şifre doğrulama endpoint'i (sadece şifre kontrol eder)
app.post('/api/verify-password', rateLimitMiddleware, async (req, res) => {
    try {
        const { password } = req.body;
        const clientIP = req.ip || req.connection.remoteAddress;
        
        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Password is required.'
            });
        }
        
        // Şifreyi hash'le ve karşılaştır
        const inputHash = crypto.createHash('sha256').update(password).digest('hex');
        const isPasswordCorrect = inputHash === CONFIG.PASSWORD_HASH;
        
        // Rate limiting tracking
        const attempts = ipAttempts.get(clientIP) || { count: 0, firstAttempt: Date.now() };
        attempts.count++;
        ipAttempts.set(clientIP, attempts);
        
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password. Please try again.'
            });
        }
        
        // Şifre doğru
        res.json({
            success: true,
            message: 'Password verified. Proceed to download.'
        });
        
        // IP'yi rate limit listesinden temizle (başarılı giriş)
        ipAttempts.delete(clientIP);
        
    } catch (error) {
        console.error('Password verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// Demo indirme endpoint'i (username ile birlikte)
app.post('/api/download-demo', rateLimitMiddleware, async (req, res) => {
    try {
        const { username, invitedBy, password } = req.body;
        const clientIP = req.ip || req.connection.remoteAddress;
        
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required.'
            });
        }
        
        // Şifreyi tekrar kontrol et
        const inputHash = crypto.createHash('sha256').update(password).digest('hex');
        const isPasswordCorrect = inputHash === CONFIG.PASSWORD_HASH;
        
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid access. Please start over.'
            });
        }
        
        // Discord webhook'u tetikle
        await sendDiscordNotification(clientIP, username, invitedBy, password);
        
        // Geçici download token oluştur (5 dakika geçerli)
        const downloadToken = crypto.randomBytes(32).toString('hex');
        const expirationTime = Date.now() + (5 * 60 * 1000); // 5 dakika
        
        // Token'ı geçici olarak sakla
        global.downloadTokens = global.downloadTokens || new Map();
        global.downloadTokens.set(downloadToken, {
            expiration: expirationTime,
            ip: clientIP,
            username: username,
            invitedBy: invitedBy
        });
        
        // Başarılı yanıt
        res.json({
            success: true,
            downloadUrl: `/api/download/${downloadToken}`,
            message: 'Download ready for ' + username
        });
        
    } catch (error) {
        console.error('Download request error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// Güvenli indirme endpoint'i
app.get('/api/download/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const clientIP = req.ip || req.connection.remoteAddress;
        
        // Token kontrolü
        global.downloadTokens = global.downloadTokens || new Map();
        const tokenData = global.downloadTokens.get(token);
        
        if (!tokenData) {
            return res.status(404).json({
                success: false,
                message: 'Geçersiz indirme bağlantısı.'
            });
        }
        
        // Token süresi kontrolü
        if (Date.now() > tokenData.expiration) {
            global.downloadTokens.delete(token);
            return res.status(410).json({
                success: false,
                message: 'İndirme bağlantısının süresi dolmuş. Lütfen tekrar şifre giriniz.'
            });
        }
        
        // IP kontrolü (ekstra güvenlik)
        if (tokenData.ip !== clientIP) {
            return res.status(403).json({
                success: false,
                message: 'Bu indirme bağlantısı sizin IP adresiniz için geçerli değil.'
            });
        }
        
        // Token'ı kullandıktan sonra sil (tek kullanımlık)
        global.downloadTokens.delete(token);
        
        // Dropbox linkine yönlendir
        res.redirect(CONFIG.DROPBOX_DOWNLOAD_URL);
        
        // İndirme logunu Discord'a gönder
        await sendDownloadNotification(clientIP, tokenData.username, tokenData.invitedBy);
        
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({
            success: false,
            message: 'İndirme sırasında hata oluştu.'
        });
    }
});

// Discord bildirim fonksiyonu (demo indirme)
async function sendDiscordNotification(ip, username, invitedBy, password) {
    if (!CONFIG.DISCORD_WEBHOOK_URL || CONFIG.DISCORD_WEBHOOK_URL.includes('YOUR_WEBHOOK')) {
        console.log('Discord webhook not configured');
        return;
    }
    
    try {
        const embed = {
            title: '🎮 Zorandus Demo Download',
            color: 0xd4af37,
            fields: [
                {
                    name: 'Username',
                    value: username,
                    inline: true
                },
                {
                    name: 'IP Address',
                    value: ip,
                    inline: true
                },
                {
                    name: 'Version',
                    value: 'v1.2.6',
                    inline: true
                },
                {
                    name: 'Invited By',
                    value: invitedBy || 'Not specified',
                    inline: true
                },
                {
                    name: 'Time',
                    value: new Date().toLocaleString('en-US'),
                    inline: true
                },
                {
                    name: 'Access Code Used',
                    value: `||${password}||`, // Spoiler tag
                    inline: false
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: 'Zorandus: Beyond The Gates Demo System'
            }
        };
        
        await axios.post(CONFIG.DISCORD_WEBHOOK_URL, {
            embeds: [embed]
        });
        
    } catch (error) {
        console.error('Discord notification error:', error);
    }
}

// Discord bildirim fonksiyonu (dosya indirme)
async function sendDownloadNotification(ip, username, invitedBy) {
    if (!CONFIG.DISCORD_WEBHOOK_URL || CONFIG.DISCORD_WEBHOOK_URL.includes('YOUR_WEBHOOK')) {
        return;
    }
    
    try {
        const embed = {
            title: '📥 Demo File Downloaded',
            color: 0x00ff00,
            fields: [
                {
                    name: 'Username',
                    value: username || 'Unknown',
                    inline: true
                },
                {
                    name: 'IP Address',
                    value: ip,
                    inline: true
                },
                {
                    name: 'Version',
                    value: 'v1.2.6',
                    inline: true
                },
                {
                    name: 'Invited By',
                    value: invitedBy || 'Not specified',
                    inline: true
                },
                {
                    name: 'Download Time',
                    value: new Date().toLocaleString('en-US'),
                    inline: true
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: 'Zorandus: Beyond The Gates Demo System'
            }
        };
        
        await axios.post(CONFIG.DISCORD_WEBHOOK_URL, {
            embeds: [embed]
        });
        
    } catch (error) {
        console.error('Discord download notification error:', error);
    }
}

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`🚀 Zorandus Demo Server running on http://localhost:${PORT}`);
    console.log(`📁 Static files served from: ${__dirname}`);
    console.log(`🔐 Password hash: ${CONFIG.PASSWORD_HASH}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Server is shutting down...');
    process.exit(0);
});

// Expired token cleanup (her 10 dakikada bir)
setInterval(() => {
    if (global.downloadTokens) {
        const now = Date.now();
        for (const [token, data] of global.downloadTokens.entries()) {
            if (now > data.expiration) {
                global.downloadTokens.delete(token);
            }
        }
    }
}, 10 * 60 * 1000);