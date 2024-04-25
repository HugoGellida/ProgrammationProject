from players.humanPlayer import HumanPlayer
from game.nimmtGame import NimmtGame
from players.botFaible import botFaible
from players.botFort import botFort
from players.botCustomPlayer import BotCustomPlayer
from players.botRandom import botRandom
from players.botEchantillon import botEchantillon
from players.botMinMax import botMinMax

def interactiveRun():
    print("Bienvenue sur le jeu 6 qui prend !")
    while True:
        try:
            num_players = int(input("Combien de joueurs ? "))
            players=[]
            for i in range(num_players):
                name=input("Nom du joueur : ")
                if name == "botFaible":
                    botName = input('Nom du bot faible : ')
                    players.append(botFaible(botName))
                elif name == "botFort":
                    botName = input('Nom du bot fort : ')
                    players.append(botFort(botName))
                elif name == "BotCustomPlayer":
                    botName = input('Nom du bot Custom : ')
                    players.append(BotCustomPlayer(botName))
                elif name == "botRandom":
                    botName = input('Nom du bot Random : ')
                    players.append(botRandom(botName))
                elif name == "Echantillon":
                    botName = input('Nom du bot Echantillon : ')
                    players.append(botEchantillon(botName))
                elif name == "MinMax":
                    botName = input('Nom du bot MinMax : ')
                    players.append(botMinMax(botName))
                else: 
                    players.append(HumanPlayer(name))
            game=NimmtGame(players)
            scores, winners=game.play()

            print("La partie est terminée!")
            print("Scores finaux :")
            for playername, score in scores.items(): 
                print(f"Joueur {playername} : {score} points")
            s=" ".join([player.name for player in winners])
            print("Vainqueurs(s) : ",s," !")
            break
        except ValueError:
            print("Veuillez entrer un nombre entier.")

if __name__ == "__main__":
    interactiveRun()
    