# Social Network

Ứng dụng mạng xã hội cho phép chia sẻ hoạt động và tham gia các nhóm dựa trên sở thích. Người dùng đăng bài (video, ảnh), bình luận, thả cảm xúc, kết bạn, theo dõi nhau, tham gia nhóm và nhắn tin trực tiếp theo thời gian thực.

Dự án gồm backend (NestJS), ứng dụng web (React) và ứng dụng mobile (React Native).

## Mục lục

- [Kiến trúc](#kiến-trúc)
- [Tính năng](#tính-năng)
- [Phân quyền](#phân-quyền)
- [Điểm nổi tiếng](#điểm-nổi-tiếng)
- [Công nghệ](#công-nghệ)
- [Bắt đầu](#bắt-đầu)
- [Biến môi trường](#biến-môi-trường)
- [Scripts](#scripts)
- [Triển khai](#triển-khai)
- [Định hướng phát triển](#định-hướng-phát-triển)
- [Phân công](#phân-công)

## Kiến trúc

| Ứng dụng | Mô tả |
| --- | --- |
| `api/` | Backend REST API và WebSocket (NestJS, MongoDB) |
| `web/` | Ứng dụng web (React, Vite) |
| `mobile/` | Ứng dụng mobile (React Native, Expo), chuyển đổi từ bản web |

Web và mobile cùng gọi tới API qua REST, tin nhắn trực tiếp đi qua Socket.IO.

## Tính năng

### Bài viết
- Đăng bài với 3 dạng nội dung: **video**, **một ảnh** hoặc **nhiều ảnh**.
- Mỗi bài có trạng thái hiển thị: **chỉ mình tôi**, **bạn bè** hoặc **mọi người**.
- Bình luận bài viết và thả cảm xúc.

### Bạn bè và theo dõi
- Kết bạn và quản lý danh sách bạn bè.
- Theo dõi (follow) người dùng khác.

### Nhóm
- Tạo và tham gia nhóm.
- Hoạt động trong nhóm, quản lý bởi admin nhóm (xem [Phân quyền](#phân-quyền)).

### Nhắn tin
- Nhắn tin trực tiếp theo thời gian thực bằng **Socket.IO**.

### Thông báo
- Thông báo cho người dùng khi có hoạt động liên quan.

### Thanh toán
- Thanh toán qua **Stripe**.

### Quản trị
- Admin hệ thống quản lý người dùng, thực hiện **ban** và **cấm** tài khoản.

## Phân quyền

Hệ thống phân quyền ở hai cấp.

**Cấp hệ thống (khi đăng nhập)**

| Vai trò | Quyền |
| --- | --- |
| Admin hệ thống | Quản lý người dùng, ban và cấm tài khoản |
| Người dùng | Sử dụng các tính năng của mạng xã hội |

**Cấp nhóm**

| Vai trò | Quyền |
| --- | --- |
| Admin nhóm | Toàn quyền trong nhóm |
| Thành viên | Tham gia và hoạt động trong nhóm |

## Điểm nổi tiếng

Mỗi người dùng có một điểm nổi tiếng được tính từ hoạt động của họ: đăng bài, thích bài, bình luận và theo dõi người khác. Nguồn điểm lớn nhất đến từ **số người theo dõi (follower)** mà người dùng đạt được.

## Công nghệ

| Thành phần | Công nghệ |
| --- | --- |
| Backend | NestJS 11, MongoDB + Mongoose 8, Passport + JWT, Socket.IO, class-validator |
| Thanh toán | Stripe |
| Email | Nodemailer (SMTP) |
| Web | React 19, Vite 7, TypeScript, React Router 7, TanStack Query, Socket.IO client, Sass |
| Mobile | React Native, Expo, TypeScript, TanStack Query, Socket.IO client, React Native Paper |
| Tiến trình | PM2 |

## Bắt đầu

### Yêu cầu

- Node.js 20 trở lên
- npm
- MongoDB

### Cài đặt

```bash
git clone https://github.com/Hongtruongbvn/socal-media.git
cd socal-media
```

### Backend

```bash
cd api
npm install
# tạo file .env theo mục "Biến môi trường"
npm run start:dev
```

API chạy tại `http://localhost:8888/api`.

Nạp dữ liệu mẫu (tùy chọn):

```bash
npm run seed
```

### Web

```bash
cd web
npm install
# tạo file .env theo mục "Biến môi trường"
npm run dev
```

### Mobile

```bash
cd mobile
npm install
# tạo file .env theo mục "Biến môi trường"
npm start
```

Sau khi chạy `npm start`, mở ứng dụng trên thiết bị hoặc giả lập (`npm run android` / `npm run ios`).

## Biến môi trường

> Các giá trị dạng `YOUR_...` là ví dụ. Hãy thay bằng giá trị của bạn và **không commit file `.env` lên GitHub**.

### API (`api/.env`)

```dotenv
# Email
MAIL_USER=YOUR_EMAIL
MAIL_HOST=smtp.gmail.com
MAIL_PASS=YOUR_APP_PASSWORD
MAIL_FROM="YOUR_APP_NAME" <YOUR_EMAIL>

# Database
MONGO_URI=YOUR_MONGO_URI                  # ví dụ: mongodb://localhost:27017/YOUR_DB_NAME

# Xác thực
JWT_SECRET=YOUR_JWT_SECRET
JWT_EXPIRES_IN=1d

# URL của API
API_URL=YOUR_API_URL                      # ví dụ: http://localhost:8888/api

# Stripe (backend dùng secret key)
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
```

### Web (`web/.env`)

```dotenv
VITE_API_BASE_URL=YOUR_API_BASE_URL       # ví dụ: http://localhost:8888/api
VITE_API_STATIC_URL=YOUR_STATIC_URL       # ví dụ: http://localhost:8888
VITE_STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_PUBLISHABLE_KEY
```

### Mobile (`mobile/.env`)

```dotenv
VITE_API_BASE_URL=YOUR_API_BASE_URL       # ví dụ: http://YOUR_LOCAL_IP:8888/api
VITE_API_STATIC_URL=YOUR_STATIC_URL       # ví dụ: http://YOUR_LOCAL_IP:8888
VITE_STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_PUBLISHABLE_KEY
API_URL=YOUR_API_BASE_URL                 # ví dụ: http://YOUR_LOCAL_IP:8888/api
```

> Khi chạy mobile trên thiết bị thật, dùng địa chỉ IP trong mạng LAN của máy đang chạy API (không dùng `localhost`).

## Scripts

### API

| Lệnh | Mô tả |
| --- | --- |
| `npm run start:dev` | Chạy chế độ phát triển (watch) |
| `npm run build` | Build |
| `npm run start:prod` | Chạy bản build |
| `npm run seed` | Nạp dữ liệu mẫu |

### Web

| Lệnh | Mô tả |
| --- | --- |
| `npm run dev` | Chạy chế độ phát triển |
| `npm run build` | Build |
| `npm run preview` | Xem thử bản build |
| `npm run lint` | Kiểm tra lint |

### Mobile

| Lệnh | Mô tả |
| --- | --- |
| `npm start` | Chạy Expo |
| `npm run android` | Chạy trên Android |
| `npm run ios` | Chạy trên iOS |

## Triển khai

Backend được chạy bằng **PM2**:

```bash
cd api
npm run build
pm2 start dist/main.js --name social-api
```

## Định hướng phát triển

- Mở rộng các tính năng giao tiếp cộng đồng theo hướng Discord (hiện mới là định hướng, chưa triển khai).

## Phân công

**Phạm Hồng Trưởng** (Trưởng nhóm)
- **Backend:** xử lý toàn bộ logic bạn bè, hoạt động trong nhóm, thanh toán, thông báo và quản trị người dùng (ban, cấm).
- **Cơ sở dữ liệu:** thiết kế cơ sở dữ liệu.
- **Mobile:** thực hiện toàn bộ ứng dụng mobile, chuyển đổi từ bản web React sang React Native.
