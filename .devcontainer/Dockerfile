FROM mcr.microsoft.com/devcontainers/base:ubuntu

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    build-essential \
    carton \
    cpanminus \
    pkg-config \
    libgd-dev \
    libfreetype6-dev \
    libpng-dev \
    libjpeg-dev \
    libyaz-dev \
    yaz \
    libfribidi-dev \
    libtext-bidi-perl \
    libxml2-dev \
    libexpat1-dev \
    libssl-dev \
    libicu-dev \
    libdb-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*
