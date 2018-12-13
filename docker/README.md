### How to run local node with docker

**Warining - all values are hardcoded, don't use in production!**

Two docker images: one for ipfsnode itself (configured from ./ipfsnode catalog) and second for nginx frontend(configured from nginx catalog).

```bash
git clone https://github.com/mixbytes/ipfs-testing.git
cd ipfs-testing/docker
docker-compose build && docker compose up
```

