import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Constant from './constantVars';

const getHeaders = async (auth) => {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    if(auth){
        try {

            var getUserSession = await AsyncStorage.getItem('@shu_user_session');
            
            getUserSession = getUserSession != null ? JSON.parse(getUserSession) : null;

            if(getUserSession !== null){
                if (getUserSession.token.length > 0) {
                    headers['token'] = getUserSession.token;
                }
            }
        
        } catch (errorr) {
        }
    }

    return headers;
};

export const postData = async (methodName, auth, postValue) => {

    const allHeaders = await getHeaders(auth);

    console.log("All POST Method Headers: " + JSON.stringify(allHeaders));
    console.log("POST Method URL : " + `${Constant.BASE_URL}${methodName}`);
    console.log("POST Method Body : " + JSON.stringify(postValue));
    
    return fetch(`${Constant.BASE_URL}${methodName}`, {
        method: 'POST',
        headers: allHeaders,
        body: JSON.stringify(postValue)
    }).then(response => {
        
        console.log("POST Server Response (1) => ",JSON.stringify(response));

        if (response.status >= 200 && response.status < 300) {
            return response.json();
        }else if(response.status === 403){
            return response.json();
        }

    }).then((responseJson) => {

        console.log("POST Server Response (2) => ",JSON.stringify(responseJson));

        // if (responseJson !== undefined && responseJson.code !== undefined && responseJson.code === 401) {
        //     // logoutDeleteCase(responseJson.message)
        // }else if(responseJson !== undefined && responseJson.code !== undefined && responseJson.code === 503 || responseJson.code === 402){
        //      // appUpdateOrMaintanance(responseJson.message)
        // } else {
            return responseJson;
        // }

    }).catch((error) => {
        console.error(error);
        return error;
    });

};

export const getData = async (methodName, auth) => {
    
    const allHeaders = await getHeaders(auth);

    console.log("All headers: " + JSON.stringify(allHeaders));
    console.log("URL : " + `${Constant.BASE_URL}${methodName}`);
    
    return fetch(`${Constant.BASE_URL}${methodName}`, {
        method: 'GET',
        headers: allHeaders
    }).then(response => {
        
        if (response.status >= 200 && response.status < 300) {
            return response.json();
        }else if(response.status === 403){
            return response.json();
        }

    }).then((responseJson) => {

        console.log(" Server Response => ",JSON.stringify(responseJson));

        if (responseJson !== undefined && responseJson.code === 401) {
            // logoutDeleteCase(responseJson.message)
        }else if(responseJson !== undefined && responseJson.code === 503 || responseJson.code === 402){
             // appUpdateOrMaintanance(responseJson.message)
        } else {
            return responseJson;
        }

    }).catch((error) => {
        console.error(error);
        return error;
    });

};