import sys
import os

# Add the root and backend directory to the python path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from backend.app import app

# Vercel expects the Flask instance to be named 'app'
# Since we imported it as 'app', it should just work.
