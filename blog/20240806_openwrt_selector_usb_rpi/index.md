---
title: "Raspberry PI Gadget - Openwrt"
description: "Packages, uci-defaults and guide to generate an image with usb-gadget"
date: 2024-08-06
tags: ["router", "embedded", "openwrt", "raspberrypi"]
image: "banner.jpg"
draft: false
url: https://gist.github.com/hkfuertes/a37776f4e94de34cc3a4658b15ec1545
---

Simple steps to use with https://firmware-selector.openwrt.org/ to generate an OpenWrt image for Raspberrypi with Wifi enabled and network over usb (zeros, 4 and 3a).

Packages:
``` 
... kmod-usb-gadget kmod-usb-gadget-eth kmod-usb-dwc2 parted losetup resize2fs
```

`uci-defaults`:
```shell
# Change to not default network
uci set network.lan.ipaddr="192.168.2.1"
uci commit network

# Enable Wifi
uci set wireless.@wifi-device[0].disabled='0'
uci set wireless.@wifi-iface[0].disabled='0'
uci set wireless.@wifi-iface[0].encryption='open'
uci set wireless.@wifi-iface[0].ssid="OpenWrt"
uci commit wireless

# Enable usb0
grep -qxF 'dtoverlay=dwc2' /boot/config.txt || echo 'dtoverlay=dwc2' >> /boot/config.txt
echo "modprobe g_ether" > /etc/rc.local
uci add_list network.@device[0].ports='usb0' 
uci add_list network.@device[0].ports='eth0'
uci commit network

# Expand ROOTFS
cat << "EOF" > /etc/uci-defaults/70-rootpt-resize
if [ ! -e /etc/rootpt-resize ] \
&& type parted > /dev/null \
&& lock -n /var/lock/root-resize
then
ROOT_BLK="$(readlink -f /sys/dev/block/"$(awk -e \
'$9=="/dev/root"{print $3}' /proc/self/mountinfo)")"
ROOT_DISK="/dev/$(basename "${ROOT_BLK%/*}")"
ROOT_PART="${ROOT_BLK##*[^0-9]}"
parted -f -s "${ROOT_DISK}" \
resizepart "${ROOT_PART}" 100%
mount_root done
touch /etc/rootpt-resize
reboot
fi
exit 1
EOF
cat << "EOF" > /etc/uci-defaults/80-rootfs-resize
if [ ! -e /etc/rootfs-resize ] \
&& [ -e /etc/rootpt-resize ] \
&& type losetup > /dev/null \
&& type resize2fs > /dev/null \
&& lock -n /var/lock/root-resize
then
ROOT_BLK="$(readlink -f /sys/dev/block/"$(awk -e \
'$9=="/dev/root"{print $3}' /proc/self/mountinfo)")"
ROOT_DEV="/dev/${ROOT_BLK##*/}"
LOOP_DEV="$(awk -e '$5=="/overlay"{print $9}' \
/proc/self/mountinfo)"
if [ -z "${LOOP_DEV}" ]
then
LOOP_DEV="$(losetup -f)"
losetup "${LOOP_DEV}" "${ROOT_DEV}"
fi
resize2fs -f "${LOOP_DEV}"
mount_root done
touch /etc/rootfs-resize
reboot
fi
exit 1
EOF
cat << "EOF" >> /etc/sysupgrade.conf
/etc/uci-defaults/70-rootpt-resize
/etc/uci-defaults/80-rootfs-resize
EOF

# To make the config.txt changes effective...
reboot
```
---
- Expand `rootfs`: https://openwrt.org/docs/guide-user/advanced/expand_root
- `kmod-mt7601u` for: `148f:7601 MediaTek 802.11 n WLAN`