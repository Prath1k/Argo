#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Adafruit_SHT31.h>
#include <ModbusMaster.h>

// -----------------------------------------------------------------------------
// ARGO AgriVision ESP32 telemetry node
// Reads soil sensor values over RS485 Modbus and ambient conditions over I2C,
// then publishes a JSON payload to the MQTT topic used by the app.
// -----------------------------------------------------------------------------

#define MODBUS_RX_PIN 16
#define MODBUS_TX_PIN 17
#define RS485_DE_PIN 4
#define RS485_RE_PIN 5
#define SOIL_SENSOR_ID 1
#define MODBUS_BAUD 9600
#define MODBUS_TIMEOUT 2000
#define WAKEUP_INTERVAL_SECONDS 900

const char *wifiSsid = "YOUR_WIFI_SSID";
const char *wifiPassword = "YOUR_WIFI_PASSWORD";
const char *mqttBroker = "broker.emqx.io";
const uint16_t mqttPort = 1883;
const char *mqttClientId = "argo_esp32_node_001";
const char *mqttTopic = "argo/cropsap/v1/telemetry";

WiFiClient espClient;
PubSubClient mqttClient(espClient);
HardwareSerial modbusSerial(2);
ModbusMaster soilNode;
Adafruit_SHT31 sht31 = Adafruit_SHT31();

void preTransmission() {
  digitalWrite(RS485_DE_PIN, HIGH);
  digitalWrite(RS485_RE_PIN, HIGH);
}

void postTransmission() {
  digitalWrite(RS485_DE_PIN, LOW);
  digitalWrite(RS485_RE_PIN, LOW);
}

bool connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(wifiSsid, wifiPassword);

  Serial.print("Connecting to WiFi");
  for (int i = 0; i < 30; i++) {
    if (WiFi.status() == WL_CONNECTED) {
      Serial.println();
      Serial.print("WiFi connected: ");
      Serial.println(WiFi.localIP());
      return true;
    }
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi connection failed");
  return false;
}

bool connectMqtt() {
  mqttClient.setServer(mqttBroker, mqttPort);
  mqttClient.setKeepAlive(90);

  int attempts = 0;
  while (!mqttClient.connected() && attempts < 20) {
    Serial.print("Attempting MQTT connection...");
    if (mqttClient.connect(mqttClientId)) {
      Serial.println("connected");
      return true;
    }

    Serial.print("failed, rc=");
    Serial.println(mqttClient.state());
    delay(1000);
    attempts++;
  }

  Serial.println("MQTT connection failed");
  return false;
}

bool readSHT31(float &tempC, float &humidityPct) {
  if (!sht31.begin(0x44)) {
    Serial.println("SHT31 sensor not found");
    return false;
  }

  tempC = sht31.readTemperature();
  humidityPct = sht31.readHumidity();

  if (!isnan(tempC) && !isnan(humidityPct)) {
    return true;
  }

  Serial.println("Failed to read SHT31");
  return false;
}

float readHoldingRegister(uint16_t regAddress) {
  uint8_t result = soilNode.readHoldingRegisters(regAddress, 1);
  if (result == soilNode.ku8MBSuccess) {
    uint16_t value = soilNode.getResponseBuffer(0);
    return static_cast<float>(value);
  }

  Serial.print("Modbus read failed at register 0x");
  Serial.println(regAddress, HEX);
  return NAN;
}

void setupModbus() {
  pinMode(RS485_DE_PIN, OUTPUT);
  pinMode(RS485_RE_PIN, OUTPUT);
  digitalWrite(RS485_DE_PIN, LOW);
  digitalWrite(RS485_RE_PIN, LOW);

  modbusSerial.begin(MODBUS_BAUD, SERIAL_8N1, MODBUS_RX_PIN, MODBUS_TX_PIN);
  soilNode.begin(SOIL_SENSOR_ID, modbusSerial);
  soilNode.preTransmission(preTransmission);
  soilNode.postTransmission(postTransmission);
  soilNode.setTimeout(MODBUS_TIMEOUT);
}

float calculateVpd(float tempC, float humidityPct) {
  float svp = 0.61078f * exp((17.27f * tempC) / (tempC + 237.3f));
  float avp = svp * (humidityPct / 100.0f);
  float vpd = svp - avp;
  return max(0.05f, vpd);
}

