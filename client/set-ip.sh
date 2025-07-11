#!/data/data/com.termux/files/usr/bin/bash

# Try using ifconfig to get local IP (safe in Termux)
IP=$(ifconfig | grep 'inet ' | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
PORT=3001

if [ -z "$IP" ]; then
  echo "❌ Could not detect local IP address (fallback from ifconfig)."
  exit 1
fi

echo "REACT_APP_SERVER_URL=http://$IP:$PORT" > .env
echo "✅ .env updated with IP: $IP"
