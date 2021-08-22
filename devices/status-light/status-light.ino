#include "secrets.h"
#include <WiFiClientSecure.h>
#include <MQTTClient.h>
#include <ArduinoJson.h>
#include "WiFi.h"


// The MQTT topics that this device should publish
#define IOT_PUBLISH_STATUS_TOPIC "distanciaVirtual/STATUS_LIGHT/reading/status"

// The MQTT topics that this device should subscribe
#define IOT_SUBSCRIBE_GET_STATUS_TOPIC "distanciaVirtual/STATUS_LIGHT/get_status"
#define IOT_SUBSCRIBE_SET_STATUS_TOPIC "distanciaVirtual/STATUS_LIGHT/set_status"

// LEDS
#define LED_GREEN 15
#define LED_RED 4

unsigned long seconds = 1000L;
unsigned long minutes = seconds * 60;
unsigned long hours = minutes * 60; 

WiFiClientSecure net = WiFiClientSecure();
MQTTClient client = MQTTClient(256);
String main_status = String("enabled");
unsigned long lastSendTime = 0;
bool blinkStatus = false;

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
  client.subscribe(IOT_SUBSCRIBE_SET_STATUS_TOPIC);
  client.subscribe(IOT_SUBSCRIBE_GET_STATUS_TOPIC);

  Serial.println("");
  Serial.println("IoT Broker Connected!");
}

void publishStatus()
{
  lastSendTime = millis();
  StaticJsonDocument<200> doc;
  doc["value"] = main_status;
  doc["magnitude"] = "device_status";
  doc["name"] = "status";
  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer); // print to client

  client.publish(IOT_PUBLISH_STATUS_TOPIC, jsonBuffer);
}

void messageHandler(String &topic, String &payload) {
   Serial.print("Recibiendo...");
   Serial.println("incoming: " + topic + " - " + payload);

   StaticJsonDocument<200> doc;
   
   deserializeJson(doc, payload);
   
   const char* message = doc["status"];//body has to be {"status":"some_status"}
   
   char _topic[topic.length()+1];
   topic.toCharArray(_topic,topic.length()+1);

  if(strcmp(_topic,(char*)IOT_SUBSCRIBE_SET_STATUS_TOPIC)==0){
    if(strcmp(message,"enabled") == 0){ main_status = String("enabled"); Serial.println("Device enabled, awaiting status..."); }
    else if(strcmp(message,"disabled") == 0){ main_status = String("disabled"); Serial.println("Device disabled, no more readings will be sent."); onStatusDisabled(); }
    else if(strcmp(message,"good") == 0){ main_status = String("good"); Serial.println("Device status set to: good"); }
    else if(strcmp(message,"alerted") == 0){ main_status = String("alerted"); Serial.println("Device status set to: alerted"); }
    else if(strcmp(message,"alarmed") == 0){ main_status = String("alarmed"); Serial.println("Device status set to: alarmed"); }
    else { main_status = String("enabled"); Serial.println("Device status unknown, awaiting status..."); }
    publishStatus();
  }

  if(strcmp(_topic,(char*)IOT_SUBSCRIBE_GET_STATUS_TOPIC) == 0){
    StaticJsonDocument<200> doc;
    doc["value"] = main_status;
    doc["magnitude"] = "device_status";
    doc["name"] = "status";

    char jsonBuffer[512];
    serializeJson(doc, jsonBuffer); // print to client
  
    client.publish(IOT_PUBLISH_STATUS_TOPIC, jsonBuffer);
  }

}

void showStatus(){
  if(main_status.equals(String("enabled"))) onStatusWaiting();
  else if(main_status.equals(String("good"))) onStatusGood(); 
  else if(main_status.equals(String("alerted"))) onStatusAlerted();
  else if(main_status.equals(String("alarmed"))) onStatusAlarmed();
  else onStatusWaiting();
}

void onStatusGood(){
  digitalWrite(LED_GREEN, HIGH);
  digitalWrite(LED_RED, LOW);
}

void onStatusAlerted(){
  digitalWrite(LED_RED, HIGH);
  digitalWrite(LED_GREEN, LOW);
}

void onStatusAlarmed(){
  digitalWrite(LED_GREEN, LOW);
  if(!blinkStatus) digitalWrite(LED_RED, HIGH);
  else digitalWrite(LED_RED, LOW);
  blinkStatus = !blinkStatus;
}

void onStatusWaiting(){
  if(!blinkStatus) {
    digitalWrite(LED_RED, HIGH); 
    digitalWrite(LED_GREEN, HIGH);
  }
  else{
    digitalWrite(LED_RED, LOW); 
    digitalWrite(LED_GREEN, LOW);
  }
  blinkStatus = !blinkStatus;
}

void onStatusDisabled(){
  digitalWrite(LED_RED, LOW);
  digitalWrite(LED_GREEN, LOW);
}

void setup() {
  Serial.begin(9600);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  onStatusWaiting();
  connect();
  publishStatus();
}

void loop() {
  if(!main_status.equals(String("disabled"))) showStatus();
  
  client.loop();
  delay(1000);
}
