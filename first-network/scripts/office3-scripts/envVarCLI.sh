#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

# This is a collection of bash functions used by different scripts

ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/lithium.com/orderers/orderer.lithium.com/msp/tlscacerts/tlsca.lithium.com-cert.pem
PEER0_OFFICE1_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/office1.lithium.com/peers/peer0.office1.lithium.com/tls/ca.crt
PEER0_OFFICE2_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/office2.lithium.com/peers/peer0.office2.lithium.com/tls/ca.crt
PEER0_OFFICE3_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/office3.lithium.com/peers/peer0.office3.lithium.com/tls/ca.crt

# Set OrdererOrg.Admin globals
setOrdererGlobals() {
  CORE_PEER_LOCALMSPID="OrdererMSP"
  CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/lithium.com/orderers/orderer.lithium.com/msp/tlscacerts/tlsca.lithium.com-cert.pem
  CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/lithium.com/users/Admin@lithium.com/msp
}

# Set environment variables for the peer org
setGlobals() {
  ORG=$1
  if [ $ORG -eq 1 ]; then
    CORE_PEER_LOCALMSPID="office1MSP"
    CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_OFFICE1_CA
    CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/office1.lithium.com/users/Admin@office1.lithium.com/msp
    CORE_PEER_ADDRESS=peer0.office1.lithium.com:7051
  elif [ $ORG -eq 2 ]; then
    CORE_PEER_LOCALMSPID="office2MSP"
    CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_OFFICE2_CA
    CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/office2.lithium.com/users/Admin@office2.lithium.com/msp
    CORE_PEER_ADDRESS=peer0.office2.lithium.com:9051
  elif [ $ORG -eq 3 ]; then
    CORE_PEER_LOCALMSPID="office3MSP"
    CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_OFFICE3_CA
    CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/office3.lithium.com/users/Admin@office3.lithium.com/msp
    CORE_PEER_ADDRESS=peer0.office3.lithium.com:11051
  else
    echo "================== ERROR !!! ORG Unknown =================="
  fi

  if [ "$VERBOSE" == "true" ]; then
    env | grep CORE
  fi
}

verifyResult() {
  if [ $1 -ne 0 ]; then
    echo $'\e[1;31m'!!!!!!!!!!!!!!! $2 !!!!!!!!!!!!!!!!$'\e[0m'
    echo
    exit 1
  fi
}
