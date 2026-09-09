# ARGO ESP32 Field Telemetry Firmware

This folder contains an Arduino sketch for the ESP32-S3 / ESP32-based field node used by the ARGO AgriVision system.

## What it does

- Reads ambient temperature and humidity from an SHT31 sensor over I2C
- Reads soil nutrient and moisture values over RS485 Modbus using a MAX485 transceiver
- Publishes a JSON telemetry payload to the MQTT topic:
  - `argo/cropsap/v1/telemetry`
- Enters deep sleep after transmission to conserve power

## Modbus register mapping used

- `0x001E` — Nitrogen (N)
- `0x001F` — Phosphorus (P)
- `0x0020` — Potassium (K)
- `0x0012` — Soil moisture
- `0x0006` — Soil pH

## Required Arduino libraries

Install these in the Arduino IDE or PlatformIO:

- `WiFi`
- `PubSubClient`
- `Wire`
- `Adafruit SHT31`
- `ModbusMaster`

## Board setup

Use an ESP32 development board and connect:

- SHT31 SDA -> GPIO 21
- SHT31 SCL -> GPIO 22
- RS485 DE -> GPIO 4
- RS485 RE -> GPIO 5
- RS485 TX -> GPIO 17
- RS485 RX -> GPIO 16

## Example compile notes

Before flashing, replace these values in the sketch:

- `YOUR_WIFI_SSID`
- `YOUR_WIFI_PASSWORD`
- `broker.emqx.io` if you want to test against a public MQTT broker

## Deployment note

This is a realistic firmware template aligned with the hardware architecture in the product plan and matches the telemetry schema used by the app.

For a production deployment, replace the demo MQTT broker and insert your real field gateway credentials and sensor calibration values.
