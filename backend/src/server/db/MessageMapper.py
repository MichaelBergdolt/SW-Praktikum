from src.server.bo import Message
from src.server.db import Mapper
Message = Message.Message


class MessageMapper(Mapper.Mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * FROM message")
        tuples = cursor.fetchall()

        for (id, timestamp, message_content, sender, receiver) in tuples:
            message = Message()
            message.set_id(id)
            message.set_timestamp(timestamp)
            message.set_message_content(message_content)
            message.set_sender(sender)
            message.set_receiver(receiver)
            result.append(message)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_id(self, chat_id):
        result = None
        cursor = self._cnx.cursor()
        command = "SELECT * FROM chatrelation WHERE ChatID={}".format(chat_id)
        cursor.execute(command)
        message_tuple = cursor.fetchone()

        if message_tuple is not None:
            message_id = message_tuple[0]

            command2 = "SELECT * FROM message WHERE MessgeID={}".format(message_id)
            cursor.execute(command2)
            messages = cursor.fetchall()

            if messages is not None:
                message_body = []

                for message in messages:
                    jsstr = f'{{"MessageID": "{message_body[0]}", "Sender": "{message_body[1]}", "Content": "{message_body[2]}", "TimeStamp": "{message_body[3]}"}}'
                    messageJSON = json.loads(jsstr)
                    result.append(messageJSON)


        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, user_id, payload):
        cursor = self._cnx.cursor()

        command = "INSERT INTO message (id, Sender, Content, Timestamp) VALUES (%s, %s, %s, %s, %s)"
        data = (payload.get('id'), user_id, payload.get('content'), payload.get('timestamp'))
        cursor.execute(command, data)
        self._cnx.commit()
        cursor.close()

        return payload

    def update(self, message):
        cursor = self._cnx.cursor()

        command = "UPDATE message SET timestamp=%s, message_content=%s, sender=%s, receiver=%s WHERE id=%s"
        data = (message.get_timestamp(), message.get_message_content(), message.get_sender(), message.get_receiver(),
                message.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, message):
        cursor = self._cnx.cursor()

        command = "DELETE FROM message WHERE MessageID={}".format(message.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

    def find_by_email(self, email):
        pass

    def find_by_name(self, name):
        pass