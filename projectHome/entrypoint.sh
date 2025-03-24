#!/bin/sh
echo 'ejecutando proceso'
sed -i 's|\${API_BASE_URL}|'"$API_BASE_URL"'|g' /usr/share/nginx/html/assets/config/env-config.js
nginx -g 'daemon off;'