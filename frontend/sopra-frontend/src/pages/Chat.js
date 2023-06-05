import * as React from "react";
import ChatContainer from "../components/ChatContainer";
import AppHeader from "../components/AppHeader";
import {Component} from "react";

/**
 * *
 * @author [Jannik Haug](https://github.com/JannikHaug)
 */

class Chat extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            messageArrayLeft: ["Hallo wie gehts?", "Danke mir auch", "Ja das ist schön", "Heute gehe ich ins Freibad", "Hallo wie gehts?", "Danke mir auch", "Ja das ist schön", "Heute gehe ich ins Freibad"],
            messageArrayRight: ["Hi mir gehts gut und dir?", "Super das freut mich", "Was machst du heute?", "Wow das ist cool. Ich gehe ins Kino", "Hi mir gehts gut und dir?", "Super das freut mich", "Was machst du heute?", "Wow das ist cool. Ich gehe ins Kino"]
        };
    }
    render() {
    return (
        <div className="App">
            <ChatContainer></ChatContainer>
        </div>
    )
        ;
}
}
export default Chat