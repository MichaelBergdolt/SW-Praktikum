import Container from "@mui/material/Container";
import AppHeader from "../components/AppHeader";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import * as React from "react";
import BookmarkProfileCard from "../components/BookmarkProfileCard";
import SopraDatingAPI from "../api/SopraDatingAPI";
import {ListItem, ListItemText} from "@mui/material";
import Typography from "@mui/material/Typography";

/**
 * Shows the Bookmarklist with all Profiles, that are Bookmarked by the User
 *
 * @author [Michael Bergdolt]
 */

export default class bookmarkList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            error: null,
            bookmarklist: []
        }
    }

    /**
     * Fetches the bookmarklist for the current user
     */
    getBookmarklist = () => {
        SopraDatingAPI.getAPI().getBookmarklist(this.props.user.getUserID())
            .then(UserBOs =>
                this.setState({
                    error: null,
                    bookmarklist: UserBOs
                }))
            .catch(e =>
                this.setState({
                    error: e,
                    bookmarklist: []
                })
            );
    };

    componentDidMount() {
        this.getBookmarklist();
    }

    /**
     * Removes the blocked user from the bookmarklist
     *
     * @param {UserBO} addedUser - user which was added to the blocklist
     */
    addUserToBlocklistHandler = (addedUser) => {
        this.setState({
            bookmarklist: this.state.bookmarklist.filter(user => user.getUserID() !== addedUser.getUserID())
        });
    };

    render() {
        const {bookmarklist} = this.state;


        return (
            <div className="App">
                <AppHeader avatar={this.props.avatar}></AppHeader>
                <Container style={{marginTop: '50px'}}>
                    <Box>
                        <Grid
                            container
                            spacing={{xs: 10, md: 10}}
                            columns={{xs: 4, sm: 8, md: 12}}>
                            {bookmarklist.length > 0 ? (
                                bookmarklist.map((bookmarklistItem) => (
                                    <Grid xs={4} sm={4} md={4} key={bookmarklistItem.getUserID()}>
                                        <BookmarkProfileCard key={bookmarklistItem.getUserID()}
                                                             user={this.props.user}
                                                             bookmarkedUser={bookmarklistItem}
                                                             onUserRemoved={this.addUserToBlocklistHandler}>
                                        </BookmarkProfileCard>
                                    </Grid>
                                ))
                            ) : (
                                <ListItem>
                                    <ListItemText sx={{ textAlign: 'center' }}>
                                        <Typography variant="body1">Keine Nutzer auf der Merkliste</Typography>
                                    </ListItemText>
                                </ListItem>
                            )}
                        </Grid>
                    </Box>
                </Container>
            </div>
        );
    }
}