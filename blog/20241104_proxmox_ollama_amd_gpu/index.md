---
title: "iGPU Ollama Server on Proxmox"
description: "Alpine LXC Container with iGPU Ollama Server on Proxmox"
date: 2024-11-04
tags: ["docker", "embedded", "proxmox", "linux"]
image: "banner.jpg"
draft: false
url: https://gist.github.com/hkfuertes/deeab4f3f49b28d0842d21af60fe1be3
---

How to setup an LXC container with AMD iGPU (Ryzen 7 5800H) passthrougth for Ollama in Proxmox

## Proxmox
First we need to install the Alpine LXC, the easiest way is to use Proxmox Helper scripts: https://tteck.github.io/Proxmox/
```bash
bash -c "$(wget -qLO - https://github.com/tteck/Proxmox/raw/main/ct/alpine.sh)"
```

I would install in "advance" mode and be generous with the resources (8-16 cores, 16G ram, 128GB disk)

Once its installed halt the container.<br/>
Then append this into the configuration file in Proxmox to passthrough (actually bin-mount) the iGPU:
```bash
# /etc/pve/lxc/<LXC_ID>.conf
# From Jellyfin lxc.conf
dev0: /dev/dri/card0,gid=44
dev1: /dev/dri/renderD128,gid=104
dev2: /dev/kfd,gid=104
```
## Alpine LXC
First we need to setup docker:
```bash
apk update
apk add docker docker-compose
rc-update add docker
service docker start
```

Then just create a `docker-compose.yml` file with this content:
```yaml
services:
  ollama:
    user: root
    container_name: ollama
    image: ollama/ollama:rocm
    healthcheck:
      test: ollama --version || exit 1
      interval: 10s
    ports:
      - "11434:11434"
    restart: unless-stopped
    devices:
      - /dev/dri/renderD128:/dev/dri/renderD128
      - /dev/kfd:/dev/kfd
    volumes:
      - ./config:/root/.ollama
    environment:
      - HSA_OVERRIDE_GFX_VERSION='9.0.0'

  owui:
    ports:
      - 80:8080
    extra_hosts:
      - host.docker.internal:host-gateway
    volumes:
      - open-webui:/app/backend/data
    depends_on:
      - ollama
    container_name: open-webui
    restart: unless-stopped
    image: ghcr.io/open-webui/open-webui:main

volumes:
  open-webui:
```
To run it `docker compose up -d`.

You can now access ollama (to install new models throught CLI) with this command:
```bash
docker exec -it ollama /bin/ollama
# Alternatively you can create an alias for it.
alias ollama="docker exec -it ollama /bin/ollama"
```
