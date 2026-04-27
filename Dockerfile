# 🐳 MASTER DOCKERFILE (For Railway/Cloud Deployment)
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements explicitly from the subfolder
COPY ./server/requirements.txt /app/requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy everything from the server folder to the /app directory
COPY ./server/ /app/

# Expose port (Documentation only, Railway uses $PORT)
EXPOSE 8000

# Start the server
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
