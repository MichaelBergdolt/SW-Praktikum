import {ListItem, ListItemButton, ListItemText} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import placeHolderImage from '../static/images/profileImagePlaceholder.jpeg';
import Tooltip from "@mui/material/Tooltip";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import {Link, useNavigate} from "react-router-dom";
import {Component} from "react";

/**
 * *
 * @author [Jannik Haug](https://github.com/JannikHaug)
 */
class ConversationOverviewItem extends Component {
render() {
const {name, avatarLink, chatBo} = this.props;
const chatID = chatBo.getChatID();

    return (
        <div style={{display: "flex", alignItems: "center"}}>

            <ListItem  sx={{
                my: 1,
                justifyContent: "space-between",
                border: 1,
                borderRadius: 3,
                borderColor: "#cfd8dc",
                ':hover': {boxShadow: 2}
            }} style={{width: 500}}>
                <div style={{display: "flex", alignItems: "center"}}>
                    <Avatar src={placeHolderImage}></Avatar>
                    <ListItemText noWrap={false} sx={{ml: 2, fontSize: 20, wordBreak: 'break-all'}}
                                  primary={`${name}`}></ListItemText>
                </div>
                <Link  to={`/chat/${chatID}`}>
                <Tooltip title="zum Chat" fontSize="large" sx={{color: "#2979ff"}}>
                    <KeyboardDoubleArrowRightIcon>
                        test
                    </KeyboardDoubleArrowRightIcon>
                </Tooltip>
</Link>
            </ListItem>

        </div>
    );
}
}
export default ConversationOverviewItem;