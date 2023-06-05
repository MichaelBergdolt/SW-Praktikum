from src.server.bo.Property import Property
from src.server.bo.Information import Information

class SelectionProperty(Property):
    def __init__(self, value, options):
        info = Information(value)
        self.options = options
        super().__init__(info)

    #str und from_dict methoden werden von Property vererbt