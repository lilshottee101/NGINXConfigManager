FROM node:20-bookworm

# Install nginx and certbot
RUN apt-get update && apt-get install -y \
    nginx \
    certbot \
    python3-certbot-nginx \
    && rm -rf /var/lib/apt/lists/*

# Create nginx directories
RUN mkdir -p /etc/nginx/conf.d \
    && mkdir -p /var/log/nginx \
    && mkdir -p /var/www/html \
    && mkdir -p /etc/letsencrypt

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy project files
COPY . .

# Create entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose ports
# 3000 for Nuxt app
# 80 for nginx HTTP
# 443 for nginx HTTPS
EXPOSE 3000 80 443

# Set entrypoint
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
