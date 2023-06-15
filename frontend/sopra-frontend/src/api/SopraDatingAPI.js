/**
 * Abstracts the REST interface of the Python backend with convenient access methods.
 * The class is implemented as a singleton.
 *
 * @author [Michael Bergdolt] (https://github.com/MichaelBergdolt)
 * inspired by [Christoph Kunz] (https://github.com/christophkunz)
 */
import UserBO from "./UserBO";
import MessageBO from "./MessageBO";
import chatb from "./ChatBO";
import ChatBO from "./ChatBO";

export default class SopraDatingAPI {

    // Singleton instance
    static #api = null;

    // Local Python backend
    #SopraDatingServerBaseURL = 'http://127.0.0.1:8000';

    // Local http-fake-backend
    //#SopraDatingServerBaseURL = 'http://localhost:8081/api/v1'


    // User related
    #getUserURL = (email) => {
        return `http://localhost:8081/api/v1/user/${email}` //Todo set Base URL Back to variable
    };

    // Main Page related
    #getUserListBySearchprofileURL = (searchProfileID) => {
        return `http://localhost:8081/api/v1/userList/${searchProfileID}`; //Todo set Base URL Back to variable
    };

    // Bookmarklist related
    #addUserToBookmarklistURL = (userID) => {
        return `${this.#SopraDatingServerBaseURL}/bookmarklist/${userID}`;
    };
    #getBookmarklistURL = (userID) => {
        return `${this.#SopraDatingServerBaseURL}/bookmarklist/${userID}`;
    };
    #removeUserFromBookmarklistURL = (userID) => {
        return `${this.#SopraDatingServerBaseURL}/bookmarklist/${userID}`;
    };

    // Blocklist related
    #addUserToBlocklistURL = (userID) => `${this.#SopraDatingServerBaseURL}/blocklist/${userID}`;
    #getBlocklistURL = (userID) => `${this.#SopraDatingServerBaseURL}/blocklist/${userID}`;
    #removeUserFromBlocklistURL = (userID) => `${this.#SopraDatingServerBaseURL}/blocklist/${userID}`;

    // Chat related
    #addUserToChatURL = (userID) => `${this.#SopraDatingServerBaseURL}/chat/${userID}`;
    #getUserChatsURL = (userID) => {
        return `${this.#SopraDatingServerBaseURL}/chat/${userID}`; //TODO change ID
    }
    #removeChatURL = (chatID) => `${this.#SopraDatingServerBaseURL}/conversationoverview?id=${chatID}`;

    // Message related
    #addMessageURl = (userID) => `${this.#SopraDatingServerBaseURL}/message/${userID}`;
    //#getChatMessagesURL = (chatID) => `${this.#SopraDatingServerBaseURL}/message/30001`; //TODO change ID
    #getChatMessagesURL = (chatID) => `http://127.0.0.1:8000/message/${chatID}`; //TODO change ID

    // Profile related
    #getProfileURL = (userID) => `${this.#SopraDatingServerBaseURL}/profile?id=${userID}`;
    #updateProfileURL = (userID) => `${this.#SopraDatingServerBaseURL}/profile?id=${userID}`;

    // SearchProfile related
    #getSearchProfileURL = (searchprofileID) => {
        return `${this.#SopraDatingServerBaseURL}/searchprofile?id=${searchprofileID}`;
    }
    #getSearchProfilesURL = (userID) => {
        return `${this.#SopraDatingServerBaseURL}/searchprofile?id=${userID}`;
    }
    #addSearchProfileURL = () => {
        return `${this.#SopraDatingServerBaseURL}/searchprofile`;
    }
    #updateSearchProfileURL = (searchprofileID) => {
        return `${this.#SopraDatingServerBaseURL}/searchprofile?id=${searchprofileID}`;
    }
    #deleteSearchProfileURL = (searchprofileID) => {
        return `${this.#SopraDatingServerBaseURL}/searchprofile?id=${searchprofileID}`;
    }

    // viewedList related
    #addUserToViewedlistURL = (userID)=>`${this.#SopraDatingServerBaseURL}/view/${userID}`;
    #getViewedlistURL = (userID) => `${this.#SopraDatingServerBaseURL}/view/${userID}`

    // similarityMeasure related


    /**
     * Get the Singleton instance
     *
     * @public
     */
    static getAPI() {
        if (this.#api == null) {
            this.#api = new SopraDatingAPI();
        }
        return this.#api;
    }

    /**
     *  Returns a json object.
     *  fetchAdvanced throws an Error also an server status errors
     */
    #fetchAdvanced = (url, init) => fetch(url, init)
        .then(res => {
                // The Promise returned from fetch() won’t reject on HTTP error status even if the response is an HTTP 404 or 500.
                if (!res.ok) {
                    throw Error(`${res.status} ${res.statusText}`);
                }
                return res.json();
            }
        )

    getUser(email) {
        return this.#fetchAdvanced(this.#getUserURL(email))
            .then((responseJSON) => {
                let userBOs = UserBO.fromJSON(responseJSON);
                // console.log(blocklistBOs)
                return new Promise(function (resolve) {
                    resolve(userBOs)
                })
        })
    }

    getUserListBySearchprofile(searchProfileID=1) {
        return this.#fetchAdvanced(this.#getUserListBySearchprofileURL(searchProfileID))
            .then((responseJSON) => {
                let userBOs = UserBO.fromJSON(responseJSON);
                // console.log(blocklistBOs)
                return new Promise(function (resolve) {
                    resolve(userBOs)
                })
        })
    }

    addUserToBookmarklist(userID, userBO) {
        return this.#fetchAdvanced(this.#addUserToBookmarklistURL(userID), {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(userBO)
        }).then((responseJSON) => {
            let userBO = UserBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(userBO)
            })
        })
    }

    getBookmarklist(userID) {
        return this.#fetchAdvanced(this.#getBookmarklistURL(userID))
            .then((responseJSON) => {
                let userBOs = UserBO.fromJSON(responseJSON);
                // console.log(blocklistBOs)
                return new Promise(function (resolve) {
                    resolve(userBOs)
                })
            })
    }

    removeUserFromBookmarklist(userID, userBO) {
        return this.#fetchAdvanced(this.#removeUserFromBookmarklistURL(userID), {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(userBO)
        }).then((responseJSON) => {
            let userBOs = UserBO.fromJSON(responseJSON)[0];
            // console.info(userBOs);
            return new Promise(function (resolve) {
                resolve(userBOs);
            })
        })
    }

    addUserToBlocklist(userID, userBO) {
        return this.#fetchAdvanced(this.#addUserToBlocklistURL(userID), {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(userBO)
        }).then((responseJSON) => {
            let userBO = UserBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(userBO)
            })
        })
    }

    getBlocklist(userID) {
        return this.#fetchAdvanced(this.#getBlocklistURL(userID))
            .then((responseJSON) => {
                let userBOs = UserBO.fromJSON(responseJSON);
                // console.log(blocklistBOs)
                return new Promise(function (resolve) {
                    resolve(userBOs)
                })
            })
    }

    removeUserFromBlocklist(userID, userBO) {
        return this.#fetchAdvanced(this.#removeUserFromBlocklistURL(userID), {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(userBO)
        }).then((responseJSON) => {
            let userBOs = UserBO.fromJSON(responseJSON)[0];
            // console.info(userBOs);
            return new Promise(function (resolve) {
                resolve(userBOs);
            })
        })
    }

    addUserToChat(ownUserId ,partnerUserId) {
        return this.#fetchAdvanced(this.#addUserToChatURL(ownUserId), {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(partnerUserId)
        })
    }

    getUserChats(userID) {
        return this.#fetchAdvanced(this.#getUserChatsURL(userID)).then((responseJSON) => {
            let chatBOs = ChatBO.fromJSON(responseJSON);
            console.log("chatBOS:", chatBOs)
            return new Promise(function (resolve) {
                resolve(chatBOs)
            })
        })
    }

    removeChat(chatID) {
        return this.#fetchAdvanced(this.#removeChatURL(chatID), {
            method: 'DELETE'
        })
    }

    addMessage(userID, messageBO) {
        return this.#fetchAdvanced(this.#addMessageURl(userID), {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(messageBO)
        }).then((responseJSON) => {
            let userBO = UserBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(userBO)
            })
        })
    }

    getChatMessages(chatID) {
        console.log("test:"+ this.#getChatMessagesURL(chatID))
        return this.#fetchAdvanced(this.#getChatMessagesURL(chatID))
            .then((responseJSON) => {
                let messageBOs = MessageBO.fromJSON(responseJSON);
                // console.log(messageBOs)
                return new Promise(function (resolve) {
                    resolve(messageBOs)
                })
            })
    }

    getProfile(userID) {
        return this.#fetchAdvanced(this.#getProfileURL(userID)).then((responseJSON) => {
            return responseJSON
        })
    }

    updateProfile(userBO) {
        return this.#fetchAdvanced(this.#updateProfileURL(userBO.id), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json',
            },
            body: JSON.stringify(userBO)
        })
    }

    getSearchProfile(searchprofileID) {
        return this.#fetchAdvanced(this.#getSearchProfileURL(searchprofileID)).then((responseJSON) => {
            return responseJSON
        })
    }

    getSearchProfiles(userID) {
        return this.#fetchAdvanced(this.#getSearchProfilesURL(userID)).then((responseJSON) => {
            return responseJSON
        })
    }

    addSearchProfile(searchprofileBO) {
        return this.#fetchAdvanced(this.#addSearchProfileURL(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(searchprofileBO)
        })
    }

    updateSearchProfile(searchprofileBO) {
        return this.#fetchAdvanced(this.#updateSearchProfileURL(searchprofileBO.id), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(searchprofileBO)
        })
    }

    deleteSearchProfile(searchprofileID) {
        return this.#fetchAdvanced(this.#deleteSearchProfileURL(searchprofileID), {
            method: 'DELETE'
        })
    }

    addUserToViewedlist(userID, userBO) {
        return this.#fetchAdvanced(this.#addUserToViewedlistURL(userID), {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(userBO)
        }).then((responseJSON) => {
            let userBO = UserBO.fromJSON(responseJSON)[0];
            return new Promise(function (resolve) {
                resolve(userBO)
            })
        })
    }

    getViewedlist(userID) {
        return this.#fetchAdvanced(this.#getViewedlistURL(userID))
            .then((responseJSON) => {
                let userBOs = UserBO.fromJSON(responseJSON);
                return new Promise(function (resolve) {
                    resolve(userBOs)
                })
        })
    }
}