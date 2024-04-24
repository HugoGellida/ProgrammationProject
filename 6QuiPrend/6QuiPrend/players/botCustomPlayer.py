from players.player import Player
from game.card import Card

class BotCustomPlayer(Player):
    def info(self, message):
        print("bot "+self.name+" : ",message)

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
        table = game.table
        minimalGap = -1
        minimalCardGap = 0
        print("Cartes du bot Custom :", self.hand)
        for index, row in enumerate(table):
            for card in self.hand:
                gap = abs(row[len(row) - 1].value - card.value)
                if gap < minimalGap or minimalGap == -1:
                    minimalGap = gap
                    minimalCardGap = card
        print("Le bot Custom a joué :", minimalCardGap)
        return minimalCardGap