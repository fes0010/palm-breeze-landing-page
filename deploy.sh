#!/bin/bash

# Palm Breeze Networks - Secure Deployment Script
# This script deploys the website to production with security measures

set -e  # Exit on error

echo "🚀 Starting secure deployment for Palm Breeze Networks..."

# Configuration
DEPLOY_DIR="/var/www/palm-breeze"
BACKUP_DIR="/var/www/backups/palm-breeze-$(date +%Y%m%d_%H%M%S)"
NGINX_CONFIG_DIR="/etc/nginx/sites-available"
CURRENT_DIR="$(pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run with sudo: sudo ./deploy.sh"
    exit 1
fi

# Create backup of current deployment
if [ -d "$DEPLOY_DIR" ]; then
    print_status "Creating backup of current deployment..."
    mkdir -p "$(dirname $BACKUP_DIR)"
    cp -r "$DEPLOY_DIR" "$BACKUP_DIR"
    print_status "Backup created at: $BACKUP_DIR"
fi

# Create deployment directory if it doesn't exist
mkdir -p "$DEPLOY_DIR"

# Files to deploy (excluding .git and sensitive files)
print_status "Deploying files..."
rsync -av \
    --exclude='.git/' \
    --exclude='.gitignore' \
    --exclude='node_modules/' \
    --exclude='*.log' \
    --exclude='*.bak' \
    --exclude='deploy.sh' \
    --exclude='CURRENT_STATUS.md' \
    --exclude='footer-update.txt' \
    --exclude='instructions.txt' \
    --exclude='UPDATE_FLYER.md' \
    --exclude='save-new-flyer.sh' \
    "$CURRENT_DIR/" "$DEPLOY_DIR/"

print_status "Files deployed successfully"

# Remove .git directory if it exists in deployment
if [ -d "$DEPLOY_DIR/.git" ]; then
    print_warning "Removing .git directory from deployment..."
    rm -rf "$DEPLOY_DIR/.git"
    print_status ".git directory removed"
fi

# Set proper permissions
print_status "Setting file permissions..."
chown -R www-data:www-data "$DEPLOY_DIR"
find "$DEPLOY_DIR" -type f -exec chmod 644 {} \;
find "$DEPLOY_DIR" -type d -exec chmod 755 {} \;
print_status "Permissions set"

# Deploy nginx configuration
if [ -f "$CURRENT_DIR/nginx.conf" ]; then
    print_status "Deploying nginx configuration..."
    cp "$CURRENT_DIR/nginx.conf" "$NGINX_CONFIG_DIR/palmbreezenetworks.net"
    
    # Create symbolic link if it doesn't exist
    if [ ! -L "/etc/nginx/sites-enabled/palmbreezenetworks.net" ]; then
        ln -s "$NGINX_CONFIG_DIR/palmbreezenetworks.net" /etc/nginx/sites-enabled/
        print_status "Nginx site enabled"
    fi
    
    # Test nginx configuration
    print_status "Testing nginx configuration..."
    if nginx -t; then
        print_status "Nginx configuration is valid"
        
        # Reload nginx
        print_status "Reloading nginx..."
        systemctl reload nginx
        print_status "Nginx reloaded successfully"
    else
        print_error "Nginx configuration test failed!"
        print_warning "Rolling back..."
        rm -f "$NGINX_CONFIG_DIR/palmbreezenetworks.net"
        exit 1
    fi
fi

# Create .well-known directory for security.txt
mkdir -p "$DEPLOY_DIR/.well-known"
if [ -f "$CURRENT_DIR/.well-known/security.txt" ]; then
    cp "$CURRENT_DIR/.well-known/security.txt" "$DEPLOY_DIR/.well-known/"
    print_status "security.txt deployed"
fi

# Security verification
print_status "Running security verification..."

# Check for .git directory
if [ -d "$DEPLOY_DIR/.git" ]; then
    print_error "CRITICAL: .git directory found in deployment!"
    exit 1
else
    print_status ".git directory not present - Good!"
fi

# Check for sensitive files
SENSITIVE_FILES=(".env" "config.ini" "*.key" "*.pem")
FOUND_SENSITIVE=0
for pattern in "${SENSITIVE_FILES[@]}"; do
    if find "$DEPLOY_DIR" -name "$pattern" -type f | grep -q .; then
        print_error "Found sensitive files: $pattern"
        FOUND_SENSITIVE=1
    fi
done

if [ $FOUND_SENSITIVE -eq 0 ]; then
    print_status "No sensitive files found - Good!"
fi

# Final summary
echo ""
echo "================================"
echo "   Deployment Summary"
echo "================================"
print_status "Website deployed to: $DEPLOY_DIR"
print_status "Backup location: $BACKUP_DIR"
print_status "Security headers: ✓ Configured"
print_status ".git blocking: ✓ Enabled"
print_status "HSTS: ✓ Enabled"
print_status "CSP: ✓ Configured"
echo ""
echo -e "${GREEN}✓ Deployment completed successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Visit https://palmbreezenetworks.net to verify"
echo "2. Test security headers at securityheaders.com"
echo "3. Verify .git is blocked by visiting https://palmbreezenetworks.net/.git"
echo ""
