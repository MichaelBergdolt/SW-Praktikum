import AppHeader from "../components/AppHeader";
import Container from "@mui/material/Container";
import ConversationOverwievContainer from "../components/ConversationOverviewContainer";

export default function ConversationOverview() {
    const nameArray= ["Peter Scheidschel","Max Verstappen", "Lewis Hamilton", "Toto Wolf", "Fernando Alonso"]
    return (
        <div className="App">
            <AppHeader></AppHeader>
            <Container style={{display: 'grid', placeItems: 'center', marginTop: '50px'}} >
               <h3> My Conversations</h3>
            </Container>
            <ConversationOverwievContainer name={nameArray}>

            </ConversationOverwievContainer>
        </div>
    );
}