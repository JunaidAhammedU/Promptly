# 🧪 Testing Your Error Handling System

## Quick Test Commands

Use these commands to test the error handling system after starting your server:

### Start the Server
```bash
npm run start:dev
```

---

## 🎯 Test Endpoints

All test endpoints are available at: `http://localhost:3000/api/v1/error-test/`

### 1. Test Success Response
```bash
curl http://localhost:3000/api/v1/error-test/success
```

**Expected Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "message": "This is a successful response",
    "data": {
      "test": true
    }
  },
  "timestamp": "2025-10-04T12:00:00.000Z"
}
```

---

### 2. Test 404 Not Found
```bash
curl http://localhost:3000/api/v1/error-test/not-found
```

**Expected Response:**
```json
{
  "success": false,
  "statusCode": 404,
  "errorCode": "NOT_FOUND",
  "message": "Test resource not found",
  "details": [
    {
      "field": "id",
      "message": "Resource does not exist",
      "value": 123
    }
  ],
  "timestamp": "2025-10-04T12:00:00.000Z",
  "path": "/api/v1/error-test/not-found"
}
```

---

### 3. Test 400 Bad Request
```bash
curl http://localhost:3000/api/v1/error-test/bad-request
```

---

### 4. Test 409 Conflict
```bash
curl http://localhost:3000/api/v1/error-test/conflict
```

---

### 5. Test Validation Error
```bash
curl http://localhost:3000/api/v1/error-test/validation
```

---

### 6. Test 500 Server Error
```bash
curl http://localhost:3000/api/v1/error-test/server-error
```

**Expected Response:**
```json
{
  "success": false,
  "statusCode": 500,
  "errorCode": "INTERNAL_SERVER_ERROR",
  "message": "Unexpected server error occurred",
  "timestamp": "2025-10-04T12:00:00.000Z",
  "path": "/api/v1/error-test/server-error",
  "stack": "Error: Unexpected server error occurred\n    at ..."
}
```
*Note: Stack trace only shown in development mode*

---

### 7. Test POST Validation
```bash
# Missing email (should fail)
curl -X POST http://localhost:3000/api/v1/error-test/test-validation \
  -H "Content-Type: application/json" \
  -d '{}'

# With email (should succeed)
curl -X POST http://localhost:3000/api/v1/error-test/test-validation \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

---

### 8. Test Dynamic Parameters
```bash
# Valid ID (should succeed)
curl http://localhost:3000/api/v1/error-test/user/50

# Invalid ID (should fail with 404)
curl http://localhost:3000/api/v1/error-test/user/150
```

---

## 📊 Check Logs

After running tests, check the log files:

### View Error Logs
```bash
# Windows PowerShell
Get-Content logs\error.log -Tail 20

# Or use a text editor
code logs\error.log
```

### View All Logs
```bash
# Windows PowerShell
Get-Content logs\combined.log -Tail 50

# Or use a text editor
code logs\combined.log
```

---

## 🔍 What to Look For

### In Console (Development Mode)
You should see:
- ✅ Incoming request logs (green)
- ✅ Outgoing response logs (green for success, red for errors)
- ✅ Response times
- ✅ Error details (for failed requests)

### In Log Files
Check that:
- ✅ All requests are logged with timestamps
- ✅ Sensitive data (passwords) are redacted as `***REDACTED***`
- ✅ Error logs include stack traces
- ✅ Request details (method, URL, body) are present

---

## 🧪 Testing with Postman or Thunder Client

### Import Collection

Create a new collection with these requests:

1. **GET Success**
   - URL: `http://localhost:3000/api/v1/error-test/success`
   - Method: GET

2. **GET Not Found**
   - URL: `http://localhost:3000/api/v1/error-test/not-found`
   - Method: GET

3. **POST Validation**
   - URL: `http://localhost:3000/api/v1/error-test/test-validation`
   - Method: POST
   - Body (JSON):
     ```json
     {
       "email": "test@example.com"
     }
     ```

---

## 🎯 Test Your Own Endpoints

### Example: Testing Users Endpoint

1. **Create `src/users/users.service.ts`** with error handling:

```typescript
import { Injectable } from '@nestjs/common';
import { NotFoundException } from '../common/exceptions/http.exceptions';

@Injectable()
export class UsersService {
  async findOne(id: number) {
    // Simulate database lookup
    const user = null; // Replace with actual DB call
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`, [
        { field: 'id', message: 'User does not exist', value: id }
      ]);
    }
    
    return user;
  }
}
```

2. **Test it:**
```bash
curl http://localhost:3000/api/v1/users/999
```

---

## ✅ Verification Checklist

Run through this checklist to ensure everything works:

- [ ] Server starts without errors
- [ ] Success endpoint returns 200 with wrapped response
- [ ] Error endpoints return appropriate status codes
- [ ] Error responses include `errorCode`, `message`, and `details`
- [ ] Timestamps are present in all responses
- [ ] Console shows colored logs (in development)
- [ ] `logs/error.log` contains error-level logs
- [ ] `logs/combined.log` contains all logs
- [ ] Sensitive data is redacted in logs
- [ ] Stack traces appear only in development mode
- [ ] Response times are logged

---

## 🐛 Common Issues

### Logs Not Created?
- Check that `logs/` directory exists
- Ensure Winston has write permissions
- Verify `LOG_LEVEL` environment variable is set

### Errors Not Caught?
- Ensure global filter is registered in `main.ts` or `app.module.ts`
- Check that exceptions extend from `Error` or `HttpException`
- Verify the exception is thrown (not just returned)

### Stack Traces in Production?
- Set `NODE_ENV=production` in your `.env` file
- Restart the server after changing environment variables

---

## 🚀 Next Steps

1. Remove the `ErrorTestModule` from production builds
2. Implement error handling in your actual services
3. Set up monitoring/alerting based on error logs
4. Add more specific error types as needed
5. Configure log rotation for production

---

## 📝 Production Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production`
- [ ] Remove or disable `ErrorTestModule`
- [ ] Configure log rotation (e.g., with `winston-daily-rotate-file`)
- [ ] Set up error monitoring (e.g., Sentry, LogRocket)
- [ ] Review all error messages for sensitive information
- [ ] Test error handling with production-like data
- [ ] Document common error codes for your API consumers

---

Happy Testing! 🎉
