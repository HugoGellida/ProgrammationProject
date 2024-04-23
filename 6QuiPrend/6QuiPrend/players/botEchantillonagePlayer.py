from players.player import Player
from game.card import Card
import random
from copy import copy

class BotEchantillonagePlayer(Player):
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
        return minIndexLine

    def getCardToPlay(self):
        pass

    def analysePoints(self, plays, game):
        points = 0
        testGame = copy(game)
        for player, card in plays:
            placed = False
            for i in range(len(testGame.table) - 1, -1, -1):
                if testGame.table[i][-1] < card:
                    if len(testGame.table[i]) < 5:
                        testGame.table[i].append(card)
                    else:
                        if player.name == self.name:
                            points = testGame.total_cows(testGame.table[i])
                    placed = True
                    break
            if not placed:
                line = self.getLineToRemove(testGame)
                if player.name == self.name:
                    points = testGame.total_cows(testGame.table[line-1])
        print(plays)
        return points

    def player_turn(self, game):
        table = game.table
        print("Cards of bot:", self.hand)
        notPossibleCards = game.alreadyPlayedCards + self.hand
        players = game.players
        valuePerCards = {}
        for card in self.hand:
            valuePerCards[card.value] = 0
        for _ in range(5):
            E = []
            for i in range(len(players)):
                if players[i].name != self.name:
                    x = random.randint(1, 104)
                    while Card(x) in notPossibleCards or Card(x) in E:
                        x = random.randint(1, 104)
                    E.append((players[i], Card(x)))
            for card in self.hand:
                valuePerCards[card.value] += self.analysePoints(E + [(self, card)], game)
        minPoints = -1
        minCardPoints = 0
        print(valuePerCards)
        for c, value in valuePerCards.items():
            if value < minPoints or minPoints == -1:
                minPoints = value
                minCardPoints = Card(c)
        return minCardPoints