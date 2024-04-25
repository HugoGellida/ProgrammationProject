from players.player import Player
from game.card import Card
from random import *
from itertools import combinations

class botEchantillon(Player):
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
        ScoreFinal=self.Emulator(hand,NotPlayedCards,game.table,len(game.players))
        for i in ScoreFinal:
            ScoreFinal[i]=(sum(ScoreFinal[i])/len(ScoreFinal[i]))
        response = min(ScoreFinal, key=lambda k: ScoreFinal[k])
        print("Le bot Echantillonage à joué :", response)
        return Card(response)


    def Emulator(self,hand,ListOfCards,Plateau,NbJoueurs):
        NotPlayedCards=ListOfCards.copy()
        Retour={}
        for i in hand :
            Retour[i]=[]
        for i in hand :
            for j in range(100):
                ListeMain=[element for element in self.hand if element != Card(i)]
                Comb , ListeSansComb=  self.Combinaison(NotPlayedCards,NbJoueurs)
                Retour[i].append(self.Simulate_update_table(Plateau.copy(),i,Comb+(i,),ListeSansComb,NbJoueurs,ListeMain))    
        return Retour

                    
                


    def Simulate_update_table(self,Table,handCard,Combinations,ListWithoutComb,NbJoueurs,ListeMain):
        if (len(ListeMain)==0):
            return 0
        else:
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
                            cows = botEchantillon.total_cows(Table[i])
                            Valeurs[val].append(cows)
                            Table[i] = [Card(val)]
                            Table = sorted(Table, key=lambda x: x[-1].value)
                        placed = True
                        break
                if not placed:
                    minIndex = 0
                    minOfLine = -1
                    for index, row in enumerate(Table):
                        total = botEchantillon.total_cows(row)
                        if (total < minOfLine or minOfLine == -1):
                            minIndex = index + 1
                            minOfLine = total
                    Valeurs[val].append(botEchantillon.total_cows(Table[minIndex-1]))
                    Table[minIndex - 1] = [Card(val)]
                    Table = sorted(Table, key=lambda x: x[-1].value)
            Comb , ListeSansComb=  self.Combinaison(ListWithoutComb,NbJoueurs)
            i=choice(ListeMain)
            ListeMain=[element for element in ListeMain if element != i]
            return Valeurs[handCard][0]+self.Simulate_update_table(Table,i.value,Comb+(i.value,),ListeSansComb,NbJoueurs,ListeMain)
            








    def Combinaison(self,liste,taille):
        toutes_combinaisons = list(combinations(liste, taille))
        combinaison_choisie = choice(toutes_combinaisons)
        liste_sans_comb=[element for element in liste if element != combinaison_choisie]
        return combinaison_choisie , liste_sans_comb


    @staticmethod
    def total_cows(cardlist):
        """
        Calcule le total de boeufs dans une liste de cartes.

        :param cardList: La liste de cartes.
        :return: Le nombre total de boeufs dans la liste.
        """
        return sum(card.cowsNb for card in cardlist)
