
IP="broker.distanciavirtual.com.ar"
SUBJECT_CLIENT="/C=SE/ST=Stockholm/L=Stockholm/O=himinds/OU=Client/CN=$IP"
read -p "Enter client username: " clientName

function generate_client () {
   echo "$SUBJECT_CLIENT"
   mkdir -p ./clients/$clientName
   openssl req -new -nodes -sha256 -subj "$SUBJECT_CLIENT" -out ./clients/$clientName/$clientName.csr -keyout ./clients/$clientName/$clientName.key 
   openssl x509 -req -sha256 -in ./clients/$clientName/$clientName.csr -CA ./server/ca.crt -CAkey ./server/ca.key -CAcreateserial -out ./clients/$clientName/$clientName.crt -days 365
}

generate_client