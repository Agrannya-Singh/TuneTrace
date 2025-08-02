# TuneTrace Deployment Guide for Render

## Overview

This guide provides step-by-step instructions for deploying TuneTrace on Render platform. The application consists of two services:
- **Frontend**: Next.js application
- **Backend**: Python FastAPI application with ML capabilities

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **Git Repository**: Push your code to GitHub/GitLab
3. **API Keys**: Obtain YouTube and Spotify API credentials
4. **Database**: Set up a PostgreSQL database (recommended for production)

## Deployment Steps

### 1. Frontend Deployment (Next.js)

#### Step 1: Create Web Service
1. Log into Render Dashboard
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Configure the service:

```yaml
Name: tunetrace-frontend
Environment: Node
Build Command: npm ci && npm run build
Start Command: npm start
```

#### Step 2: Environment Variables
Add the following environment variables in Render dashboard:

```bash
# Required
NODE_ENV=production
NEXT_PUBLIC_PYTHON_BACKEND_URL=https://your-backend-service.onrender.com

# YouTube API (if still using for fallback)
YOUTUBE_API_KEY=your_youtube_api_key

# Spotify API
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=https://your-frontend-service.onrender.com/api/spotify/callback

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-frontend-service.onrender.com
```

#### Step 3: Advanced Settings
- **Auto-Deploy**: Enable
- **Branch**: `main` (or your default branch)
- **Health Check Path**: `/`

### 2. Backend Deployment (Python FastAPI)

#### Step 1: Create Web Service
1. Click "New +" → "Web Service"
2. Connect the same Git repository
3. Configure the service:

```yaml
Name: tunetrace-backend
Environment: Python 3
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

#### Step 2: Environment Variables
Add the following environment variables:

```bash
# Required
PYTHON_BACKEND_URL=https://your-backend-service.onrender.com
DATABASE_URL=postgresql://user:password@host:port/db

# API Keys
YOUTUBE_API_KEY=your_youtube_api_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# ML Configuration
ML_MODEL_PATH=./ml_models/recommendation_model.pkl

# Optional: For production database
# DATABASE_URL=postgresql://user:password@host:port/db
```

#### Step 3: Advanced Settings
- **Auto-Deploy**: Enable
- **Branch**: `main`
- **Health Check Path**: `/health`

### 3. Database Setup (Optional but Recommended)

#### PostgreSQL Database
1. Click "New +" → "PostgreSQL"
2. Configure:
   - **Name**: `tunetrace-db`
   - **Database**: `tunetrace`
   - **User**: `tunetrace_user`
3. Copy the connection string to your backend environment variables

#### Update Backend Environment
```bash
DATABASE_URL=postgresql://tunetrace_user:password@host:port/tunetrace
```

### 4. Environment Configuration

#### Update Spotify Redirect URI
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Update your app's redirect URI to:
   ```
   https://your-frontend-service.onrender.com/api/spotify/callback
   ```

#### Update YouTube API
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable YouTube Data API v3
3. Create API key with appropriate restrictions

### 5. Custom Domain (Optional)

1. In Render dashboard, go to your service
2. Click "Settings" → "Custom Domains"
3. Add your domain and configure DNS

## Docker Deployment Alternative

If you prefer Docker deployment:

### Frontend Dockerfile
```dockerfile
# Already created in root directory
# Use the existing Dockerfile
```

### Backend Dockerfile
```dockerfile
# Already created in backend directory
# Use the existing backend/Dockerfile
```

### Docker Compose for Local Testing
```bash
# Test locally before deployment
docker-compose up --build
```

## Health Checks

### Frontend Health Check
- **Path**: `/`
- **Expected**: 200 OK with HTML content

### Backend Health Check
- **Path**: `/health`
- **Expected**: `{"status": "healthy"}`

## Monitoring and Logs

### View Logs
1. Go to your service in Render dashboard
2. Click "Logs" tab
3. Monitor for errors and performance issues

### Set Up Alerts
1. Go to "Settings" → "Alerts"
2. Configure alerts for:
   - Service down
   - High error rates
   - Performance issues

## Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check build logs
# Common issues:
# - Missing environment variables
# - Dependency conflicts
# - Port configuration issues
```

#### 2. Runtime Errors
```bash
# Check application logs
# Common issues:
# - Database connection problems
# - API key issues
# - CORS configuration
```

#### 3. Performance Issues
```bash
# Monitor resource usage
# Consider:
# - Upgrading service tier
# - Optimizing code
# - Caching strategies
```

### Debug Commands

#### Frontend Debug
```bash
# Check if frontend is accessible
curl https://your-frontend-service.onrender.com

# Check environment variables
echo $NEXT_PUBLIC_PYTHON_BACKEND_URL
```

#### Backend Debug
```bash
# Check if backend is accessible
curl https://your-backend-service.onrender.com/health

# Check API endpoints
curl https://your-backend-service.onrender.com/api/search
```

## Security Considerations

### Environment Variables
- Never commit API keys to Git
- Use Render's environment variable system
- Rotate keys regularly

### CORS Configuration
Update backend CORS settings for production:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-service.onrender.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

### Database Security
- Use connection pooling
- Enable SSL connections
- Regular backups

## Cost Optimization

### Free Tier Limits
- **Web Services**: 750 hours/month
- **PostgreSQL**: 90 days free trial
- **Custom Domains**: Free

### Scaling Considerations
- Monitor usage
- Upgrade when needed
- Consider caching strategies

## Maintenance

### Regular Tasks
1. **Security Updates**: Keep dependencies updated
2. **Backup Database**: Regular backups
3. **Monitor Logs**: Check for issues
4. **Update API Keys**: Rotate when needed

### Update Deployment
1. Push changes to Git
2. Render auto-deploys (if enabled)
3. Monitor deployment logs
4. Verify functionality

## Support

### Render Support
- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- [Render Status](https://status.render.com)

### Application Support
- Check logs for errors
- Verify environment variables
- Test endpoints manually
- Review security configuration 