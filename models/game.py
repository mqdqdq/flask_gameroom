import ast

class Game():
    
    def user_input(data) -> bool:
        pass

    def get_content(self) -> dict:
        return self.__dict__()

    def apply_content(self, content: dict):
        for attr_name, value in content.items():
            self.__setattr__(attr_name, value)

    def __dict__(self, attributes):
        result = {}
        for attribute in attributes:
            result[attribute] = self.__getattribute__(attribute)
        return result