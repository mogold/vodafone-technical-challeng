(async function returnFunc() {
    console.log('returning instantly')
    let instant = await getProcessingPage([{state: 'success'}]);
    console.log(instant);
    console.log(`---------------------------------------------------`);
    console.log(`---------------------------------------------------`);
    console.log('waiting 2 seconds');
    let delay = await getProcessingPage([{ state: 'processing' }, { state: 'error' }]);
    console.log(delay);

})()

/**
 * Returns the final requested state
 * @param {array} data 
 */
function once(data) {
    return new Promise((resolve, reject) => {
        switch(data[0].state) {
            case 'processing':
            case 'error':
                switch (data[0].errorCode) {
                    case 'NO_STOCK':
                        resolve({ title: 'Error page', message: 'No stock has been found' });
                    case 'INCORRECT_DETAILS':
                        resolve({ title: 'Error page', message: 'Incorrect details have been entered' });
                    case null:
                    case undefined:
                        resolve({ title: 'Error page', message: null });
                }
            case 'success':
                resolve({ title: 'Order complete', message: null });
            default:
                resolve({ title: 'Error page', message: null });
        }
    });
}

/**
 * Gets the processing page
 * @param {array} data 
 */
function getProcessingPage(data) {

    return new Promise((resolve, reject) => {
        if(data.length < 1 || data.length >2) {
            resolve({ title: 'Error page', message: null });
        }
        if(data[0].state == 'processing') {
            setTimeout(function() {
                data.splice(0,1);
                once(data).then(response => resolve(response))
            }, 2000)
        } else {
            once(data).then(response => resolve(response))
        }
    })

}