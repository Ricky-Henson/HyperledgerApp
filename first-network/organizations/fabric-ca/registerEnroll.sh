#!/bin/bash

source scriptUtils.sh

function createOffice1() {

  infoln "Enroll the CA admin"
  mkdir -p organizations/peerOrganizations/office1.lithium.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/office1.lithium.com/
  #  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
  #  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://office1admin:office1lithium@localhost:7054 --caname ca-office1 --tls.certfiles ${PWD}/organizations/fabric-ca/office1/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-office1.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-office1.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-office1.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-office1.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/peerOrganizations/office1.lithium.com/msp/config.yaml

  infoln "Register peer0"
  set -x
  fabric-ca-client register --caname ca-office1 --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/office1/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register user"
  set -x
  fabric-ca-client register --caname ca-office1 --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/office1/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register the org admin"
  set -x
  fabric-ca-client register --caname ca-office1 --id.name office1office1admin --id.secret office1office1lithium --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/office1/tls-cert.pem
  { set +x; } 2>/dev/null

  mkdir -p organizations/peerOrganizations/office1.lithium.com/peers
  mkdir -p organizations/peerOrganizations/office1.lithium.com/peers/peer0.office1.lithium.com

  infoln "Generate the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-office1 -M ${PWD}/organizations/peerOrganizations/office1.lithium.com/peers/peer0.office1.lithium.com/msp --csr.hosts peer0.office1.lithium.com --tls.certfiles ${PWD}/organizations/fabric-ca/office1/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/office1.lithium.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/office1.lithium.com/peers/peer0.office1.lithium.com/msp/config.yaml

  infoln "Generate the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-office1 -M ${PWD}/organizations/peerOrganizations/office1.lithium.com/peers/peer0.office1.lithium.com/tls --enrollment.profile tls --csr.hosts peer0.office1.lithium.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/office1/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/office1.lithium.com/peers/peer0.office1.lithium.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/office1.lithium.com/peers/peer0.office1.lithium.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/office1.lithium.com/peers/peer0.office1.lithium.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/office1.lithium.com/peers/peer0.office1.lithium.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/office1.lithium.com/peers/peer0.office1.lithium.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/office1.lithium.com/peers/peer0.office1.lithium.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/office1.lithium.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/office1.lithium.com/peers/peer0.office1.lithium.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/office1.lithium.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/office1.lithium.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/office1.lithium.com/peers/peer0.office1.lithium.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/office1.lithium.com/tlsca/tlsca.office1.lithium.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/office1.lithium.com/ca
  cp ${PWD}/organizations/peerOrganizations/office1.lithium.com/peers/peer0.office1.lithium.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/office1.lithium.com/ca/ca.office1.lithium.com-cert.pem

  mkdir -p organizations/peerOrganizations/office1.lithium.com/users
  mkdir -p organizations/peerOrganizations/office1.lithium.com/users/User1@office1.lithium.com

  infoln "Generate the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:7054 --caname ca-office1 -M ${PWD}/organizations/peerOrganizations/office1.lithium.com/users/User1@office1.lithium.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/office1/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/office1.lithium.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/office1.lithium.com/users/User1@office1.lithium.com/msp/config.yaml

  mkdir -p organizations/peerOrganizations/office1.lithium.com/users/Admin@office1.lithium.com

  infoln "Generate the org admin msp"
  set -x
  fabric-ca-client enroll -u https://office1office1admin:office1office1lithium@localhost:7054 --caname ca-office1 -M ${PWD}/organizations/peerOrganizations/office1.lithium.com/users/Admin@office1.lithium.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/office1/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/office1.lithium.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/office1.lithium.com/users/Admin@office1.lithium.com/msp/config.yaml

}

