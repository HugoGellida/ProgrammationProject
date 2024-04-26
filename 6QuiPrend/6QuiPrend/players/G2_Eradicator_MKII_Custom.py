from players.player import Player
from game.card import Card

class G2_Eradicator_MKII_Custom(Player):
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
        minimumGap = -1
        hasFoundCard = False
        minimalCardGap = Card(0)
        print("Cartes de G2_EMKII_Custom :", self.hand)
        moyenne = sum([card.value for card in self.hand])/len(self.hand)
        sorted_hand = sorted(self.hand, key=lambda x: abs(x.value - moyenne))
        for index, row in enumerate(table):
            for card in sorted_hand:
                gap = card.value - row[len(row) - 1].value
                if (gap < minimumGap or minimumGap == -1) and len(row) != 5 and gap > 0:
                    minimumGap = gap
                    hasFoundCard = True
                    minimalCardGap = card
        existCardMin = False
        for index, row in enumerate(table):
            if min([card.value for card in self.hand]) < any(row):
                existCardMin = True
                break
        if not hasFoundCard or existCardMin:
            m = min([card.value for card in self.hand])
            minimalCardGap = Card(m)
        print("G2_EMKII_Custom a joué :", minimalCardGap)
        return minimalCardGap