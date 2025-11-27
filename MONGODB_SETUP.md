# Kết nối MongoDB Atlas

## 📦 Đã cài đặt
- `mongodb`: Driver chính thức của MongoDB cho Node.js

## 📁 Files đã tạo

### 1. `src/lib/mongodb.ts`
File quản lý kết nối MongoDB với connection pooling và HMR support cho development.

**Chức năng:**
- Singleton pattern để tái sử dụng kết nối
- Hỗ trợ HMR trong development mode
- Export functions: `getDatabase()`, `getCollection()`

### 2. `src/lib/mongodb-utils.ts`
Utility functions cho CRUD operations.

**Các functions có sẵn:**
- `findDocuments()` - Tìm nhiều documents
- `findOneDocument()` - Tìm 1 document
- `insertDocument()` - Thêm 1 document
- `insertDocuments()` - Thêm nhiều documents
- `updateDocument()` - Cập nhật 1 document
- `updateDocuments()` - Cập nhật nhiều documents
- `deleteDocument()` - Xóa 1 document
- `deleteDocuments()` - Xóa nhiều documents
- `countDocuments()` - Đếm documents
- `documentExists()` - Kiểm tra document có tồn tại

### 3. API Routes

#### `src/app/api/mongodb/test/route.ts`
Test kết nối MongoDB.

**Endpoint:** `GET /api/mongodb/test`

**Response:**
```json
{
  "success": true,
  "message": "MongoDB connection successful",
  "database": "ipms",
  "stats": {
    "collections": 10,
    "dataSize": 1024,
    "indexSize": 512
  }
}
```

#### `src/app/api/mongodb/data/route.ts`
CRUD operations cho collection.

**Endpoints:**
- `GET /api/mongodb/data` - Lấy tất cả documents (có pagination)
- `GET /api/mongodb/data?id=xxx` - Lấy 1 document
- `POST /api/mongodb/data` - Tạo document mới
- `PUT /api/mongodb/data?id=xxx` - Cập nhật document
- `DELETE /api/mongodb/data?id=xxx` - Xóa document

**Query Parameters:**
- `limit`: Số lượng documents (default: 100)
- `skip`: Bỏ qua bao nhiêu documents (default: 0)

## ⚙️ Cấu hình

### File `.env`
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DATABASE=ipms
MONGODB_COLLECTION_NAME=ocr_extractions_raw
MONGODB_LOG_COLLECTION=ocr_logs
```

**Cần thay đổi:**
1. `username` - MongoDB Atlas username
2. `password` - MongoDB Atlas password
3. `cluster.mongodb.net` - Cluster URL của bạn

### Lấy Connection String từ MongoDB Atlas:
1. Đăng nhập vào [MongoDB Atlas](https://cloud.mongodb.com/)
2. Chọn cluster của bạn
3. Click "Connect" → "Connect your application"
4. Chọn Driver: Node.js, Version: 5.5 or later
5. Copy connection string và thay thế vào `.env`

## 🚀 Cách sử dụng

### 1. Test kết nối
Khởi động dev server:
```bash
npm run dev
```

Truy cập: `http://localhost:3000/api/mongodb/test`

### 2. Sử dụng trong Server Component
```typescript
import { findDocuments } from '@/lib/mongodb-utils';

export default async function MyPage() {
  const data = await findDocuments('ocr_extractions_raw', {}, { limit: 10 });
  
  return (
    <div>
      {data.map((item) => (
        <div key={item._id.toString()}>{/* render data */}</div>
      ))}
    </div>
  );
}
```

### 3. Sử dụng trong API Route
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { findDocuments } from '@/lib/mongodb-utils';

export async function GET(request: NextRequest) {
  try {
    const data = await findDocuments('your_collection', {});
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

### 4. Sử dụng với TanStack Query (Client Component)
```typescript
'use client';

import { useQuery } from '@tanstack/react-query';

export default function MyComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['mongodb-data'],
    queryFn: async () => {
      const res = await fetch('/api/mongodb/data?limit=20');
      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  
  return <div>{/* render data */}</div>;
}
```

## 🔒 Bảo mật

### Đã implement:
- ✅ Connection string lưu trong environment variables
- ✅ Không hardcode credentials trong code
- ✅ Error handling không expose stack trace ra client
- ✅ Validation inputs trong API routes

### Cần implement thêm:
- [ ] Authentication & Authorization cho API routes
- [ ] Rate limiting
- [ ] Input validation với Zod/Yup
- [ ] CORS configuration
- [ ] Logging cho mọi database operations

## 📝 Lưu ý

1. **Connection Pooling**: MongoDB driver tự động quản lý connection pool
2. **Development HMR**: Sử dụng global variable để tránh tạo nhiều connections khi HMR
3. **Production**: Mỗi serverless function sẽ có connection riêng nhưng được reuse
4. **Timeout**: Default connection timeout là 30s, có thể config trong options
5. **Error Handling**: Luôn wrap database calls trong try-catch

## 🐛 Troubleshooting

### Lỗi kết nối
- Kiểm tra IP whitelist trong MongoDB Atlas (thêm `0.0.0.0/0` cho development)
- Verify username/password chính xác
- Kiểm tra cluster URL đúng

### Lỗi authentication
- Đảm bảo database user đã được tạo
- Kiểm tra quyền của user (readWrite hoặc admin)

### Lỗi timeout
- Tăng timeout trong MongoDB connection options
- Kiểm tra network connectivity
