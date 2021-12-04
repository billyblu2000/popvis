import { message } from "antd";
import axios from "axios";

var env = 'dev'

export const themeColor = [
    '#e6f7ff',
    '#bae7ff',
    '#91d5ff',
    '#69c0ff',
    '#40a9ff',
    '#1890ff',
    '#096dd9',
    '#0050b3',
    '#003a8c',
    '#002766',
    '#cae7ff'
]
var prodServer = 'https://billyyi.top/api/popvis_back_end'
var stagingServer = 'http://10.209.83.40/api/popvis_back_end';
var privateServer = 'http://localhost:3000/api/popvis_back_end';
var address
if (env === 'prod'){
    address = prodServer;
}
else if (env === 'staging'){
    address = stagingServer;
}
else{
    address = privateServer;
}
export function server(add, obj, v, f=null, paras=null) {
    axios.get(address + add).then(
        response => { 
            obj.setState({
                [v]:response.data
            });
            if (f !== null){
                f(...paras)
            }
        },
        error => { 
            message.warn('Sorry, something wrong happened to the server!')
            console.log(error)
        },
    )
};
