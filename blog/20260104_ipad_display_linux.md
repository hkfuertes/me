---
title: "iPad as Second Display for Linux"
description: "Use iPad with Sunshine/Moonlight as external display for Laptop"
date: 2026-01-04
tags: ["iPad", "moonlight", "sunshine", "linux"]
image: "banner.jpg"
draft: false
---

Excelente elección, **Moonlight + Sunshine** es probablemente la mejor opción para tu caso porque tiene latencia mucho más baja que VNC y mejor calidad de video gracias a la codificación por hardware (H.264/H.265).

## Setup con Moonlight/Sunshine + USB Tunneling

### Paso 1: Instalar Sunshine en Linux

```bash
# Descargar desde GitHub (versión más reciente)
# https://github.com/LizardByte/Sunshine/releases

# Para Debian/Ubuntu (ejemplo con .deb)
wget https://github.com/LizardByte/Sunshine/releases/download/vX.X.X/sunshine-ubuntu-22.04-amd64.deb
sudo apt install ./sunshine-ubuntu-22.04-amd64.deb

# O desde repositorios si está disponible
sudo add-apt-repository ppa:lizardbyte/stable
sudo apt update && sudo apt install sunshine
```

### Paso 2: Configurar Sunshine

Sunshine usa por defecto los puertos **47984-47990** (TCP/UDP). Arranca Sunshine:

```bash
sunshine
# O como servicio: sudo systemctl start sunshine
```

Accede a la interfaz web en `https://localhost:47990` para configurar el PIN y ajustes.

### Paso 3: Crear túnel USB con iproxy

```bash
# Pairing del iPad
idevicepair pair

# Tunelizar los puertos de Sunshine
iproxy 47984:47984 &
iproxy 47989:47989 &
iproxy 48010:48010 &
```

También puedes usar un script para mapear todos los puertos necesarios simultáneamente.

### Paso 4: Moonlight en iPad

Instala **Moonlight** desde la App Store (es gratuito). Configura la conexión:
- **Host**: `127.0.0.1` o `localhost`
- Moonlight detectará automáticamente Sunshine a través del túnel USB
- Introduce el PIN que configuraste en Sunshine

### Ventajas de Moonlight vs VNC

- **Latencia ultra-baja**: Diseñado para gaming, optimizado para streaming en tiempo real
- **Codificación hardware**: Usa tu GPU (Intel QSV, VAAPI, NVENC) para H.264/H.265
- **Mejor calidad**: Bitrate ajustable, resolución hasta 4K
- **Input táctil**: Moonlight soporta touch como mouse, gestos, etc.

Sunshine detectará automáticamente tus displays y puedes configurar qué escritorio o aplicación específica streamear. Si quieres un display "extendido" separado, combínalo con xrandr para crear un VIRTUAL display y configura Sunshine para capturar solo ese.

El ancho de banda por USB 2.0 (480 Mbps teórico, ~30 MB/s real) es más que suficiente para streaming 1080p@60fps con H.264, que típicamente usa 10-20 Mbps.
