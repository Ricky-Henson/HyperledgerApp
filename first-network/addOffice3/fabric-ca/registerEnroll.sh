

function createOffice3 {

  echo
	echo "Enroll the CA admin of office3"
  echo
	mkdir -p ../organizations/peerOrganizations/office3.ccu.com/

	export FABRIC_CA_CLIENT_HOME=${PWD}/../organizations/peerOrganizations/office3.ccu.com/
#  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
#  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://office3admin:office3ccu@localhost:11054 --caname ca-office3 --tls.certfiles ${PWD}/fabric-ca/office3/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-office3.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-office3.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-office3.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-office3.pem
    OrganizationalUnitIdentifier: orderer' > ${PWD}/../organizations/peerOrganizations/office3.ccu.com/msp/config.yaml

  echo
	echo "Register peer0 of office3"
  echo
  set -x
	fabric-ca-client register --caname ca-office3 --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/fabric-ca/office3/tls-cert.pem
  { set +x; } 2>/dev/null

  echo
  echo "Register user of office3"
  echo
  set -x
  fabric-ca-client register --caname ca-office3 --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/fabric-ca/office3/tls-cert.pem
  { set +x; } 2>/dev/null

  echo
  echo "Register the office3 admin"
  echo
  set -x
  fabric-ca-client register --caname ca-office3 --id.name office3office3admin --id.secret office3office3ccu --id.type admin --tls.certfiles ${PWD}/fabric-ca/office3/tls-cert.pem
  { set +x; } 2>/dev/null

	mkdir -p ../organizations/peerOrganizations/office3.ccu.com/peers
  mkdir -p ../organizations/peerOrganizations/office3.ccu.com/peers/peer0.office3.ccu.com

  echo
  echo "## Generate the peer0 msp for office3"
  echo
  set -x
	fabric-ca-client enroll -u https://peer0:peer0pw@localhost:11054 --caname ca-office3 -M ${PWD}/../organizations/peerOrganizations/office3.ccu.com/peers/peer0.office3.ccu.com/msp --csr.hosts peer0.office3.ccu.com --tls.certfiles ${PWD}/fabric-ca/office3/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/../organizations/peerOrganizations/office3.ccu.com/msp/config.yaml ${PWD}/../organizations/peerOrganizations/office3.ccu.com/peers/peer0.office3.ccu.com/msp/config.yaml

  echo
  echo "## Generate the peer0-tls certificates for office3"
  echo
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:11054 --caname ca-office3 -M ${PWD}/../organizations/peerOrganizations/office3.ccu.com/peers/peer0.office3.ccu.com/tls --enrollment.profile tls --csr.hosts peer0.office3.ccu.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/office3/tls-cert.pem
  { set +x; } 2>/dev/null


  cp ${PWD}/../organizations/peerOrganizations/office3.ccu.com/peers/peer0.office3.ccu.com/tls/tlscacerts/* ${PWD}/../organizations/peerOrganizations/office3.ccu.com/peers/peer0.office3.ccu.com/tls/ca.crt
  cp ${PWD}/../organizations/peerOrganizations/office3.ccu.com/peers/peer0.office3.ccu.com/tls/signcerts/* ${PWD}/../organizations/peerOrganizations/office3.ccu.com/peers/peer0.office3.ccu.com/tls/server.crt
  cp ${PWD}/../organizations/peerOrganizations/office3.ccu.com/peers/peer0.office3.ccu.com/tls/keystore/* ${PWD}/../organizations/peerOrganizations/office3.ccu.com/peers/peer0.office3.ccu.com/tls/server.key

  mkdir ${PWD}/../organizations/peerOrganizations/office3.ccu.com/msp/tlscacerts
  cp ${PWD}/../organizations/peerOrganizations/office3.ccu.com/peers/peer0.office3.ccu.com/tls/tlscacerts/* ${PWD}/../organizations/peerOrganizations/office3.ccu.com/msp/tlscacerts/ca.crt

  mkdir ${PWD}/../organizations/peerOrganizations/office3.ccu.com/tlsca
  cp ${PWD}/../organizations/peerOrganizations/office3.ccu.com/peers/peer0.office3.ccu.com/tls/tlscacerts/* ${PWD}/../organizations/peerOrganizations/office3.ccu.com/tlsca/tlsca.office3.ccu.com-cert.pem

  mkdir ${PWD}/../organizations/peerOrganizations/office3.ccu.com/ca
  cp ${PWD}/../organizations/peerOrganizations/office3.ccu.com/peers/peer0.office3.ccu.com/msp/cacerts/* ${PWD}/../organizations/peerOrganizations/office3.ccu.com/ca/ca.office3.ccu.com-cert.pem

  mkdir -p ../organizations/peerOrganizations/office3.ccu.com/users
  mkdir -p ../organizations/peerOrganizations/office3.ccu.com/users/User1@office3.ccu.com

  echo
  echo "## Generate the user msp for office3"
  echo
  set -x
	fabric-ca-client enroll -u https://user1:user1pw@localhost:11054 --caname ca-office3 -M ${PWD}/../organizations/peerOrganizations/office3.ccu.com/users/User1@office3.ccu.com/msp --tls.certfiles ${PWD}/fabric-ca/office3/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/../organizations/peerOrganizations/office3.ccu.com/msp/config.yaml ${PWD}/../organizations/peerOrganizations/office3.ccu.com/users/User1@office3.ccu.com/msp/config.yaml

  mkdir -p ../organizations/peerOrganizations/office3.ccu.com/users/Admin@office3.ccu.com

  echo
  echo "## Generate the office 3 admin msp"
  echo
  set -x
	fabric-ca-client enroll -u https://office3office3admin:office3office3ccu@localhost:11054 --caname ca-office3 -M ${PWD}/../organizations/peerOrganizations/office3.ccu.com/users/Admin@office3.ccu.com/msp --tls.certfiles ${PWD}/fabric-ca/office3/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/../organizations/peerOrganizations/office3.ccu.com/msp/config.yaml ${PWD}/../organizations/peerOrganizations/office3.ccu.com/users/Admin@office3.ccu.com/msp/config.yaml

}
