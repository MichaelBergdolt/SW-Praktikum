import AppHeader from "../components/AppHeader";
import Container from "@mui/material/Container";
import GridContainer from "../components/GridContainer";

export default function Main(props) {

    return (
        <div className="App">
            <AppHeader avatar={props.avatar}></AppHeader>
            <Container style={{marginTop: '10px'}}>
                <GridContainer user={props.user}></GridContainer>
            </Container>
        </div>
    );
}