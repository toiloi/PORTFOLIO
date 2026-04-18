# Static group portfolio — served by nginx
FROM nginx:1.27-alpine

# Site root (matches default nginx html location)
COPY . /usr/share/nginx/html

EXPOSE 80
