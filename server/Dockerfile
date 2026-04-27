# Use a slim Python image for a smaller footprint
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Install system dependencies (needed for some Python packages)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Railway provides a dynamic PORT environment variable
# We tell uvicorn to listen on 0.0.0.0 and the port provided by Railway
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
