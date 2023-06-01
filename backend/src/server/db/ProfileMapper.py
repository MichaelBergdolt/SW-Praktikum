import json

from backend.src.server.db import Mapper
from backend.src.server.bo.Profile import Profile

class ProfileMapper(Mapper.Mapper):

    def __init__(self):
        super().__init__()

    def find_all(self):
        """
        Finds all profiles in the system
        :return: all existing profiles
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * FROM profile")
        tuples = cursor.fetchall()

        for (profile_id, user_id, is_personal) in tuples:
            profile = Profile()
            profile.set_id(profile_id)
            profile.set_user_id(user_id)
            profile.set_is_personal(is_personal)
            result.append(profile)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_id(self, id):
        """
        Returns the profile belonging to the given ID
        :param id: ID of the profile
        :return: profile belonging to the given ID
        """
        result = None
        cursor = self._cnx.cursor()
        command = "SELECT * FROM profile WHERE ProfileID={}".format(id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (profile_id, user_id, is_personal) = tuples[0]
            profile = Profile()
            profile.set_id(profile_id)
            profile.set_user_id(user_id)
            profile.set_is_personal(is_personal)
            result = profile
        except IndexError:
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_owner(self, owner_id):
        """
        Returns all profiles belonging to a given user
        :param owner_id: id of the user
        :return: all profiles belonging to the user
        """
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT * FROM profile WHERE UserID={}".format(owner_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (profile_id, user_id, is_personal) in tuples:
            profile = Profile()
            profile.set_id(profile_id)
            profile.set_user_id(user_id)
            profile.set_is_personal(is_personal)
            result.append(profile)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_information(self, information):
        """
        Returns a list of all profiles that have the given info
        :param information: information that we filter by
        :return: a list of all profiles with that information
        """
        result = []
        cursor = self._cnx.cursor()

        # Retrieve all profile IDs with the info
        command = "SELECT * FROM info_assignment WHERE InformationID={}".format(information.get_id())
        cursor.execute(command)
        assignments = cursor.fetchall()

        if assignments is not None:
            profile_ids = [assignment[1] for assignment in assignments]
            profile_ids = list(set(profile_ids)) #Removing duplicate entries

            # Retrieve Profiles by ProfileID
            command2 = "SELECT * FROM profile WHERE ProfileID IN ({})".format(
                ','.join(str(p_id) for p_id in profile_ids))
            cursor.execute(command2)
            tuples = cursor.fetchall()

            for (profile_id, user_id, is_personal) in tuples:
                profile = Profile()
                profile.set_id(profile_id)
                profile.set_user_id(user_id)
                profile.set_is_personal(is_personal)
                result.append(profile)

            self._cnx.commit()
            cursor.close()

            return result


    def insert(self, profile):
        """
        Inserts a new profile in the system
        :param profile: profile to be inserted
        :return: returns the inserted profile
        """
        cursor = self._cnx.cursor()

        command = "INSERT INTO profile (ProfileID, UserID, IsPersonal) VALUES (%s,%s,%s)"
        data = (profile.get_id(), profile.get_user_id(), profile.get_is_personal())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return profile

    def update(self, profile):
        # cursor = self._cnx.cursor()
        #
        # command = "UPDATE profile SET ProfileID=%s, UserID=%s, IsPersonal=%s WHERE ProfileID=%s"
        # data = (profile.get_id(), profile.get_id())
        # cursor.execute(command, data)
        #
        # self._cnx.commit()
        # cursor.close()
        #
        # return profile
        pass

    def delete(self, profile):
        """
        Deleting a profile
        :param profile: Profile to be deleted
        :return: deleted profile
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM profile WHERE ProfileID={}".format(profile.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

        return profile



    def find_all_infos(self, profile):
        """
        Returns a list of all information objects assigned to the profile
        :param profile: the unique id of the profile
        :return: a list of all information objects assigned to the profile. If there is no information, it will return an empty list.
        """
        result = []
        cursor = self._cnx.cursor()

        # Retrieve assigned infos by ProfileID
        command = "SELECT * FROM info_assignment WHERE ProfileID={}".format(profile.get_id)
        cursor.execute(command)
        assignments = cursor.fetchall()

        if assignments is not None:
            info_ids = [assignment[2] for assignment in assignments]

            #Retrieve infos by InformationID
            command2 = "SELECT * FROM information WHERE InformationID IN ({})".format(','.join(str(infid) for infid in info_ids))
            cursor.execute(command2)
            infos = cursor.fetchall()

            # Form infos into a json and add them to the list
            for info in infos:
                jsstr = f'{{"id": "{info[0]}", "property_id": "{info[1]}", "value": "{info[2]}"}}' #todo evtl auch properties rausholen und die values als string geben?
                infoJSON = json.loads(jsstr)
                result.append(infoJSON)

        self._cnx.commit()
        cursor.close()

        return result

    def add_info(self, profile, payload): #todo evtl überarbeiten: Unterschied, ob Selection oder Text?
        """
        Adding an information to a profile
        :param profile: the profile we are adding infos to
        :param payload: the dic of the info to be added
        :return: the added info
        """
        cursor = self._cnx.cursor()


        info = int(payload.get('id'))

        cursor.execute(f'INSERT INTO info_assignment (ProfileID, InformationID) VALUES ({profile.get_id()}, {info})')

        self._cnx.commit()
        cursor.close()

        return payload

    def remove_info(self, profile, payload):
        """
        Removing an information from a profile
        :param profile: the profile we are deleting an info from
        :param payload: the dic of the info that will be deleted
        :return: the removed info
        """
        cursor = self._cnx.cursor()

        info = int(payload.get('id'))

        cursor.execute(f'DELETE FROM info_assignment WHERE ProfileID = {profile.get_id()} AND InformationID = {info}')

        self._cnx.commit()
        cursor.close()

        return payload

    def update_info(self, profile, assignment):
        """
        Updating / changing an information object belonging to the given profile
        :param profile:
        :param assignment:
        :return:
        """
        #todo
        pass