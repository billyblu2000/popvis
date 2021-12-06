import { message } from "antd";
import axios from "axios";
import PubSub from "pubsub-js";

var env = 'prod'

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
export function fullScreen() {
    var element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
}

//退出全屏 
export function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

window.onresize = function() {
    var isFull=!!(document.webkitIsFullScreen || document.mozFullScreen || 
        document.msFullscreenElement || document.fullscreenElement
    );
    if (!isFull){
        PubSub.publish('full', false)
    }
}

export const noteText = {
    welcome:'POPVIS is a visualzation of the POP909 Dataset created by Music-X-Lab, NYU Shanghai. If you are confused about the design logic, you may find it helpful by clicking the view title or the card ribbon. For some views, you may click the button next to the view title to enter the fullscreen mode.',
    selector:'The selector card enables you to filter phrases. It is combined by 3 parts. 1. The year-month brusher: this area chart represents the song number published in specific months. The x-axis is the years and months, and the y-axis is the amount of songs that published in the month. 2. The phrase selector: five kind of phrases are included: intro, verse, chorus, outro, and other phrases. If none is selected, then by default will show all phrases. 3. The mode selector: similar to the phrase selector, you can select major mode or minor mode. By default all modes will be shown.',
    statistics:'The statistics card brings different statistics of the selected songs and phrases. On the left side is the song selector. When hovering on each songs, the song information will also be highlighted in some of the statistic views. If a song is clicked, the detailed information will be shown in the song card. (For more information, please refer to the user guid of the song card.) Type in the input frame on the top-left of the statistics card, you may filter the songs by artist or name. For informations about different views, please refer to the corresponding user guid (by clicking the view’s title).',
    song:'The song card shows the detailed information of a song. To view it, you have to first click a song in the left side of the statistics card. The song information is represented by a flow of phrase cards. The phrase card in ordered from left to right, it’s horizontal position represents the actual phrase location in the song. The type of the phrase is represented by color hue, with the mapping relationship: light_orange: intro; orange: verse; blue: chorus; light_blue: outro; gray: other. The width of the phrase card represents the length of the phrase, measured in bars. Two kinds of height exists. Card with larger height means the phrase have vocal, cards with smaller height don’t have a vocal track. You may also view the detailed information of a phrase by clicking the card. Clicking the chord progression in the card will play the chord progression. ',
    chord:'The chord progression view is a force directed tree, the progressions are represented by the hierarchy of tree, the saturation and the size of a node is the popularity of the current progression. ',
    melody:'The melody pieces view is a parallel coordinates chart that shows the popular melody pieces in the selected phrases. Melodies are sliced with each piece contains five notes. The coordinates from the left to the right shows the pitch of the first note to the fifth note. The thickness and the saturation shows the popularity of a specific melody piece. Hovering will show the tooltip.',
    keyMode:'The pitch range view is a pie chart that shows the amount of each kind of key and mode in the selected phrases. The inner circle is all the minor tonics, while the outer circle is all the major tonics. The saturation represents the amount of a specific key and mode. ',
    pitchRange:'The pitch range view is a histogram that shows the number of each kind of pitch range in the selected phrases. The x-axis is the pitch range and the y-axis is the amount. Hovering will show the tooltip of detailed information.',
    chordDuration:'The chord duration view is a pie chart that shows the proportion of each kinds of chord durations in the selected phrases. Hovering will show the tooltip of detailed information.',
    meter:'The meter view is a pie chart that shows the proportion of each kinds of meters in the selected phrases. Hovering will show the tooltip of detailed information.',
}