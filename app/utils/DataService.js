export function post(url, body) {
    return fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
}