function createOffice2() {

  infoln "Enroll the CA admin"
  mkdir -p organizations/peerOrganizations/office2.lithium.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/office2.lithium.com/
  #  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
  #  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://office2admin:office2lithium@localhost:8054 --caname ca-office2 --tls.certfiles ${PWD}/organizations/fabric-ca/office2/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-office2.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-office2.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-office2.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-office2.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/peerOrganizations/office2.lithium.com/msp/config.yaml

  infoln "Register peer0"
  set -x
  fabric-ca-client register --caname ca-office2 --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/office2/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register user"
  set -x
  fabric-ca-client register --caname ca-office2 --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/office2/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register the org admin"
  set -x
  fabric-ca-client register --caname ca-office2 --id.name office2office2admin --id.secret office2office2lithium --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/office2/tls-cert.pem
  { set +x; } 2>/dev/null

  mkdir -p organizations/peerOrganizations/office2.lithium.com/peers
  mkdir -p organizations/peerOrganizations/office2.lithium.com/peers/peer0.office2.lithium.com

  infoln "Generate the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-office2 -M ${PWD}/organizations/peerOrganizations/office2.lithium.com/peers/peer0.office2.lithium.com/msp --csr.hosts peer0.office2.lithium.com --tls.certfiles ${PWD}/organizations/fabric-ca/office2/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/office2.lithium.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/office2.lithium.com/peers/peer0.office2.lithium.com/msp/config.yaml

  infoln "Generate the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-office2 -M ${PWD}/organizations/peerOrganizations/office2.lithium.com/peers/peer0.office2.lithium.com/tls --enrollment.profile tls --csr.hosts peer0.office2.lithium.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/office2/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/office2.lithium.com/peers/peer0.office2.lithium.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/office2.lithium.com/peers/peer0.office2.lithium.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/office2.lithium.com/peers/peer0.office2.lithium.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/office2.lithium.com/peers/peer0.office2.lithium.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/office2.lithium.com/peers/peer0.office2.lithium.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/office2.lithium.com/peers/peer0.office2.lithium.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/office2.lithium.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/office2.lithium.com/peers/peer0.office2.lithium.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/office2.lithium.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/office2.lithium.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/office2.lithium.com/peers/peer0.office2.lithium.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/office2.lithium.com/tlsca/tlsca.office2.lithium.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/office2.lithium.com/ca
  cp ${PWD}/organizations/peerOrganizations/office2.lithium.com/peers/peer0.office2.lithium.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/office2.lithium.com/ca/ca.office2.lithium.com-cert.pem

  mkdir -p organizations/peerOrganizations/office2.lithium.com/users
  mkdir -p organizations/peerOrganizations/office2.lithium.com/users/User1@office2.lithium.com

  infoln "Generate the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:8054 --caname ca-office2 -M ${PWD}/organizations/peerOrganizations/office2.lithium.com/users/User1@office2.lithium.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/office2/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/office2.lithium.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/office2.lithium.com/users/User1@office2.lithium.com/msp/config.yaml

  mkdir -p organizations/peerOrganizations/office2.lithium.com/users/Admin@office2.lithium.com

  infoln "Generate the org admin msp"
  set -x
  fabric-ca-client enroll -u https://office2office2admin:office2office2lithium@localhost:8054 --caname ca-office2 -M ${PWD}/organizations/peerOrganizations/office2.lithium.com/users/Admin@office2.lithium.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/office2/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/office2.lithium.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/office2.lithium.com/users/Admin@office2.lithium.com/msp/config.yaml

}

function createOrderer() {

  infoln "Enroll the CA admin"
  mkdir -p organizations/ordererOrganizations/lithium.com

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/ordererOrganizations/lithium.com
  #  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
  #  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:9054 --caname ca-orderer --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/ordererOrganizations/lithium.com/msp/config.yaml

  infoln "Register orderer"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name orderer --id.secret ordererpw --id.type orderer --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register the orderer admin"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name ordererAdmin --id.secret ordererAdminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  mkdir -p organizations/ordererOrganizations/lithium.com/orderers
  mkdir -p organizations/ordererOrganizations/lithium.com/orderers/lithium.com

  mkdir -p organizations/ordererOrganizations/lithium.com/orderers/orderer.lithium.com

  infoln "Generate the orderer msp"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/lithium.com/orderers/orderer.lithium.com/msp --csr.hosts orderer.lithium.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/lithium.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/lithium.com/orderers/orderer.lithium.com/msp/config.yaml

  infoln "Generate the orderer-tls certificates"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/lithium.com/orderers/orderer.lithium.com/tls --enrollment.profile tls --csr.hosts orderer.lithium.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/lithium.com/orderers/orderer.lithium.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/lithium.com/orderers/orderer.lithium.com/tls/ca.crt
  cp ${PWD}/organizations/ordererOrganizations/lithium.com/orderers/orderer.lithium.com/tls/signcerts/* ${PWD}/organizations/ordererOrganizations/lithium.com/orderers/orderer.lithium.com/tls/server.crt
  cp ${PWD}/organizations/ordererOrganizations/lithium.com/orderers/orderer.lithium.com/tls/keystore/* ${PWD}/organizations/ordererOrganizations/lithium.com/orderers/orderer.lithium.com/tls/server.key

  mkdir -p ${PWD}/organizations/ordererOrganizations/lithium.com/orderers/orderer.lithium.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/lithium.com/orderers/orderer.lithium.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/lithium.com/orderers/orderer.lithium.com/msp/tlscacerts/tlsca.lithium.com-cert.pem

  mkdir -p ${PWD}/organizations/ordererOrganizations/lithium.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/lithium.com/orderers/orderer.lithium.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/lithium.com/msp/tlscacerts/tlsca.lithium.com-cert.pem

  mkdir -p organizations/ordererOrganizations/lithium.com/users
  mkdir -p organizations/ordererOrganizations/lithium.com/users/Admin@lithium.com

  infoln "Generate the admin msp"
  set -x
  fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/lithium.com/users/Admin@lithium.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/lithium.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/lithium.com/users/Admin@lithium.com/msp/config.yaml

}
