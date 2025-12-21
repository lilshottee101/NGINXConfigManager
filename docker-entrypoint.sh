#!/bin/bash
set -e

echo "Starting NGINX Config Manager..."

# Build the Nuxt app
echo "Building Nuxt application..."
npm run build

# Create default nginx config if it doesn't exist
if [ ! -f /etc/nginx/conf.d/default.conf ]; then
    echo "Creating default nginx configuration..."
    cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 80 default_server;
    server_name _;

    location / {
        root /var/www/html;
        index index.html;
    }
}
EOF
fi

# Test nginx configuration
echo "Testing nginx configuration..."
nginx -t

# Start nginx in the background
echo "Starting nginx..."
nginx

# Start the Nuxt application
echo "Starting Nuxt application..."
exec node .output/server/index.mjs
