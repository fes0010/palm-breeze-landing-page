# Quick Deployment Guide - Palm Breeze Networks

## 🚨 URGENT - Before Deployment

### 1. Revoke Exposed GitHub Token
```bash
# Visit: https://github.com/settings/tokens
# Find and delete the exposed token (starts with ghs_S28...)
# This token was found in .git/config on production server
```

## 🚀 Production Deployment (Server: 194.147.58.125)

### One-Time Setup (If not already done)

```bash
# SSH into production server
ssh user@194.147.58.125

# Install dependencies
sudo apt-get update
sudo apt-get install -y nginx rsync git

# Create web directory
sudo mkdir -p /var/www/palm-breeze
sudo mkdir -p /var/www/backups
```

### Deploy Security Updates

```bash
# 1. SSH into server
ssh user@194.147.58.125

# 2. Navigate to repository (or clone if first time)
cd /home/festoh/palm-breeze-landing-page
git pull origin main

# OR if first time:
# cd /home/festoh
# git clone https://github.com/fes0010/palm-breeze-landing-page.git
# cd palm-breeze-landing-page

# 3. Make deploy script executable (if not already)
chmod +x deploy.sh

# 4. Run deployment with sudo
sudo ./deploy.sh

# 5. Verify deployment
curl -I https://palmbreezenetworks.net/.git/config
# Should return 404 or 403

curl -I https://palmbreezenetworks.net | grep -i "strict-transport"
# Should show HSTS header
```

## ✅ Post-Deployment Verification

### 1. Check .git is Blocked
```bash
curl -I https://palmbreezenetworks.net/.git/config
# Expected: HTTP/2 404 or 403
```

### 2. Verify Security Headers
```bash
curl -I https://palmbreezenetworks.net
# Should show:
# - Strict-Transport-Security
# - Content-Security-Policy
# - X-Frame-Options
# - X-Content-Type-Options
```

### 3. Test Security Headers Grade
Visit: https://securityheaders.com/?q=palmbreezenetworks.net
- **Expected Grade: A or A+**

### 4. Test SSL Configuration
Visit: https://www.ssllabs.com/ssltest/analyze.html?d=palmbreezenetworks.net
- **Expected Grade: A or A+**

### 5. Verify Website Functionality
- Visit: https://palmbreezenetworks.net
- Test contact form
- Check all links work
- Verify mobile responsiveness

## 🔧 Troubleshooting

### Nginx Won't Start
```bash
# Check nginx configuration
sudo nginx -t

# View nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart nginx
sudo systemctl restart nginx
```

### .git Still Accessible
```bash
# Verify nginx config is loaded
sudo nginx -t

# Check if site is enabled
ls -la /etc/nginx/sites-enabled/

# Reload nginx
sudo systemctl reload nginx

# Manually remove .git from deployment
sudo rm -rf /var/www/palm-breeze/.git
```

### Security Headers Not Showing
```bash
# Check which nginx config is active
sudo nginx -T | grep -A 20 "server_name palmbreezenetworks"

# Verify the correct config file
cat /etc/nginx/sites-available/palmbreezenetworks.net

# Reload nginx
sudo systemctl reload nginx
```

## 📋 Deployment Checklist

- [ ] Pull latest code from GitHub
- [ ] Review changes in `git log`
- [ ] Run `sudo ./deploy.sh`
- [ ] Verify .git is blocked
- [ ] Check security headers are present
- [ ] Test website functionality
- [ ] Verify SSL certificate is valid
- [ ] Test contact form
- [ ] Check mobile responsiveness
- [ ] Monitor nginx logs for errors

## 🔐 Security Monitoring

### Daily Checks
```bash
# Check nginx access logs for suspicious activity
sudo tail -100 /var/log/nginx/access.log | grep -E "\.git|\.env|admin"

# Check for failed authentication attempts
sudo tail -100 /var/log/auth.log | grep "Failed"
```

### Weekly Checks
- Test security headers at securityheaders.com
- Review SSL Labs rating
- Check for WordPress/plugin updates (if applicable)
- Review backup integrity

### Monthly Checks
- Full security audit
- Review and rotate access credentials
- Test disaster recovery procedures
- Update dependencies

## 📞 Support Contacts

- **Primary:** 0742 22 44 14
- **Secondary:** 020 78 48 390
- **Email:** info@palmbreeze.co.ke
- **Security:** security@palmbreeze.co.ke

## 📚 Additional Resources

- Full Security Documentation: `SECURITY_IMPROVEMENTS.md`
- Nginx Configuration: `nginx.conf`
- Deployment Script: `deploy.sh`
- Project README: `README.md`

---

**Last Updated:** 2025-11-06  
**Version:** 1.0.0  
**Status:** Production Ready ✅
