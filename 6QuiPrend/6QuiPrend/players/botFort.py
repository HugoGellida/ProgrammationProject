from players.player import Player
from game.card import Card

class botFort(Player):
    def info(self, message):
        print("@"+self.name+" : ",message)

    def getLineToRemove(self, game):
        table = game.table
        minIndexLine = 0
        minOfLine = -1
        for index, row in enumerate(table):
            total = game.total_cows(row)
            if (total < minOfLine or minOfLine == -1):
                minIndexLine = index + 1
                minOfLine = total
        print('Le bot a choisit de supprimer la ligne : ', minIndexLine)
        return minIndexLine

    def getCardToPlay(self):
        pass

    def player_turn(self, game):
        hand = [getattr(card, "value") for card in self.hand]
        hand.sort()
        response = hand[len(hand)-1]
        print("Le bot Fort a joué : ", response)
        carteChoisie = Card(response)
        return carteChoisie