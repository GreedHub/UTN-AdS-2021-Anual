#include "secrets.h"
#include <WiFiClientSecure.h>
#include <MQTTClient.h>
#include <ArduinoJson.h>
#include "WiFi.h"

#ifdef __cplusplus
extern "C" {
#endif
uint8_t temprature_sens_read();
#ifdef __cplusplus
}
#endif

// The MQTT topics that this device should publish
#define IOT_PUBLISH_TEMP_TOPIC   "distanciaVirtual/TEMP_SENSOR/reading/temp"
#define IOT_PUBLISH_STATUS_TOPIC "distanciaVirtual/TEMP_SENSOR/reading/status"

// The MQTT topics that this device should subscribe
#define IOT_SUBSCRIBE_GET_STATUS_TOPIC "distanciaVirtual/TEMP_SENSOR/get_status"
#define IOT_SUBSCRIBE_ENABLE_TOPIC     "distanciaVirtual/TEMP_SENSOR/enabled"

unsigned long seconds = 1000L;
unsigned long minutes = seconds * 60;
unsigned long hours = minutes * 60; 

WiFiClientSecure net = WiFiClientSecure();
MQTTClient client = MQTTClient(256);
uint8_t temprature_sens_read();
bool isEnabled = true;
unsigned long lastSendTime = 0;

void connect()
{
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.println();
  Serial.print("Connecting to Wi-Fi");

  while (WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  // Configure WiFiClientSecure to use the IoT device credentials
  net.setCACert(CERT_CA);
  net.setCertificate(CERT_CRT);
  net.setPrivateKey(CERT_PRIVATE);

  // Connect to the MQTT broker on the endpoint we defined earlier
  client.begin(IOT_ENDPOINT, IOT_PORT, net);

  // Create a message handler
  client.onMessage(messageHandler);

  Serial.print("Connecting to IoT Broker");

  while (!client.connect(THINGNAME,IOT_USERNAME,IOT_PASSWORD)) {
    Serial.print(".");
    delay(100);
  }

  if(!client.connected()){
    Serial.println("IoT Connection Timeout!");
    return;
  }

  // Subscribe to topics
  client.subscribe(IOT_SUBSCRIBE_ENABLE_TOPIC);
  client.subscribe(IOT_SUBSCRIBE_GET_STATUS_TOPIC);

  Serial.println("");
  Serial.println("IoT Broker Connected!");
}

void publishMessage()
{
  lastSendTime = millis();
  StaticJsonDocument<200> doc;
  doc["value"] = (temprature_sens_read() - 32) / 1.8;
  doc["magnitude"] = "C";
  doc["name"] = "main_temp";
  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer); // print to client

  client.publish(IOT_PUBLISH_TEMP_TOPIC, jsonBuffer);
}

void messageHandler(String &topic, String &payload) {
   Serial.print("Recibiendo...");
   Serial.println("incoming: " + topic + " - " + payload);

   StaticJsonDocument<200> doc;
   
   deserializeJson(doc, payload);
   
   const char* message = doc["message"];//body has to be {"message":"true"}
   
   char _topic[topic.length()+1];
   topic.toCharArray(_topic,topic.length()+1);

  if(strcmp(_topic,(char*)IOT_SUBSCRIBE_ENABLE_TOPIC)==0){
    if(strcmp(message,"true") == 0){ isEnabled = true; Serial.print("Device enabled"); }
    else {isEnabled = false; Serial.print("Device disabled");}
  }

  if(strcmp(_topic,(char*)IOT_SUBSCRIBE_GET_STATUS_TOPIC) == 0){
    StaticJsonDocument<200> doc;
    doc["value"] = isEnabled;
    doc["name"] = "deviceStatus";

    char jsonBuffer[512];
    serializeJson(doc, jsonBuffer); // print to client
  
    client.publish(IOT_PUBLISH_STATUS_TOPIC, jsonBuffer);
  }

}


void setup() {
  Serial.begin(9600);
  connect();
}

void loop() {
  if(isEnabled && millis()-lastSendTime > 1*minutes)
    publishMessage();
  client.loop();
  delay(1000);
}
