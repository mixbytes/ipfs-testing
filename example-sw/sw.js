self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting());
    console.log('SW Installed');
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
    console.log('SW Activated');
});

self.addEventListener('fetch', (event) => {
    console.log('Request caught:', event.request);

    if (event.request.url.indexOf('ipfs.io') !== -1) {
        console.log('Request is ipfs file fetch');
        event.respondWith(new Promise(resolve => {
            console.log('Do fetch to ipfs');
            fetch(event.request.url)
            .then(resp => {
                console.log('Received response from ipfs:', resp);
                return newResponse(resp);
            })
            .then(resp => {
                console.log('Added Content-Type and return to page');
                resolve(resp);
            })
        }));
    }
});


function newResponse(resp) {
    return new Promise(resolve => {
        let newResp = {
            status: resp.status,
            statusText: resp.statusText,
            url: resp.url,
            headers: {'Content-Type': 'image'}
        };

        resp.headers.forEach(function (v, k) {
            if (k.toLowerCase() !== 'Content-Type'.toLowerCase())
                newResp.headers[k] = v;
        });

        return resp.blob().then(function (body) {
            let nr = new Response(body, newResp);
            resolve(nr);
        });
    });
}