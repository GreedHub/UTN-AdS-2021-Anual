#include <pgmspace.h>

#define SECRET
#define THINGNAME "TEMP_SENSOR"

const char WIFI_SSID[] = "MySSID";
const char WIFI_PASSWORD[] = "MyPassword";
const char IOT_BASE_TOPIC[] = "MyProject";
const char IOT_ENDPOINT[] = "ENDPOINT_URL";
const int  IOT_PORT = 1883;

// Root CA 1
static const char CERT_CA[] PROGMEM = R"EOF(
-----BEGIN CERTIFICATE-----
MIIDQTCCAimgAwIBAgITBmyfz5m/jAo54vB4ikPmljZbyjANBgkqhkiG9w0BAQsF
-----END CERTIFICATE-----
)EOF";

// Device Certificate
static const char CERT_CRT[] PROGMEM = R"KEY(
-----BEGIN CERTIFICATE-----
MIIDWjCCAkKgAwIBAgIVAOLtmmzDZL3r3Yjw8Q1K+T2R1ceeMA0GCSqGSIb3DQEB
-----END CERTIFICATE-----
)KEY";

// Device Private Key
static const char CERT_PRIVATE[] PROGMEM = R"KEY(
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAuy7R7bOAmjIwv2XScLUms+3xK3es6nLXdekYJOJZuv6/luYv
-----END RSA PRIVATE KEY-----
)KEY";
