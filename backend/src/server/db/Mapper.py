from abc import ABC, abstractmethod
from contextlib import AbstractContextManager
import mysql
import mysql.connector as connector


class Mapper(AbstractContextManager, ABC):

    def __init__(self):

        self._cnx = connector.connect(user='root', password='sopra_2023', host="127.0.0.1", database='datenbank')

    def __enter__(self):

        self._cnx = connector.connect(user='root', password='sopra_2023', host="127.0.0.1", database='datenbank')

        return self


    def __exit__(self, exc_type, exc_val, exc_tb):
        self._cnx.close()

    @abstractmethod
    def find_all(self):
        pass

    @abstractmethod
    def find_by_id(self, id):
        pass

    @abstractmethod
    def insert(self, object, payload):
        pass

    @abstractmethod
    def update(self, object):
        pass

    @abstractmethod
    def delete(self, object, payload):
        pass