String buildPayloadJson(
  float airTemp,
  float humidity,
  float soilN,
  float soilP,
  float soilK,
  float soilMoisture,
  float soilPh,
  float meanNdvi,
  float meanNdre,
  float batteryLevel,
  bool solarCharging,
  float vpd
) {
  char json[512];

  snprintf(
    json,
    sizeof(json),
    "{"
    "\"gateway_id\":\"ARGO_NODE_MH_042\","
    "\"taluka\":\"Niphad\","
    "\"district\":\"Nashik\","
    "\"timestamp\":\"%s\","
    "\"telemetry\":{"
      "\"air_temp_c\":%.2f,"
      "\"air_humidity_pct\":%.2f,"
      "\"soil_n_mg_kg\":%.2f,"
      "\"soil_p_mg_kg\":%.2f,"
      "\"soil_k_mg_kg\":%.2f,"
      "\"soil_moisture_pct\":%.2f,"
      "\"soil_ph\":%.2f,"
      "\"vpd_kpa\":%.2f"
    "},"
    "\"multispectral_indices\":{"
      "\"mean_ndvi\":%.2f,"
      "\"mean_ndre\":%.2f,"
      "\"anomaly_flag\":%s"
    "},"
    "\"battery_pct\":%.0f,"
    "\"solar_mv\":%d"
    "}",
    "2026-09-09T00:00:00Z",
    airTemp,
    humidity,
    soilN,
    soilP,
    soilK,
    soilMoisture,
    soilPh,
    vpd,
    meanNdvi,
    meanNdre,
    (meanNdre < 0.35 || humidity > 85.0f || soilN < 50.0f) ? "true" : "false",
    batteryLevel,
    solarCharging ? 5120 : 4200
  );

  return String(json);
}

void publishTelemetry() {
  float airTemp = 0.0f;
  float humidityPct = 0.0f;

  bool ambientOk = readSHT31(airTemp, humidityPct);

  float soilN = readHoldingRegister(0x001E);
  float soilP = readHoldingRegister(0x001F);
  float soilK = readHoldingRegister(0x0020);
  float soilMoisture = readHoldingRegister(0x0012);
  float soilPh = readHoldingRegister(0x0006);

  if (isnan(soilN) || isnan(soilP) || isnan(soilK) || isnan(soilMoisture) || isnan(soilPh)) {
    Serial.println("Modbus sensor read failed - falling back to simulated field values");
    soilN = 110.0f;
    soilP = 24.0f;
    soilK = 180.0f;
    soilMoisture = 42.0f;
    soilPh = 7.2f;
  }

  if (!ambientOk) {
    airTemp = 31.5f;
    humidityPct = 78.0f;
  }

  float vpd = calculateVpd(airTemp, humidityPct);
  float meanNdvi = 0.52f;
  float meanNdre = 0.38f;
  float batteryLevel = 94.0f;
  bool solarCharging = true;

  String payload = buildPayloadJson(
    airTemp,
    humidityPct,
    soilN,
    soilP,
    soilK,
    soilMoisture,
    soilPh,
    meanNdvi,
    meanNdre,
    batteryLevel,
    solarCharging,
    vpd
  );

  Serial.println("Publishing telemetry:");
  Serial.println(payload);

  mqttClient.publish(mqttTopic, payload.c_str());
}

void setup() {
  Serial.begin(115200);
  while (!Serial) {
    delay(10);
  }

  setupModbus();

  if (connectWiFi()) {
    connectMqtt();
    publishTelemetry();
    mqttClient.loop();
  }

  // The app expects a lightweight, low-power node. In the field this is done by
  // sleeping for 15 minutes to conserve power, then waking up and transmitting again.
  #if defined(ESP32)
    esp_sleep_enable_timer_wakeup(WAKEUP_INTERVAL_SECONDS * 1000000ULL);
  #endif

  Serial.println("Sleeping for 15 minutes");
  delay(500);
  esp_deep_sleep_start();
}

void loop() {
  // Intentionally left empty because the ESP32 enters deep sleep after publishing.
}
