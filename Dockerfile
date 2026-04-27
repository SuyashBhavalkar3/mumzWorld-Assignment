# 🐳 MASTER DOCKERFILE (For Railway/Cloud Deployment)
# This file sits in the root so Railway can find it easily.

FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements from the server subfolder
COPY server/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire server folder content to the container
COPY server/ .

# Railway dynamic port support
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
