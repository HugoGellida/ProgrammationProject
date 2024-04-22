from players.player import Player
from game.card import Card

class Bot1Player(Player):
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
        print('the bot chose to remove line', minIndexLine)
        return minIndexLine


    def getCardToPlay(self):
        hand = [getattr(card, "value") for card in self.hand]
        hand.sort()
        response = hand[0]
        print("The bot played", response)
        return response
    
    def player_turn(self, game):
        carteChoisie = Card(self.getCardToPlay())
        return carteChoisie