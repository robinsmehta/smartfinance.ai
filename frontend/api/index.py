import sys
import os

# Add the root and backend directory to the python path
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
backend_dir = os.path.abspath(os.path.join(base_dir, "backend"))

if base_dir not in sys.path:
    sys.path.append(base_dir)
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

from backend.app import app

# Vercel expects the Flask instance to be named 'app'
# Since we imported it as 'app', it should just work.
