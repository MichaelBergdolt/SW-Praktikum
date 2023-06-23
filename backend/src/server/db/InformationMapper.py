"""
get: getting a list of all information objects of a profile

post: adding a new information object to a profile

delete: deleting an information object from a profile
"""

import json

from backend.src.server.bo.Information import Information
from backend.src.server.db.Mapper import Mapper

class InformationMapper(Mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):
        """
        Finds all existing information objects
        :return: all existing information objects
        """
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT * FROM information"
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, profile_id, value_id) in tuples:
            information = Information()
            information.set_id(id)
            information.set_profile_id(profile_id)
            information.set_value_id(value_id)
            result.append(information)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_id(self, id):
        """
        Finds an information object by its ID
        :return: information object with the given ID
        """
        result = None
        cursor = self._cnx.cursor()
        command = "SELECT * FROM information WHERE InformationID={}".format(id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (info_id, profile_id, value_id) = tuples[0]
            info = Information()
            info.set_id(id)
            info.set_profile_id(profile_id)
            info.set_value_id(value_id)
            result = info
        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_property(self, property):
        """
        Returns all information objects assigned to the given property
        :param property: property object of the needed infos
        :return: a list of information objects assigned to the property
        """
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT * FROM property_assignment WHERE PropertyID={}".format(property.get_id())
        cursor.execute(command)
        assignments = cursor.fetchall()

        if assignments:
            value_ids = [ass[0] for ass in assignments]

            #Retrieve Informations by ValueID
            command2 = "SELECT * FROM information WHERE ValueID IN ({})".format(
                ','.join(str(v_id) for v_id in value_ids))
            cursor.execute(command2)
            tuples = cursor.fetchall()

            for (id, profile_id, value_id) in tuples:
                information = Information()
                information.set_id(id)
                information.set_profile_id(profile_id)
                information.set_value_id(value_id)
                result.append(information)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_profile(self, id):
        """
        Returns a list of all information objects assigned to the profile
        :param profile: the unique id of the profile
        :return: a list of all information objects assigned to the profile. If there is no information, it will return an empty list.
        """
        result = []
        cursor = self._cnx.cursor()

        # Retrieve assigned infos by ProfileID
        command = f"SELECT * FROM information WHERE ProfileID={id}"
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, profile_id, value_id) in tuples:
            info = Information()
            info.set_id(id)
            info.set_profile_id(profile_id)
            info.set_value_id(value_id)
            result.append(info)


        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, info):
        """
        Inserts a new information object in the system
        :param info: new information object
        :return: inserted information object
        """
        cursor = self._cnx.cursor()
        # ID Handling with specified ID range
        cursor.execute("SELECT MAX(InformationID) AS maxid FROM information")
        tuples = cursor.fetchall()

        for maxid in tuples:
            if maxid[0] is not None:
                if maxid[0]+1 > 6000:
                    raise ValueError("Reached maximum entities. Initializing not possible.") #todo catch error somewhere
                else:
                    info.set_id(maxid[0]+1)
            else:
                info.set_id(5001)

        command = "INSERT INTO information (InformationID, ProfileID, ValueID) VALUES (%s,%s,%s)"
        data = (info.get_id(), info.get_profile_id(), info.get_value_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return info

    def update(self, info, payload):
        """
        Updating information object
        :param info: information object to be updated
        :return: updated information object
        """
        cursor = self._cnx.cursor()
        command = "UPDATE information SET ProfileID=%s, ValueID=%s WHERE InformationID = %s"
        data = (info.get_profile_id(), payload.get('valueID'), info.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return payload

    def delete(self, info):
        """
        Deleting information object
        :param info: information object to be deleted
        :return: deleted information object
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM information WHERE InformationID={}".format(info.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

        return info


    #
    # def add_info_to_profile(self, profile_id, payload): #siehe profile methoden
    #     pass
    #     # überprüfen ob es sich bei der jeweiligen property dieses info-objekts
    #     # um dropdown oder um freitext handelt.
    #     # wenn dropdown: hole das info-objekt aus der datenbank (mapper find_by_id)
    #     # wenn freitext: zuerst create_info,
    #     # hole dann dieses info-objekt aus der datenbank (mapper find_by_id)
    #

    def get_content_of_info(self, info):
        """
        gets the value of an info object
        :param info: info we want to get the content from
        :return: a dictionary with the content of the information object
        """
        cursor = self._cnx.cursor()

        # Retrieving information
        command = "SELECT * FROM information WHERE InformationID = {}".format(info.get_id())
        cursor.execute(command)
        information = cursor.fetchone()

        if information:
            value_id = information[2]

            # Retrieving occupancies rows
            command2 = "SELECT * FROM occupancies WHERE ValueID = {}".format(value_id)
            cursor.execute(command2)
            content = cursor.fetchone()

            command3 = "SELECT * FROM property_assignment WHERE ValueID = {}".format(value_id)
            cursor.execute(command3)
            prop_ass_tuple = cursor.fetchone()
            if prop_ass_tuple:
                prop_id = prop_ass_tuple[1]
                command4 = "SELECT * FROM property WHERE PropertyID = {}".format(prop_id)
                cursor.execute(command4)
                prop_tuple = cursor.fetchone()
                prop = prop_tuple[1]

                if content:
                    jsstr = f'{{"valueID": "{content[0]}", "value": "{content[1]}", "property": "{prop}"}}'
                    content_json = json.loads(jsstr)

        self._cnx.commit()
        cursor.close()

        return content_json
