export const IVAL = 1000;
export const MTDB_STATE = process.env.NODE_ENV !== 'production' ? process.env.REACT_APP_MTDB_STATE : window.location.origin;
export const MTSRV_BACKEND = process.env.NODE_ENV !== 'production' ? process.env.REACT_APP_MTSRV_BACKEND : window.location.origin;
export const CNV_BACKEND = process.env.NODE_ENV !== 'production' ? process.env.REACT_APP_CNV_BACKEND : window.location.origin;

export const toHms = (totalSec) => {
    let hours = parseInt( totalSec / 3600 , 10) % 24;
    let minutes = parseInt( totalSec / 60 , 10) % 60;
    let seconds = (totalSec % 60).toFixed(2);
    if (seconds < 0) seconds = 0;
    return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
};

export const totalSeconds = (time) => {
    let parts = time.split(':');
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
};

export const getPercent = (total,current) => {
    let percent = (100 * totalSeconds(current) / totalSeconds(total)).toFixed(0);
    percent = +percent || 0;
    return percent;
};

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

export const mediaTools = (path, data, cb) => fetch(`${MTSRV_BACKEND}/mtools/${path}`, {
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

export const getStatus = (ep, cb) => {
    let url = ep === "convert" ? CNV_BACKEND : MTSRV_BACKEND;
    fetch(`${url}/${ep}/status`)
        .then((response) => {
            if (response.ok) {
                return response.json().then(data => cb(data));
            }
        })
        .catch(ex => console.log(`getUpload`, ex));
};
