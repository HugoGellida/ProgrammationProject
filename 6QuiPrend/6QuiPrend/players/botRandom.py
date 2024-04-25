from players.player import Player
from game.card import Card
from random import *

class botRandom(Player):
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
        response = hand[randint(0,len(hand)-1)]
        print("Le bot Random a joué : ", response)
        carteChoisie = Card(response)
        return carteChoisie