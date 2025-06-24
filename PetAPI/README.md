# PetAPI - Sanal Evcil Hayvan Oyunu API'si

PetAPI, kullanıcıların sanal evcil hayvanlar oluşturup onlarla etkileşime geçebileceği bir oyun API'sidir. Kullanıcılar evcil hayvanlarını besleyebilir, onlarla oyun oynayabilir ve liderlik tablosunda sıralamalarını görebilir.

## 🚀 Kullanılan Teknolojiler

- **.NET 8** - Modern .NET framework
- **ASP.NET Core** - Web API framework
- **Entity Framework Core** - ORM ve veritabanı yönetimi
- **SQL Server** - Veritabanı
- **JWT Bearer** - Kimlik doğrulama
- **BCrypt.Net-Next** - Şifre hash'leme
- **Serilog** - Yapısal loglama
- **Swagger/OpenAPI** - API dokümantasyonu
- **Docker** - Konteynerizasyon
- **xUnit** - Birim testleri
- **Moq** - Mock framework
- **FluentAssertions** - Test assertions

## 📋 Özellikler

- ✅ Kullanıcı kayıt ve giriş sistemi
- ✅ JWT tabanlı kimlik doğrulama
- ✅ Evcil hayvan oluşturma ve yönetimi
- ✅ Besleme ve oyun oynama mekanikleri
- ✅ Liderlik tablosu (sayfalama ile)
- ✅ Otomatik istatistik güncelleme (background service)
- ✅ Global hata yönetimi
- ✅ Kapsamlı API dokümantasyonu
- ✅ Docker desteği

## 🛠️ Kurulum ve Çalıştırma

### Ön Gereksinimler

- .NET 8 SDK
- SQL Server (LocalDB, Express veya Full)
- Docker (opsiyonel)

### 1. Projeyi Klonlama

```bash
git clone <repository-url>
cd PetAPI
```

### 2. User Secrets Yapılandırması

Projeye sağ tıklayın → "Manage User Secrets" seçin ve aşağıdaki değerleri ekleyin:

```json
{
  "Jwt": {
    "Key": "CokGizliVeUzunBirAnahtar_PetAPI_2024!@#$%^&*()",
    "Issuer": "PetAPI_Issuer",
    "Audience": "PetAPI_Audience"
  },
  "ApiKey": "your-super-secret-api-key-here"
}
```

### 3. Veritabanı Bağlantısı

`appsettings.json` dosyasındaki connection string'i güncelleyin:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=PetAPIDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

### 4. Veritabanı Migration'ları

```bash
# Migration oluştur
dotnet ef migrations add InitialCreate

# Veritabanını güncelle
dotnet ef database update
```

### 5. Uygulamayı Başlatma

```bash
dotnet run
```

Uygulama varsayılan olarak `https://localhost:7000` ve `http://localhost:5000` adreslerinde çalışacaktır.

## 📚 API Kullanımı

### Swagger Dokümantasyonu

API dokümantasyonuna erişmek için: `https://localhost:7000/swagger`

### Ana Endpoint'ler

#### 🔐 Kimlik Doğrulama

**Kullanıcı Kaydı:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "123456"
}
```

**Kullanıcı Girişi:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "123456"
}
```

#### 🐾 Evcil Hayvan İşlemleri

**Evcil Hayvan Oluşturma:**
```http
POST /api/pets
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Pamuk",
  "type": "Kedi"
}
```

**Evcil Hayvanımı Görüntüleme:**
```http
GET /api/pets/mypet
Authorization: Bearer <jwt-token>
```

**Evcil Hayvanı Besleme:**
```http
POST /api/pets/feed
Authorization: Bearer <jwt-token>
```

**Evcil Hayvanla Oyun Oynama:**
```http
POST /api/pets/play
Authorization: Bearer <jwt-token>
```

#### 🏆 Liderlik Tablosu

**Liderlik Tablosunu Görüntüleme:**
```http
GET /api/pets/leaderboard?pageNumber=1&pageSize=10
```

## 🐳 Docker ile Çalıştırma

### Sadece Uygulamayı Çalıştırma

```bash
# Docker imajını oluştur
docker build -t petapi .

# Uygulamayı çalıştır
docker run -p 8080:8080 petapi
```

### Docker Compose ile Tam Ortam

```bash
# Tüm servisleri başlat (API + Database)
docker-compose up -d

# Servisleri durdur
docker-compose down
```

## 🧪 Test

### Birim Testleri

```bash
cd PetAPI.Tests
dotnet test
```

## 📁 Proje Yapısı

```
PetAPI/
├── Controllers/          # API Controller'ları
├── Services/            # İş mantığı servisleri
├── Interfaces/          # Servis arayüzleri
├── Entities/            # Veritabanı entity'leri
├── Data/               # DbContext ve veritabanı yapılandırması
├── Dtos/               # Data Transfer Objects
├── Middleware/         # Custom middleware'ler
├── BackgroundServices/ # Arka plan servisleri
├── Migrations/         # EF Core migration'ları
└── Properties/         # Proje özellikleri
```

## 🔧 Yapılandırma

### Environment Variables

- `ASPNETCORE_ENVIRONMENT`: Çalışma ortamı (Development/Production)
- `ConnectionStrings__DefaultConnection`: Veritabanı bağlantı cümlesi
- `Jwt__Key`: JWT imzalama anahtarı
- `Jwt__Issuer`: JWT issuer
- `Jwt__Audience`: JWT audience

### Loglama

Uygulama Serilog kullanarak loglama yapar:
- Konsol çıktısı
- `logs/log-YYYY-MM-DD.txt` dosyaları

## 🚨 Güvenlik

- JWT Bearer token kimlik doğrulama
- BCrypt ile güvenli şifre hash'leme
- Global exception handling
- Input validation
- CORS yapılandırması

## 📈 Performans

- Entity Framework Core optimizasyonları
- AsNoTracking() kullanımı
- Background service ile asenkron işlemler
- Sayfalama (pagination) desteği

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Sorularınız için issue açabilir veya iletişime geçebilirsiniz. 