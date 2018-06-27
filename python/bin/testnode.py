import ipfsapi
import tempfile
import os
from pprint import pprint
import time

def main():

    # CONNECT
    # Importanan values in config ("$HOME/.ipfs/config" by default)
    # Writeable = True (to allow POST and PUT requests to store files)
    # I tried direct install, and Docker image from: https://hub.docker.com/r/ipfs/go-ipfs/ - everything works
    IPFS_NODE_HOST='127.0.0.1'
    IPFS_NODE_PORT=5001

    # .connect raises: VersionMismatch, ErrorResponse, ConnectionError, ProtocolError, StatusError, TimeoutError
    # there is also: 
    # ipfsapi.assert_version(version, minimum='0.4.3', maximum='0.5.0')
    #
    iapi = ipfsapi.connect(host=IPFS_NODE_HOST, port=IPFS_NODE_PORT)
    # full params: ipfsapi = iapi.connect(host='127.0.0.1', port=5001, base='api/v0', chunk_size=4096)
    print("IPFS node at {}:{} connected".format(IPFS_NODE_HOST, IPFS_NODE_PORT))

    # we can add catalogs, with files, but we cannot add files to them without changing catalog hash, so they're useless for us
    # res = ipfsapi.add('smartz/', recursive=True, pin=True)
    # print("Adding catalog 'smartz/' and everypthin inside")
    # print repo stats

    res = iapi.repo_stat()
    print("IPFS repo stats: ")
    pprint(res)


    # FILE UPLOAD
    res = upload_data_to_ipfs_using_tempfile(iapi, "aaIPFasfawfwfwfwSNIHUYddddsssaqqasASEBE", False) # pin is True!
    fhash = res.get('Hash')
    if (fhash is None):
        print("File was not uploaded")
        return 1

    print("File with hash  {} was uploaded to IPFS, result:".format(fhash))
    pprint(res)
    # get contents of stored fhash
    res = get_file_contents_by_hash(iapi, fhash)
    print("Content of hash {}  is: {}".format(fhash, res))


    # PINNING
    # to make a "direct" pin of file, you must use recursive=False option
    res = iapi.pin_add(fhash, recursive=False)
    pprint(res)


    res = iapi.pin_ls(type='direct')
    pprint(res)
    # with iapi.pin_verify(fhash, verbose=True) as pin_verify_iter:
    #     for item in pin_verify_iter:
    #         pprint(item)

    # res=iapi.get(fhash)
    # pprint(res)


    return 



def get_file_contents_by_hash(iapi, fhash):
    try:
        res = iapi.cat(fhash)
    except ipfsapi.exceptions.Error as e:
        print("Error getting contents of hash {}: {}".format(fhash, e))
        return None

    return res


def upload_data_to_ipfs_using_tempfile(iapi, content, pin=False):
    # do it normal - now ipfs api accepts only filename in string format, maybe here SpooledTemporaryFile is better
    fhash = None
    with tempfile.NamedTemporaryFile(mode="w", prefix="smartz-", delete=False) as temp:
        temp.write(content)
        temp.close()
        # Pinnig is HERE
        res = iapi.add(temp.name, pin=pin)
        os.unlink(temp.name)
        return res


if __name__=="__main__":
    main()

# now uploading single file and pinning it
#wita io.open('temp_upload_to_ipfs', 'w', encoding='utf-8') as f:
#	numbytes = f.write('HUYA!')


# creating IPFS catalog


#            host='localhost', port=5001, base='api/v0', chunk_size=4096
# checking running daemon and 8080 port open
# http://10.100.7.171:8080/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG



# pprint res['Hash']
#hash = 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'

#res = ipfsapi.cat(hash)
#pprint(res)
