#!/bin/bash


RANDOM_STRING=$(date +%s | sha256sum | base64 | head -c 32 ; echo)
RANDOM_FILE_NAME=$(date +%s | sha256sum | base64 | head -c 8 ; echo).test

echo "Generated random IPFS file and content, file: ${RANDOM_FILE_NAME}, content: ${RANDOM_STRING}"

# we will put our files into "empty" directory
IPFS_EMPTY_DIR_HASH=QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn
IPFS_WRITE_HOST=${IPFS_WRITE_HOST:="https://ipfs.smartz.io"}
IPFS_READ_HOST=${IPFS_READ_HOST:="http://ipfs.io:80"}

# exit test if any command is failed
# set -e

# curl "-v" to print headers, "-s" to silent progress bar
echo "CURL: curl -v -s -X PUT --data ${RANDOM_STRING} ${IPFS_WRITE_HOST}/ipfs/${IPFS_EMPTY_DIR_HASH}/${RANDOM_FILE_NAME} 2>&1"
CURL_OUTPUT=$(curl -v -s -X PUT --data ${RANDOM_STRING} ${IPFS_WRITE_HOST}/ipfs/${IPFS_EMPTY_DIR_HASH}/${RANDOM_FILE_NAME} 2>&1)
# echo "Curl output:"
# echo $CURL_OUTPUT
# echo " "

IPFS_HASH=$(echo $CURL_OUTPUT | perl -wne '/Ipfs\-Hash\:\s(\S+)/i && print $1')

if [ -z "${IPFS_HASH}" ]; then
	echo "Header 'Ipfs-Hash' not found in response, try to repeat: curl -v -s -X PUT --data ${RANDOM_STRING} ${IPFS_WRITE_HOST}/ipfs/${IPFS_EMPTY_DIR_HASH}/${RANDOM_FILE_NAME}";
	exit 42;
fi

echo "Got an IPFS hash of new file: $IPFS_HASH";
echo "Trying to get this file from ANOTHER IPFS node (to prove delivery using IPFS p2p)"

# file now can be retreived from location /ipfs/${IPFS_HASH}/${RANDOM_FILE_NAME}
# this location can also be got from response header 'Location', but I prefer to construct from Ipfs-Hash

echo "CURL: curl -v -s ${IPFS_READ_HOST}/ipfs/${IPFS_HASH}/${RANDOM_FILE_NAME}"
IPFS_FILE_CONTENT=$(curl -v -s ${IPFS_READ_HOST}/ipfs/${IPFS_HASH}/${RANDOM_FILE_NAME})

echo "Got content: $IPFS_FILE_CONTENT"
if [ "$IPFS_FILE_CONTENT" != "$RANDOM_STRING" ]; then
	echo "Receved content differs from content generated for uploaded file, somethong broken"
	exit 41
fi

echo "All OK, file was uploaded and downloaded from IPFS"


