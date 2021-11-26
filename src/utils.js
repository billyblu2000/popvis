import { message } from "antd";
import axios from "axios";

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

export function server(add, obj, v, f=null, paras=null) {
    axios.get('http://localhost:3000' + add).then(
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
