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
        hasFoundCard = False
        minimalCardGap = Card(0)
        print("Cartes du bot Custom :", self.hand)
        for index, row in enumerate(table):
            for card in self.hand:
                gap = card.value - row[len(row) - 1].value
                if (gap < minimalGap or minimalGap == -1) and len(row) != 5 and gap > 0:
                    minimalGap = gap
                    hasFoundCard = True
                    minimalCardGap = card
        if not hasFoundCard:
            m = min([card.value for card in self.hand])
            minimalCardGap = Card(m)
        print("Le bot Custom a joué :", minimalCardGap)
        return minimalCardGap