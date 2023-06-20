import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import placeHolderImage from '../static/images/profileImagePlaceholder.jpeg';
import Avatar from "@mui/material/Avatar";
import {Component} from "react";
import Tooltip from "@mui/material/Tooltip";
import BlockIcon from "@mui/icons-material/Block";
import {Link} from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import Box from "@mui/material/Box";
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import SopraDatingAPI from "../api/SopraDatingAPI";
import CachedIcon from "@mui/icons-material/Cached";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

/**
 * @author [Jannik Haug]
 */
class BookmarkProfileCard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            addingError: null,
            deletingError: null
        }
    }

    blockUser = () => {
        const {bookmarkedUser, user} = this.props;
        SopraDatingAPI.getAPI().addUserToBlocklist(user.getUserID(), bookmarkedUser).then(() => {
            this.setState({
                addingError: null
            })
            this.props.onUserRemoved(bookmarkedUser);
        }).catch(e =>
            this.setState({
                addingError: e
            })
        );

        this.setState({
            addingError: null
        })

        SopraDatingAPI.getAPI().removeUserFromBookmarklist(user.getUserID(), bookmarkedUser).then(() => {
            this.setState({
                addingError: null
            })
        }).catch(e =>
            this.setState({
                addingError: e
            })
        );

        this.setState({
            addingError: null
        })
    }

    removeUserFromBookmarklist = () => {
        const {bookmarkedUser} = this.props;
        SopraDatingAPI.getAPI().removeUserFromBookmarklist(bookmarkedUser.getUserID()).then(() => {
            this.setState({
                deletingError: null
            })
            this.props.onUserRemoved(bookmarkedUser);
        }).catch(e =>
            this.setState({
                deletingError: e
            })
        );

        this.setState({
            deletingError: null
        })
    }
    addUserToChat = (userToAdd) => {
        SopraDatingAPI.getAPI().addUserToChat(this.props.user.getUserID(), userToAdd)
            .then(() => {
                alert("Der User wurde dem Chat hinzugefügt ")
            })
            .catch(error => {
                alert("Der User kann nicht erneut einem Chat hinzugefügt werden ")
            })
    }

    chatButtonFunction(userToAdd) {
        var addObject = {
            "UserID": userToAdd
        }
        this.addUserToChat(addObject)
    }

    render() {
        const {bookmarkedUser} = this.props;
        const bookMarkedUserId = parseInt(this.props.bookmarkedUser.getUserID())
        return (
            <div>
                <Card direction="row"
                      justifycontent="space-evenly"
                      alignitems="center"

                      sx={{
                          borderTop: 3,
                          borderBottom: 3,
                          borderRadius: 2,
                          borderColor: "#eceff1",
                          ':hover': {boxShadow: 3},
                          minWidth: "300px"
                      }} //Quelle: https://stackoverflow.com/questions/37062176/mui-how-to-animate-card-depth-on-hover
                >
                    <Avatar sx={{width: 56, height: 56, margin: "auto", mt: 1}} src={placeHolderImage}></Avatar>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {bookmarkedUser.getDisplayname()}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" style={{textAlign: "left"}}>
                            Alter:
                        </Typography>
                        <Typography variant="h6" color="text.secondary" style={{textAlign: "left"}}>
                            Geschlecht:
                        </Typography>
                        <Typography variant="h6" color="text.secondary" style={{textAlign: "left"}}>
                            Raucher:
                        </Typography>
                        <Typography variant="h6" color="text.secondary" style={{textAlign: "left"}}>
                            Religion:
                        </Typography>
                        <Typography variant="h6" color="text.secondary" style={{textAlign: "left"}}>
                            Haarfarbe:
                        </Typography>
                        <Typography variant="h6" color="text.secondary" style={{textAlign: "left"}}>
                            Geburtsdatum:
                        </Typography>
                        <Typography variant="h6" color="text.secondary" style={{textAlign: "left"}}>
                            Körpergröße:
                        </Typography>
                        <Box sx={{marginTop: 5, display: 'flex', justifyContent: 'space-between'}}>
                            <Tooltip title="User blockieren">
                                <BlockIcon onClick={() => this.blockUser()}
                                           sx={{cursor: 'pointer', width: 35, height: 35}}></BlockIcon>
                            </Tooltip>
                            <Tooltip title="User von Merkliste entfernen">
                                <HeartBrokenIcon onClick={() => this.removeUserFromBookmarklist()}
                                                 sx={{cursor: 'pointer', width: 35, height: 35}}></HeartBrokenIcon>
                            </Tooltip>
                            <Tooltip title="User zum Chat hinzufügen">
                                <ChatIcon onClick={() => this.chatButtonFunction(bookMarkedUserId)} sx={{cursor: 'pointer', width: 35, height: 35}}></ChatIcon>
                            </Tooltip>
                        </Box>
                    </CardContent>
                </Card>
            </div>
        )
    }
}

export default BookmarkProfileCard;