export const MTDB_STATE = process.env.REACT_APP_MTDB_STATE;
export const MTSRV_BACKEND = process.env.NODE_ENV !== 'production' ? process.env.REACT_APP_MTSRV_BACKEND : '/wfapi';


export const getData = (path, cb) => fetch(`${MTDB_STATE}/${path}`)
    .then((response) => {
        if (response.ok) {
            return response.json().then(data => cb(data));
        }
    })
    .catch(ex => console.log(`get ${path}`, ex));

export const putData = (path, data, cb) => fetch(`${MTDB_STATE}/${path}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body:  JSON.stringify(data)
})
    .then((response) => {
        if (response.ok) {
            return response.json().then(respond => cb(respond));
        }
    })
    .catch(ex => console.log("Put Data error:", ex));

export const removeData = (path, cb) => fetch(`${MTDB_STATE}/${path}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
})
    .then((response) => {
        if (response.ok) {
            return response.json().then(respond => cb(respond));
        }
    })
    .catch(ex => console.log("Remove Data error:", ex));