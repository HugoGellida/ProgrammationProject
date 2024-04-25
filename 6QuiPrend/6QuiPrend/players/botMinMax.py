from players.player import Player
from game.card import Card
from itertools import combinations

class botMinMax(Player):
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
        allPlayedCards = [getattr(card, "value") for card in game.alreadyPlayedCards]
        HandCard=[getattr(card, "value") for card in self.hand]
        allCards = [i for i in range(1, 105)]
        NotPlayedCards = [element for element in allCards if element not in allPlayedCards ]
        NotPlayedCards = [element for element in NotPlayedCards if element not in HandCard ]
        hand = [getattr(card, "value") for card in self.hand]
        AllCombinations = list(combinations(NotPlayedCards, len(game.players)-1))
        print('Liste des cartes non jouees  : ', NotPlayedCards)
        print('Liste des cartes jouees  : ', allPlayedCards)
        print('Le tableau  : ', game.table)
        ScoreFinal={}
        for i in range(len(hand)):
            Scores=[]
            for j in range(len(AllCombinations)):
                Scores.append(self.Simulate_update_table(game.table.copy(),hand[i],AllCombinations[j]+(hand[i],)))
            ScoreFinal[hand[i]]=Scores
        print('Le dico de valeurs obtenu : ', ScoreFinal)
        for i in ScoreFinal:
            ScoreFinal[i]=(sum(ScoreFinal[i])/len(ScoreFinal[i]))
            print('Carte : ',i," Moyenne : ",ScoreFinal[i] )
        response = min(ScoreFinal, key=lambda k: ScoreFinal[k])
        return Card(response)

        


    def Simulate_update_table(self,Table,handCard,Combinations):
        Valeurs = {}
        Combination = sorted(Combinations)
        for val in Combination:
            Valeurs[val]=[]
            placed = False
            for i in range(len(Table) - 1, -1, -1):
                if Table[i][-1].value<val:
                    if len(Table[i]) < 5:
                        Valeurs[val].append(0)
                    else:
                        cows = botMinMax.total_cows(Table[i])
                        Valeurs[val].append(cows)
                        Table[i] = [Card(val)]
                        Table = sorted(Table, key=lambda x: x[-1].value)
                    placed = True
                    break
            if not placed:
                minIndex = 0
                minOfLine = -1
                for index, row in enumerate(Table):
                    total = botMinMax.total_cows(row)
                    if (total < minOfLine or minOfLine == -1):
                        minIndex = index + 1
                        minOfLine = total
                Valeurs[val].append(botMinMax.total_cows(Table[minIndex-1]))
                Table[minIndex - 1] = [Card(val)]
                Table = sorted(Table, key=lambda x: x[-1].value)
        return Valeurs[handCard][0]

    

    @staticmethod
    def total_cows(cardlist):
        """
        Calcule le total de boeufs dans une liste de cartes.

        :param cardList: La liste de cartes.
        :return: Le nombre total de boeufs dans la liste.
        """
        return sum(card.cowsNb for card in cardlist)

